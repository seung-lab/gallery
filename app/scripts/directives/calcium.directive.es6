'use strict';
  
app.directive('calcium', [ function () {

  var chartLinker = function (scope, element, attrs) {
    
    // Make dataset
    scope.angles = [ 0, 315, 270, 225, 180, 135, 90, 45, 0 ]; // Hack for line to connect to self
    scope.dataset = makeDataset(scope);

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

  };

  function updateChartColors (scope) {

    if (!scope.chart) {
      return;
    }

    let dict = {};
    let any = false;

    scope.cells.forEach(function (cell) {
      any = any || cell.highlight;
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
    scope.dataset = scope.dataset.filter( ds => !ds.hidden );
    scope.chart.updateToggle(scope); // Update chart here
  }

  function makeDataset (scope) {
    let cells = scope.cells,
        activation = scope.activation;

    let any_highlighted = false;
    cells.forEach( (cell) => any_highlighted = any_highlighted || cell.highlight );

    cells = cells.filter( (cell) => cell.directional_response );

    return cells.map(function (cell) {

      let color = cell.color;
      if (scope.cells.length === 1) {
        color = '#1A1A1A';
      }

      let line_color = ColorUtils.toRGBA(color, 1);

      let hidden = false;
      if (!cell.highlight && cell.hidden) {
        hidden = true;
      }
      else if (!cell.highlight && any_highlighted) { // If <any_highlighted> = true, then we are highlighting
        hidden = true;
      }

      return  {
        label: cell.id,
        hidden: hidden,
        color: color,
        data: scope.angles.map(function (angle) {
          return cell.directional_response.activations[angle];
        }),
      };
    });
  }

  // ------------------------------------
  // D3

  function makeChart(scope, element) {
    // Size Characteristics
    let width,
        height,
        radius,
        margin = {
          top: 35,
          right: 35,
          bottom: 35,
          left: 35,
        };

    // Data
    let dataset,
        angles;

    // Scales + Axes
    let radScale,
        labelScale,
        regions;

    // Tooltip
    let tooltip,
        activation,
        cellId;

    // Generator functions
    let polarLineGenerator,
        lineGenerator;

    // SVG element groups
    let svg,
        svg_container,
        seriesGroup,
        radAxisGroup,
        thetaAxisGroup,
        regionalAxisGroup,
        regionalLabelsGroup;

    regions = 2; // Number of radial grid lines

    dataset = scope.dataset;
    angles = scope.angles;

    // Trig helper functions
    function toDegrees(rad) {
      return rad * 180 / Math.PI;
    }

    function toRadians(deg) {
      return deg * Math.PI / 180;
    }

    function polarX(rad, theta) {
      return radius + rad * Math.cos(toRadians(theta)); // X + transtion to center
    }
    
    function polarY(rad, theta) {
      // -rad to flip chart to upright orientation
      return radius + -rad * Math.sin(toRadians(theta)); // Y + transtion to center
    }

    // Define line 'polar' generatdebugger; or
    polarLineGenerator = d3.svg.line()
      .interpolate('linear')
      .x( function(d) { return polarX(radScale(d.x), d.value); })
      .y( function(d) { return polarY(radScale(d.y), d.value); });

    lineGenerator = d3.svg.line()
      .interpolate('linear')
      .x( function(d) { return d.x; })
      .y( function(d) { return d.y; });

    // Add svg
    svg_container = d3.select(element[0])
      .attr("class", "radar-chart chart");

    svg = svg_container
        .append("svg")
          .attr("id", scope.activation + "_svg")
          .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");

    // Set local svg reference
    svg = d3.select('#' + scope.activation + "_svg").select("g");

    setDimensions();

    radScale = d3.scale.linear();   // Define main scale
    labelScale = d3.scale.linear(); // Inverse for setting labels

    // Set domain, range
    setScales(scope);

    // Setup Axes Groups
    setAxes();

    // Setup Tooltip
    setTooltip(scope);

    // Setup Series Groups
    setSeries();

    function highlight(scope) { 
    // Update Chart Series      
      updateSeries(scope);
    }

    function updateToggle(scope) {
      // Update graph dimensions
      setDimensions(scope);
      // Update Axes
      updateAxes(scope, 2);
      // Update Chart Series
      updateSeries(scope);
    }

    function update(scope) {
      updateToggle(scope);
      // Update domain, range
      setScales(scope);
      // Update Chart Series
      updateSeries(scope);
    }

    function setTooltip(scope) {
      // Define 'div' for tooltips
      tooltip = d3.select(element[0])
        .append("div")
          .attr("id", "tooltip-" + scope.activation)
          .attr("class", "tooltip");

      tooltip
        .append("h4")
        .text("ID");
        tooltip
          .append("p")
          .attr("class", "cell-id");
        tooltip
          .append("h4")
          .text("Activation");
        tooltip
          .append("p")
          .attr("class", "activation");

      // Tooltip keys
      cellId = tooltip.select(".cell-id");
      activation = tooltip.select(".activation");

    }

    function setSeries() {
     
      // Create group for series elements
      seriesGroup = svg.append("g");
      seriesGroup.attr('class', "series-group");                  

    }

    function updateSeries(scope) {

      dataset = scope.dataset;
      angles = scope.angles;      

      let series = seriesGroup.selectAll('.radar-lines')
            .data(dataset, function(d) { return d.label; }); 

            // Remove extra data points
            series.exit().classed({ 'series-hidden': true })
                         .remove();
            
            // Create Series Lines
            series.enter().append("path")
                .attr("class", "line radar-lines transition-none series-hidden")
                .attr("id", function(d) { return "radar-" + scope.activation + "-" + d.label; }) // Name each uniquely wrt cell label
                .attr("opacity", 0)
                .classed({ 'transition-none': false, 'series-hidden': false, 'series-visible': true });

            // Update Series Lines
            series
                .attr("d", function(d) { 
                  return lineGenerator(setRadarValues(d.data, angles)); // Draw radar line
                })
                .attr("stroke", function(d) { return d.color; });

      let seriesCircleGroup = seriesGroup.selectAll('.circle-series-group')
            .data(dataset, function(d) { return d.label; });

            // Remove extra data points
            seriesCircleGroup.exit().classed({ 'series-hidden': true })
                                    .remove();

            // Create Groups / Cell Series
            seriesCircleGroup.enter().append("g")
              .attr('id', function(d) { return "cell-circle-series-group-" + scope.activation + "-" + d.label; })
              .attr('cell-label', function(d) { return d.label; })
              .attr('class', "circle-series-group");

            seriesCircleGroup.style("fill", function(d) { return d.color; }); 

      let seriesPoints = seriesCircleGroup.selectAll('.circle-series')
            .data(function(d) { return d.data; });

            // Remove extra data points
            seriesPoints.exit().classed({ 'series-visible': false, 'series-hidden': true })
                               .remove();

            // Create Circle Points
            seriesPoints.enter().append("circle")
              .classed({ 'circle-series': true, 'series-hidden': false, 'series-visible': true });

            // Update Circle Points
            seriesPoints
              .attr("cx", function(d, i) { return polarX(radScale(d), angles[i]); })
              .attr("cy", function(d, i) { return polarY(radScale(d), angles[i]); })
              .classed({ 'circle-two': true });

      let seriesHitPoints = seriesCircleGroup.selectAll('.circle-series-hit')
            .data(function(d) { return d.data; });

            // Remove extra data points
            seriesHitPoints.exit().classed({ 'series-visible': false, 'series-hidden': true })
                                  .remove(); 

            // Create Circle Points
            seriesHitPoints.enter().append("circle")
              .classed({ 'circle-series-hit': true, 'series-hidden': true, 'series-visible': false });

            // Update Circle Points
            seriesHitPoints
              .attr("cx", function(d, i) { return polarX(radScale(d), angles[i]); })
              .attr("cy", function(d, i) { return polarY(radScale(d), angles[i]); })
              .classed({ 'circle-ten': true });

          // Mouseover Tooltip
          seriesHitPoints.on('mouseover', function(dd) {
            let element = d3.select(this);

            element.classed({ 
              'circle-ten': false,
              'circle-five': true,
              'series-hidden': false,
              'series-visible': true,
            });

            // Get positon of datum
            let x = parseInt(element.attr('cx')),
                y = parseInt(element.attr('cy'));

            // Logic for padding
            x = x > radius
                ? x - 75
                : x + 50;

            y = y > radius
                ? y - 75
                : y + 60;

            tooltip.classed({ 'series-hidden': false, 'series-visible': true })
                   .style('z-index', 1);

            tooltip // Setting positioning logic 
              .style('left', function() {
                  return x + "px";
              })
              .style('top', function() {
                  return y + "px";
              });

            let activation_output = element.datum();
                activation_output = activation_output.toFixed(5);

            activation.text(activation_output); // Convert cartesian coords

            let cell_label = d3.select(this.parentNode).attr('cell-label');
            cellId.text(cell_label);
          });

          // MouseOut Tooltip
          seriesHitPoints.on('mouseout', function(dd) {
            let element = d3.select(this);

            element.classed({ 
              'circle-ten': true,
              'circle-five': false,
              'series-hidden': true,
              'series-visible': false,
            });

            tooltip.classed({ 'series-hidden': true, 'series-visible': false })
                   .style('z-index', -1);

          });
    }

    function setRegionValues(angles, regions) {

      // Region Iterator
      let step = radius / regions,
          regionValues = [];  

      let polarXY = function(value) {
        let dd = [];
        
        for (let j = 0; j < angles.length; j++) {
          dd.push (
            {
              x: polarX(value, angles[j]),
              y: polarY(value, angles[j]),
            }
          );
        }

        return dd;
      }

       // Divide chart into even regions, starting from edges
      for (let i = 0; i < regions; i++) {
        let value = radius - 7.5 - step * i; // --> 7.5 ~ Padding
        regionValues.push(
          { 
            value: value, 
            data: polarXY(value),
            label: i,
          }
        );
      }

      return regionValues;

    }

    function setRadarValues(values, angles) {
      let radarValues = [];

      for (let i = 0; i < angles.length; i++) {
          radarValues.push (
            {
              x: polarX(radScale(values[i]), angles[i]),
              y: polarY(radScale(values[i]), angles[i]),
            }
          );
        }

      return radarValues;
    }

    function setAxes() {

      // Create group for radial axis elements
      radAxisGroup = svg.append("g");
        radAxisGroup.attr('class', "radial-axis-labels-group");    

      // Create group for theta axis elements
      thetaAxisGroup = svg.append("g");
        thetaAxisGroup.attr('class', "theta-axis-group");

      // Create group for regional axis elements
      regionalAxisGroup = svg.append("g");
        regionalAxisGroup.attr('class', "regional-axis-group");

      // Create group for regional label elements
      regionalLabelsGroup = svg.append("g");
        regionalLabelsGroup.attr('class', "regional-labels-group");

    }

    function updateAxes(scope, regions) {

      dataset = scope.dataset;
      angles = scope.angles;

      let regionValues = setRegionValues(angles, regions);    

      // Join Axis Data
      let radAxis = radAxisGroup.selectAll('.rad-axis')
            .data(angles, function(d) { return d; }); // Make an axis for each angle

            // Remove extra data points
            radAxis.exit().classed({ 'series-hidden': true })
                          .remove();

            // Create Radial Axes
            radAxis.enter().append('line')
              .attr('id', function(d) { return "degrees-" + scope.activation + "-" + d; })
              .attr('class', 'rad-axis');

            // Update Radial Axes
            radAxis
              .attr("x1", radius) // Center
              .attr("y1", radius) // Center
              .attr("x2", function(d) { return polarX(radius, d); })
              .attr("y2", function(d) { return polarY(radius, d); });

      // Join Theta Axis Data
      let thetaAxisLabels = thetaAxisGroup.selectAll('.theta-label')
            .data(angles, function(d) { return d; }); // Make an axis for each angle

            // Remove extra data points
            thetaAxisLabels.exit().classed({ 'series-hidden': true })
                                  .remove();

            // Create Theta Axis Labels
            thetaAxisLabels.enter().append("text")
              .attr('class', 'theta-label axis')
              .attr("text-anchor", "middle");

            // Update Theta Axis Labels
            thetaAxisLabels
              .attr("transform",function(d) {  // Position labels
                let radius_plus  = radius + 10; // Position labels out a bit
                return "translate(" + 
                  polarX(radius_plus, d) + "," + 
                  polarY(radius_plus, d) + ")";
              })
              .text(function(d) { return d; });

      // Join Regional Axis Data
      let regionalAxes = regionalAxisGroup.selectAll('.regional-axis')
            .data(regionValues, function(d) { return d.label; });

            // Create Regional Axes --> Circular | Lines
            regionalAxes.enter()
              .append("path")
                .attr('id', function(d) { return "regional-axis_" + scope.activation + "-" + d.label; })
                .attr("class", "regional-axis line transition-none series-hidden")
                .classed({ 'transition-none': false, 'series-hidden': false, 'series-soft': true });

            // Update Regional Axes --> Circular | Lines
            regionalAxes
                .attr("opacity", 0)
                .attr("d", function(d) { return lineGenerator(d.data); }) // Draw radarLines line
                .attr("stroke", function(d) { return d.color; })
                .classed({ 'series-hidden': false, 'series-soft': true });

            // Remove extra data points
            regionalAxes.exit().classed({ 'series-hidden': true, 'series-soft': false })
                               .remove();

      // Join Regional Axis Data
      let regionalLabels = regionalLabelsGroup.selectAll('.regional-label')
            .data(regionValues, function(d) { return d.label; });

            // Remove extra data points
            regionalLabels.exit().classed({ 'series-hidden': true, 'series-soft': false });

            // Create Regional Value Background Circles
            regionalLabels.enter().append("circle")
                  .attr('class', 'regional-circle circle-seven-five');

            // Update Regional Value Background Circles
            regionalLabels
                .attr("cx", function(d) { return polarX(d.value, 270); })
                .attr("cy", function(d) { return polarY(d.value, 270); });

            // Create Regional Text Value
            regionalLabels.enter().append('text') // Create Regional Labels
              .attr('id', function(d) { return "regional-label_" + scope.activation + "-" + d.label; })
              .attr('class', "regional-label axis")
              .attr('text-anchor', 'middle');

            // Update Regional Text Value
            regionalLabels
              .attr("transform", function(d) {
                return "translate(" + 
                  polarX(d.value, 270) + "," + // Set theta = 0 --> Vertical alignment
                  polarY(d.value, 270) + ")";
              })
              .text(function(d) { return Math.floor(labelScale(d.value)); }); // Radius location wrt domain
    }

    function setScales(scope) {
      dataset = scope.dataset;
      angles = scope.angles;

      radScale.range([0, radius]); // Scale = Chart Radius

      let max = !dataset.length
        ? 1
        : d3.max(dataset, function(d) { // forEach element of dataSet
            return Math.max(...d.data);
          });

      max *= 1.2; // Padding

      radScale.domain([ 0, max ]);

      // Inverse for setting labels
      labelScale.domain([0, radius])
      labelScale.range([ 0, max ]);
    }

    function setDimensions() {
      width = angular.element('.radar-chart').width();
      height = width; // square format

      // SVG width --> height
      svg_container
        .style('width', function() { return width + "px"; })
        .style('height', function() { return width + "px"; });

      // Set graph dimensions
      width = width - margin.left - margin.right;
      height = height - margin.top - margin.bottom;

      radius = width / 2;
    }

    return {
      update: update,
      updateToggle: updateToggle,
      highlight: highlight,
    };
  }

  return {
    restrict: "E",
    scope: {
        activation: "@activation",
        cells: "=",
    },
    replace: false,
    transclude: false,
    link: chartLinker,
  };

}]);
   

