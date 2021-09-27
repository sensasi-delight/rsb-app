import { memo, useEffect, useMemo } from "react";

import * as am4core from "@amcharts/amcharts4/core";
import PropTypes from 'prop-types';

// import * as am4charts from "@amcharts/amcharts4/charts";
import * as forceDirected from "@amcharts/amcharts4/plugins/forceDirected";
// import am4themes_animated from "@amcharts/amcharts4/themes/animated";

// am4core.useTheme(am4themes_animated);

const chartxx = (chartId) => {
	const chart = am4core.create(chartId, forceDirected.ForceDirectedTree);
	// chart.strokeWidth=1
	// chart.background.fiil='#AAA'
	// chart.background.opacity = 0.5
	chart.zoomable = true
	// chart.legend = new am4charts.Legend();

	const series = chart.series.push(new forceDirected.ForceDirectedSeries());

	// series.data = data

	// Set up data fields
	series.dataFields.value = "impact";
	series.dataFields.name = "name";
	series.dataFields.hiddenInLegend = false
	// series.dataFields.children = "children";
	series.dataFields.id = "name";
	// series.dataFields.linkWith = "link";
	series.dataFields.children = "childrens";
	// series.fontSize = 10;
	series.minRadius = 15;
	series.maxRadius = 50;
	series.dataFields.color = "color"
	series.centerStrength = 1;
	// series.manyBodyStrength = -50;
	// series.colors.wrap = false;
	series.maxLevels = 1;

	// series.dataFields.collapsed = "off";

	// Add labels
	let nodeTemplate = series.nodes.template;
	nodeTemplate.label.text = "{name}";
	nodeTemplate.tooltipText = "{text}";
	// nodeTemplate.hide = true;

	// nodeTemplate.width = 150;
	// nodeTemplate.wrap = true;
	// nodeTemplate.fillOpacity = 1;
	// nodeTemplate.label.hideOversized = true;
	// nodeTemplate.label.truncate = true;

	// let linkTemplate = series.links.template;
	// linkTemplate.strokeWidth = 1;
	// linkTemplate.tooltipText = "{expectation}";
	// linkTemplate.strokeWidth = 2;
	// linkTemplate.stroke = am4core.color('red')
	// linkTemplate.fill = am4core.color('red');
	// linkTemplate.fillOpacity = 1;
	// linkTemplate.distance = 2;
	// linkTemplate.interactionsEnabled = true;
	// chart.tooltip.label.maxWidth = 150;
	// chart.tooltip.label.wrap = true;
	// linkTemplate.strength = 2


	// let linkHoverState = linkTemplate.states.create("hover");
	// linkHoverState.properties.strokeOpacity = 1;
	// linkHoverState.properties.strokeWidth = 3;


	// nodeTemplate.events.on("over", function (event) {
	// 	let dataItem = event.target.dataItem;
	// 	dataItem.childLinks.each(function (link) {
	// 		link.isHover = true;
	// 	})
	// })

	// nodeTemplate.events.on("out", function (event) {
	// 	let dataItem = event.target.dataItem;
	// 	dataItem.childLinks.each(function (link) {
	// 		link.isHover = false;
	// 	})
	// })

	return chart
}

function NetworkChart(props) {

	const { chartId, onInitialize } = props;

	const initializeChart = useMemo(() => {
		return () => chartxx(chartId)
	}, [chartId])

	useEffect(() => {
		const ch = initializeChart()
		onInitialize(ch)
		return () => ch.dispose()
	}, [initializeChart, onInitialize])

	return (
		<div id={chartId} style={{ border: '1', width: "100%", height: "75vh", fontFamily:'monospace' }}></div>
	)
}


NetworkChart.propTypes = {
	chartId: PropTypes.string.isRequired,
	onInitialize: PropTypes.func.isRequired,
}

export default memo(NetworkChart)