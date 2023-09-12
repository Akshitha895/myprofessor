import React from 'react';
//import ChartView from 'react-native-highcharts';
import ChartView from './HighChart.js';
const PolarRadialBar = () => {
  const Highcharts = 'Highcharts';
  const conf = {
    colors: ['#6A5177', '#A3BA6D', '#D88212', '#F94D48', '#D19DE6', '#30A6DC'],
    chart: {
      type: 'column',
      inverted: true,
      polar: true,
      style: {
        fontFamily: 'Roboto, sans-serif',
      },
    },
    title: {
      text: '',
    },
    tooltip: {
      outside: true,
    },
    pane: {
      size: '85%',
      innerSize: '20%',
      endAngle: 270,
    },
    xAxis: {
      tickInterval: 1,
      labels: {
        align: 'right',
        useHTML: true,
        allowOverlap: true,
        step: 1,
        y: 3,
        style: {
          fontSize: '13px',
        },
      },
      lineWidth: 0,
      categories: [
        'Create',
        'Evaluate',
        'Analyze',
        'Apply',
        'Understand',
        'Remember',
      ],
    },
    credits: {
      enabled: false,
    },
    yAxis: {
      crosshair: {
        enabled: true,
        color: '#333',
      },
      lineWidth: 0,
      min: 0,
      max: 100,
      tickInterval: 5,
      labels: {
        formatter(label) {
          return label.value + '%';
        },
      },
      reversedStacks: false,
      endOnTick: true,
      showLastLabel: true,
    },
    exporting: {
      enabled: false,
    },
    plotOptions: {
      column: {
        stacking: 'normal',
        borderWidth: 0,
        pointPadding: 0,
        groupPadding: 0.15,
      },
    },
    series: [
      {
        name: 'Create',
        data: [32, 0, 0, 0, 0, 0],
      },
      {
        name: 'Evaluate',
        data: [0, 86, 0, 0, 0, 0],
      },
      {
        name: 'Analyze',
        data: [0, 0, 45, 0, 0, 0],
      },
      {
        name: 'Apply',
        data: [0, 0, 0, 91, 0, 0],
      },
      {
        name: 'Understand',
        data: [0, 0, 0, 0, 58, 0],
      },
      {
        name: 'Remember',
        data: [0, 0, 0, 0, 0, 29],
      },
    ],
  };
  const options = {
    global: {
      useUTC: false,
    },
    lang: {
      decimalPoint: ',',
      thousandsSep: '.',
    },
  };
  return (
    <ChartView
      style={{ height: 400, overflow: 'hidden' }}
      config={conf}
      options={options}
      highcharts={Highcharts}
    />
  );
};

export default PolarRadialBar;
