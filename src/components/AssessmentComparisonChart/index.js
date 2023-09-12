import React, { useState, useEffect } from 'react';
import { Text, View, Dimensions } from 'react-native';
//import ChartView from 'react-native-highcharts';
import DeviceConstants from 'react-native-device-constants';
import ChartView from './HighChart.js';

const windowWidth = Dimensions.get('window').width;

const AssessmentComparisonChart = (props) => {
  const { topicPreVsPostData } = props;
  let [chartOptions, setChartOptions] = useState(null);
  let [chartConfig, setChartConfig] = useState(null);
  let [spinner, setspinner] = useState(true);

  useEffect(() => {
    if (topicPreVsPostData && Object.keys(topicPreVsPostData).length) {
      console.log('   ', topicPreVsPostData?.super?.postTestScore);
      //     const conf = {
      //       chart: {
      //         type: 'bar',
      //         animation: {
      //           duration: 1000,
      //         },
      //         style: {
      //          // fontFamily: 'Roboto, sans-serif',
      //         }
      //     },
      //     title: {
      //         text: 'Pre (vs) Post Assessments'
      //     },
      //     xAxis: {
      //         categories: ['Post Assessment','Pre Assessment']
      //     },
      //     yAxis: {
      //         min: 0,
      //         title: {
      //             text: 'Aggregate of all Assessments (%)'
      //         }
      //     },
      //     fill: {
      //       colors: ['#a4b96e','#F94D48'],
      //     },
      //     colors: ['#a4b96e','#F94D48'],
      //     legend: {
      //         reversed: true
      //     },
      //     plotOptions: {
      //       series: {
      //           stacking: 'normal'
      //       }
      //   },
      //     series: [
      //       {
      //         name: 'Post Assessment',
      //         data: [topicPreVsPostData?.super?.postTestScore, 0,]
      //     },
      //     {
      //       name: 'Pre Assessment',
      //       data: [0,topicPreVsPostData?.super?.preTestScore]
      //   }
      //   ]
      //     }
      const conf = {
        chart: {
          type: 'bar',
          animation: {
            duration: 1000,
          },
          style: {
            fontFamily: 'Roboto, sans-serif',
          },
        },

        title: {
          text: 'Pre (vs) Post Assessments',
        },
        xAxis: {
          categories: ['Post Assessment', 'Pre Assessment'],
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Aggregate of all Assessments (%)',
          },
        },
        credits: {
          enabled: false,
        },
        fill: {
          colors: ['#a4b96e', '#F94D48'],
        },
        colors: ['#a4b96e', '#F94D48'],
        legend: {
          enabled: false,
        },
        exporting: {
          enabled: false,
        },
        series: [
          {
            name: 'Post Assessment',
            data: [topicPreVsPostData?.super?.postTestScore, 0],
          },
          {
            name: 'Pre Assessment',
            data: [0, topicPreVsPostData?.super?.preTestScore],
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
    }
  }, [topicPreVsPostData]);
  const isTablet = DeviceConstants.isTablet; // false
  var headfont = 15,
    newviewheight = 300;
  if (isTablet) {
    (headfont = 20), (smanewviewheightllbox = 400);
  }
  return spinner ? (
    <Text style={{ fontSize: headfont }}>Loading....</Text>
  ) : (
    <View style={{ alignItems: 'center' }}>
      <ChartView
        style={{
          height: newviewheight,
          width: windowWidth / 1.1,
          overflow: 'hidden',
        }}
        config={chartConfig}
        options={chartOptions}
        originWhitelist={['']}
      />
    </View>
  );
};

export default AssessmentComparisonChart;
