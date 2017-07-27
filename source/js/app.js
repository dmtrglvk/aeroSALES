var $ = require('jquery'),
	d3 = require("d3"),
	selectpicker = require('bootstrap-select');

$(function(){
	forgotPassword();
	menuPanel();
	$('select').selectpicker();
	groupBarChart();
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

function menuPanel() {
	var $parent = $('.js-menu-panel-parent'),
		$opener = $('.js-menu-opener', $parent),
		$pageOverlay = $('.page-overlay');

	$opener.on('click', function(e){
		e.preventDefault();
		if(!$parent.hasClass('opened')) {
			$parent.addClass('opened');
			$(this).parent().addClass('selected');
			$(this).find('svg use').attr('xlink:href', '#back');
			$('body').addClass('menu-open');
		} else {
			$parent.removeClass('opened');
			$(this).parent().removeClass('selected');
			$(this).find('svg use').attr('xlink:href', '#menu');
			$('body').removeClass('menu-open');
		}
	});
	$pageOverlay.on('click', function(){
		$parent.removeClass('opened');
		$opener.parent().removeClass('selected');
		$opener.find('svg use').attr('xlink:href', '#menu');
		$('body').removeClass('menu-open');
	})
}

function groupBarChart() {
	var svg = d3.select("svg.bar-chart"),
		margin = {
			top: 20,
			right: 20,
			bottom: 30,
			left: 8
		},
		width = +svg.attr("width") - margin.left - margin.right,
		height = +svg.attr("height") - margin.top - margin.bottom,
		g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var x0 = d3.scaleBand()
		.rangeRound([0, width])
		.paddingInner(0.2)
		.paddingOuter(0.2);

	var x1 = d3.scaleBand()
		.padding(0);

	var y = d3.scaleLinear()
		.rangeRound([height, 0]);

	var barColors = ['#c2e2d6', '#a9d6c4', '#a196c0', '#7c6da7'];

	d3.csv("/js/data/data.csv", function(d, i, columns) {
		for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = +d[columns[i]];
		return d;
	}, function(error, data) {
		if (error) throw error;

		var keys = data.columns.slice(1);

		x0.domain(data.map(function(d) { return d.Group; }));
		x1.domain(keys).rangeRound([0, x0.bandwidth()]);
		y.domain([0, d3.max(data, function(d) {
			return d3.max(keys, function(key) { return d[key]; });
		})]).nice();

		g.attr('class', 'sector')
			.append("g")
			.selectAll("g")
			.data(data)
			.enter().append("g")
			.attr("transform", function(d) {
				return "translate(" + x0(d.Group) + ",0)";
			})
			.selectAll("rect")
			.data(function(d) {
				return keys.map(function(key) {
					return {
						key: key,
						value: d[key]
					};
				});
			})
			.enter()
			.append("rect")
			.attr("x", function(d) {

				var color = barColors.shift();
				$(this).attr('fill', color);

				return x1(d.key);
			})
			.attr("y", function(d) { return y(d.value); })
			.attr("width", x1.bandwidth())
			.attr("height", function(d) {
				return height - y(d.value);
			})
			.attr('class', 'bar');

		g
			.append("g")
			.selectAll("g")
			.data(data)
			.enter().append("g")
			.attr("transform", function(d) {
				return "translate(" + x0(d.Group) + ",0)";
			})
			.selectAll("text")
			.data(function(d) {
				return keys.map(function(key) {
					return {
						key: key,
						value: d[key]
					};
				});
			})
			.enter()
			.append('text')
			.attr('class', 'label')
			.attr("x", function(d) {
				return x1(d.key) + x1.bandwidth()/2;
			})
			.attr("y", function(d) {
				return y(d.value) - 5;
			})
			.text(function(d){
				return d.value;
			})
			.attr("text-anchor", "middle")

		g.append("g")
			.attr("class", "axis")
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(x0));

		g.append("g")
			.attr("class", "axis")
			.call(d3.axisLeft(y))

	});
}