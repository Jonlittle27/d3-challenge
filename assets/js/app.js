// Define SVG area dimensions
var svgWidth = 800;
var svgHeight = 500;

// Define the chart's margins as an object
var chartMargin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

//Appending the svg to the body tag
var svg = d3.select("#scatter")
  .append("svg") 
  .attr("height", svgHeight)
  .attr("width", svgWidth);

//chart group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

var csv = "assets/data/data.csv"


//data
d3.csv(csv).then(function(stateData) {
    console.log(stateData)

    //parse data and cast as numbers 
    stateData.forEach(function(data) {
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
      });
    
    //scaling functions
    var xLinearScale = d3.scaleLinear()
      .domain([6, d3.max(stateData, d => d.smokes)])
      .range([0, chartWidth]);

    var yLinearScale = d3.scaleLinear()
      .domain([15, d3.max(stateData, d => d.obesity)])
      .range([chartHeight, 0]);
    
    // creating axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // appending the axis to the chart
    chartGroup.append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // creating the scatter circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(stateData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.smokes))
    .attr("cy", d => yLinearScale(d.obesity))
    .attr("r", "10")
    .attr("fill", "lightblue")
    .attr("opacity", ".5");

    //labeling the points with state abbr
    var circleLabels = chartGroup.selectAll()
        .data(stateData)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d.smokes))
        .attr("y", d => yLinearScale(d.obesity))
        .style("font-size", "7px")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text(d => (d.abbr))

    // creating the tool tip
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>Smokes: ${d.smokes}%<br>Obesity: ${d.obesity}%`);
      });

    // creating tooltip
    chartGroup.call(toolTip);

    // creating event listeners to display and hide the tooltip
    circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // creating axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - chartMargin.left + 40)
      .attr("x", 0 - (chartHeight / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Obesity Percentage");

    chartGroup.append("text")
      .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + chartMargin.top + 30})`)
      .attr("class", "axisText")
      .text("Smokers Percentage");
}).catch(function(error) {
    console.log(error);
  });
