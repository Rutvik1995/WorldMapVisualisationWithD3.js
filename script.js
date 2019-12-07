$(window).on("load", function() {
  // $("#myModalIntro").modal("show");
});

// Global variables for line chart
var country1 = "China";
var country2 = "United Kingdom";
var lineChartWorldBankData = {};
var minYearLineChart = "1960";
var maxYearLineChart = "1990";

var number = 123;
var year = 1992;
var timeInterval;
var downDownValue = "CO2 emissions (kt)";
var output_year = document.getElementById("yy");
var toolTipValue = "CO2 emissions (kt)";
//console.log(output_year);
var yearVisedata = {};
var yearAuto = 1991;

function trig() {
  yearAuto++;
  document.getElementById("animationSpan").innerHTML = yearAuto;
  if (yearAuto >= 2012) {
    document.getElementById("yr").style.display = "block";
    document.getElementById("yy").style.display = "block";
    document.getElementById("animationSpan").style.display = "none";
    document.getElementById("buttonStop").style.display = "none";
    document.getElementById("buttonStart").style.display = "block";
    clearInterval(timeInterval);
    yearAuto = 1991;
    year = 1992;

    d3.queue()
      .defer(
        d3.json,
        "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
      )
      .defer(d3.csv, "concap.csv")
      .defer(
        d3.csv,
        "https://raw.githubusercontent.com/ZeningQu/World-Bank-Data-by-Indicators/master/climate-change/climate-change.csv"
      )
      .await(ready);
    return;
  }
  year = yearAuto;
  d3.queue()
    .defer(
      d3.json,
      "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
    )
    .defer(d3.csv, "concap.csv")
    .defer(
      d3.csv,
      "https://raw.githubusercontent.com/ZeningQu/World-Bank-Data-by-Indicators/master/climate-change/climate-change.csv"
    )
    .await(ready);
}

function numberWithCommas(x) {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

function addInterval() {
  document.getElementById("yr").style.display = "none";
  document.getElementById("yy").style.display = "none";
  document.getElementById("animationSpan").style.display = "block";
  document.getElementById("buttonStop").style.display = "block";
  document.getElementById("buttonStart").style.display = "none";

  timeInterval = setInterval(function() {
    trig();
  }, 200);
}
function StopInterval() {
  document.getElementById("yr").style.display = "block";
  document.getElementById("yy").style.display = "block";
  document.getElementById("animationSpan").style.display = "none";
  document.getElementById("buttonStop").style.display = "none";
  document.getElementById("buttonStart").style.display = "block";
  year = 1991;
  clearInterval(timeInterval);
}

function changeSlider() {
  // console.log("trigger");
}

document.getElementById("yr").addEventListener("change", function() {
  year = this.value;
  output_year.value = this.value;

  d3.queue()
    .defer(
      d3.json,
      "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
    )
    .defer(d3.csv, "concap.csv")
    .defer(
      d3.csv,
      "https://raw.githubusercontent.com/ZeningQu/World-Bank-Data-by-Indicators/master/climate-change/climate-change.csv"
    )
    .await(ready);
});

function myFunction() {
  downDownValue = document.getElementById("mySelect").value;
  yearAuto = 1991;

  //  console.log(downDownValue);
  if (downDownValue == "CO2 emissions (kt)") {
    toolTipValue = "CO2 emissions (kt)";
  } else if (downDownValue == "Methane emissions (kt of CO2 equivalent)") {
    toolTipValue = "Methane emissions (kt)";
  } else if (
    downDownValue ==
    "Nitrous oxide emissions (thousand metric tons of CO2 equivalent)"
  ) {
    toolTipValue = "Nitrous oxide emissions (kt)";
  } else if (downDownValue == "Population, total") {
    toolTipValue = "Total Population ";
  } else if (
    downDownValue == "Total greenhouse gas emissions (kt of CO2 equivalent)"
  ) {
    toolTipValue = "Total greenhouse (kt)";
  }

  d3.queue()
    .defer(
      d3.json,
      "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
    )
    .defer(d3.csv, "concap.csv")
    .defer(
      d3.csv,
      "https://raw.githubusercontent.com/ZeningQu/World-Bank-Data-by-Indicators/master/climate-change/climate-change.csv"
    )
    .await(ready);
}
var yearVisedata = [];

const tooltip = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip-map")
  .style("opacity", 0);

var margin = { top: 10, right: 10, bottom: 10, left: 0 },
  width = 730 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

var svg = d3
  .select(".map")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "scale(1.4)")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var projection = d3
  .geoMercator()
  .translate([width / 2, height / 2])
  .scale(90);

