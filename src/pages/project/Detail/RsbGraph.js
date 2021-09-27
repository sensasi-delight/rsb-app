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


	// Create axes
	let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
	// dateAxis.tooltipText = "Survei: {date}"
	dateAxis.tooltipDateFormat = "yyyy-MM-dd";
	dateAxis.renderer.grid.template.location = 0.5;
	dateAxis.renderer.labels.template.location = 0.5;
	// dateAxis.renderer.grid.template.disabled = true;
	// dateAxis.renderer.minGridDistance = 60;

	// Create series
	let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());


	function createAxisAndSeries(field) {
		let series = chart.series.push(new am4charts.LineSeries());
		series.dataFields.valueY = field;
		series.dataFields.dateX = "date";
		series.name = (field === 'expectationTotal' ? 'Ekspektasi' : 'Realita')
		series.tooltipText = "{valueY}";
		series.strokeWidth = 2;
		series.stroke = am4core.color(field === 'expectationTotal' ? '#9e9e9e' : '#3F51B5');
		series.fill = am4core.color(field === 'expectationTotal' ? '#9e9e9e' : '#3F51B5');

		let interfaceColors = new am4core.InterfaceColorSet();
		let bullet = series.bullets.push(new am4charts.CircleBullet());
		bullet.circle.stroke = interfaceColors.getFor("background");
		bullet.circle.strokeWidth = 2;
		// bullet.tooltip.tooltipX.
		// bullet.tooltipText = "Value: [bold]{value}[/]";

		valueAxis.renderer.line.strokeOpacity = 1;
	}

	createAxisAndSeries('expectationTotal')
	createAxisAndSeries('realityTotal')



	return chart
};

const RsbGraph = props => {

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

RsbGraph.propTypes = {
	chartId: PropTypes.string.isRequired,
	onInitialize: PropTypes.func.isRequired,
}

export default memo(RsbGraph)