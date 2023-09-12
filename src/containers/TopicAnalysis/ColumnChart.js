import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
//import ChartView from 'react-native-highcharts';
import DeviceConstants from 'react-native-device-constants';
import ChartView from './HighChart.js';

const ColumnChart = ({ type, question }) => {
  let [chartOptions, setChartOptions] = useState(null);
  let [chartConfig, setChartConfig] = useState(null);
  let [data, setData] = useState(true);
  let [spinner, setspinner] = useState(true);
  useEffect(() => {
    console.log('datattatatatta', question);
    //  if (question && Object.keys(question).length) {
    var correct = question?.correct ? question?.correct : 0;
    var incorrect = question?.inCorrect ? question?.inCorrect : 0;
    let total = correct + incorrect;
    var Highcharts = 'Highcharts';
    const conf = {
      chart: {
        type: 'column',
        animation: Highcharts.svg,
      },
      title: {
        text: '',
      },
      subtitle: {
        text: '',
      },
      xAxis: {
        categories: [type],
        crosshair: true,
      },
      yAxis: {
        min: 0,
        tickInterval: total < 10 ? 1 : 2,
        title: {
          text: '',
        },
      },
      // tooltip: {
      //   headerFormat:
      //     '<span style="font-size:10px">{point.key}</span><table>',
      //   pointFormat:
      //     '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
      //     '<td style="padding:0"><b>{point.y}</b></td></tr>',
      //   footerFormat: '</table>',
      //   shared: true,
      //   useHTML: true,
      // },
      plotOptions: {
        column: {
          pointPadding: 0.1,
          borderWidth: 0,
        },
      },
      credits: {
        enabled: false,
      },
      legend: {
        enabled: false,
      },
      exporting: {
        enabled: false,
      },
      series: [
        {
          showInLegend: false,
          name: 'Correct',
          data: [
            { y: question?.correct ? question?.correct : 0, color: '#A3BA6D' },
          ], // this point is red
        },
        {
          showInLegend: false,
          name: 'Incorrect',
          data: [
            {
              y: question?.inCorrect ? question?.inCorrect : 0,
              color: '#F94D48',
            },
          ], // this point is red
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
    setChartOptions(options);
    setChartConfig(conf);
    setspinner(false);

    //  else{
    //   setspinner(false)
    //   setData(false)
    //  }
  }, [question]);
  var isTablet = DeviceConstants.isTablet;
  var circle = 10,
    newsize = 12;
  if (isTablet) {
    (circle = 20), (newsize = 20);
  }
  return spinner ? (
    <Text style={{ textAlign: 'center' }}>Loading....</Text>
  ) : data ? (
    <View>
      <ChartView
        style={{ height: 300, overflow: 'hidden' }}
        config={chartConfig}
        options={chartOptions}
        originWhitelist={['']}
      />
      <View
        style={{
          flexDirection: 'row',
          marginTop: 15,
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 10,
          }}
        >
          <View
            style={{
              width: circle,
              height: circle,
              backgroundColor: '#A3BA6D',
              alignItems: 'center',
            }}
          />
          <Text style={{ marginLeft: 5, fontSize: newsize }}>Correct</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marignLeft: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: circle,
              height: circle,
              backgroundColor: '#F94D48',
            }}
          />
          <Text style={{ marginLeft: 5, fontSize: newsize }}>Incorrect</Text>
        </View>
      </View>
    </View>
  ) : (
    <Text style={{ textAlign: 'center' }}>No Data</Text>
  );
};

export default ColumnChart;
