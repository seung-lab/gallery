'use strict';
  
app.directive('stratification', function ($timeout) {

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

    addResizeListener(document.getElementById('stratification-chart'), function() {
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
      
      cells = cells.filter( (cell) => cell.stratification );

      let any_highlighted = false;
      cells.forEach( (cell) => any_highlighted = any_highlighted || cell.highlight );

      return cells.map(function (cell) {

        let fmt = (z, factor) => Math.round(z * factor) / factor;

        let strat_x = (i) => cell.stratification[i][0],
            strat_y = (i) => cell.stratification[i][1];

        cell.stratification.sort(function (a, b) {
          return a[0] - b[0];
        });

        let data = [];
        let x, y;

        let stride = 4;

        for (let i = 0; i < cell.stratification.length; i += stride) {

          stride = Math.min(stride, cell.stratification.length - i);

          // averaging filter with bin size 4 since skeletonization data is noisy
          x = _.range(stride).map( (plus) => strat_x(i + plus) ).reduce( (a,b) => a+b, 0) / stride;
          y = _.range(stride).map( (plus) => strat_y(i + plus) ).reduce( (a,b) => a+b, 0) / stride;
        
          data.push({ 
            x: fmt(x, 1e3),
            y: fmt(y, 1e7), 
          });
        }

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
    var last = this.size() - 1;
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
          right: 25,
          bottom: 60,
          left: 25,
          padding: 100,
        };

    // Scales
    let xScale,
        yScale,
        xAxis, 
        yAxis;

    // Elements
    let tooltip,
        tooltipCircle,
        ipl,
        volume,
        svg,
        seriesGroup,
        cellId,
        label;

    // Labels
    let xLabel, yLabel,
        yLabel_INL, yLabel_GCL,
        yLabel_Inner, yLabel_Outer,
        yAxis_IPL_Ticks,
        yAxis_Outer_Inner_Tick,
        yLabel_Layers,
        yLabel_Inner_intra_SAC, yLabel_Inner_extra_SAC,
        yLabel_OFF, yLabel_ON,
        yLabel_Top;

    let dataset,
        tickValues,
        lineGenerator;

    // Define line generator
    lineGenerator = d3.svg.line()
      .interpolate("linear")
      .x(function(d) { return xScale(d.y); }) // Value intentionally flipped
      .y(function(d) { return yScale(d.x); });

    // Values correspond to:
    // IPL Start, End [0,100]
    // IPL ON, OFF, 28, 45, 62 %
    tickValues = [0, 0.28, 0.45, 0.62, 1];

    // Add svg
    svg = d3.select("#stratification-chart")
      .append("svg")
        .attr("id", "stratification-svg")
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    setDimensions();

    // Set scale type
    xScale = d3.scale.linear();
    yScale = d3.scale.linear();

    // Set domain of data
    yScale.domain([1.2, -0.20]); // IPL | GCL Bottom
    xScale.domain([0, 0.1]);  // Arbor Volume Density
    
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

    function distance_scaled(target, point) { // Data Intentionally flipped 
      return Math.sqrt((target.x - xScale(point.y)) * (target.x - xScale(point.y)) + 
                       (target.y - yScale(point.x)) * (target.y - yScale(point.x)));
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
      tooltip = d3.select("#stratification-chart")
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
          .text("IPL%");
        tooltip
          .append("p")
          .attr("class", "ipl");
        tooltip
          .append("h4")
          .text("Volume");
        tooltip
          .append("p")
          .attr("class", "volume");

      // Tooltip keys
      cellId = tooltip.select(".cell-id");
      volume = tooltip.select(".volume");
      ipl    = tooltip.select(".ipl");

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
        .innerTickSize(width - 50)
        .outerTickSize(0)
        .tickPadding([7])
        .tickFormat(d3.format('.2f'))
        .tickValues(tickValues);

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
          .style('text-anchor', 'end');
    }

    function updateAxes(scope) {
      yAxis
        .innerTickSize(width - 50);

      // Update axis and line
      xAxis.scale(xScale);
      yAxis.scale(yScale);

      svg.select('#x-axis').attr("transform", "translate(0," + height + ")");

      xAxis.outerTickSize(-height);

      // Update domain to allow for additional right padding
      // xAxis.scale().domain()[0] += 0.05;

      // Axis label | X
      xLabel
       .attr("transform", "translate(" + (width/2) + ", 40)");

      // Axis label | Y
      yLabel_Inner.attr("transform", "translate(" + (width + 10) + "," + yScale(0.225) + ") rotate(90)");
        yLabel_Outer.attr("transform", "translate(" + (width + 10) + "," + yScale(0.725) + ") rotate(90)");
        yLabel_OFF.attr("transform", "translate(" + (width - 50) + "," + yScale(tickValues[1] + 0.01) + ")"); // 50~Offset
        yLabel_ON.attr("transform", "translate(" + (width - 50) + "," + yScale(tickValues[3] + 0.01) + ")"); // 50~Offset
        
      yLabel.attr("transform", "translate(-10," + yScale(0.45) + ") rotate(-90)");
        yLabel_INL.attr("transform", "translate(-10," + yScale(-0.10) + ") rotate(-90)");
        yLabel_GCL.attr("transform", "translate(-10," + yScale(1.10) + ") rotate(-90)");

      // Top Bar
        yLabel_Top 
          .attr("x1", 0)
          .attr("x2", width)
          .attr("y1", yScale(-0.20))
          .attr("y2", yScale(-0.20));

      // Inner Outer Tick
      yAxis_Outer_Inner_Tick
        .attr("x1", width)
        .attr("x2", (width + 10))
        .attr("y1", yScale(0.45))
        .attr("y2", yScale(0.45));

      // IPL Ticks | Right
      yAxis_IPL_Ticks.selectAll('.tick-right')
        .attr("x1", width)
        .attr("x2", (width + 10));

      yAxis_IPL_Ticks.select('#tick-left-end')
        .attr("y1", yScale(1.0))
        .attr("y2", yScale(1.0));

      yAxis_IPL_Ticks.select('#tick-left-start')
        .attr("y1", yScale(0))
        .attr("y2", yScale(0));

      yAxis_IPL_Ticks.select('#tick-right-end')
        .attr("y1", yScale(1.0))
        .attr("y2", yScale(1.0));

      yAxis_IPL_Ticks.select('#tick-right-start')
        .attr("y1", yScale(0))
        .attr("y2", yScale(0));

      //Update X axis
      svg.select(".x.axis")
        .call(xAxis);

      //Update Y axis
      svg.select(".y.axis")
        .call(yAxis)
        .selectAll('.tick').selectAll('text')
            .style('text-anchor', 'end')
            .attr("transform", "translate(25, 0)"); // Add a bit of padding after line

      // Style ON / OFF Lines with Dashes
      svg.select('.y')
          .selectAll('.tick')
          .filter( function(d, i) { return i % 2 === 1; } )
            .selectAll('line')
              .attr("x2", width - 85);

      // Remove first and last ticks from X axis
      d3.select('.x.axis').selectAll('.tick').first().remove();
      d3.select('.x.axis').selectAll('.tick').last().remove();
    }

    function setAxesLables() {
      // Axis label | X
      xLabel = svg.select(".x.axis")
        .append("text")
          .attr("class", "axis-label")
          .attr("text-anchor", "middle")
          .attr("transform", "translate(" + (width/2) + ", 40)")
          .text("Skeleton Density");

      // Axis label | Y
      yLabel = svg.select(".y.axis")
          .append("text")
            .attr("class", "axis-label")
            .attr("text-anchor", "middle")
            .attr("transform", "translate(-10," + yScale(0.45) + ") rotate(-90)")
            .text("IPL Depth %");

      // Axis label | Y --> INL
      yLabel_INL = svg.select(".y.axis")
          .append("text")
            .attr("class", "axis-label")
            .attr("text-anchor", "middle")
            .attr("transform", "translate(-10," + yScale(-0.10) + ") rotate(-90)") // Dynamic Scale
            .text("INL");

      // Axis label | Y --> GCL
      yLabel_GCL = svg.select(".y.axis")
          .append("text")
            .attr("class", "axis-label")
            .attr("text-anchor", "middle")
            .attr("transform", "translate(-10," + yScale(1.10) + ") rotate(-90)") // Dynamic Scale
            .text("GCL");

      // Axis label | Y --> Outer
      yLabel_Inner = svg.select(".y.axis")
          .append("text")
            .attr("class", "axis-label")
            .attr("text-anchor", "middle")
            .attr("transform", "translate(" + (width + 10) + "," + yScale(0.225) + ") rotate(90)") // Dynamic Scale
            .text("Outer");

      // Axis label | Y --> Inner
      yLabel_Outer = svg.select(".y.axis")
          .append("text")
            .attr("class", "axis-label")
            .attr("text-anchor", "middle")
            .attr("transform", "translate(" + (width + 10) + "," + yScale(0.725) + ") rotate(90)") // Dynamic Scale
            .text("Inner");

      // Axis label | Y --> Outer intra_SAC
      yLabel_OFF = svg.select('.y.axis')
          .append("text")
              .attr("class", "axis-label sub-label axis-label-minor")
              .attr("text-anchor", "end")
              .attr("transform", "translate(" + (width - 50) + "," + yScale(tickValues[1] + 0.01) + ")") // Dynamic Scale
              .text("Off");

      // Axis label | Y --> Outer extra_SAC
      yLabel_ON = svg.select('.y.axis')
          .append("text")
              .attr("class", "axis-label sub-label axis-label-minor")
              .attr("text-anchor", "end")
              .attr("transform", "translate(" + (width - 50) + "," + yScale(tickValues[3] + 0.01) + ")") // Dynamic Scale
              .text("On");

      // Style ON / OFF Lines with Dashes
      yLabel_Layers = d3.selectAll('.y')
          .selectAll('.tick')
          .filter( function(d, i) { return i % 2 === 1; } )
            .selectAll('line')
              .style("stroke-linecap", "round")
              .style("stroke-dasharray", ("3, 10"));

      // Labels for top bar
      yLabel_Top = d3.select('.y')
          .append('line')
            .attr("x1", 0)
            .attr("x2", width)
            .attr("y1", yScale(-0.20))
            .attr("y2", yScale(-0.20))
            .attr('class', 'top-bar');

      // Inner Outer Tick
      yAxis_Outer_Inner_Tick = d3.select('.y')
          .append('line')
            .attr('class', 'tick-right')
            .attr("x1", width)
            .attr("x2", (width + 10))
            .attr("y1", yScale(0.45))
            .attr("y2", yScale(0.45));

      yAxis_IPL_Ticks = d3.select('.y');
      
        // IPL Start | Left
        yAxis_IPL_Ticks.append('line')
          .attr('class', 'tick-left')
          .attr('id', 'tick-left-start')
          .attr("x1", 0)
          .attr("x2", -10)
          .attr("y1", yScale(0))
          .attr("y2", yScale(0));

        // IPL End | Left
        yAxis_IPL_Ticks.append('line')
          .attr('class', 'tick-left')
          .attr('id', 'tick-left-end')
          .attr("x1", 0)
          .attr("x2", -10)
          .attr("y1", yScale(1.0))
          .attr("y2", yScale(1.0));

        // IPL Start | Right
        yAxis_IPL_Ticks.append('line')
          .attr('class', 'tick-right')
          .attr('id', 'tick-right-start')
          .attr("x1", width)
          .attr("x2", (width + 10))
          .attr("y1", yScale(0))
          .attr("y2", yScale(0));

        // IPL End | Right
        yAxis_IPL_Ticks.append('line')
          .attr('class', 'tick-right')
          .attr('id', 'tick-right-end')
          .attr("x1", width)
          .attr("x2", (width + 10))
          .attr("y1", yScale(1.0))
          .attr("y2", yScale(1.0));
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

      d3.select('#stratification-svg').on('mouseover', function() {
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

            if ( distance_scaled(mousepos, nearest) > 50 ) { // Mouseover Threshold | 50 Experimentially Determined
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
              .attr("cx", xScale(nearest.y)) // Scales Intentionally Flipped
              .attr("cy", yScale(nearest.x)) // Scales Intentionally Flipped
              .classed({ 'circle-five': true });

            tooltip.classed({ 'series-hidden': false, 'series-visible': true })

            tooltip // Setting positioning logic 
              .style('left', function() {
                  x = xScale(nearest.y) < width / 2 // Avoid crossing y-axis
                      ? xScale(nearest.y) + 75
                      : xScale(nearest.y) - 100;

                  return x + "px"; // Scales Intentionally Flipped
              })
              .style('top', function() {
                  y = yScale(nearest.x) > height * 0.6 // Avoid crossing y-axis
                        ? yScale(nearest.x) - 100
                        : yScale(nearest.x);

                  return y + "px"; // Scales Intentionally Flipped
              });

            cellId.text(nearest.label);
            ipl.text(nearest.x.toFixed(5));
            volume.text(nearest.y.toFixed(5));

          })
        })
        .on('mouseout', function() {
            if (timer) {
              $timeout.cancel(timer);
            }

            tooltipCircle.classed({ 'series-hidden': true, 'circle-five': false });


            d3.selectAll('.series').classed({ 'series-visible': true, 'series-other': false }); // Remove Highlight State

            tooltip.classed({ 'series-hidden': true, 'series-visible': false });
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
      //Update scale X domain | Datum intentionally flipped
      if (dataset.length !== 0) {
        xScale.domain([
          0, 
          d3.max(dataset, function (ds) { // forEach element of dataSet
            return Math.max(...ds.data.map( d => d.y ));
          })
        ]);

        let spacer = 0.4; // Squeeze X-Axis

        xScale.domain([
          0,
          xAxis.scale().domain()[1] * spacer + xAxis.scale().domain()[1]
        ]);
      }
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
   

