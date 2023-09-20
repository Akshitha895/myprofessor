import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
//import ChartView from 'react-native-highcharts';
import DeviceConstants from 'react-native-device-constants';
import ChartView from './HighChart.js';

const TimeSpentChart = (props) => {
  const { testResult } = props;
  let [chartOptions, setChartOptions] = useState(null);
  let [data, setData] = useState(true);
  let [chartConfig, setChartConfig] = useState(null);
  let [spinner, setspinner] = useState(true);

  useEffect(() => {
    if (testResult) {
      console.log('xmbcvjZCNvkc', testResult);
      if (testResult.questions && testResult.questions.length) {
        // let labels = []
        // let idealTimeData = []
        // let spentTimeData = []
        // let spentTimeColors = []

        // testResult?.questions?.map((tq, i) => {
        //   console.log("asmnckck",tq)

        //     labels.push(i + 1)
        //     idealTimeData.push(tq.actualDuration)
        //     spentTimeData.push(tq.timeTaken)
        //     const color = tq.analysis !== 'Lost' ? '#a3ba6d' : '#f94d48'

        //   spentTimeColors.push(color)
        let labels = [];
        let idealTimeData = [];
        let spentTimeData = [];
        let spentTimeColors = [];
        testResult.questions.forEach((tq, i) => {
          labels.push(`${i + 1} (${tq.markAllocation}M)`);
          idealTimeData.push(Math.abs(tq.actualDuration));
          spentTimeData.push(Math.abs(tq.timeTaken));
          const color =
            tq.analysis === 'Lost' ||
            tq.analysis === 'Un Answered' ||
            tq.analysis === 'Extra Time'
              ? '#f94d48'
              : '#a3ba6d';
          spentTimeColors.push(color);
        });

        const conf = {
          chart: {
            type: 'bar',
            animation: {
              duration: 100,
            },
            style: {
              fontFamily: 'Roboto, sans-serif',
            },
          },
          title: {
            text: 'Time Spent ',
          },
          legend: {
            enabled: false,
          },
          xAxis: {
            categories: labels,
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
          fill: {
            colors: ['#a14321', '#307698'],
          },
          yAxis: {
            title: {
              text: 'Seconds',
            },
            labels: {
              formatter() {
                return `${value}s`;
              },
            },
          },
          series: [
            {
              name: 'Time Spent',
              data: spentTimeData,
              colorByPoint: true,
              colors: spentTimeColors,
            },
            { name: 'Ideal Optimized Time', data: idealTimeData },
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
    }
  }, [testResult]);
  const isTablet = DeviceConstants.isTablet; // false
  var headfont = 15,
    smallbox = 10;
  if (isTablet) {
    (headfont = 20), (smallbox = 20);
  }

  return spinner ? (
    <Text style={{ textAlign: 'center', fontSize: headfont }}>Loading....</Text>
  ) : data ? (
    <View>
      <ChartView
        style={{ height: testResult.questions.length * 150, flex: 1 }}
        height={testResult.questionslength * 150}
        config={chartConfig}
        options={chartOptions}
        originWhitelist={['*']}
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
            marignLeft: 10,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 10,
          }}
        >
          <View
            style={{
              width: smallbox,
              height: smallbox,
              backgroundColor: '#7CB5EC',
            }}
          />
          <Text style={{ marginLeft: 10, fontSize: headfont }}>IdealTime</Text>
        </View>
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
              width: smallbox,
              height: smallbox,
              backgroundColor: '#A3BA6D',
              alignItems: 'center',
            }}
          />
          <Text style={{ marginLeft: 10, fontSize: headfont }}>Correct</Text>
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
              width: smallbox,
              height: smallbox,
              backgroundColor: '#F94D48',
            }}
          />
          <Text style={{ marginLeft: 10, fontSize: headfont }}>Incorrect</Text>
        </View>
      </View>
    </View>
  ) : (
    <Text style={{ textAlign: 'center', fontSize: headfont }}>No Data</Text>
  );
};

export default TimeSpentChart;
