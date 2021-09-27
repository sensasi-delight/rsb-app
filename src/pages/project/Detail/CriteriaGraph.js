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
	// categoryAxis.renderer.grid.template.location= 0
	// dateAxis.renderer.grid.template.location = 0;
	categoryAxis.renderer.minGridDistance = 30;
	// dateAxis.dateFormats.setKey("day", "dd");
	// dateAxis.periodChangeDateFormats.setKey("day", "[bold]MMM");
	// dateAxis.renderer.axisFills.template.fillOpacity = 1;


	const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
	// valueAxis.renderer.grid.template.location = 0;
	// valueAxis.renderer.inversed = true;
	// valueAxis.min = -0.5;
	// valueAxis.max = 0.5; 
	// valueAxis.value = 0
	
	var range2 = valueAxis.axisRanges.create();
	range2.value = 5;
	// range2.endValue = -0.3;
	range2.grid.stroke = am4core.color("green");
	range2.grid.strokeWidth = 2;
	range2.grid.strokeOpacity = 0.2;
	range2.label.inside = true;
	range2.label.text = "Ekspektasi";
	range2.label.fill = range2.grid.stroke;
	range2.label.align = "center";
	// range2.label.verticalCenter = "bottom";
	// range2.label.horizontalCenter = "center";


	const GapSeries = chart.series.push(new am4charts.LineSeries());
	GapSeries.dataFields.categoryX = "symbol";
	GapSeries.dataFields.valueY = "gap";
	GapSeries.name = "Realita"
	GapSeries.strokeWidth = 2;

	const interfaceColors = new am4core.InterfaceColorSet();
	const bullet = GapSeries.bullets.push(new am4charts.CircleBullet());
	bullet.circle.stroke = interfaceColors.getFor("background");
	bullet.fill = GapSeries.stroke
	bullet.tooltipText = '{bulletTooltip}';


	bullet.adapter.add("fill", function (fill, target) {
		return target.dataItem.valueY >= 5  ? am4core.color('green') : am4core.color('red');
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