var path = d3.geoPath().projection(projection);

var f = d3
  .queue()
  .defer(
    d3.json,
    "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
  )
  .defer(d3.csv, "concap.csv")
  .defer(
    d3.csv,
    "https://raw.githubusercontent.com/ZeningQu/World-Bank-Data-by-Indicators/master/climate-change/climate-change.csv"
  )
  .await(ready);

var yearVisedata = [];
var m = svg
  .append("g")
  .attr("class", "legendThreshold")
  .attr("transform", "translate(15,200)")
  .append("text");

// Global WorldBankData object for Line Chart
var lineChartWorldBankData = {};

function ready(error, topo, dataset, worldBankData) {
  lineChartWorldBankData = JSON.parse(JSON.stringify(worldBankData));
  renderMap(topo, worldBankData);
  cleanedWorldBankData = filterTopData(worldBankData);
  renderPieChart(cleanedWorldBankData);
  renderBarChart(cleanedWorldBankData);
  updateLineChart(lineChartWorldBankData);
}

function filterTopData(worldBankData) {
  let nonCountryArray = [
    "East Asia & Pacific (excluding high income)",
    "East Asia & Pacific (IDA & IBRD countries)",
    "Early-demographic dividend",
    "element Middle East & North Africa (IDA & IBRD countries)",
    "Europe & Central Asia (IDA & IBRD countries)",
    "East Asia & Pacific",
    "IBRD only",
    "Late-demographic dividend",
    "Latin America & Caribbean (excluding high income)",
    "Middle East & North Africa (excluding high income)",
    "Middle East & North Africa (IDA & IBRD countries)",
    "Pacific island small states",
    "Sub-Saharan Africa (IDA & IBRD countries)",
    "Upper middle income",
    "Central Europe and the Baltics",
    "Europe & Central Asia (excluding high income)",
    "Europe & Central Asia",
    "Fragile and conflict affected situations",
    "Heavily indebted poor countries (HIPC)",
    "High income",
    "IDA & IBRD total",
    "Low & middle income",
    "Middle income",
    "OECD members",
    "Post-demographic dividend",
    "Pre-demographic dividend",
    "Sub-Saharan Africa (excluding high income)",
    "Caribbean small states",
    "Least developed countries: UN classification",
    "South Asia (IDA & IBRD)",
    "South Asia",
    "Latin America & the Caribbean (IDA & IBRD countries)",
    "Latin America & Caribbean",
    "Low income",
    "European Union",
    "World",
    "Lower middle income",
    "Middle East & North Africa",
    "Euro area",
    "Arab World",
    "IDA total",
    "Sub-Saharan Africa",
    "IDA blend",
    "IDA only",
    "Small states",
    "Other small states",
    "North America",
    "South America"
  ];
  // let sortIndex = "Country Name";
  let sortIndex = downDownValue;
  let sortedWorldBankData = [];
  // sortedWorldBankData = worldBankData.slice().sort((a, b) => d3.descending(a[sortIndex], b[sortIndex]));
  sortedWorldBankData = worldBankData
    .slice()
    .sort((a, b) =>
      d3.descending(parseInt(a[sortIndex]), parseInt(b[sortIndex]))
    );
  // for each element in worldBankData if the country name is in nonCountyArrays[] do not add it to cleaned array
  // console.log(year);
  cleanedWorldBankData = [];

  sortedWorldBankData.forEach(element => {
    // console.log(element["Year"]);
    if (
      element["Year"] == year &&
      !nonCountryArray.includes(element["Country Name"])
    ) {
      // console.log(element["Country Name"]);
      return cleanedWorldBankData.push(element); // filter remove
    }
  });

  dataForCharts = [];

  // push top 10 values in data
  for (i = 0; i < 8; i++) {
    dataForCharts.push({
      name: cleanedWorldBankData[i]["Country Name"],
      value: cleanedWorldBankData[i][sortIndex]
    });
  }

  console.log(dataForCharts);

  return dataForCharts;
}

