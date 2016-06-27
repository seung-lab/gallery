'use strict';
  
app.directive('stratification', function () {

  let chartLinker = function (scope, element, attrs) {
    let _cellCount; // Hack
    charter.createChart();

    scope.$watch(function (scope) {
      return scope.cells.map( (cell) => cell.id ).join('');
    }, function () {
      let dataset = createDataset(scope.cells);
          _cellCount = dataset.length; 

      if (_cellCount === 1) {
        dataset[0].color = "#1A1A1A"; // Cell white, data black
      }

      charter.updateChart(dataset);
    });

    scope.$watch(function (scope) {
      return scope.cells.map( (cell) => cell.hidden ? 't' : 'f' ).join('');
    }, 
    function (value) {
      let dataset = createDataset(scope.cells);

      if (_cellCount === 1 && dataset.length === 1) {
        dataset[0].color = "#1A1A1A"; // Cell white, data black
      } 

      charter.updateChart(dataset);
    });

    scope.$watch(function (scope) {
      return scope.cells.map( (cell) => cell.highlight ? 't' : 'f' ).join('');
    }, 
    function (value) {
      // console.log('update highlight');
      // Use this to show only one piece of datum at a time | Highlight
    });
  };

  // ------------------------------------
  // D3

  function createDataset (cells) {
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

  let charter = (function() {
    let width, height,
        xScale, yScale,
        xAxis, yAxis,
        margin,
        tooltip,
        ipl,
        volume,
        svg,
        clip,
        cellId,
        label,
        lineGenerator;


    function createChart() {
      width = angular.element('.characterization').width(),
      height = 500;

      margin = {
        top: 10,
        right: 40,
        bottom: 50,
        left: 25,
      };

      // Set graph dimensions
      width = width - margin.left - margin.right;
      height = height - margin.top - margin.bottom;

      // Set ranges
      xScale = d3.scale.linear().range([0, width]),
      yScale = d3.scale.linear().range([height, 0]); // Reverse for SVG drawing

      // Define axes
      xAxis = d3.svg.axis().scale(xScale)
        .orient('bottom')
        .innerTickSize(-height)
        .outerTickSize(0)
        .tickPadding([7])
        .ticks(5);

      yAxis = d3.svg.axis().scale(yScale)
        .orient('left')
        .innerTickSize(-width)
        .outerTickSize(0)
        .tickPadding([7])
        .ticks(5);

      // Set range of data
      yScale.domain([120, -20]); // IPL % | GCL Bottom
      xScale.domain([0, 0.05]);  // Arbor Volume Density

      // Define line generator
      lineGenerator = d3.svg.line()
        .interpolate("basis")
        .x(function(d) { return xScale(d.y); }) // Value is intentionally flipped
        .y(function(d) { return yScale(d.x); });

      // Add svg canvas
      svg = d3.select("#stratification-chart")
        .append("svg")
          .attr("id", "stratification-svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

      // Define 'div' for tooltips
      tooltip = d3.select("#stratification-chart")
        .append("div")
        .attr("id", "tooltip");
        tooltip = d3.select("#tooltip")
          .append("h3")
          .attr("id", "cell-id");
        tooltip = d3.select("#tooltip")
          .append("hr");
        tooltip = d3.select("#tooltip")
          .append("h4")
          .text("IPL%");
        tooltip = d3.select("#tooltip")
          .append("p")
          .attr("id", "ipl");
        tooltip = d3.select("#tooltip")
          .append("h4")
          .text("Volume");
        tooltip = d3.select("#tooltip")
          .append("p")
          .attr("id", "volume");
        tooltip = d3.select("#tooltip");



       //make a clip path for the graph  
      clip = svg.append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", width)
        .attr("height", height);   

      // Tooltip keys
      cellId = d3.select("#cell-id");
      volume = d3.select("#volume");
      ipl    = d3.select("#ipl");

      // Add X axis
      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
          .style("text-anchor", "start");

      // Axis label | X
      let xLabel = svg.select(".x.axis")
          .append("text")
            // .attr("class", "axis-label")
            .attr("text-anchor", "middle")
            .attr("transform", "translate(" + (width/2) + ", 35)")
            .text("% IPL Depth");

      // Add Y axis
      svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

      // Axis label | Y
      let yLabel = svg.select(".y.axis")
          .append("text")
            // .attr("class", "axis-label")
            .attr("text-anchor", "middle")
            .attr("transform", "translate(" + (height/2) + ") rotate(-90)")
            .text("Arbor Volume Density");

      svg.selectAll(".tick")
        .filter(function (d) { return d === 0;  })
        .text("");
    }

    function updateChart(dataset) { // Load the dataset | Refresh chart
      //Update scale X domain | Datum intentionally flipped
      xScale.domain([
        0, 
        d3.max(dataset, function(d) { // forEach element of dataSet
          return d3.max(d.data, function(dd) { // forEach element of dataSet.data
            return dd.y; // return value
          }); 
        })
      ]);

      // Announce to D3 that we'll be binding our dataset to 'series' objects
      let series = svg.selectAll(".series")
        .data(dataset, function(d) { return d.label; }); // Key function for data join

      // Remove extra data points on highlight
      let seriesExit = series.exit().transition()
            .duration(200)
            .style("opacity", 0)
            .remove();

      // Create separate groups for each series object 
      let seriesEnter = series.enter().append("g")
        .attr("class", "series")
        .attr("id", function(d) { return d.label; }) // Name each uniquely wrt cell label
        .append("path")
          .attr("class", "line")
          .attr("opacity", 0)
          .attr("d", function(d) { return lineGenerator(d.data); }) // Draw series line
          .attr("stroke", function(d) { return d.color; })
        .transition()
          .duration(200)
          .attr("opacity", 1);

      // // Draw a hidden scatterplot, for mouseover
      let scatter = series.selectAll('dot')
        .data( function(d) { // Use accessor functions to dive into data
          let label = d.label;
          let output = d.data.map(function(obj){ 
            let rObj = {
              x: obj.x,
              y: obj.y,
              label: label,
            };
            return rObj;
          });

          return output;
        });
      
      let scatterEnter = scatter.enter().append("circle")
        .attr("r", 3)
        .attr("class", "point")
        .attr("cx", function(d) { return xScale(d.y); }) // Datum intentionally flipped
        .attr("cy", function(d) { return yScale(d.x); })
        .on('mouseover', function(d) {
          tooltip.transition()
            .duration(200)
            .style('opacity', 1);
          tooltip
            .style('left', width - this.getBoundingClientRect().width - 50 + "px")
            .style('top', function() {
              return Math.abs(d3.mouse(d3.select('#stratification-svg').node())[1]) > height / 2
                ? 35 + "px"           // Put tooltip in top
                : height - this.getBoundingClientRect().height - 20 + "px";  // Put tooltip in bottom
            });
          cellId
            .text(d.label);
          volume 
            .text(d.y);
          ipl
            .text(d.x);
        })
        .on('mouseout', function(d) {
            tooltip.transition()
              .duration(200)
              .style('opacity', 0);
        });

      let scatterExit = scatter.exit()
          .remove();

      //Update X axis
      svg.select(".x.axis")
          .transition()
          .duration(200)
        .call(xAxis);

      //Update Y axis
      svg.select(".y.axis")
          .transition()
          .duration(200)
        .call(yAxis);

    }

    // Call this on resize
    function calcWidth(container) {
      let width = container.width(),
          paddingLeft = container.css('padding-left'), 
          paddingRight = container.css('padding-right');

      paddingLeft = paddingLeft.slice(0, -2); // CSS returns "px"
      paddingRight = paddingRight.slice(0, -2);

      width = width - paddingLeft - paddingRight;

      return width;
    }

    return {
      calcWidth: function() {
        calcWidth();
      },
      updateChart: function(scope) {  
        updateChart(scope);
      },
      toggleCell: function(scope) {  
        toggleCell(scope);
      },
      highlightCell: function(scope) {  
        highlightCell(scope);
      },
      createChart: function() {  
        createChart();
      },
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
   

