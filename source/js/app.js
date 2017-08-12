global.jQuery = require('jquery');
require('bootstrap');

var d3 = require("d3/build/d3.min.js"),
	c3 = require("c3/c3.min.js"),
	selectpicker = require('bootstrap-select/dist/js/bootstrap-select.min.js');

jQuery(function(){
	forgotPassword();
	menuPanel();
	if(jQuery('.d3chart').length) {
		callCharts();
	}
	tableColor(".js-color-table td[data-attr != 'add-cell']");
	tableColor(".js-color-table td[data-total = 'total-cell']");
	tableValueColor();
	multiTable();
	chartStyle();
	jQuery('select').selectpicker();

});

function callCharts() {
	groupBarChart('.js-growth-chart', './js/data/data-growth.csv', ['#c2e2d6', '#a9d6c4', '#a196c0', '#7c6da7']);
	groupBarChart('.js-passenger-chart', './js/data/data-passenger.csv', ['#cccbcc', '#7a8690', '#48b192', '#7d6ba4']);
	groupBarChart('.js-capacity-chart', './js/data/data-capacity.csv', ['#bbe1d6', '#7a8690', '#93d0bd', '#79c4ad']);
	groupBarChart('.js-revenue-chart', './js/data/data-revenue.csv', ['#c4aa95', '#789d59', '#f9ec61', '#fac06e']);
	groupBarChart('.js-yeild-chart', './js/data/data-revenue.csv', ['#d9f3c5', '#94af80', '#3ab894', '#55c8a6']);

	var chart = c3.generate({
		bindto: '.line-chart',
		data: {
			xs: {
				KTM: "cat1",
				CMB: "cat2",
				BOM: "cat3",
				BLR: "cat4",
				SHJ: "cat5"
			},
			columns: [
				["cat1", "JAN", "FEB", "MAR", "APR"],
				["KTM", 30, 200, 100, 400, 200],
				["cat2", "JAN", "FEB", "MAR", "APR"],
				["CMB", 400, 60, 200, 800, 10],
				["cat3", "JAN", "FEB", "MAR", "APR"],
				["BOM", 300, 160, 300, 500, 100],
				["cat4", "JAN", "FEB", "MAR", "APR"],
				["BLR", 200, 260, 100, 200, 50],
				["cat5", "JAN", "FEB", "MAR", "APR"],
				["SHJ", 320, 600, 250, 300, 30]
			]
		},
		axis: {
			x: {
				padding: {
					left: -0.4,
					right: -0.3
				},
				type: "category"
			},
			y: {
				padding: {
					bottom: 10
				}
			}
		},
		legend: {
			show: false
		},
		point: {
			r: 4
		},
		onrendered: function () {
			var $$ = this;
			var circles = $$.getCircles();
			for(var i = 0; i < circles.length; i++){
				for(var j = 0; j < circles[i].length; j++){
					$$.getCircles(j).style("fill", '#FFF')
						.style("stroke", $$.color)
						.style("stroke-width", 2);
				}
			}
		}
	});

	chart.data.colors({
		KTM: '#488edd',
		CMB: '#493080',
		BOM: '#7ac4ae',
		BLR: '#f7a63d',
		SHJ: '#f10e0e'
	});

}

// var waitForFinalEvent = (function() {
// 	var timers = {};
// 	return function(callback, ms, uniqueId) {
// 		if (!uniqueId) {
// 			uniqueId = "Don't call this twice without a uniqueId";
// 		}
// 		if (timers[uniqueId]) {
// 			clearTimeout(timers[uniqueId]);
// 		}
// 		timers[uniqueId] = setTimeout(callback, ms);
// 	};
// })();
//
// jQuery(window).resize(function() {
// 	waitForFinalEvent(function() {
//
// 		jQuery('.d3chart svg').remove();
//
// 		callCharts();
//
// 	}, 2);
// });