function renderMap(topo, worldBankData) {
  let count = 0;
  let maxValueCo2 = 0;
  let countries = topo.features;
  //  console.log(year);
  for (let i = 0; i < worldBankData.length; i++) {
    if (worldBankData[i].Year == year) {
      if (worldBankData[i][downDownValue] > maxValueCo2) {
        maxValueCo2 = worldBankData[i][downDownValue];
      }
      count++;
    }
  }

  //   let color = d3
  //     .scaleLinear()
  //     .domain([3, maxValueCo2])
  //     .range(["rgb(255, 127, 14)", "rgb(214, 39, 40)"]);

  let colorScale = d3
    .scaleThreshold()
    .domain([1000, 10000, 100000, 300000, 1000000, 5000000])
    .range(d3.schemeOranges[7]);
  m.attr("class", "caption")
    .attr("x", 0)
    .attr("y", -6)
    .text(toolTipValue);

  var labels = [
    "0",
    "1-1000",
    "1000-10000",
    "10000-100000",
    "100000-300000",
    "300000-1000000",
    ">1000000"
  ];
  var legend = d3
    .legendColor()
    .labels(function(d) {
      return labels[d.i];
    })
    .shapePadding(4)
    .scale(colorScale);
  svg.select(".legendThreshold").call(legend);

  svg
    .selectAll(".country")
    .data(countries)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("fill", function(d, i) {
      let t = d.id;
      let colorValue = null;
      for (let i = 0; i < worldBankData.length; i++) {
        if (worldBankData[i].Year == year) {
          if (worldBankData[i]["Country Code"] == t) {
            colorValue = worldBankData[i][downDownValue];
          }
        }
      }
      return colorScale(colorValue);
    })
    .on("mouseover", function(d) {
      let t = d.id;
      let hoverData = null;
      // console.log(t);
      for (var i = 0; i < worldBankData.length; i++) {
        if (worldBankData[i].Year == year) {
          if (worldBankData[i]["Country Code"] == t) {
            //console.log("yes");
            //console.log(worldBankData[i]);
            hoverData = worldBankData[i];
            //console.log(hoverData);
            tooltip
              .style("opacity", 0.8)
              .html(
                "Name: " +
                  hoverData["Country Name"] +
                  "<br />" +
                  toolTipValue +
                  " " +
                  hoverData[downDownValue]
              )
              .style("left", d3.event.pageX + 20 + "px")
              .style("top", d3.event.pageY + 20 + "px");
          }
        }
      }
    })
    .on("mouseout", function(d) {
      d3.select(this).classed("selected", false);
      d3.select(this);
      tooltip.style("opacity", 0);
    });
}

