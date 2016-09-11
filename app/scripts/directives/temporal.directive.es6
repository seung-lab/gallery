'use strict';
  
app.directive('temporal', function ($timeout) {

  let chartLinker = function (scope, element, attrs) {

    // Set up chart
    scope.chart = makeChart(scope, element);

    // Watch for dataset changes
    scope.$watch(function (scope) {
      return scope.cells.map( (cell) => cell.id ).join(',');
    }, 
    function (value) {
      scope.dataset = makeDataset(scope);
      scope.chart.update(scope);
    });

    // Watch for toggling cells
    scope.$watch(function (scope) {
      return scope.cells.map( (cell) => cell.hidden ? 't' : 'f' ).join('');
    }, 
    function (value) {
      updateChartColors(scope);
    });

    // Watch for highlighting cells
    scope.$watch(function (scope) {
      return scope.cells.map( (cell) => cell.highlight ? 't' : 'f' ).join('');
    }, 
    function (value) {
      updateChartColors(scope);
    });

    // =^..^= Monitor Sidebar size change
    addResizeListener(document.getElementById('right-sidebar'), function () {
      scope.chart.update(scope);
    });

    addResizeListener(document.getElementById('temporal-chart'), function() {
      scope.chart.update(scope);
    });

    function updateChartColors (scope) {
      if (!scope.chart) {
        return;
      }

      let dict = {};
      scope.cells.forEach(function (cell) {
        dict[cell.id + ""] = cell;
      });

      scope.dataset = makeDataset(scope); // Rebuild dataset

      scope.dataset.forEach(function (datum) {
        let cell = dict[datum.label];
        let color = cell.color;

        if (scope.cells.length === 1) {
          color = '#1A1A1A';
        }

        datum.color = color;
      });

      // Update dataset
      scope.dataset = scope.dataset.filter( (dataset) => !dataset.hidden );
      scope.chart.highlight(scope); // Update chart here
    }

    function makeDataset (scope) {
      let cells = scope.cells;
      
      cells = cells.filter( (cell) => cell.temporal_response );

      let any_highlighted = false;
      cells.forEach( (cell) => any_highlighted = any_highlighted || cell.highlight );

      return cells.map(function (cell) {

        let fmt = (z, factor) => Math.round(z * factor) / factor;

        let strat_x = (i) => cell.temporal[i][0],
            strat_y = (i) => cell.temporal[i][1];

        cell.temporal_response.sort(function (a, b) {
          return a[0] - b[0];
        });

        let data = [];

        cell.temporal_response.forEach( (datum, index) => 
          data.push({ 
            x: (index / 7.5), // Re-map temporal domain to 4s range
            y: datum, 
          })
        );

        while (data.length && data[0].y === 0) {
          data.shift();
        }

        while (data.length && data[data.length - 1].y === 0) {
          data.pop();
        }

        let color = cell.color;
        if (cells.length === 1) {
          color = '#1A1A1A';
        }

        let hidden = false;
        if (!cell.highlight && cell.hidden) {
          hidden = true;
        }
        else if (!cell.highlight && any_highlighted) { // If <any_highlighted> = true, then we are highlighting
          hidden = true;
        }

        return {
          annotation: cell.annotation,
          highlight: cell.highlight,
          hidden: hidden,
          color: color,
          label: cell.id,
          data: data,
        };
      });
    }
  };

  // ------------------------------------
  // D3

  // Modify D3 prototype to enable first and last child selections
  d3.selection.prototype.first = function() {
    return d3.select(this[0][0]);
  };
  d3.selection.prototype.last = function() {
    let last = this.size() - 1;
    return d3.select(this[0][last]);
  };

  function distance(v1, v2) { 
    return Math.sqrt((v1.x - v2.x) * (v1.x - v2.x) + (v1.y - v2.y) * (v1.y - v2.y));
  }

  function makeChart(scope, element) {
    // Size Characteristics
    let width,
        height,
        margin = {
          top: 25,
          right: 35,
          bottom: 50,
          left: 35,
          padding: 25,
        };

    // Scales
    let xScale,
        yScale,
        xAxis, 
        yAxis,
        x_axis_range = {
          start: 0,
          mid: 0.5,
          end: 1,
        },
        y_axis_range = {
          start: 0,
          mid: 0.5,
          end: 1,
        };

    // Elements
    let tooltip,
        tooltipCircle,
        time_value,
        f_value,
        svg,
        seriesGroup,
        cellId,
        label;

    // Labels
    let xLabel, yLabel,
        yLabel_Inner, yLabel_Outer,
        yAxis_time_value_Ticks,
        yAxis_Outer_Inner_Tick,
        yLabel_Layers,
        xLabel_Time;

    let dataset,
        tickValues,
        lineGenerator;

    // Define line generator
    lineGenerator = d3.svg.line()
      .interpolate("linear")
      .x(function(d) { return xScale(d.x); })
      .y(function(d) { return yScale(d.y); });

    // Add svg
    svg = d3.select("#temporal-chart")
      .append("svg")
        .attr("id", "temporal-svg")
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    setDimensions();

    // Set scale type
    xScale = d3.scale.linear();
    yScale = d3.scale.linear();

    // Set domain of data
    yScale.domain([-10, 10]); // Domain inferred from Flourescence % in GC paper
    xScale.domain([0, 4]);    // Domain inferred from Time Window in GC paper
    
    // Set domain, range
    setScales(scope);
    // Setup Axes Groups
    setAxes(scope);
    // Setup Axis Labels
    setAxesLables();
    // Setup Tooltip
    setTooltip(scope);
    // Setup Series Groups
    setSeries();

    function distance_scaled(target, point) {
      return Math.sqrt((target.x - xScale(point.x)) * (target.x - xScale(point.x)) + 
                       (target.y - yScale(point.y)) * (target.y - yScale(point.y)));
    }

    // k = Number of points returned
    // target = Target point
    // points = sample array
    function k_nearest(k, points, target, label) {

      points = points.map(function(point) {
        return {
          x: point.x,
          y: point.y,
          label: label || point.label,
        }
      }); 

      // swartzarian transform
      let distpts = points.map(function(point) {
        return [
          distance_scaled(target, point),
          point
        ];
      });

      distpts.sort((a, b) => {
        return a[0] - b[0];
      });

      distpts = distpts.map((x) => x[1]).slice(0, k);

      return distpts;
    }

    function nearestPoint(dataset, loc) {
      let points = []; 
      dataset.forEach(function(datum) {
        points.push(k_nearest(1, datum.data, loc, datum.label)[0]); 
      });

      if (points.length > 1) {
        return k_nearest(1, points, loc)[0];
      }

      return points[0];
    }


    function highlight(scope) {
      // Update Chart Series      
      updateSeries(scope);
    }

    function update(scope) {
      // Update graph dimensions
      setDimensions(scope);
      // Update domain
      setDomain(scope);
      // Update range
      setScales(scope);
      // Update Axes
      updateAxes(scope);
      // Update Chart Series
      updateSeries(scope);
    }

    function setTooltip(scope) {
      // Define 'div' for tooltips
      tooltip = d3.select("#temporal-chart")
        .append("div")
        .attr("class", "tooltip");

      tooltip
        .append("h4")
        .text("ID");
        tooltip
          .append("h3")
            .attr("class", "cell-id");
        tooltip
          .append("h4")
          .html("&Delta;F/F (%)");
        tooltip
          .append("p")
          .attr("class", "f_value");
        tooltip
          .append("h4")
          .text("Time (s)");
        tooltip
          .append("p")
          .attr("class", "time_value");

      // Tooltip keys
      cellId = tooltip.select(".cell-id");
      f_value = tooltip.select(".f_value");
      time_value    = tooltip.select(".time_value");

      // Tooltip circle
      tooltipCircle = svg.append("circle")
          .attr("r", 0)
          .attr("class", "point hidden");

    }

    function setSeries() {
      // Create group for series elements
      seriesGroup = svg.append("g");
      seriesGroup.attr('class', "series-group");                  

    }

    // Add min/max domain scaling
    function setScales(scope) {
      // Set ranges
      xScale.range([0, width]);
      yScale.range([height, 0]); // Reverse for SVG drawing
    }

    function setAxes(scope) {

      // Define axes
      xAxis = d3.svg.axis()
        .orient('bottom')
        .outerTickSize(-height)
        .tickPadding([7])
        .ticks(5);

      yAxis = d3.svg.axis()
        .orient('right')
        .outerTickSize(-width)
        .tickPadding([20])
        .ticks(5);

      // Set axis and line scale
      xAxis.scale(xScale);
      yAxis.scale(yScale);

      // Add X axis
      svg.append("g")
        .attr("class", "x axis")
        .attr("id", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
          .style("text-anchor", "start");

      // Add Y axis
      svg.append("g")
        .attr("class", "y axis")
        .attr("id", "y-axis")
        .call(yAxis)
        .selectAll('text')
          .attr("class", "axis-label axis-label-minor")
          .style('text-anchor', 'start');

    }

    function updateAxes(scope) {

      // Update axis and line
      xAxis.scale(xScale);
      yAxis.scale(yScale);

      yAxis.outerTickSize(-width);

      svg.select('#x-axis').attr("transform", "translate(0," + height + ")");

      xAxis.outerTickSize(-height);

      // Axis label | X + Y
      xLabel.attr("transform", "translate(" + (width/2) + ", 50)");
      yLabel.attr("transform", "translate(" + (-width - 20) + ", " + yScale(y_axis_range.mid) + ") rotate(-90)");

      // Update vertical bars
      xLabel_Time.select('#first-bar')
        .attr("x1", xScale(1))
        .attr("x2", xScale(1))
        .attr("y1", 0)
        .attr("y2", -height);

      xLabel_Time.select('#second-bar')
        .attr("x1", xScale(2))
        .attr("x2", xScale(2))
        .attr("y1", 0)
        .attr("y2", -height);

      // Update X axis
      svg.select(".x.axis")
        .call(xAxis);

      // Update Y axis
      svg.select(".y.axis")
        .call(yAxis)
        .selectAll('.tick').selectAll('text')
            .style('text-anchor', 'end');

      // Translate Y-Axis ticks to right of chart
      svg.select('.y.axis').attr("transform", "translate(" + width + ", 0)");

      // Remove first and last ticks from X axis
      // svg.select('.x.axis').selectAll('.tick').first().remove();
      // svg.select('.x.axis').selectAll('.tick').last().remove();
    }

    function setAxesLables() {
      // Axis label | X
      xLabel = svg.select(".x.axis")
        .append("text")
          .attr("class", "axis-label")
          .attr("text-anchor", "middle")
          .attr("transform", "translate(" + (width/2) + ", 50)")
          .text("Time");

      // Axis label | Y
      yLabel = svg.select(".y.axis")
          .append("text")
            .attr("class", "axis-label")
            .attr("text-anchor", "middle")
            .attr("transform", "translate(0," + yScale(y_axis_range.mid) + ") rotate(-90)")
            .html("&Delta;F/F (%)");

      // Labels for 1 + 2 Time 
      xLabel_Time = svg.select('.x');
      
      xLabel_Time.append('line')
            .attr("x1", xScale(8))
            .attr("x2", xScale(8))
            .attr("y1", yScale(y_axis_range.start))
            .attr("y2", yScale(y_axis_range.end))
            .attr('id', 'first-bar')
            .attr('class', 'gray-bar')
            .style("stroke-dasharray", ("3, 10"));
      
      xLabel_Time.append('line')
            .attr("x1", xScale(16))
            .attr("x2", xScale(16))
            .attr("y1", yScale(y_axis_range.start))
            .attr("y2", yScale(y_axis_range.end))
            .attr('id', 'second-bar')
            .attr('class', 'gray-bar')
            .style("stroke-dasharray", ("3, 10"));
    }

    function setDimensions() {
      // Update width
      width = angular.element(element[0]).width();
      height = angular.element(element[0]).height();

      // Set graph dimensions
      width = width - margin.left - margin.right;
      height = height - margin.top - margin.bottom;
    }

    function updateSeries(scope) {
      dataset = scope.dataset;

      let series = seriesGroup.selectAll('.series')
            .data(dataset, function(d) { return d.label; });

          // Remove extra data points on highlight
          series.exit().classed({ 'series-hidden': true })
                       .remove();

          // Create separate groups for each series object 
          series.enter().append("path")
              .attr("id", function(d) { return "series-" + d.label; }) // Name each uniquely wrt cell label
              .attr("class", "line series transition-none series-hidden")
              .classed({ 'transition-none': false, 'series-hidden': false, 'series-visible': true });

          series
            .attr("d", function(d) { return lineGenerator(d.data); }) // Draw series line
            .attr("stroke", function(d) { return d.color; });

      let timer; // Timeout for series hover

      d3.select('#temporal-svg').on('mouseover', function() {
          d3.select(this).on('mousemove', function() {
            let mousepos = {
                  x: d3.mouse(d3.select(this).node())[0] - margin.left,
                  y: d3.mouse(d3.select(this).node())[1] - margin.top,
                };

            let nearest = nearestPoint(dataset, mousepos),
                nearest_color;

            if (!nearest) {
              return;
            }

            dataset.forEach(function(datum) { // Set circle color
              if (nearest.label === datum.label) {
                nearest_color = datum.color;
              }
            });

            if ( distance_scaled(mousepos, nearest) > 25 ) { // Mouseover Threshold | 25 Experimentially Determined
              return;
            }

            if (timer) {
              $timeout.cancel(timer);
            }

           timer =  $timeout(function() { // Avoid series flickering
              svg.selectAll('.series').classed({ 'series-visible': false, 'series-other': true });
              svg.select('#series-' + nearest.label).classed({ 'series-visible': true });
            }, 250);

            tooltipCircle
              .classed({ 'series-hidden': false, 'series-visible': true })
              .style("fill", nearest_color)
              .attr("cx", xScale(nearest.x))
              .attr("cy", yScale(nearest.y))
              .classed({ 'circle-five': true });

            tooltip.classed({ 'series-hidden': false, 'series-visible': true })

            tooltip // Setting positioning logic 
              .style('left', function() {
                  x = xScale(nearest.x) < width / 2 // Avoid crossing x-axis
                      ? xScale(nearest.x) + 75
                      : xScale(nearest.x) - 100;

                  return x + "px"; // Scales Intentionally Flipped
              })
              .style('top', function() {
                  y = yScale(nearest.y) > height * 0.6 // Avoid crossing y-axis
                        ? yScale(nearest.y) - 100
                        : yScale(nearest.y);

                  return y + "px"; // Scales Intentionally Flipped
              });

            cellId.text(nearest.label);
            f_value.text(nearest.y.toFixed(3));
            time_value.text(nearest.x.toFixed(3));

          })
        })
        .on('mouseout', function() {
            if (timer) {
              $timeout.cancel(timer);
            }

            d3.selectAll('.series').classed({ 'series-visible': true, 'series-other': false }); // Remove Highlight State
            tooltip.classed({ 'series-hidden': true, 'series-visible': false });
            tooltipCircle.classed({ 'series-hidden': true, 'circle-five': false });
        });
    }

    function closestPt(loc, dataset) {
      let points = [];
      dataset.forEach(data => {
        points.push(k_nearest(1, points, loc));
      })
    }

    function setDomain(scope) {
      dataset = scope.dataset;
      
      //Update scale X domain
      if (dataset.length !== 0) {
        xScale.domain([
          d3.min(dataset, function (ds) { // forEach element of dataSet
            return Math.min(...ds.data.map( d => d.x ));
          }),
          d3.max(dataset, function (ds) { // forEach element of dataSet
            return Math.max(...ds.data.map( d => d.x ));
          })
        ]);
      }

      x_axis_range.start = xScale.domain()[0];
      x_axis_range.mid = (xScale.domain()[1] + xScale.domain()[0]) / 2;
      x_axis_range.end = xScale.domain()[1];

      //Update scale Y domain
      if (dataset.length !== 0) {
        yScale.domain([
          d3.min(dataset, function (ds) { // forEach element of dataSet
            return Math.min(...ds.data.map( d => d.y ));
          }) * 1.25, // Bottom padding for chart
          d3.max(dataset, function (ds) { // forEach element of dataSet
            return Math.max(...ds.data.map( d => d.y ));
          }) * 1.25  // Top padding for chart
        ]);
      }

      y_axis_range.start = yScale.domain()[0];
      y_axis_range.mid = (yScale.domain()[1] + yScale.domain()[0]) / 2;
      y_axis_range.end = yScale.domain()[1];
    }

    return {
      update: update,
      highlight: highlight,
    };
  }

  // ------------------------------------
  // /D3

  return {
    restrict: "E",
    scope: {
        cells: "=",
    },
    template: `<div></div>`,
    replace: false,
    transclude: false,
    link: chartLinker,
  };

});
   

