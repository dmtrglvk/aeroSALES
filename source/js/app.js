var $ = require('jquery'),
	d3 = require("d3");

$(function(){
	forgotPassword();

	// var width = 960,
	// 	height = 500;
	//
	// var y = d3.scaleLinear()
	// 	.range([height, 0]);
	//
	// var chart = d3.select(".chart")
	// 	.attr("width", width)
	// 	.attr("height", height);
	//
	// d3.tsv("js/data/data.tsv", type, function(error, data) {
	// 	y.domain([0, d3.max(data, function(d) { return d.value; })]);
	//
	// 	var barWidth = width / data.length;
	//
	// 	var bar = chart.selectAll("g")
	// 		.data(data)
	// 		.enter().append("g")
	// 		.attr("transform", function(d, i) { return "translate(" + i * barWidth + ",0)"; });
	//
	// 	bar.append("rect")
	// 		.attr("y", function(d) { return y(d.value); })
	// 		.attr("height", function(d) { return height - y(d.value); })
	// 		.attr("width", barWidth - 1);
	//
	// 	bar.append("text")
	// 		.attr("x", barWidth / 2)
	// 		.attr("y", function(d) { return y(d.value) + 3; })
	// 		.attr("dy", ".75em")
	// 		.text(function(d) { return d.value; });
	// });
	//
	// function type(d) {
	// 	d.value = +d.value; // coerce to number
	// 	return d;
	// }

});


function forgotPassword() {
	var forgotLink = $('.js-forgot-password'),
		loginContent = $('.js-login-content'),
		forgotContent = $('.js-forgot-content'),
		backBtn = $('.js-btn-back');

	forgotLink.on('click', function(e){
		e.preventDefault();
		loginContent.fadeOut(300, function(){
			forgotContent.fadeIn(300);
		})
	});
	backBtn.on('click', function(e){
		e.preventDefault();
		forgotContent.fadeOut(300, function(){
			loginContent.fadeIn(300);
		})
	})
}