function renderPieChart(dataForCharts) {
  document.getElementById("piechart").innerHTML = "";

  let text = "";
  let width = 250;
  let height = 250;
  let thickness = 40;
  let duration = 750;
  let padding = 10;
  let opacity = 0.8;
  let opacityHover = 1;
  let otherOpacityOnHover = 0.8;
  let tooltipMargin = 13;
  let radius = Math.min(width - padding, height - padding) / 2;
  let color = d3.scaleOrdinal(d3.schemeCategory10);
  let svg = d3
    .select("#piechart")
    .append("svg")
    .attr("class", "pie")
    .attr("width", width)
    .attr("height", height);
  let g = svg
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
  let arc = d3
    .arc()
    .innerRadius(0)
    .outerRadius(radius);
  let pie = d3
    .pie()
    .value(function(d) {
      return d.value;
    })
    .sort(null);

  let path = g
    .selectAll("path")
    .data(pie(dataForCharts))
    .enter()
    .append("g")
    .append("path")
    .attr("d", arc)
    .attr("fill", (d, i) => color(i))
    .style("opacity", opacity)
    .style("stroke", "white")
    .on("mouseover", function(d) {
      d3.selectAll("path").style("opacity", otherOpacityOnHover);
      d3.select(this).style("opacity", opacityHover);
      let g = d3
        .select("#piechart svg")
        .style("cursor", "pointer")
        .append("g")
        .attr("class", "tooltip")
        .style("opacity", 0);
      g.append("text")
        .attr("class", "name-text")
        .text(`${d.data.name} (${numberWithCommas(d.data.value)} kt)`)
        .attr("text-anchor", "middle");
      let text = g.select("text");
      let bbox = text.node().getBBox();
      let padding = 2;
      g.insert("rect", "text")
        .attr("x", bbox.x - padding)
        .attr("y", bbox.y - padding)
        .attr("width", bbox.width + padding * 2)
        .attr("height", bbox.height + padding * 2)
        .style("fill", "white")
        .style("opacity", 0.75);
    })

    .on("mousemove", function(d) {
      let mousePosition = d3.mouse(this);
      let x = mousePosition[0] + width / 2;
      let y = mousePosition[1] + height / 2 - tooltipMargin;

      let text = d3.select("#piechart .tooltip text");
      let bbox = text.node().getBBox();
      if (x - bbox.width / 2 < 0) {
        x = bbox.width / 2;
      } else if (width - x - bbox.width / 2 < 0) {
        x = width - bbox.width / 2;
      }
      if (y - bbox.height / 2 < 0) {
        y = bbox.height + tooltipMargin * 2;
      } else if (height - y - bbox.height / 2 < 0) {
        y = height - bbox.height / 2;
      }
      d3.select("#piechart .tooltip")
        .style("opacity", 1)
        .attr("transform", `translate(${x}, ${y})`);
    })

    .on("mouseout", function(d) {
      d3.select("#piechart svg")
        .style("cursor", "none")
        .select(".tooltip")
        .remove();
      d3.selectAll("path").style("opacity", opacity);
    })
    .on("touchstart", function(d) {
      d3.select(".tooltip svg").style("cursor", "none");
    })
    .each(function(d, i) {
      this._current = i;
    });
  let legend = d3
    .select("#piechart")
    .append("div")
    .attr("class", "legend")
    .style("margin-left", "20px")
    .style("margin-top", "40px");
  let keys = legend
    .selectAll(".key")
    .data(dataForCharts)
    .enter()
    .append("div")
    .attr("class", "key")
    .style("display", "flex")
    .style("align-items", "center")
    .style("margin-right", "20px");
  keys
    .append("div")
    .attr("class", "symbol")
    .style("height", "10px")
    .style("width", "10px")
    .style("margin", "5px 5px")
    .style("background-color", (d, i) => color(i));
  keys
    .append("div")
    .attr("class", "name")
    .text(d => `${d.name} (${numberWithCommas(d.value)} kilo tons)`);
  keys.exit().remove();
}

