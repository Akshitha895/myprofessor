import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
//import ChartView from 'react-native-highcharts';
import DeviceConstants from 'react-native-device-constants';
import ChartView from './HighChart.js';

const LineChart = ({ studentPreVsPost }) => {
  let [chartOptions, setChartOptions] = useState(null);
  let [chartConfig, setChartConfig] = useState(null);
  let [spinner, setspinner] = useState(true);
  let [nodata, setNodata] = useState(false);

  const isTablet = DeviceConstants.isTablet; // false
  var chartheight = 300,
    headtext = 15,
    colorbox = 10;
  if (isTablet) {
    chartheight = 400;
    headtext = 20;
    colorbox = 20;
  }

  useEffect(() => {
    console.log('preTestData', studentPreVsPost);

    if (studentPreVsPost && studentPreVsPost.length) {
      let labels = studentPreVsPost.map((pt) => pt.name);
      let preTestData = studentPreVsPost.map((pt) => {
        return pt.superPreTestScore;
      });
      let postTestData = studentPreVsPost.map((pt) => {
        return pt.superPostTestScore;
      });
      const conf = {
        chart: {
          type: 'spline',
          animation: {
            duration: 1000,
          },
          style: {
            fontFamily: 'Roboto, sans-serif',
          },
        },

        title: {
          text: '',
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
        xAxis: {
          categories: labels,
        },
        fill: {
          colors: ['#dfb027'],
        },
        colors: ['#F94D48', '#a4b96e'],
        yAxis: {
          title: '',
          min: 0,
          // max: 100,
          //f tickInterval: 20,
          // labels: {
          //   formatter: function () {
          //     return `${this.value}%`
          //   },
          // },
        },
        series: [
          {
            name: 'Pre Test',
            data: preTestData,
          },
          {
            name: 'Post Test',
            data: postTestData,
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
      setNodata(false);
    } else {
      setspinner(false);
      setNodata(true);
    }
    console.log('preTestData', studentPreVsPost);
  }, [studentPreVsPost]);

  return spinner ? (
    <Text>Loading....</Text>
  ) : nodata ? (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <Text>No data</Text>
    </View>
  ) : (
    <View>
      <ChartView
        style={{ height: chartheight, overflow: 'hidden' }}
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
          }}
        >
          <View
            style={{
              width: colorbox,
              height: colorbox,
              backgroundColor: '#F94D48',
            }}
          />
          <Text style={{ marginLeft: 5, fontSize: headtext }}>Pre Test</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginLeft: 20,
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: colorbox,
              height: colorbox,
              backgroundColor: '#A3BA6D',
              alignItems: 'center',
            }}
          />
          <Text style={{ marginLeft: 5, fontSize: headtext }}>Post Test</Text>
        </View>
      </View>
    </View>
  );
};

export default LineChart;
