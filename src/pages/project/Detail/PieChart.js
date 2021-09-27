import React, { useEffect, useMemo, memo } from 'react';
import PropTypes from 'prop-types';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";

import am4themes_animated from "@amcharts/amcharts4/themes/animated";


am4core.useTheme(am4themes_animated);

const chartx = (chartId) => {
	const chart = am4core.create(chartId, am4charts.PieChart)
	chart.radius = am4core.percent(40);
	chart.legend = new am4charts.Legend();

	const title = chart.titles.create();
	title.text = chartId;
	title.fontSize = 25;
	// title.marginBottom = 30;

	var pieSeries = chart.series.push(new am4charts.PieSeries());
	pieSeries.dataFields.value = "value";
	pieSeries.dataFields.category = "category";
	pieSeries.slices.template.stroke = am4core.color("#fff");
	pieSeries.slices.template.strokeWidth = 2;
	pieSeries.slices.template.strokeOpacity = 1;
	
	// This creates initial animation
	pieSeries.hiddenState.properties.opacity = 1;
	pieSeries.hiddenState.properties.endAngle = -90;
	pieSeries.hiddenState.properties.startAngle = -90;

	return chart
};

const PieChart = props => {

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
		<div id={chartId} style={{ height: "400px", marginTop: "4em", fontFamily:'monospace' }}></div>
	)
}

PieChart.propTypes = {
    chartId: PropTypes.string.isRequired,
    onInitialize: PropTypes.func.isRequired,
}

export default memo(PieChart)