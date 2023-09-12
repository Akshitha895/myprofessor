import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import DeviceConstants from 'react-native-device-constants';
import ChartView from './HighChart.js';
const TimeSpentChart = ({ topicsTimeTakenData = {} }) => {
  let [chartOptions, setChartOptions] = useState(null);
  let [chartConfig, setChartConfig] = useState(null);
  let [data, setData] = useState(true);

  let [spinner, setspinner] = useState(true);
  useEffect(() => {
    if (topicsTimeTakenData && Object.keys(topicsTimeTakenData).length) {
      let labels = [];
      let values = [];
      topicsTimeTakenData?.userTestQuestions.map((question, key) => {
        labels.push(`Q ${key + 1}`);
        let color = question.score === 1 ? '#A3BA6D' : '#F94D48';
        values.push({ y: Math.abs(question.timeTaken), color });
      });
      console.log('acnadkljckadc', labels, values);
      const conf = {
        chart: {
          type: 'column',
          style: {
            fontFamily: 'Roboto, sans-serif',
          },
        },
        title: {
          text: '',
        },
        subtitle: {
          text: '',
        },
        xAxis: {
          categories: labels,
          crosshair: true,
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Time spent in seconds',
          },
        },
        credits: {
          enabled: false,
        },
        tooltip: {
          headerFormat:
            '<span style="font-size:10px">{point.key}</span><table>',
          pointFormat:
            '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f} seconds</b></td></tr>',
          footerFormat: '</table>',
          shared: true,
          useHTML: true,
        },
        plotOptions: {
          column: {
            pointPadding: 0.2,
            borderWidth: 0,
          },
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
            name: 'Time Taken',
            data: values,
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
    } else {
      setspinner(false);
      setData(false);
    }

    console.log('weeklyEngagementAverage');
  }, [topicsTimeTakenData]);
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
        style={{ height: 400, overflow: 'hidden' }}
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

export default TimeSpentChart;
