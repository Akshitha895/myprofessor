import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { Dimensions, Image, Text, TouchableOpacity, View } from 'react-native';
import DeviceConstants from 'react-native-device-constants';
import { Actions } from 'react-native-router-flux';
import Toast from 'react-native-simple-toast';
import { baseUrl } from '../../constants';
import StringsOfLanguages from './../../StringsOfLanguages';
import LineChart from './LineChart';
import styles from './styles';

const windowWidth = Dimensions.get('window').width;

// import {
// 	LineChart,
// 	BarChart,
// 	PieChart,
// 	ProgressChart,
// 	ContributionGraph,
// 	StackedBarChart
//   } from "react-native-chart-kit"
// let sampleData = [
//   {
//     seriesName: 'Pre Assesment',
//     data: [
//       { x: '0', y: 20 },
//       { x: 'Physics', y: 30 },
//       { x: 'Chemistry', y: 50 },
//       { x: 'Biollogy', y: 70 },
//       { x: 'Mathematics', y: 90 },
//     ],
//     color: 'orange',
//   },
//   {
//     seriesName: 'Post Assesment',
//     data: [
//       { x: '0', y: 5 },
//       { x: 'Physics', y: 20 },
//       { x: 'Chemistry', y: 40 },
//       { x: 'Biology', y: 60 },
//       { x: 'Mathematics', y: 80 },
//     ],
//     color: 'green',
//   },
// ];
class MyPerformance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      graphdata: [],
      spinner: true,
      prertestscore: [],
      posttestscore: [],
      newgraphdtaa: {},
      datacountt: 0,
      nodata: false,
    };
  }
  componentDidMount() {
    this.getData();
  }
  getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@user');
      //  alert(JSON.stringify(value))
      if (value !== null) {
        var data = JSON.parse(value);
        const token = await AsyncStorage.getItem('@access_token');
        if (token) {
          this.setState(
            {
              token: JSON.parse(token),
            },
            () => this.getTopics()
          );
        } else {
        }
      } else {
        console.log('errorr');
      }
    } catch (e) {
      return null;
    }
  };
  getTopics() {
    var url = baseUrl + '/analytics/student/PrePostAssessmentReport';
    console.log('value', url);
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: this.state.token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        console.log('dattaaasknbckjdbjkdbjbdjfcbdjfn', json);
        if (json.statusCode === '401') {
          //Toast.show(json.message, Toast.LONG);
          this.setState({
            graphdata: [],
            spinner: false,
            datacountt: count,
          });
        } else {
          if (json.data) {
            // this.setState({
            //     graphdata: json.data,
            //     spinner: false
            // })
            console.log('dattaaasknbckjdbjkdbjbdjfcbdjfn', json);

            var labels = [];
            var pretestscore = [];
            var posttestscore = [];
            var count = 0;
            json.data.map((res, i) => {
              labels.push(res.name);
              pretestscore.push(res.superPreTestScore);
              posttestscore.push(res.superPostTestScore);
              console.log(
                'res.superPreTestScore',
                res.superPreTestScore,
                res.superPostTestScore
              );
              count = count + res.superPreTestScore + res.superPostTestScore;
            });
            console.log('countttt', count);
            if (count > 0) {
              this.setState({ nodata: false });
            } else if (count === 0) {
              this.setState({ nodata: true });
            }

            this.setState({
              graphdata: labels,
              newgraphdtaa: json.data,
              prertestscore: pretestscore,
              posttestscore,
              spinner: false,
              datacountt: count,
            });
          } else {
            //alert("ffff"+JSON.stringify(json.message))
            Toast.show(json.message, Toast.LONG);
            this.setState({
              graphdata: [],
              spinner: false,
              datacountt: count,
            });
          }
        }
      })
      .catch((error) => console.error(error));
    //Actions.push('boards')
  }
  onViewall() {
    Actions.push('analysis');
  }
  render() {
    const isTablet = DeviceConstants.isTablet; // false
    var nodataimagewidth = 317 / 2,
      noimagefont = 18,
      headfont = 16,
      bluebarheight = 50;
    if (isTablet) {
      nodataimagewidth = 317 / 1.5;
      noimagefont = 22;
      headfont = 22;
      bluebarheight = 70;
    }
    return this.state.spinner ? null : (
      <View
        style={{
          width: windowWidth / 1.06,
          justifyContent: 'center',
          alignSelf: 'center',
          marginHorizontal: 0,
          borderRadius: 10,
          marginBottom: 20,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 1,
          shadowRadius: 2,
          elevation: 10,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#0A7FD7',
            height: bluebarheight,
          }}
        >
          <Text
            style={{
              marginLeft: 15,
              fontSize: headfont,
              color: 'white',
              fontWeight: '600',
            }}
          >
            {StringsOfLanguages.myperformance}
          </Text>
          <TouchableOpacity onPress={this.onViewall.bind(this)}>
            {/* <Text style={{marginRight:15,fontSize:14,color:"#656565"}}>{StringsOfLanguages.seeall}</Text> */}
          </TouchableOpacity>
        </View>
        <View style={styles.chartview}>
          {this.state.nodata ? (
            <View
              style={{
                height: 300,
                width: windowWidth / 1.1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Image
                source={require('../../assets/images/graphabs.png')}
                style={{ width: nodataimagewidth, height: nodataimagewidth }}
              />
            </View>
          ) : (
            <LineChart studentPreVsPost={this.state.newgraphdtaa} />
          )}
        </View>
      </View>
    );
  }
}
export default MyPerformance;
