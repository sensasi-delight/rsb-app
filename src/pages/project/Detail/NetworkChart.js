import { useLayoutEffect } from "react";

import * as am4core from "@amcharts/amcharts4/core";
// import * as am4charts from "@amcharts/amcharts4/charts";
import * as forceDirected from "@amcharts/amcharts4/plugins/forceDirected";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

const chartxx = (data, chartId) => {
	let chart = am4core.create(chartId, forceDirected.ForceDirectedTree);
	// chart.legend = new am4charts.Legend()

	var series = chart.series.push(new forceDirected.ForceDirectedSeries());

	series.data = data

	// Set up data fields
	series.dataFields.value = "impact";
	series.dataFields.name = "name";
	series.dataFields.hiddenInLegend = true
	// series.dataFields.children = "children";
	series.dataFields.id = "name";
	series.dataFields.linkWith = "link";
	series.fontSize = 10;
	series.minRadius = 15;
	series.maxRadius = 40;
	series.dataFields.color = "color"
	series.centerStrength = 0.5;
	series.manyBodyStrength = -50;

	// Add labels
	let nodeTemplate = series.nodes.template;
	nodeTemplate.label.text = "{name}";
	nodeTemplate.tooltipText = "{text}";
	nodeTemplate.hide = true;

	// nodeTemplate.width = 150;
	// nodeTemplate.wrap = true;
	nodeTemplate.fillOpacity = 1;
	// nodeTemplate.label.hideOversized = true;
	// nodeTemplate.label.truncate = true;

	let linkTemplate = series.links.template;
	// linkTemplate.strokeWidth = 1;
	// linkTemplate.tooltipText = "{value}";
	linkTemplate.strokeWidth = 2;
	linkTemplate.distance = 2;
	linkTemplate.interactionsEnabled = false;
// chart.tooltip.label.maxWidth = 150;
// chart.tooltip.label.wrap = true;
	// linkTemplate.strength = 2

	let linkHoverState = linkTemplate.states.create("hover");
	linkHoverState.properties.strokeOpacity = 1;
	linkHoverState.properties.strokeWidth = 3;


	nodeTemplate.events.on("over", function (event) {
		let dataItem = event.target.dataItem;
		dataItem.childLinks.each(function (link) {
			link.isHover = true;
		})
	})

	

	nodeTemplate.events.on("out", function (event) {
		let dataItem = event.target.dataItem;
		dataItem.childLinks.each(function (link) {
			link.isHover = false;
		})
	})


	// nodeTemplate.events.on("hit", function (event) {
	// 	console.log('c');
	// 	if (event.target.dataItem.isHiding) {
	// 	console.log('d');

	// 	event.target.dataItem.show();

	// 	} else {

	// 		event.target.dataItem.hide();
	// 	}
	// })


	// nodeTemplate.events.on("hidden", function (event) {
	// 	console.log('c');
	// 	if (event.target.dataItem.isHiding) {
	// 	console.log('d');

	// 		event.target.dataItem.show();

	// 	} else {

	// 		event.target.dataItem.hide();
	// 	}
	// })


	// series.events.on("hidden", function(event) {
	// 	// let dataItem = event.target.dataItem;
	// 	series.hide()
	//   });
	  
	//   series.events.on("shown", function(event) {
	// 	// let dataItem = event.target.dataItem;
	// 	series.show()
	//   });


	return () => {
		chart.dispose();
	};
}
export default function NetworkChart(props) {
	useLayoutEffect(() => {
		chartxx(props.data, props.chartId);
	}, [props.data, props.chartId]);

	return (
		<div id={props.chartId} style={{ width: "100%", height: "75vh" }}></div>
	)
}