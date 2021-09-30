import { useEffect, useMemo } from 'react';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import PropTypes from 'prop-types';

// import am4themes_animated from "@amcharts/amcharts4/themes/animated";


// am4core.useTheme(am4themes_animated);

const chartx = (chartId) => {
	const chart = am4core.create(chartId, am4charts.XYChart)

	// Create axes
	const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
	categoryAxis.dataFields.category = "symbol";
	categoryAxis.tooltipText = "{desc}"
	categoryAxis.renderer.minGridDistance = 30;


	const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
	
	var range2 = valueAxis.axisRanges.create();
	range2.value = 5;
	range2.grid.stroke = am4core.color("green");
	range2.grid.strokeWidth = 2;
	range2.grid.strokeOpacity = 0.2;
	range2.label.inside = true;
	range2.label.text = "Ekspektasi";
	range2.label.fill = range2.grid.stroke;
	range2.label.align = "center";


	const GapSeries = chart.series.push(new am4charts.LineSeries());
	GapSeries.dataFields.categoryX = "symbol";
	GapSeries.dataFields.valueY = "score";
	GapSeries.name = "Realita"
	GapSeries.strokeWidth = 2;

	const interfaceColors = new am4core.InterfaceColorSet();
	const bullet = GapSeries.bullets.push(new am4charts.CircleBullet());
	bullet.circle.stroke = interfaceColors.getFor("background");
	bullet.fill = GapSeries.stroke
	bullet.tooltipText = '{bulletTooltip}'

	bullet.adapter.add("fill", function (fill, target) {
		return target.dataItem.valueY === 0 ?  am4core.color('gray') : target.dataItem.valueY >= 5  ? am4core.color('green') : am4core.color('red');
	})

	chart.legend = new am4charts.Legend();
	chart.cursor = new am4charts.XYCursor();

	return chart
};

const CritertiaGraph = ({ chartId, onInitialize }) => {

	const initializeChart = useMemo(() => {
		return () => chartx(chartId)
	}, [chartId])

	useEffect(() => {
		const ch = initializeChart()
		onInitialize(ch)
		return () => ch.dispose()
	}, [initializeChart, onInitialize])


	return (
		<div id={chartId} style={{ width: "100%", height: "435px", fontFamily:'monospace'}}></div>
	)
}

CritertiaGraph.propTypes = {
	chartId: PropTypes.string.isRequired,
	onInitialize: PropTypes.func.isRequired,
}

export default CritertiaGraph