'use strict';
  
app.directive('stratification', function () {

  let chartLinker = function (scope, element, attrs) {
    charter.init();
    let cellCount;

    // Dataset loaded watcher
    scope.$watch(function (scope) {
      return scope.cells.map( (cell) => cell.id ).join(',');
    }, function () {
      cellCount = scope.cells.length;
      let dataset = createDataset(scope.cells, cellCount);
      charter.updateDomain(dataset);
      charter.updateChart(dataset);
    });

    // Cell hidden watcher
    scope.$watch(function (scope) {
      return scope.cells.map( (cell) => cell.hidden ? 't' : 'f' ).join('');
    }, 
    function (value) {
      let dataset = createDataset(scope.cells, cellCount);
      charter.updateChart(dataset);
    });

      // =^..^= Monitor Sidebar size change
    let resizeElement = document.getElementById('right-sidebar'),
        resizeCallback = function() {
            charter.resize();
        };

    addResizeListener(resizeElement, resizeCallback);

    // Highlight cell watcher
    scope.$watch(function (scope) {
      return scope.cells.map( (cell) => cell.highlight ? 't' : 'f' ).join('');
    }, 
    function (value) {
      let highlight = false;

      for (let i = 0; i < scope.cells.length; i++) {
        let cell = scope.cells[i];
        if (cell.highlight && !cell.hidden) {
          highlight = true;
          break;
        }
        highlight = false;
      }

      let dataset = highlight === true
        ? highlightDataset(scope.cells)
        : createDataset(scope.cells);

      charter.updateChart(dataset);
    });
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

  function createDataset (cells, cellCount) {
    cells = cells.filter( (cell) => cell.stratification && !cell.hidden );

    return cells.map(function (cell) {

      let fmt = (z, factor) => Math.round(z * factor) / factor;

      cell.stratification.sort(function (a, b) {
        return a[0] - b[0];
      });

      let data = [];
      for (let i = 0; i < cell.stratification.length; i++) {
        data.push({ 
          x: fmt(cell.stratification[i][0], 1e3), 
          y: fmt(cell.stratification[i][1], 1e7), 
        });
      }

      while (data.length && data[0].y === 0) {
        data.shift();
      }

      while (data.length && data[data.length - 1].y === 0) {
        data.pop();
      }

      let color = cell.color;
      if (cells.length === 1 && cellCount === 1) {
        color = '#1A1A1A';
      }

      return {
        annotation: cell.annotation,
        highlight: cell.highlight,
        hidden: cell.hidden,
        color: color,
        label: cell.id,
        data: data,
      };
    });
  }

  function highlightDataset (cells) {
    cells = cells.filter( (cell) => cell.stratification && !cell.hidden && cell.highlight );

    return cells.map(function (cell) {

      let fmt = (z, factor) => Math.round(z * factor) / factor;

      cell.stratification.sort(function (a, b) {
        return a[0] - b[0];
      });

      let data = [];
      for (let i = 0; i < cell.stratification.length; i++) {
        data.push({ 
          x: fmt(cell.stratification[i][0], 1e3), 
          y: fmt(cell.stratification[i][1], 1e7), 
        });
      }

      while (data.length && data[0].y === 0) {
        data.shift();
      }

      while (data.length && data[data.length - 1].y === 0) {
        data.pop();
      }

      let color = cell.color;
      // if (cells.length === 1) {
      //   color = '#1A1A1A';
      // }

      return {
        annotation: cell.annotation,
        highlight: cell.highlight,
        hidden: cell.hidden,
        color: cell.color,
        label: cell.id,
        data: data,
      };
    });
  }

  function distance(v1, v2) { // Customized to only calculate y distance
    return Math.sqrt((v1.x - v2.x) * (v1.x - v2.x) + (v1.y - v2.y) * (v1.y - v2.y));
  }

  // k = Number of points returned
  // target = Target point
  // points = sample array
  // Customized to compare only y values
  function k_nearest(k, points, target) { 
    let _this = this;

    // swartzarian transform
    let distpts = points.map(function (point) {
      return [
        distance(target, point),
        point
      ];
    });

    distpts.sort((a, b) => {
      return a[0] - b[0];
    });

    return distpts.map((x) => x[1]).slice(0, k);
  }

  let charter = (function() {
    let width, height,
        xScale, yScale,
        xAxis, yAxis,
        margin,
        tooltip,
        ipl,
        volume,
        svg,
        cellId,
        label,
        xLabel, yLabel,
        yLabel_INL, yLabel_GCL,
        yLabel_ON, yLabel_OFF,
        yAxis_IPL_Ticks,
        yAxis_ONOFF_Tick,
        yLabel_Layers,
        yLabel_ON_Transient, yLabel_ON_Sustained,
        yLabel_OFF_Transient, yLabel_OFF_Sustained,
        yLabel_Top,
        dataset_old,
        tickValues,
        lineGenerator;

    function init() {
      width = angular.element('.characterization').width();
      height = 500;

      margin = {
        top: 25,
        right: 35,
        bottom: 50,
        left: 35,
        padding: 100,
      };

      // Values correspond to:
      // IPL Start, End [0,100]
      // IPL ON, OFF, 28, 45, 62
      tickValues = [0, 28, 45, 62, 100];

      // Set graph dimensions
      width = width - margin.left - margin.right;
      height = height - margin.top - margin.bottom;

      // Set ranges
      xScale = d3.scale.linear().range([0, width]);
      yScale = d3.scale.linear().range([height, 0]); // Reverse for SVG drawing

      // Set domain of data
      yScale.domain([120, -20]); // IPL % | GCL Bottom
      xScale.domain([0, 0.1]);  // Arbor Volume Density

       // Add svg
      svg = d3.select("#stratification-chart")
        .attr("class", "chart")
        .append("svg")
          .attr("id", "stratification-svg")
          // .attr("width", width + margin.left + margin.right)
          // .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

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
        .tickValues(tickValues);

      // Set axis and line scale
      xAxis.scale(xScale);
      yAxis.scale(yScale);

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
          .append("hr");
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

      // Add X axis
      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
          .style("text-anchor", "start");

      // Axis label | X
      xLabel = svg.select(".x.axis")
        .append("text")
          .attr("class", "axis-label")
          .attr("text-anchor", "middle")
          .attr("transform", "translate(" + (width/2) + ", 50)")
          .text("Arbor Volume Density");

      // Add Y axis
      svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .selectAll('text')
          .attr("class", "axis-label axis-label-minor")
          .style('text-anchor', 'end');

      // Axis label | Y
      yLabel = svg.select(".y.axis")
          .append("text")
            .attr("class", "axis-label")
            .attr("text-anchor", "middle")
            .attr("transform", "translate(-20," + yScale(45) + ") rotate(-90)")
            .text("IPL Depth %");

      // Axis label | Y --> INL
      yLabel_INL = svg.select(".y.axis")
          .append("text")
            .attr("class", "axis-label")
            .attr("text-anchor", "middle")
            .attr("transform", "translate(-20," + yScale(-10) + ") rotate(-90)") // Dynamic Scale
            .text("INL");

      // Axis label | Y --> GCL
      yLabel_GCL = svg.select(".y.axis")
          .append("text")
            .attr("class", "axis-label")
            .attr("text-anchor", "middle")
            .attr("transform", "translate(-20," + yScale(110) + ") rotate(-90)") // Dynamic Scale
            .text("GCL");

      // Axis label | Y --> ON
      yLabel_ON = svg.select(".y.axis")
          .append("text")
            .attr("class", "axis-label")
            .attr("text-anchor", "middle")
            .attr("transform", "translate(" + (width + 25) + "," + yScale(22.5) + ") rotate(90)") // Dynamic Scale
            .text("ON");

      // Axis label | Y --> OFF
      yLabel_OFF = svg.select(".y.axis")
          .append("text")
            .attr("class", "axis-label")
            .attr("text-anchor", "middle")
            .attr("transform", "translate(" + (width + 25) + "," + yScale(72.5) + ") rotate(90)") // Dynamic Scale
            .text("OFF");

      // Axis label | Y --> OFF Transient
      yLabel_OFF_Transient = svg.select('.y.axis')
          .append("text")
              .attr("class", "axis-label sub-label axis-label-minor")
              .attr("text-anchor", "end")
              .attr("transform", "translate(" + (width - 18) + "," + yScale(14) + ")") // Dynamic Scale
              .text("Transient");

      // Axis label | Y --> OFF Sustained
      yLabel_OFF_Sustained = svg.select('.y.axis')
          .append("text")
              .attr("class", "axis-label sub-label axis-label-minor")
              .attr("text-anchor", "end")
              .attr("transform", "translate(" + (width - 18) + "," + yScale(36.5) + ")") // Dynamic Scale
              .text("Sustained");

      // Axis label | Y --> ON Transient
      yLabel_ON_Transient = svg.select('.y.axis')
          .append("text")
              .attr("class", "axis-label sub-label axis-label-minor")
              .attr("text-anchor", "end")
              .attr("transform", "translate(" + (width - 18) + "," + yScale(53.5) + ")") // Dynamic Scale
              .text("Transient");

      // Axis label | Y --> ON Sustained
      yLabel_ON_Sustained = svg.select('.y.axis')
          .append("text")
              .attr("class", "axis-label sub-label axis-label-minor")
              .attr("text-anchor", "end")
              .attr("transform", "translate(" + (width - 18) + "," + yScale(81) + ")") // Dynamic Scale
              .text("Sustained");

      // Style Transient + Sustained Lines with Dashes
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
            .attr("y1", yScale(-20))
            .attr("y2", yScale(-20))
            .attr('class', 'top-bar');

      // ON OFF Tick
      yAxis_ONOFF_Tick = d3.select('.y')
          .append('line')
            .attr('class', 'tick-right')
            .attr("x1", width)
            .attr("x2", (width + 10))
            .attr("y1", yScale(45))
            .attr("y2", yScale(45));

      yAxis_IPL_Ticks = d3.select('.y');
      
        // IPL Start | Left
        yAxis_IPL_Ticks.append('line')
          .attr('class', 'tick-left')
          .attr("x1", 0)
          .attr("x2", -10)
          .attr("y1", yScale(0))
          .attr("y2", yScale(0));

        // IPL End | Left
        yAxis_IPL_Ticks.append('line')
          .attr('class', 'tick-left')
          .attr("x1", 0)
          .attr("x2", -10)
          .attr("y1", yScale(100))
          .attr("y2", yScale(100));

        // IPL Start | Right
        yAxis_IPL_Ticks.append('line')
          .attr('class', 'tick-right')
          .attr("x1", width)
          .attr("x2", (width + 10))
          .attr("y1", yScale(0))
          .attr("y2", yScale(0));

        // IPL End | Right
        yAxis_IPL_Ticks.append('line')
          .attr('class', 'tick-right')
          .attr("x1", width)
          .attr("x2", (width + 10))
          .attr("y1", yScale(100))
          .attr("y2", yScale(100));

      // Define line generator
      lineGenerator = d3.svg.line()
        .interpolate("linear")
        .x(function(d) { return xScale(d.y); }) // Value intentionally flipped
        .y(function(d) { return yScale(d.x); });

    }

    function resize() {
      
      // Update width
      width = angular.element('.characterization').width();
      height = 500;

      // Set graph dimensions
      width = width - margin.left - margin.right;
      height = height - margin.top - margin.bottom;

      // Update ranges
      xScale.range([0, width]);
      yScale.range([height, 0]); // Reverse for SVG drawing

      yAxis
        .innerTickSize(width - 50);

      // Update axis and line
      xAxis.scale(xScale);
      yAxis.scale(yScale);

      // Update domain to allow for additional right padding
      // xAxis.scale().domain()[0] += 0.05;

      // Axis label | X
      xLabel
       .attr("transform", "translate(" + (width/2) + ", 50)");

    // Axis label | Y
    yLabel_ON.attr("transform", "translate(" + (width + 25) + "," + yScale(22.5) + ") rotate(90)");
      yLabel_OFF.attr("transform", "translate(" + (width + 25) + "," + yScale(72.5) + ") rotate(90)");
      yLabel_OFF_Transient.attr("transform", "translate(" + (width - 18) + "," + yScale(14) + ")"); // 18~Offset
      yLabel_OFF_Sustained.attr("transform", "translate(" + (width - 18) + "," + yScale(37) + ")"); // 18~Offset
      yLabel_ON_Transient.attr("transform", "translate(" + (width - 18) + "," + yScale(55) + ")"); // 18~Offset
      yLabel_ON_Sustained.attr("transform", "translate(" + (width - 18) + "," + yScale(81) + ")"); // 18~Offset

    // Top Bar
      yLabel_Top 
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", yScale(-20))
        .attr("y2", yScale(-20));

    // ON OFF Tick
    yAxis_ONOFF_Tick
      .attr("x1", width)
      .attr("x2", (width + 10));

    // IPL Ticks | Right
    yAxis_IPL_Ticks.selectAll('.tick-right')
      .attr("x1", width)
      .attr("x2", (width + 10));


      let seriesUpdate = d3.selectAll('.series').selectAll('path')
          .attr("d", function(d) { return lineGenerator(d.data); });

      let seriesHitUpdate = d3.selectAll('.series-hit').selectAll('path')
          .attr("d", function(d) { return lineGenerator(d.data); });

      updateChart(dataset_old); // Update chart with existing dataset
    }

    function updateChart(dataset) { // Load the dataset | Refresh chart
      dataset_old = dataset;

      // Announce to D3 that we'll be binding our dataset to 'series' objects
      let series = svg.selectAll(".series")
        .data(dataset, function(d) { return d.label; }); // Key function for data join

      let seriesHit = svg.selectAll(".series-hit")
        .data(dataset, function(d) { return d.label; }); // Key function for data join

      // Remove extra data points on highlight
      let seriesExit = series.exit().transition()
            .duration(100)
            .style("opacity", 0)
            .remove();

      // Remove extra data points on highlight
      let seriesHitExit = seriesHit.exit().transition()
            .duration(100)
            .style("opacity", 0)
            .remove();

      // Create separate groups for each series object 
      let seriesEnter = series.enter().append("g")
        .attr("class", "series")
        .attr("id", function(d) { return "series-" + d.label; }) // Name each uniquely wrt cell label
        .append("path")
          .attr("class", "line")
          .attr("opacity", 0)
          .attr("d", function(d) { return lineGenerator(d.data); }) // Draw series line
          .attr("stroke", function(d) { return d.color; })
        .transition()
          .duration(100)
          .attr("opacity", 1);

      // Create separate groups for each series object | This line for mouseover
      let seriesHitEnter = series.enter().append("g")
        .attr("class", "series-hit")
        .attr("id", function(d) { return d.label + "_hit"; }) // Name each uniquely wrt cell label
        .append("path")
          .attr("class", "line hit_line")
          .attr("opacity", 0)
          .attr("d", function(d) { return lineGenerator(d.data); }) // Draw series line
          .attr("stroke", function(d) { return d.color; });

      let seriesHitSelect = svg.selectAll(".series-hit") // Mouseover the hit lines
        .on('mouseover', function(dd) {
          d3.select(this).on('mousemove', function(d) {
            svg.selectAll("circle")
              .remove(); // Don't pollute space with invisible circles

            let dataScale = [],
                mousepos = {
                  x: d3.mouse(d3.select('#stratification-svg').node())[0],
                  y: d3.mouse(d3.select('#stratification-svg').node())[1] - margin.top,
                };

            d.data.forEach(function(datum) {
              let rObj = {
                x:  xScale(datum.y), // X, Y flipped
                x0: datum.y,        
                y:  yScale(datum.x),
                y0: datum.x,        
              };

              dataScale.push(rObj);
            });

            let nearest = k_nearest(1, dataScale, mousepos)[0]; 

            d3.select(this).append("circle")
              .attr("r", 0)
              .attr("class", "point")
              .style("fill", function(d) { return d.color; })
              .attr("cx", nearest.x)
              .attr("cy", nearest.y)
              .transition()
                .duration(100)
                .attr("r", 5);

            tooltip.transition()
              .duration(100)
              .style('opacity', 1);

            tooltip // Setting positioning logic 
              .style('left', function() {
                  return nearest.x + 25 + "px";
              })
              .style('top', function() {
                  return nearest.y + "px";
              });

            cellId.text(d.label);
            volume.text(nearest.x0);
            ipl.text(nearest.y0);

          })
        })
        .on('mouseout', function(d) {
            svg.selectAll("circle")
              .remove(); // Don't pollute space with invisible circles

            tooltip.transition()
              .duration(100)
              .style('opacity', 0);
        });

      //Update X axis
      svg.select(".x.axis")
        .call(xAxis);

      //Update Y axis
      svg.select(".y.axis")
        .call(yAxis)
        .selectAll('.tick').selectAll('text')
            .style('text-anchor', 'end')
            .attr("transform", "translate(25, 0)"); // Add a bit of padding after line

      // Remove first and last ticks from X axis
      d3.select('.x.axis').selectAll('.tick').first().remove();
      d3.select('.x.axis').selectAll('.tick').last().remove();

    }

    function updateDomain(dataset) {
      //Update scale X domain | Datum intentionally flipped
      if (dataset.length !== 0) {
        xScale.domain([
          0, 
          d3.max(dataset, function(d) { // forEach element of dataSet
            return d3.max(d.data, function(dd) { // forEach element of dataSet.data
              return dd.y; // return value
            }); 
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
      updateChart: updateChart,
      updateDomain: updateDomain,
      init: init,
      resize: resize,
    };
  })();


  // ------------------------------------
  // /D3


  return {
    restrict: "E",
    scope: {
        cells: "="
    },
    template: `<div>
    </div>`,
    replace: false,
    transclude: false,
    link: chartLinker,
  };

});
   

