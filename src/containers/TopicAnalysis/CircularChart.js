import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
//import ChartView from 'react-native-highcharts';
import ChartView from './HighChart.js';

const CircularChart = ({ completion }) => {
  //const { t } = useTranslation()
  const [chartOptions, setChartOptions] = useState(null);
  let [chartConfig, setChartConfig] = useState(null);
  const [spinner, setspinner] = useState(true);

  useEffect(() => {
    if (completion) {
      const conf = {
        title: {
          text: '',
        },
        chart: {
          type: 'pie',
        },

        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage}%</b>',
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              distance: -150,
              style: {
                fontWeight: 'bold',
                color: '#000',
                fontSize: 20,
              },
              formatter() {
                return point.name === 'Complete'
                  ? completion
                    ? `${Number(completion)}%`
                    : 0
                  : null;
              },
            },
            colors: [
              '#A3BA6D',
              '#F94D48',
              '#30A6DC',
              '#C44921',
              '#734F96',
              '#D19DE6',
              '#734F96',
              '#6A5177',
            ],
            center: ['50%', '50%'],
            showInLegend: true,
          },
        },
        series: [
          {
            type: 'pie',
            name: 'Progress',
            borderWidth: 1,
            innerSize: '80%',
            data: [
              ['Complete', completion ? Number(completion) : 0],
              ['Incomplete', completion ? Number(100 - completion) : 100],
            ],
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
  }, [completion]);

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

export default CircularChart;
