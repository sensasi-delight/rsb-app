import React, { useLayoutEffect } from 'react';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";


am4core.useTheme(am4themes_animated);

const chart = (data, chartId) => {
    let chart = am4core.create(chartId, am4charts.XYChart);

    chart.colors.step = 2;

    chart.data = data;
    // chart.data = generateChartData();


    // Create axes
    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 50;

    // Create series
    // let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.minGridDistance = 30;

    function createAxisAndSeries(field) {
        let series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = field;
        series.dataFields.dateX = "date";
        series.strokeWidth = 2;
        series.yAxis = valueAxis;
        series.name = field;
        series.tooltipText = "{name}: [bold]{valueY}[/]";
        series.tensionX = 0.8;
        series.showOnInit = true;
        // series.tooltip.pointerOrientation = "vertical";

        let interfaceColors = new am4core.InterfaceColorSet();
        let bullet = series.bullets.push(new am4charts.CircleBullet());
        bullet.circle.stroke = interfaceColors.getFor("background");
        bullet.circle.strokeWidth = 2;

        valueAxis.renderer.line.strokeOpacity = 1;
        valueAxis.renderer.line.strokeWidth = 2;
        valueAxis.renderer.line.stroke = series.stroke;
        valueAxis.renderer.labels.template.fill = series.stroke;
        valueAxis.renderer.opposite = false;
    }

    createAxisAndSeries('actual')
    createAxisAndSeries('targeted')

    chart.legend = new am4charts.Legend();

    chart.cursor = new am4charts.XYCursor();

    return () => {
		chart.dispose();
	};
};

export default function RsbGraph(props) {
    useLayoutEffect(() => {
    chart(props.data, props.chartId);
    }, [props.data, props.chartId]);

    return (
        <div id={props.chartId} style={{ width: "100%", height: "435px" }}>
        </div>
    )
}

