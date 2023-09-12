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
import DeviceConstants from 'react-native-device-constants';
import { Actions } from 'react-native-router-flux';

import AsyncStorage from '@react-native-async-storage/async-storage';
import RNSpeedometer from 'react-native-speedometer';
import AssessmentComparisonChart from '../../components/AssessmentComparisonChart';
import TimeSpentChart from '../../components/TimeSpentChart';
import { baseUrl, colors } from '../../constants';
import styles from './styles';
import AttemptAnalysis from './AttemptAnalysis';

const windowWidth = Dimensions.get('window').width;

class PreSummary extends Component {
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
      testResult: null,
      review: false,
      prepostdata: {},
      noprepostdata: false,
      loadingspi: true,
    };
  }
  componentDidMount() {
    //alert("typeeee"+JSON.stringify(this.props.testtype))
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction
    );

    if (this.props.review) {
      this.setState({
        review: true,
      });
    }
    this.getData();
  }
  backAction = () => {
    // alert(this.state.review)
    if (this.props.review) {
      Actions.pop({ type: 'reset' });
    } else {
      Actions.topicmainview({
        type: 'reset',
        data: this.props.topicindata,
        topicsdata: this.props.topicData,
        screen: 'summary',
        subjectData: this.props.subjectData,
        from: this.props.from,
      });
    }
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
          this.setState({ token: JSON.parse(token) }, () => {
            this.getprevspost(data, JSON.parse(token));
            this.getreport();
          });
          //  this.getDataquestions(data, JSON.parse(token))
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
    var activityDimId = this.props.activtydata.activityDimId;
    var assignedActivityId = this.props.activtydata.assignedActivityId;
    var userTestId = this.props.testid;
    var url =
      baseUrl +
      `/analytics/users/${userId}/assessments/${userTestId}/report?activityDimId=${activityDimId}`;
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
  getprevspost(user, token) {
    // console.log("graphhh",baseUrl+"/analytics/student/preVsPost/"+this.props.topicindata.reference_id)
    var url = baseUrl + `/analytics/student/PrePostAssessmentReport`;
    console.log('scbnsabcjsa', url);
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        jwt: token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        console.log('lndsvlsdfk', json);
        /// const data = json.data;

        if (json) {
          if (json.code === 201) {
            this.setState({
              prepostdata: json.data,
              loadingspi: false,
            });
          } else {
            //  alert("jh")
            this.setState({
              prepostdata: [],
              noprepostdata: true,
              loadingspi: false,
            });
          }
        } else {
          this.setState({ prepostdata: {}, loadingspi: false });

          //  alert(JSON.stringify(json.message))
        }
      })
      .catch((error) => alert('gggg' + error));
  }

  onBack() {
    // alert(JSON.stringify(this.props.topicData))
    Actions.topicmainview({
      type: 'reset',
      data: this.props.topicindata,
      topicsdata: this.props.topicData,
      screen: 'summary',
      subjectData: this.props.subjectData,
      from: this.props.from,
    });
    //Actions.main()
  }
  onPrevious() {
    var newarray = this.props.smartres;
    var newobj = newarray[this.props.index - 1];
    var index = this.props.index;
    console.log('onprevious', this.props.index, ' ', newobj);
    if (newobj) {
      if (newobj.activityType === 'youtube') {
        Actions.push('videoview', {
          index: index - 1,
          smartres: this.props.smartres,
          data: newobj,
          topicData: this.props.topicData,
          subjectData: this.props.subjectData,
          topicindata: this.props.topicindata,
          from: this.props.from,
        });
      } else if (newobj.activityType === 'video') {
        Actions.push('normalvideoview', {
          index: index - 1,
          smartres: this.props.smartres,
          data: newobj,
          topicData: this.props.topicData,
          subjectData: this.props.subjectData,
          topicindata: this.props.topicindata,
          from: this.props.from,
        });
      } else if (
        newobj.activityType === 'obj' ||
        newobj.activityType === 'post' ||
        newobj.activityType === 'sub'
      ) {
        Actions.push('preassesment', {
          index: index - 1,
          smartres: this.props.smartres,
          data: newobj,
          topicData: this.props.topicData,
          subjectData: this.props.subjectData,
          topicindata: this.props.topicindata,
          from: this.props.from,
        });
      } else if (
        newobj.activityType === 'pdf' ||
        newobj.activityType === 'html5'
      ) {
        Actions.push('pdfview', {
          index: index - 1,
          smartres: this.props.smartres,
          data: newobj,
          topicData: this.props.topicData,
          subjectData: this.props.subjectData,
          topicindata: this.props.topicindata,
          from: this.props.from,
        });
      } else if (
        newobj.activityType === 'web' ||
        newobj.activityType === 'exploratory_learning'
      ) {
        Actions.push('weblinkview', {
          index: index - 1,
          smartres: this.props.smartres,
          data: newobj,
          topicData: this.props.topicData,
          subjectData: this.props.subjectData,
          topicindata: this.props.topicindata,
          from: this.props.from,
        });
      } else if (newobj.activityType === 'pre') {
        Actions.topicmainview({
          data: this.props.topicindata,
          topicsdata: this.props.topicData,
          screen: 'summary',
          subjectData: this.props.subjectData,
          from: this.props.from,
        });
      } else if (newobj.activityType === 'games') {
        Actions.push('games', {
          index: index - 1,
          smartres: this.props.smartres,
          data: newobj,
          topicData: this.props.topicData,
          subjectData: this.props.subjectData,
          topicindata: this.props.topicindata,
          from: this.props.from,
        });
      } else if (newobj.activityType === 'conceptual_video') {
        Actions.push('conceptvideo', {
          index: index - 1,
          smartres: this.props.smartres,
          data: newobj,
          topicData: this.props.topicData,
          subjectData: this.props.subjectData,
          topicindata: this.props.topicindata,
          from: this.props.from,
        });
      }
    } else {
      Actions.topicmainview({
        data: this.props.topicindata,
        topicsdata: this.props.topicData,
        screen: 'summary',
        subjectData: this.props.subjectData,
        from: this.props.from,
      });
    }
  }
  onNext() {
    var newarray = this.props.smartres;
    var newobj = newarray[this.props.index + 1];
    var index = this.props.index;
    console.log('next', this.props.index, ' ', newobj);
    if (newobj) {
      if (newobj.activityType === 'youtube') {
        Actions.push('videoview', {
          index: index + 1,
          smartres: this.props.smartres,
          data: newobj,
          topicData: this.props.topicData,
          subjectData: this.props.subjectData,
          topicindata: this.props.topicindata,
          from: this.props.from,
        });
      } else if (newobj.activityType === 'video') {
        Actions.push('normalvideoview', {
          index: index + 1,
          smartres: this.props.smartres,
          data: newobj,
          topicData: this.props.topicData,
          subjectData: this.props.subjectData,
          topicindata: this.props.topicindata,
          from: this.props.from,
        });
      } else if (
        newobj.activityType === 'obj' ||
        newobj.activityType === 'post' ||
        newobj.activityType === 'sub'
      ) {
        Actions.push('preassesment', {
          index: index + 1,
          smartres: this.props.smartres,
          data: newobj,
          topicData: this.props.topicData,
          subjectData: this.props.subjectData,
          topicindata: this.props.topicindata,
          from: this.props.from,
        });
      } else if (
        newobj.activityType === 'pdf' ||
        newobj.activityType === 'html5'
      ) {
        Actions.push('pdfview', {
          index: index + 1,
          smartres: this.props.smartres,
          data: newobj,
          topicData: this.props.topicData,
          subjectData: this.props.subjectData,
          topicindata: this.props.topicindata,
          from: this.props.from,
        });
      } else if (
        newobj.activityType === 'web' ||
        newobj.activityType === 'exploratory_learning'
      ) {
        Actions.push('weblinkview', {
          index: index + 1,
          smartres: this.props.smartres,
          data: newobj,
          topicData: this.props.topicData,
          subjectData: this.props.subjectData,
          topicindata: this.props.topicindata,
          from: this.props.from,
        });
      } else if (newobj.activityType === 'pre') {
        Actions.topicmainview({
          data: this.props.topicindata,
          topicsdata: this.props.topicData,
          screen: 'summary',
          subjectData: this.props.subjectData,
          from: this.props.from,
        });
      } else if (newobj.activityType === 'games') {
        Actions.push('games', {
          index: index + 1,
          smartres: this.props.smartres,
          data: newobj,
          topicData: this.props.topicData,
          subjectData: this.props.subjectData,
          topicindata: this.props.topicindata,
          from: this.props.from,
        });
      } else if (newobj.activityType === 'conceptual_video') {
        Actions.push('conceptvideo', {
          index: index + 1,
          smartres: this.props.smartres,
          data: newobj,
          topicData: this.props.topicData,
          subjectData: this.props.subjectData,
          topicindata: this.props.topicindata,
          from: this.props.from,
        });
      }
    } else {
      Actions.topicmainview({
        data: this.props.topicindata,
        topicsdata: this.props.topicData,
        screen: 'summary',
        subjectData: this.props.subjectData,
        from: this.props.from,
      });
    }
  }
  onViewSolutions() {
    Actions.push('presolutions', {
      activtydata: this.props.activtydata,
      testid: this.props.testid,
      data: this.props.topicindata,
      topicsdata: this.props.topicData,
      screen: 'summary',
      subjectData: this.props.subjectData,
      from: this.props.from,
    });
  }
  render() {
    const { topicindata } = this.props;
    const isTablet = DeviceConstants.isTablet; // false
    var backheight = 25,
      headfont = 18,
      meterwidth = windowWidth / 1.5,
      reviewheight = 40,
      reviewwidth = 200,
      newviewheight = windowWidth / 2,
      flexview = 0.08;
    if (isTablet) {
      (backheight = 40),
        (headfont = 28),
        (meterwidth = windowWidth / 2.2),
        (reviewheight = 60),
        (reviewwidth = 300),
        (newviewheight = windowWidth / 2.8),
        (flexview = 0.1);
    }

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
            <View style={{ flex: flexview, flexDirection: 'row' }}>
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
                      style={{
                        width: backheight,
                        height: backheight,
                        tintColor: 'white',
                      }}
                    />
                  </TouchableOpacity>

                  <Text
                    style={{
                      color: 'white',
                      fontSize: headfont,
                      marginLeft: 20,
                    }}
                  >
                    {this.props.testtype === 'POST'
                      ? 'Post-Test Analysis'
                      : this.props.testtype === 'PRE'
                      ? 'Pre-Test Analysis'
                      : 'Summary'}
                  </Text>
                </View>
              </View>
            </View>

            <View
              style={{
                flex: this.state.review ? 0.9 : 0.84,
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
                  <Text style={{ fontSize: headfont }}>Loading...</Text>
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
                          height: newviewheight,
                        }}
                      >
                        <Text
                          style={{
                            textAlign: 'left',
                            fontSize: headfont,
                            marginLeft: 10,
                          }}
                        >
                          Performace
                        </Text>

                        <RNSpeedometer
                          size={meterwidth}
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
                          labelNoteStyle={{ fontSize: headfont }}
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
                            fontSize: headfont,
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
                      {this.props.testtype === 'post' ? (
                        !this.state.loadingspi ? (
                          this.state.noprepostdata ? null : (
                            <AssessmentComparisonChart
                              topicPreVsPostData={this.state.prepostdata}
                            />
                          )
                        ) : null
                      ) : null}
                      {this.props.activtydata.activityType === 'pre' ? null : (
                        <TouchableOpacity
                          onPress={this.onViewSolutions.bind(this)}
                          style={{
                            height: reviewheight,
                            width: reviewwidth,
                            alignSelf: 'center',
                            marginVertical: 30,
                            paddingHorizontal: 20,
                            backgroundColor: colors.Themecolor,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 20,
                          }}
                        >
                          <Text style={{ color: 'white', fontSize: headfont }}>
                            Review Answers
                          </Text>
                        </TouchableOpacity>
                      )}
                    </ScrollView>
                  </View>
                </View>
              )}
            </View>
            {this.state.review ? null : (
              <View
                style={{
                  flex: 0.08,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginLeft: 10,
                  marginRight: 10,
                  alignItems: 'center',
                }}
              >
                <TouchableOpacity
                  style={{
                    height: 30,
                    borderRadius: 20,
                    backgroundColor: 'white',
                    paddingHorizontal: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={this.onPrevious.bind(this)}
                >
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 12,
                      color: colors.Themecolor,
                    }}
                  >
                    Previous Activity
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    height: 30,
                    borderRadius: 20,
                    backgroundColor: 'white',
                    paddingHorizontal: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={this.onNext.bind(this)}
                >
                  {this.props.smartres[this.props.index + 1] ? (
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: 12,
                        color: colors.Themecolor,
                      }}
                    >
                      Next Activity
                    </Text>
                  ) : (
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: 12,
                        color: colors.Themecolor,
                      }}
                    >
                      Done
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }
}
export default PreSummary;