function forgotPassword() {
	var forgotLink = jQuery('.js-forgot-password'),
		loginContent = jQuery('.js-login-content'),
		forgotContent = jQuery('.js-forgot-content'),
		backBtn = jQuery('.js-btn-back');

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
	var $parent = jQuery('.js-menu-panel-parent'),
		$opener = jQuery('.js-menu-opener', $parent),
		$pageOverlay = jQuery('.page-overlay');

	$opener.on('click', function(e){
		e.preventDefault();
		if(!$parent.hasClass('opened')) {
			$parent.addClass('opened');
			jQuery(this).parent().addClass('selected');
			jQuery(this).find('svg use').attr('xlink:href', '#back');
			jQuery('body').addClass('menu-open');
		} else {
			$parent.removeClass('opened');
			jQuery(this).parent().removeClass('selected');
			jQuery(this).find('svg use').attr('xlink:href', '#menu');
			jQuery('body').removeClass('menu-open');
		}
	});
	$pageOverlay.on('click', function(){
		$parent.removeClass('opened');
		$opener.parent().removeClass('selected');
		$opener.find('svg use').attr('xlink:href', '#menu');
		jQuery('body').removeClass('menu-open');
	})
}

function tableColor(cell){
	var cell = jQuery(cell),
		cellValues = [];

	cell.each(function () {
		var currentCell = jQuery(this).text();
		cellValues.push(+currentCell);
	});

	var max = cellValues[0];

	for (i = 1; i < cellValues.length; ++i) {
		if (cellValues[i] > max) max = cellValues[i];
	}

	cell.each(function (){
		var currentCell = jQuery(this).text();
		if(currentCell <= max/8){
			jQuery(this).addClass('rosy-pink')
		} else if(currentCell > max/8 && currentCell <= max/7){
			jQuery(this).addClass('rosy-pink-light')
		} else if(currentCell > max/7 && currentCell <= max/6){
			jQuery(this).addClass('orange')
		} else if(currentCell > max/6 && currentCell <= max/5){
			jQuery(this).addClass('orange-light')
		} else if(currentCell > max/5 && currentCell <= max/4){
			jQuery(this).addClass('yellow')
		} else if(currentCell > max/4 && currentCell <= max/3){
			jQuery(this).addClass('green-light')
		} else if(currentCell > max/3 && currentCell <= max/2){
			jQuery(this).addClass('green-medium')
		} else if(currentCell > max/2 && currentCell <= max){
			jQuery(this).addClass('green-dark')
		}
	})
}

function groupBarChart(element, data, colors) {
	var svg = d3.select(element).append('svg')
			.attr('width', jQuery(element).width())
			.attr('height', jQuery(element).height()),
		margin = {
			top: 20,
			right: 10,
			bottom: 20,
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

	var barColors = colors;

	d3.csv(data, function(d, i, columns) {
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
				jQuery(this).attr('fill', color);

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
			.attr("text-anchor", "middle");

		g.append("g")
			.attr("class", "axis")
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(x0));

		g.append("g")
			.attr("class", "axis")
			.call(d3.axisLeft(y))

	});
}

function multiTable(){
	var elem = jQuery('.outer td:first-child');

	elem.on('click', function(){
		var currentRow = jQuery(this).parent();
		if(currentRow.hasClass('open')){
			currentRow.nextUntil('.outer').hide();
			currentRow.removeClass('open');
		} else {
			currentRow.nextUntil('.outer').show();
			currentRow.addClass('open');
		}

	})
}

function tableValueColor() {
	var item = jQuery('.js-val-color-table td[data-row-ttl != "row-ttl"]');

	item.each(function(){
		var currentTempItem = jQuery(this).text(),
			currentItem = parseInt(currentTempItem);

		if(currentItem < 0){
			jQuery(this).addClass('pink-color');
		}
	})
}

function chartStyle(){
	var listItem = jQuery('.chart-style li');

	listItem.on('click', function(){
		listItem.removeClass('active');
		jQuery(this).addClass('active');
	})
}