global.jQuery = require('jquery');
require('bootstrap/dist/js/bootstrap.min');
require('pikaday');
require('pikaday/plugins/pikaday.jquery');

var d3 = require("d3/build/d3.min.js"),
	c3 = require("c3/c3.min.js"),
	selectpicker = require('bootstrap-select/dist/js/bootstrap-select.min.js');

jQuery(function(){
	forgotPassword();
	menuPanel();
	tableColor(".js-color-table td[data-attr != 'add-cell']");
	tableColor(".js-color-table td[data-total = 'total-cell']");
	tableValueColor();
	multiTable();
	jQuery('select').selectpicker();

	if(jQuery('.content-info').length) {

		var select = jQuery('.content-info select');

		select.on('show.bs.select', function(){
			jQuery('.page-fader').show();
		});
		select.on('hide.bs.select', function(){
			jQuery('.page-fader').hide();
		});
	}

	if(jQuery('.custom-date').length) {
		jQuery('.custom-date').on('change', function(){
			if(jQuery(this).is(':checked')) {
				jQuery(this).parents('.checkbox-wrap').next().removeClass('inactive').find('input').removeAttr('disabled');
			} else {
				jQuery(this).parents('.checkbox-wrap').next().addClass('inactive').find('input').prop('disabled', 'disabled');
			}
		})
	}

	popup();

	if(jQuery('.datepicker-row').length) {

		jQuery('.datepicker').pikaday()
	}

	if(jQuery('.d3chart').length) {
		callCharts();
	}

	if(jQuery('.evo-chart').length) {
		singleLineChart('.line-chart1', '#7dc5ad');
		singleLineChart('.line-chart2', '#4990e2');
	}

	if(jQuery('.upload-block').length) {
		jQuery('.browse-file').click(function(e){
			e.preventDefault();
			jQuery(this).parents('.upload-block').find('input[type="file"]').click();
		})
	}

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

		var menuIcon = false;

		if(jQuery(this).find('svg use').attr('xlink:href') == '#menu' || jQuery(this).find('svg use').attr('xlink:href') == '#back') {
			menuIcon = true;
		}

		e.preventDefault();
		if(!$parent.hasClass('opened')) {
			$parent.addClass('opened');
			jQuery(this).parent().addClass('selected');
			if(menuIcon) {
				jQuery(this).find('svg use').attr('xlink:href', '#back');
			}
			jQuery('body').addClass('menu-open');
		} else {
			$parent.removeClass('opened');
			jQuery(this).parent().removeClass('selected');
			if(menuIcon) {
				jQuery(this).find('svg use').attr('xlink:href', '#menu');
			}
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

function popup() {
	var opener = jQuery('.js-popup-opener'),
		closer = jQuery('.js-popup-closer'),
		popup = jQuery('.js-popup'),
		fader = jQuery('.page-fader');

	opener.on('click', function(e){
		e.preventDefault();

		var clickedEl = jQuery(this);

		var el = jQuery(jQuery(this).attr('href'));

		fader.fadeIn(300, function(){
			if(jQuery(window).width() < 700) {
				el.css('top', clickedEl.offset().top + 20)
			}
			el.fadeIn(300, function(){
				if(el.hasClass('chart-popup')) {
					callPopupChart();
				}
			});
		})

	});

	closer.on('click', function(e){
		e.preventDefault();

		popup.fadeOut(300, function(){
			fader.fadeOut(300);
		})

	});

}

function callPopupChart() {
	var chart = c3.generate({
		bindto: '.popup-chart-placeholder',
		data: {
			xs: {
				'2016': "cat1",
				'2017': "cat2"
			},
			columns: [
				["cat1", 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],
				["2016", 363,365,360,363,361,365,370,361,363,365,360,361,362,363,364,365,360,355,368,369,368,364,363,362,363,365,360,363,361,365],
				["cat2", 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],
				["2017", 333,335,330,333,331,335,330,331,333,335,330,331,332,333,334,335,330,335,338,339,338,334,333,332,333,335,330,333,300,310]
			],
			labels: true
		},
		axis: {
			x: {
				padding: {
					left: -0.2,
					right: 1.2
				},
				type: "category",
				height: 50
			},
			y: {
				padding: {
					bottom: 10
				}
			}
		},
		legend: {
			position: 'inset',
			inset: {
				anchor: 'bottom-left',
				x: -8,
				y: -20,
				step: 1
			}
		},
		point: {
			r: 0
		},
		tooltip: {
			show: false
		}
	});

	chart.data.colors({
		'2016': '#7dc5ad',
		'2017': '#ee0101'
	});

	chart.xgrids([{value: 1},{value: 2},{value: 3},{value: 4},{value: 5},{value: 6},{value: 7},{value: 8},{value: 9},{value: 10},{value: 11},{value: 12},{value: 13},{value: 14},{value: 15},{value: 16},{value: 17},{value: 18},{value: 19},{value: 20},{value: 21},{value: 22},{value: 23},{value: 24},{value: 25},{value: 26},{value: 27},{value: 28},{value: 29},{value: 30}]);
}

function singleLineChart(placeholder, color) {
	var chart = c3.generate({
		bindto: placeholder,
		data: {
			xs: {
				'Date of Departure': "cat1"
			},
			columns: [
				["cat1", -30,-29,-28,-27,-26,-25,-24,-23,-22,-21,-20,-19,-18,-17,-16,-15,-14,-13,-12,-11,-10,-9,-8,-7,-6,-5,-4,-3,-2,-1,0,1],
				["Date of Departure", 363,365,360,363,361,365,370,361,363,365,360,361,362,363,364,365,360,355,368,369,368,364,363,362,363,365,360,363,361,365,361,365]
			],
			labels: true
		},
		axis: {
			x: {
				padding: {
					left: -0.2,
					right: 1.2
				},
				type: "category",
				height: 50
			},
			y: {
				padding: {
					bottom: 10
				}
			}
		},
		legend: {
			position: 'bottom'
		},
		point: {
			r: 0
		},
		tooltip: {
			show: false
		}
	});

	chart.data.colors({
		'Date of Departure': color
	});

	chart.xgrids([{value: 1},{value: 2},{value: 3},{value: 4},{value: 5},{value: 6},{value: 7},{value: 8},{value: 9},{value: 10},{value: 11},{value: 12},{value: 13},{value: 14},{value: 15},{value: 16},{value: 17},{value: 18},{value: 19},{value: 20},{value: 21},{value: 22},{value: 23},{value: 24},{value: 25},{value: 26},{value: 27},{value: 28},{value: 29},{value: 30}]);
}