function renderBarChart(data) {
  document.getElementById("barchart").innerHTML = "";

  let margin = { top: 20, right: 20, bottom: 30, left: 70 };
  let width = 700 - margin.left - margin.right;
  let height = 260 - margin.top - margin.bottom;
  let color = d3.scaleOrdinal(d3.schemeCategory10);

  let xScale = d3
    .scaleBand()
    .range([0, width])
    .round(true)
    .paddingInner(0.1); // space between bars (it's a ratio)

  let maxVal = data[0].value + 500000;

  let yScale = d3
    .scaleLinear()
    .domain([0, maxVal])
    .range([height, 0]);

  let xAxis = d3.axisBottom().scale(xScale);

  let yAxis = d3
    .axisLeft()
    .scale(yScale)
    .ticks(10);

  let svg = d3
    .select("#barchart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.right})`);
  let tooltipBar = d3
    .select("#barchart")
    .append("div")
    .attr("class", "tooltip-bar")
    .style("opacity", 0);

  xScale.domain(data.map(d => d.name));
  //   yScale.domain([0, d3.max(data, d => d.value)]);

  svg
    .append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);
  svg
    .append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text(toolTipValue);
  svg
    .selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", d => xScale(d.name))
    .attr("width", xScale.bandwidth())
    .attr("y", d => yScale(d.value))
    .attr("height", d => height - yScale(d.value))
    .attr("fill", (d, i) => color(i))
    .on("mouseover", d => {
      tooltipBar
        .transition()
        .duration(0)
        .style("opacity", 0.9);
      tooltipBar
        .html(`${toolTipValue} <span>${numberWithCommas(d.value)}</span>`)
        .style("pointer-events", `none`)
        .style("left", `${d3.event.layerX}px`)
        .style("top", `${d3.event.layerY - 28}px`);
    })
    .on("mouseout", () =>
      tooltipBar
        .transition()
        .duration(0)
        .style("opacity", 0)
    );
}

// function renderLineChart(data) {
//   document.getElementById("linechart").innerHTML = "";

//   let margin = { top: 20, right: 20, bottom: 30, left: 70 };
//   let width = 700 - margin.left - margin.right;
//   let height = 260 - margin.top - margin.bottom;
//   let color = d3.scaleOrdinal(d3.schemeCategory10);

//   let xScale = d3
//     .scaleBand()
//     .range([0, width])
//     .round(true)
//     .paddingInner(0.1); // space between bars (it's a ratio)

//   let maxVal = data[0].value + 500000;

//   let yScale = d3
//     .scaleLinear()
//     .domain([0, maxVal])
//     .range([height, 0]);

//   let xAxis = d3.axisBottom().scale(xScale);

//   let yAxis = d3
//     .axisLeft()
//     .scale(yScale)
//     .ticks(10);

//   let svg = d3
//     .select("#barchart")
//     .append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//     .attr("transform", `translate(${margin.left}, ${margin.right})`);
//   let tooltipBar = d3
//     .select("#barchart")
//     .append("div")
//     .attr("class", "tooltip-bar")
//     .style("opacity", 0);

//   xScale.domain(data.map(d => d.name));
//   //   yScale.domain([0, d3.max(data, d => d.value)]);

//   svg
//     .append("g")
//     .attr("class", "x axis")
//     .attr("transform", `translate(0, ${height})`)
//     .call(xAxis);
//   svg
//     .append("g")
//     .attr("class", "y axis")
//     .call(yAxis)
//     .append("text")
//     .attr("transform", "rotate(-90)")
//     .attr("y", 6)
//     .attr("dy", ".71em")
//     .style("text-anchor", "end")
//     .text(toolTipValue);
//   svg
//     .selectAll(".bar")
//     .data(data)
//     .enter()
//     .append("rect")
//     .attr("class", "bar")
//     .attr("x", d => xScale(d.name))
//     .attr("width", xScale.bandwidth())
//     .attr("y", d => yScale(d.value))
//     .attr("height", d => height - yScale(d.value))
//     .attr("fill", (d, i) => color(i))
//     .on("mouseover", d => {
//       tooltipBar
//         .transition()
//         .duration(0)
//         .style("opacity", 0.9);
//       tooltipBar
//         .html(`${toolTipValue} <span>${numberWithCommas(d.value)}</span>`)
//         .style("pointer-events", `none`)
//         .style("left", `${d3.event.layerX}px`)
//         .style("top", `${d3.event.layerY - 28}px`);
//     })
//     .on("mouseout", () =>
//       tooltipBar
//         .transition()
//         .duration(0)
//         .style("opacity", 0)
//     );
// }

/* Line chart  */

var dataColumn, realData, realData2;

function countryInput1Changed(e) {
  country1 = e.value;
  console.log(e.value);
  updateLineChart();
}

function countryInput2Changed(e) {
  country2 = e.value;
  console.log(e.value);
  updateLineChart();
}

