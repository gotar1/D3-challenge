// The code for the chart is wrapped inside a function
// that automatically resizes the chart

// if the SVG area isn't empty when the browser loads, remove it
// and replace it with a resized version of the chart
let svgArea = d3.select("#scatter").select("svg");
if (!svgArea.empty()) {
  svgArea.remove();
}

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
// let chosenX = 'Poverty';
// let chosenY = 'Healthcare';



// append svg and group
let svg = d3
  .select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

let chartGroup = svg
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// data
function buildChart() {
  d3.csv('./assets/data/data.csv').then(d => {
    console.log(d)
    let abbr = d.map(d => d.abbr);
    console.log(abbr)

    let xAxis = 'Poverty';
    let yAxis = 'Healthcare';
    
    let poverty = d.map(d => parseFloat(d.poverty));
    console.log(poverty);

    let healthCare = d.map(d => parseFloat(d.healthcare));
    console.log(healthCare);

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
        .style("opacity", 0.5)

    // Set up y axis label
    chartGroup.selectAll("dot")
      .data(d)
      .enter()
      .append("text")
        .text(d => d.abbr)
        .attr("x", d => scale.x(parseFloat(d.poverty)))
        .attr("y", d => scale.y(parseFloat(d.healthcare)) + 3)
        .attr("fill", "white")
        .attr('text-anchor', 'middle')
        .attr("font-size", 10)
        
    
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

// Create a function that will go through and update the x_scale upon clicking on the axis label
function axisScale(chosenX, chosenY) {
  // create linear scale
  let xLinearScale = d3.scaleLinear()
    .domain([d3.min(chosenX) - 1 ,d3.max(chosenX)])
    .range([0, width]);
  
  let yLinearScale = d3.scaleLinear()
    .domain([d3.min(chosenY) - 1 ,d3.max(chosenY)])
    .range([height, 0]);
  
  return {'x': xLinearScale, 'y': yLinearScale}
}

buildChart();

