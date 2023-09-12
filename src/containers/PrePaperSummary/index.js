import React, { Component } from 'react';
import {
  Alert,
  BackHandler,
  Dimensions,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
//import { BarChart } from 'react-native-charts'
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNSpeedometer from 'react-native-speedometer';
//import { BarChart, Grid,XAxis ,YAxis } from 'react-native-svg-charts'
import TimeSpentChart from '../../components/TimeSpentChart';
import { baseUrl, colors } from '../../constants';
import AttemptAnalysis from './AttemptAnalysis';
import styles from './styles';

const windowWidth = Dimensions.get('window').width;

// const labels = [
//   {
//     name: 'Poor',
//     labelColor: '#ff5400',
//     activeBarColor: 'orange',
//   },
//   {
//     name: 'Average',
//     labelColor: '#f4ab44',
//     activeBarColor: 'yellow',
//   },
//   {
//     name: 'Fair',
//     labelColor: '#14eb6e',
//     activeBarColor: 'green',
//   },
// ];
// const data = [
//   {
//     questionno: '1',
//     question: 'dkfjkdfk;',
//     correctans: 'B',
//     answers: [],
//     result: 'correct',
//   },
//   {
//     questionno: '1',
//     question: 'dkfjkdfk;',
//     correctans: 'B',
//     answers: [],
//     result: 'wrong',
//   },
//   {
//     questionno: '1',
//     question: 'dkfjkdfk;',
//     correctans: 'B',
//     answers: [],
//     result: 'correct',
//   },
// ];
class PrePaperSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numberofques: 5,
      correctanswer: 3,
      useDetails: null,
      token: '',
      wronganswer: 2,
      spinner: true,
      correctarray: null,
      questionsarray: [],
      wrongarray: null,
      analysis: null,
      marks: 0,
      testResult: null,
    };
  }
  componentDidMount() {
    //alert(JSON.stringify(this.props.testid))
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction
    );
    this.getData();
  }
  backAction = () => {
    this.onBack();
    return true;
  };
  componentWillUnmount() {
    this.backHandler.remove();
  }
  getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@user');
      //alert(JSON.stringify(value))
      if (value !== null) {
        var data = JSON.parse(value);
        this.setState({
          useDetails: data,
        });
        const token = await AsyncStorage.getItem('@access_token');
        if (token && data) {
          //    alert("hiii")
          this.setState({ token: JSON.parse(token) });
          this.getreport(data, JSON.parse(token));
        } else {
          console.log('hihii');
        }
      } else {
        alert('errorrr');
      }
    } catch (e) {
      return null;
    }
  };

  getreport() {
    var userId = this.state.useDetails.userInfo.userId;
    // var activityDimId = this.props.activtydata.activityDimId
    // var assignedActivityId = this.props.activtydata.assignedActivityId
    var userTestId = this.props.testid;
    var url =
      baseUrl +
      `/analytics/users/${userId}/assessments/${userTestId}/report?activityDimId=${''}`;
    console.log('sdnkjadhklandf', url);
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        jwt: this.state.token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        console.log('summarydata', JSON.stringify(json));
        /// const data = json.data;

        if (json.code === 201) {
          const previousAssessmentTestData = json.data;

          if (
            previousAssessmentTestData &&
            Object.keys(previousAssessmentTestData).length
          ) {
            console.log('sakjdnklsdn', previousAssessmentTestData);
            let resultObj = { ...previousAssessmentTestData };
            let wrongAnsCount = resultObj.questions.filter(
              (q) =>
                q.analysis === 'Lost' ||
                q.analysis === 'Un Answered' ||
                q.analysis === 'Extra Time'
            ).length;
            let correctAnsCount = resultObj.questions.filter(
              (q) =>
                q.analysis !== 'Lost' &&
                q.analysis !== 'Un Answered' &&
                q.analysis !== 'Extra Time'
            ).length;
            let lostCount = resultObj.questions.filter(
              (q) => q.analysis === 'Lost' || q.analysis === null
            ).length;
            let extraCount = resultObj.questions.filter(
              (q) => q.analysis === 'Extra Time'
            ).length;
            let unAnsCount = resultObj.questions.filter(
              (q) => q.analysis === 'Un Answered'
            ).length;
            let lighteningCount = resultObj.questions.filter(
              (q) => q.analysis === 'Lightning Fast'
            ).length;
            let shotCount = resultObj.questions.filter(
              (q) => q.analysis === 'What a Timing/ Shot'
            ).length;
            let extraInningCount = resultObj.questions.filter(
              (q) => q.analysis === 'Extra Innings/ Time'
            ).length;
            resultObj.wrongAnsCount = wrongAnsCount;
            resultObj.correctAnsCount = correctAnsCount;
            resultObj.lostCount = lostCount;
            resultObj.extraCount = extraCount;
            resultObj.unAnsCount = unAnsCount;
            resultObj.lighteningCount = lighteningCount;
            resultObj.shotCount = shotCount;
            resultObj.extraInningCount = extraInningCount;
            //setTestResult(resultObj)

            this.setState(
              {
                testResult: resultObj,
                spinner: false,
              },
              () => {
                console.log('sndlkjsc', this.state.testResult);
              }
            );
          }
        } else if (json.error?.code === 400) {
          //alert("dknkdf")
          Alert.alert('My Professor', json.error.message, [
            { text: 'OK', onPress: () => this.logout() },
          ]);
        } else {
        }
      })
      .catch((error) => alert('gggg' + error));
  }
  logout() {
    var url = baseUrl + `/users/logout`;
    //console.log("value", url)
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        jwt: this.state.token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(':xjcbjhjckx', json);
        AsyncStorage.removeItem('@user');
        AsyncStorage.removeItem('@access_token');
        Actions.login({ type: 'reset' });
      })
      .catch((error) => console.error(error));
  }
  onBack() {
    // alert(JSON.stringify(this.props.from))
    //  Actions.practicechapter({type:"reset",data: this.props.subjectData})
    if (this.props.from === 'reviewscreen') {
      Actions.pop({ type: 'reset' });
    } else {
      Actions.prequestionpapers({ type: 'reset', item: this.props.item });
    }
  }

  onViewSolutions() {
    Actions.push('prepapersolutions', {
      testid: this.props.testid,
      testdata: this.props.testdata,
      selectedata: this.props.selectedata,
    });
  }

  render() {
    let stars = [];
    // Loop 5 times

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ImageBackground
          source={require('../../assets/images/dashboard/new/activitybg.jpg')}
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: colors.Themecolor,
          }}
          opacity={0.5}
        >
          <View style={{ flex: 1 }}>
            <View style={{ flex: 0.08, flexDirection: 'row' }}>
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    flex: 1,
                    marginLeft: 20,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <TouchableOpacity onPress={this.onBack.bind(this)}>
                    <Image
                      source={require('../../assets/images/left-arrow.png')}
                      style={{ width: 25, height: 25, tintColor: 'white' }}
                    />
                  </TouchableOpacity>

                  <Text
                    style={{ color: 'white', fontSize: 18, marginLeft: 10 }}
                  >
                    {'Summary'}
                  </Text>
                </View>
              </View>
              {/* <View style={{flex:0.3,justifyContent:"center"}}>
            { topicindata.image !== "null" ?
            <Image source={{ uri: imageUrl + topicindata.image }} style={{ width: 100, height: 100, resizeMode: "contain", marginRight: 10, }} />

            : <Image source={require('../../assets/images/noimage.png')}
            style={{ width: 80, height: 80, resizeMode: "contain", marginRight: 10, }} />}
            </View> */}
            </View>
            <View
              style={{
                flex: 0.9,
                backgroundColor: 'white',
                marginLeft: 10,
                marginRight: 10,
                borderRadius: 20,
                overflow: 'hidden',
              }}
            >
              {this.state.spinner ? (
                <View
                  style={{
                    height: '100%',
                    width: '100%',
                    backgroundColor: 'white',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text>Loading...</Text>
                </View>
              ) : (
                <View style={styles.mainsubview}>
                  <View style={{ flex: 1 }}>
                    <ScrollView>
                      <View
                        style={{
                          backgroundColor: 'white',
                          padding: 5,
                          //  shadowOffset: { width: 0, height: 5 },
                          //     shadowOpacity: 1,
                          //     shadowRadius: 5,
                          //     elevation: 10,
                          //     shadowColor: 'lightgrey',
                          marginTop: 20,
                          borderRadius: 10,
                          justifyContent: 'space-around',
                          marginHorizontal: 20,
                          height: windowWidth / 2,
                        }}
                      >
                        <Text
                          style={{
                            textAlign: 'left',
                            fontSize: 18,
                            marginLeft: 10,
                          }}
                        >
                          Performace
                        </Text>

                        <RNSpeedometer
                          size={windowWidth / 1.5}
                          minValue={0}
                          maxValue={100}
                          //maxValue={this.state.testResult.marks ? this.state.testResult.marks : 20}
                          value={this.state.testResult.userTestInfo.score}
                          currentValueText="Score-o-meter"
                          needleHeightRatio={0.7}
                          ringWidth={80}
                          needleTransitionDuration={3000}
                          needleTransition="easeElastic"
                          needleColor={colors.Themecolor}
                          segmentColors={[
                            '#c44921',
                            '#d88414',
                            '#a3ba6d',
                            '#016313',
                          ]}
                          labelNoteStyle={{ fontSize: 20 }}
                          labels={[
                            {
                              name: 'Poor',
                              labelColor: '#c44921',

                              activeBarColor: '#c44921',
                            },
                            {
                              name: 'Poor',
                              labelColor: '#c44921',

                              activeBarColor: '#c44921',
                            },
                            {
                              name: 'Average',
                              labelColor: '#d88414',
                              activeBarColor: '#d88414',
                            },
                            {
                              name: 'Good',
                              labelColor: '#a3ba6d',
                              activeBarColor: '#a3ba6d',
                            },
                            {
                              name: 'Excellent',
                              labelColor: '#016313',
                              activeBarColor: '#016313',
                            },
                          ]}
                        />
                      </View>

                      <View
                        style={{
                          backgroundColor: 'white',
                          paddingVertical: 10,
                          shadowOffset: { width: 0, height: 5 },
                          shadowOpacity: 1,
                          shadowRadius: 5,
                          elevation: 10,
                          shadowColor: 'lightgrey',
                          marginTop: 60,
                          borderRadius: 10,
                          justifyContent: 'space-around',
                          marginHorizontal: 20,
                        }}
                      >
                        <Text
                          style={{
                            textAlign: 'left',
                            fontSize: 18,
                            marginLeft: 10,
                          }}
                        >
                          Attempt Analysis
                        </Text>
                        <AttemptAnalysis testResult={this.state.testResult} />
                      </View>
                      <View style={{ marginVertical: 20 }}>
                        {/* <BarChartNew questionsarray={this.state.questionsarray}/> */}
                        <TimeSpentChart testResult={this.state.testResult} />
                      </View>
                      <TouchableOpacity
                        onPress={this.onViewSolutions.bind(this)}
                        style={{
                          height: 40,
                          width: 200,
                          alignSelf: 'center',
                          marginVertical: 30,
                          paddingHorizontal: 20,
                          backgroundColor: colors.Themecolor,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 20,
                        }}
                      >
                        <Text style={{ color: 'white' }}>Review Answers</Text>
                      </TouchableOpacity>
                    </ScrollView>
                  </View>
                </View>
              )}
            </View>
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }
}
export default PrePaperSummary;
