import React, { useEffect, useMemo, memo } from 'react';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import PropTypes from 'prop-types';

import am4themes_animated from "@amcharts/amcharts4/themes/animated";


am4core.useTheme(am4themes_animated);

const chartx = (chartId) => {
	const chart = am4core.create(chartId, am4charts.XYChart)
	chart.legend = new am4charts.Legend();
	chart.cursor = new am4charts.XYCursor();
	chart.topAxesContainer.paddingTop = 30;


	// Create axes
	const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
	dateAxis.renderer.grid.template.location = 0.5;
	dateAxis.tooltipDateFormat = "yyyy-MM-dd";
	dateAxis.title.text = 'Survei'



	/* Decorate axis tooltip content */
	dateAxis.adapter.add("getTooltipText", (text, target) => {
		if (new Date(text).getTime() === chart.data[0].date.getTime()) {
			text += '\n\nAwal Proyek'
		}

		return text;
	});




	// Create series
	const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
	valueAxis.max = 9
	valueAxis.min = 0
	valueAxis.title.text= 'Skor'


	const range2 = valueAxis.axisRanges.create();
	range2.value = 5;
	// range2.endValue = 10;
	range2.grid.stroke = am4core.color("green");
	range2.grid.strokeWidth = 2;
	range2.grid.strokeOpacity = 0.2;
	range2.label.inside = true;
	range2.label.text = "Ekspektasi";
	range2.label.fill = range2.grid.stroke;
	range2.label.align = "center";


	const series = chart.series.push(new am4charts.LineSeries());
	series.dataFields.valueY = "score";
	series.dataFields.dateX = "date";
	series.name = 'Realita'
	series.strokeWidth = 2;
	// series.tooltipXField = "bulletTooltip"

	const interfaceColors = new am4core.InterfaceColorSet();
	const bullet = series.bullets.push(new am4charts.CircleBullet());
	bullet.circle.stroke = interfaceColors.getFor("background");
	bullet.fill = series.stroke
	bullet.tooltipText = '{bulletTooltip}';

	bullet.adapter.add("fill", function (fill, target) {
		return target.dataItem.valueY >= 5 ? am4core.color('green') : am4core.color('red');
	})





	return chart
};

const RsbGraph2 = props => {

	const { chartId, onInitialize } = props;

	const initializeChart = useMemo(() => {
		return () => chartx(chartId)
	}, [chartId])

	useEffect(() => {
		const ch = initializeChart()
		onInitialize(ch)
		return () => ch.dispose()
	}, [initializeChart, onInitialize])


	return (
		<div id={chartId} style={{ width: "100%", height: "435px", fontFamily: 'monospace' }}></div>
	)
}

RsbGraph2.propTypes = {
	chartId: PropTypes.string.isRequired,
	onInitialize: PropTypes.func.isRequired,
}

export default memo(RsbGraph2)