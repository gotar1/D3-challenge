// if the SVG area isn't empty when the browser loads, remove it
// and replace it with a resized version of the chart
let svgArea = d3.select("#scatter").select("svg");
if (!svgArea.empty()) {
  svgArea.remove();
};

// Setting the SVG perimeter
let svgWidth = 1000;
let svgHeight = 500;

// Setting the margins that will be used to get a chart area
let margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

// Chart area
let height = svgHeight - margin.top - margin.bottom;
let width = svgWidth - margin.left - margin.right;

// Y axis is going to be Healthcare
// X axis is going to be Poverty

// append svg and group
let svg = d3
  .select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

let chartGroup = svg
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// data and fuction to build chart..
function buildChart() {
  d3.csv('./assets/data/data.csv').then(d => {
    console.log(d)
    
    let abbr = d.map(d => d.abbr);
    console.log(abbr)
    
    let poverty = d.map(d => parseFloat(d.poverty));
    console.log(poverty);

    let healthCare = d.map(d => parseFloat(d.healthcare));
    console.log(healthCare);

    // call our axis rendering and scale functions to populate our axis and append circles and text to data points.. 
    let scale = axisScale(poverty, healthCare);
    renderAxes(scale);

    // append circles to data points
    chartGroup.append("g")
      .selectAll("dot")
      .data(d)
      .enter()
      .append("circle")
        .attr("cx", d => scale.x(parseFloat(d.poverty)))
        .attr("cy", d => scale.y(parseFloat(d.healthcare)))
        .attr("r", 15)
        .attr("fill", "blue")
        .attr("opacity", 0.5)

    // Set up and append text with state appreviation to show inside circle..
    chartGroup.selectAll("dot")
      .data(d)
      .enter()
      .append("text")
        .text(d => d.abbr)
        .attr("x", d => scale.x(parseFloat(d.poverty)))
        .attr("y", d => scale.y(parseFloat(d.healthcare)))
        .attr("fill", "white")
        .attr('text-anchor', 'middle')
        .attr("font-size", 10)
    
    // set x axis label..
    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + 24})`)
        .attr("x", -25)
        .attr("y", 35)
        .classed("axis-text", true)
        .text("In Poverty (%)")
        .attr("fill", "white")
        .attr("font-size", 25)

    // Set up y axis label
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height/1.5))
      .attr("dy", "1em")
      .classed("axis-text", true)
      .text("Lacks Healthcare (%)")
      .attr("fill", "white")
      .attr("font-size", 25)
    
  }).catch(err => console.log(err))

};

// Function for rendering Axis.
function renderAxes(scale) {
  let bottomAxis = d3.axisBottom(scale.x);
  let leftAxis = d3.axisLeft(scale.y);
  
  chartGroup
    .append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(bottomAxis)

  chartGroup
    .append('g')
    .call(leftAxis);
};

// function to setup axis scales....
function axisScale(chosenX, chosenY) {

  // create linear scales for x and y axis
  let xLinearScale = d3.scaleLinear()
    .domain([d3.min(chosenX) - 2 ,d3.max(chosenX)])
    .range([0, width]);
  
  let yLinearScale = d3.scaleLinear()
    .domain([d3.min(chosenY) - 1 ,d3.max(chosenY)])
    .range([height, 0]);
  
  return {'x': xLinearScale, 'y': yLinearScale}
};

// call functtion to build chart
buildChart();