// d3.queue().defer(
//   d3.csv,
//   "https://raw.githubusercontent.com/ZeningQu/World-Bank-Data-by-Indicators/master/climate-change/climate-change.csv"
// )
// .await(readyline);

var slider = document.getElementById("lineChartSlider");

noUiSlider.create(slider, {
  start: [1960, 1990],
  connect: true,
  step: 5,
  // padding: 10,
  tooltips: [wNumb({ decimals: 0 }), wNumb({ decimals: 0 })],
  pips: {
    mode: "range",
    stepped: true,
    values: [
      1960,
      1965,
      1970,
      1975,
      1980,
      1985,
      1990,
      1995,
      2000,
      2005,
      2010,
      2015
    ],

    density: 20
  },
  range: {
    min: 1960,
    max: 2015
  }
});

function doSomething(values, handle, unencoded, tap, positions) {
  // values: Current slider values (array);
  // handle: Handle that caused the event (number);
  // unencoded: Slider values without formatting (array);
  // tap: Event was caused by the user tapping the slider (boolean);
  // positions: Left offset of the handles (array);

  minYearLineChart = parseInt(values[0]);
  maxYearLineChart = parseInt(values[1]);

  console.log(minYearLineChart, maxYearLineChart);

  console.log(values, handle, unencoded, tap, positions);
  renderLineChart(country1, country2, minYearLineChart, maxYearLineChart);
}

slider.noUiSlider.on("change", doSomething);


function updateLineChart() {
  console.log(country1, country2);
  if (country1 && country2)
    renderLineChart(country1, country2, minYearLineChart, maxYearLineChart);
}

function renderLineChart(
  country1,
  country2,
  minYearLineChart,
  maxYearLineChart
) {
  document.getElementById("linechart").innerHTML =
    "<svg width='1300' height='500'></svg>";

  console.log(lineChartWorldBankData);
  console.log("readline function");

  if (!country1 || !country2) {
    country1 = "China";
    country2 = "United Kingdom";
  }

  var data = [];

  data = loadLineChartData();

  var trendsText = {
    date: "date",
    country1Population: country1,
    country2Population: country2
  };

  // set the dimensions and margins of the graph
  var margin = { top: 20, right: 80, bottom: 30, left: 50 },
    svg = d3.select("#linechart svg"),
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;
  var g = svg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // set the ranges
  var x = d3
      .scaleBand()
      .rangeRound([0, width])
      .padding(1),
    y = d3.scaleLinear().rangeRound([height, 0]),
    z = d3.scaleOrdinal(["#036888", "#0D833C", "#D2392A"]);

  // define the line
  var line = d3
    .line()
    .x(function(d) {
      return x(d.timescale);
    })
    .y(function(d) {
      return y(d.total);
    });

  // scale the range of the data
  z.domain(
    d3.keys(data[0]).filter(function(key) {
      return key !== "timescale";
    })
  );

  var trends = z.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return {
          timescale: d.timescale,
          total: +d[name]
        };
      })
    };
  });

  x.domain(
    data.map(function(d) {
      return d.timescale;
    })
  );
  y.domain([
    d3.min(trends, function(c) {
      return d3.min(c.values, function(v) {
        return v.total;
      });
    }),
    d3.max(trends, function(c) {
      return d3.max(c.values, function(v) {
        return v.total;
      });
    })
  ]);

  // Draw the legend
  var legend = g
    .selectAll("g")
    .data(trends)
    .enter()
    .append("g")
    .attr("class", "legend");

  legend
    .append("rect")
    .attr("x", width - 20)
    .attr("y", function(d, i) {
      return height / 2 - (i + 1) * 20;
    })
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", function(d) {
      return z(d.name);
    });

  legend
    .append("text")
    .attr("x", width - 8)
    .attr("y", function(d, i) {
      return height / 2 - (i + 1) * 20 + 10;
    })
    .text(function(d) {
      return trendsText[d.name];
    });

  // Draw the line
  var trend = g
    .selectAll(".trend")
    .data(trends)
    .enter()
    .append("g")
    .attr("class", "trend");

  trend
    .append("path")
    .attr("class", "line")
    .attr("d", function(d) {
      return line(d.values);
    })
    .style("stroke", function(d) {
      return z(d.name);
    });

  // Draw the empty value for every point
  var points = g
    .selectAll(".points")
    .data(trends)
    .enter()
    .append("g")
    .attr("class", "points")
    .append("text");

  // Draw the circles
  trend
    .style("fill", "#FFF")
    .style("stroke", function(d) {
      return z(d.name);
    })
    .selectAll("circle.line")
    .data(function(d) {
      return d.values;
    })
    .enter()
    .append("circle")
    .attr("r", 5)
    .style("stroke-width", 3)
    .attr("cx", function(d) {
      return x(d.timescale);
    })
    .attr("cy", function(d) {
      return y(d.total);
    });

  // Draw the axis
  g.append("g")
    .attr("class", "axis axis-x")
    .attr("transform", "translate(0, " + height + ")")
    .call(d3.axisBottom(x));

  g.append("g")
    .attr("class", "axis axis-y")
    .call(d3.axisLeft(y).ticks(10));

  var focus = g
    .append("g")
    .attr("class", "focus")
    .style("display", "none");

  focus
    .append("line")
    .attr("class", "x-hover-line hover-line")
    .attr("y1", 0)
    .attr("y2", height);

  svg
    .append("rect")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("class", "overlay")
    .attr("width", width)
    .attr("height", height)
    .on("mouseover", mouseover)
    .on("mouseout", mouseout)
    .on("mousemove", mousemove);

  var timeScales = data.map(function(name) {
    return x(name.timescale);
  });

  function mouseover() {
    focus.style("display", null);
    d3.selectAll(".points text").style("display", null);
  }
  function mouseout() {
    focus.style("display", "none");
    d3.selectAll(".points text").style("display", "none");
  }
  function mousemove() {
    var i = d3.bisect(timeScales, d3.mouse(this)[0], 1);
    var di = data[i - 1];
    focus.attr("transform", "translate(" + x(di.timescale) + ",0)");
    d3.selectAll(".points text")
      .attr("x", function(d) {
        return x(di.timescale) + 15;
      })
      .attr("y", function(d) {
        return y(d.values[i - 1].total);
      })
      .text(function(d) {
        return d.values[i - 1].total;
      })
      .style("fill", function(d) {
        return z(d.name);
      });
  }

}

