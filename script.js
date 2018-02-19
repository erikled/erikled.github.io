d3.csv('data.csv', function (data) {
  // Variables
  var body = d3.select('body')
	var margin = { top: 50, right: 50, bottom: 50, left: 50 }
	var h = 500 - margin.top - margin.bottom
	var w = 900 - margin.left - margin.right
	var formatPercent = d3.format('.2%')
	// Scales
  var colorScale = d3.scale.category10()
    .domain([
      d3.min([0,d3.min(data,function (d) { return d.kontinent })]),
      d3.max([0,d3.max(data,function (d) { return d.kontinent })])
      ])
  var strokecolor = d3.scale.category10()
    .domain([
      d3.min([0,d3.min(data,function (d) { return d.krig })]),
      d3.max([0,d3.max(data,function (d) { return d.krig })])
      ])
  var r = d3.scale.linear()
    .domain([
    	d3.min([0,d3.min(data,function (d) { return d.befolkning })]),
    	d3.max([0,d3.max(data,function (d) { return d.befolkning })])
    	])
    .range([0,5])
  var xScale = d3.scale.linear()
    .domain([
    	d3.min([0,d3.min(data,function (d) { return d.gdpca })]),
    	50000
    	])
    .range([0,w])
  var yScale = d3.scale.linear()
    .domain([
    	d3.min([0,d3.min(data,function (d) { return d.happinessindex })]),
    	1
    	])
    .range([h,0])
	// SVG
	var svg = body.append('svg')
	    .attr('height',h + margin.top + margin.bottom)
	    .attr('width',w + margin.left + margin.right)
	  .append('g')
	    .attr('transform','translate(' + margin.left + ',' + margin.top + ')')
	// X-axis
	var xAxis = d3.svg.axis()
	  .scale(xScale)
	  .ticks(10)
	  .orient('bottom')
  // Y-axis
	var yAxis = d3.svg.axis()
	  .scale(yScale)
	  .tickFormat(formatPercent)
	  .ticks(10)
	  .orient('left')
  // Circles
  var circles = svg.selectAll('circle')
      .data(data)
      .enter()
    .append('circle')
      .attr('cx',function (d) { return xScale(d.gdpca) })
      .attr('cy',function (d,i) { return yScale(d.happinessindex) })
      .attr('r',function (d,i) { return (5+d.befolkning/10000000)})
      .attr('stroke', 'red')
      .attr('stroke-width', function (d) {return (d.militaryspending)})
      .attr('fill',function (d,i) { return colorScale(d.kontinent) })
      .on('mouseover', function () {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r',function (d,i) { return (5+d.befolkning/10000000)*1.2})
          .attr('stroke-width',function (d) {return (d.militaryspending)})
      })
      .on('mouseout', function () {
        d3.select(this)
          .transition()
          .duration(100)
          .attr('r',function (d,i) { return (5+d.befolkning/10000000)})
          .attr('stroke-width',function (d) {return (d.militaryspending)})
      })
    .append('title') // Tooltip
      .text(function (d) { return d.land +
                           '\nProportion of people who are happy: ' + formatPercent(d.happinessindex)+
                           '\nGDP/capita ' + d.gdpca+
                           '\nPopultation ' + d.befolkning+
                           '\nMilitary spending as proportion of GDP ' + d.militaryspending + '%'+
                           '\nLifespan ' + d.lifespan+
                           '\nProportion of people who believe that most people can be trusted ' + d.trust})
//"land", "happiness","gdpca","kontinent","befolkning","militaryspending","lifespan","trust"
  // X-axis
  svg.append('g')
      .attr('class','axis')
      .attr('transform', 'translate(0,' + h + ')')
      .call(xAxis)
    .append('text') // X-axis Label
      .attr('class','label')
      .attr('y',-10)
      .attr('x',w)
      .attr('dy','.71em')
      .style('text-anchor','end')
      .text('GDP per capita')


  // Y-axis
  svg.append('g')
      .attr('class', 'axis')
      .call(yAxis)
    .append('text') // y-axis Label
      .attr('class','label')
      .attr('transform','rotate(-90)')
      .attr('x',4)
      .attr('y',0)
      .attr('dy','.71em')
      .style('text-anchor','end')
      .text('Happiness Index')


    svg.append('g')
      .append('text') // X-axis Label
        .attr('class','label')
        .attr('y',422)
        .attr('x',800)
        .attr('dy','.71em')
        .style('text-anchor','end')
        .text('Colour of balls represent continents where green is Africa, red is Asia, purple is Europe, orange is South America, ')

    svg.append('g')
      .append('text') // X-axis Label
        .attr('class','label')
        .attr('y',437)
        .attr('x',710)
        .attr('dy','.71em')
        .style('text-anchor','end')
        .text('brown is North America, and pink is Oceania. Thickness of red outline represents military spending.')
})
var running = false;
  var timer;

  $("button").on("click", function() {

    var duration = 3000,
      maxstep = 2011,
      minstep = 2000;

    if (running == true) {

      $("button").html("Play");
      running = false;
      clearInterval(timer);

    }
    /*
else if (running == true && $("#slider").val() == maxstep) {
       running = true;
       $("button").html("Play1");


    }
*/
    else if (running == false) {

      $("button").html("Pause");

      sliderValue = $("#slider").val();

      timer = setInterval( function(){
          if (sliderValue < maxstep){
            sliderValue++;
            $("#slider").val(sliderValue);
            $('#range').html(sliderValue);
          }
          $("#slider").val(sliderValue);
          update();

      }, duration);
      running = true;


    }

  });

  $("#slider").on("change", function(){
    update();
    $("#range").html($("#slider").val());
    clearInterval(timer);
    $("button").html("Play");
  });

  update = function() {

    d3.selectAll(".dot")
      .transition()
      .duration(1000)
      .attr("cy", function(d) {

        switch ($("#slider").val()) {
          case "2000":
            return y(d.happinessindex2000);
            break;
          case "2001":
            return y(d.happinessindex2001);
            break;

        }
      })
      .transition()
      .duration(1000)
      .attr("cx", function(d) {
        switch ($("#slider").val()) {
          case "2000":
            return x(d.gdpca2000);
            break;
          case "2001":
            return x(d.gdpca2001);
            break;

        }
      });
  };
