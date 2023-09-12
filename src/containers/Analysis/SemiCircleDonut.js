import React, { Component } from 'react';
import { Text } from 'react-native';
//import ChartView from 'react-native-highcharts';
import ChartView from './HighChart.js';

class SemiCircleDonut extends Component {
  constructor() {
    super();
    this.state = {
      chartOptions: null,
      options: null,
      spinner: true,
    };
  }

  componentDidMount() {
    if (this.props.chapters.length > 0) {
      console.log('cccccc', this.props.chapters);
    }

    let data = [];
    if (this.props.chapters.length) {
      this.props.chapters.map((chapter) => {
        data.push([chapter.name, chapter.percentage]);
      });
    }
    console.log('dataaaa', data);
    var Highcharts = 'Highcharts';
    const conf = {
      title: {
        text: '',
      },
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false,
        marginBottom: 90,
        style: {
          fontFamily: 'Roboto, sans-serif',
        },
      },

      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.2f}%</b>',
      },
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: false,
            distance: -50,
            style: {
              fontWeight: 'bold',
              color: 'white',
            },
          },
          colors: [
            '#FF6633',
            '#FFB399',
            '#FF33FF',
            '#FFFF99',
            '#00B3E6',
            '#E6B333',
            '#3366E6',
            '#999966',
            '#99FF99',
            '#B34D4D',
            '#80B300',
            '#809900',
            '#E6B3B3',
            '#6680B3',
            '#66991A',
            '#FF99E6',
            '#CCFF1A',
            '#FF1A66',
            '#E6331A',
            '#33FFCC',
            '#66994D',
            '#B366CC',
            '#4D8000',
            '#B33300',
            '#CC80CC',
            '#66664D',
            '#991AFF',
            '#E666FF',
            '#4DB3FF',
            '#1AB399',
            '#E666B3',
            '#33991A',
            '#CC9999',
            '#B3B31A',
            '#00E680',
            '#4D8066',
            '#809980',
            '#E6FF80',
            '#1AFF33',
            '#999933',
            '#FF3380',
            '#CCCC00',
            '#66E64D',
            '#4D80CC',
            '#9900B3',
            '#E64D66',
            '#4DB380',
            '#FF4D4D',
            '#99E6E6',
            '#6666FF',
          ],
          center: ['50%', '50%'],
          showInLegend: true,
        },
      },
      credits: {
        enabled: false,
      },
      legend: {
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'top',
        x: 70,
        y: 300,
        floating: true,
        borderWidth: 1,
        backgroundColor:
          (Highcharts.theme && Highcharts.theme.legendBackgroundColor) ||
          '#FFFFFF',
        shadow: true,
      },

      exporting: {
        enabled: false,
      },
      series: [
        {
          type: 'pie',
          name: 'Progress',
          borderWidth: 1,
          innerSize: '70%',
          data,
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

    this.setState({ chartOptions: conf, options, spinner: false });
  }

  render() {
    return this.state.spinner ? (
      <Text>Loading....</Text>
    ) : (
      <ChartView
        style={{ height: 400, overflow: 'hidden' }}
        config={this.state.chartOptions}
        options={this.state.options}
        originWhitelist={['']}
      />
    );
  }
}

export default SemiCircleDonut;