function loadLineChartData() {

  realData = { values: [], CountryName: country1 };
  realData2 = { values: [], CountryName: country2 };

  console.log(lineChartWorldBankData);

  let criteria = 'Population growth (annual %)';

  for (let i = 0; i < lineChartWorldBankData.length; i++) {
    if (
      lineChartWorldBankData[i]["Year"] > minYearLineChart &&
      lineChartWorldBankData[i]["Year"] < maxYearLineChart
    ) {
      if (lineChartWorldBankData[i]["Country Name"] == country1) {
        realData.values.push({
          date: lineChartWorldBankData[i]["Year"],
          urbanPopulation:
            lineChartWorldBankData[i][criteria]
        });
      }

      if (lineChartWorldBankData[i]["Country Name"] == country2) {
        realData2.values.push({
          date: lineChartWorldBankData[i]["Year"],
          urbanPopulation:
            lineChartWorldBankData[i][criteria]
        });
      }
    }
  }

  var _lineData = [];

  console.log([realData, realData2]);

  realData["values"].forEach(val => {
    realData2["values"].forEach(val2 => {
      if (val.date === val2.date) {
        _lineData.push({
          timescale: val.date,
          country1Population: val.urbanPopulation,
          country2Population: val2.urbanPopulation
        });
      }
    });
  });
  console.log(_lineData);

  sorted = _lineData
    .sort((a, b) =>
      d3.ascending(parseInt(a['timescale']), parseInt(b['timescale']))
    );

  console.log(sorted);

  return _lineData;

  // realData.forEach(
  //   val => {

  // } );

  // dataColumn = [realData, realData2];
  // console.log(dataColumn);
}

