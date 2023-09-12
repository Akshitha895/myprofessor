import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
//import ChartView from 'react-native-highcharts';
import ChartView from './HighChart.js';
const TimeSpentChart = ({ topicsTimeTakenData = {} }) => {
  let [chartOptions, setChartOptions] = useState(null);
  let [chartConfig, setChartConfig] = useState(null);
  let [spinner, setspinner] = useState(true);
  useEffect(() => {
    if (topicsTimeTakenData && Object.keys(topicsTimeTakenData).length) {
      let labels = [];
      let values = [];
      topicsTimeTakenData?.timeSpent.map((question, key) => {
        labels.push(`Q ${key + 1}`);
        let color = question.is_correct ? '#A3BA6D' : '#F94D48';
        values.push({ y: question.test_taken_time, color });
      });
      const conf = {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'column',
          marginBottom: 50,
          style: {
            fontFamily: 'Roboto',
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
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'column',
          marginBottom: 50,
          style: {
            fontFamily: 'Roboto',
          },
        },
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
    }

    console.log('weeklyEngagementAverage');
  }, [topicsTimeTakenData]);

  return spinner ? (
    <Text>Loading....</Text>
  ) : (
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
              width: 10,
              height: 10,
              backgroundColor: '#A3BA6D',
              alignItems: 'center',
            }}
          />
          <Text style={{ marginLeft: 5 }}>Correct</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marignLeft: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View style={{ width: 10, height: 10, backgroundColor: '#F94D48' }} />
          <Text style={{ marginLeft: 5 }}>Incorrect</Text>
        </View>
      </View>
    </View>
  );
};

export default TimeSpentChart;
