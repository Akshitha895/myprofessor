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

//import styles from "./styles"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Actions } from 'react-native-router-flux';
import { VictoryPie } from 'victory-native';
import { baseUrl, colors } from '../../constants';
import ColumnChart from './ColumnChart.js';
import TimeSpentChart from './TimeSpentChart';
const windowWidth = Dimensions.get('window').width;

// var graphicData = [
//   { y: 20, x: '20%', name: 'Incomplete' },
//   { y: 90, x: '90%', name: 'Complete' },
// ];
class TopicAnalysis extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinner: true,
      isvisible: false,
      weblinkdata: null,
      analyticsData: {},
      token: '',
      topicpercentarray: [],
      topicactivitesdata: [],
      tableHead: [],
      tableData: [],
      quesloading: true,
      loading: true,
      studenteasydaata: {},
      timespinner: true,
      timespentquestions: [],
      graphvalue: 0,
      userDetails: '',
      topicAnalysisData: '',
    };
  }
  componentDidMount() {
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
      //  alert(JSON.stringify(value))
      if (value !== null) {
        var data = JSON.parse(value);

        const token = await AsyncStorage.getItem('@access_token');
        if (token && data) {
          this.setState({
            token: JSON.parse(token),
            userDetails: data,
          });
          this.getTopicAnalysis();
          //this.getassesmentanalysis()
          //this.getquestionstimespent()
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
  getquestionstimespent() {
    ///student/questionsAnalysis/${topicCode}`
    console.log(
      'gggggg',
      baseUrl + '/student/questionsAnalysis/' + this.props.data.reference_id
    );
    fetch(
      baseUrl + '/student/questionsAnalysis/' + this.props.data.reference_id,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          token: this.state.token,
        },
      }
    )
      .then((response) => response.json())
      .then((json) => {
        //st data = json.data;
        console.log('newwwwwwwww', json);
        if (json.data) {
          this.setState({
            timespentquestions: json.data,
            timespinner: false,
          });
        } else {
          this.setState({
            timespentquestions: [],
            timespinner: false,
          });
        }
      })
      .catch((error) => console.error(error));
  }
  getassesmentanalysis() {
    console.log('ddddd', this.props.data.reference_id);
    //  https://api.iconeducate.com/student/assessmentAnalysis/b2ab5c8d-92fc-4597-a7e6-6
    fetch(
      baseUrl + '/student/assessmentAnalysis/' + this.props.data.reference_id,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          token: this.state.token,
        },
      }
    )
      .then((response) => response.json())
      .then((json) => {
        //st data = json.data;
        console.log('json.datajson.data', json.data);
        if (json.data) {
          const studentTopicPerformanceAnalysisData = json.data;
          if (studentTopicPerformanceAnalysisData?.qusType) {
            let questionAnalysis = [];
            Object.keys(studentTopicPerformanceAnalysisData.qusType).map(
              (key) => {
                let obj = studentTopicPerformanceAnalysisData.qusType[key];
                questionAnalysis.push({
                  skill: key,
                  total: obj.correct + obj.wrong,
                  correct: obj.correct,
                  wrong: obj.wrong,
                });
              }
            );
            console.log('tabledata', questionAnalysis);

            let finalsample = [];
            questionAnalysis.map((res, i) => {
              let sample = [];
              sample.push(res.skill);
              sample.push(res.total);
              sample.push(res.correct);
              sample.push(res.wrong);
              finalsample.push(sample);
            });
            var tableHead = [
              'Skills',
              'Total Questions',
              'No Of Correct Questions',
              'No Of Wrong Questions',
            ];
            var tableData = finalsample;
            console.log('tableHead', tableHead);
            console.log('tabledataaaa', tableData);

            this.setState({
              tableHead,
              tableData,
              studenteasydaata: studentTopicPerformanceAnalysisData,
              quesloading: false,
            });
          }
        } else {
        }
      })
      .catch((error) => console.error(error));
  }
  getTopicAnalysis() {
    console.log('admnladfjlkdafhl', this.props.data);
    var userId = this.state.userDetails.userInfo.userId;
    var topicId = this.props.data.topicId;
    var universalTopicId = this.props.data.universalTopicId;
    console.log(
      'dcnjdnvlkncvkld',
      baseUrl +
        `/analytics/users/${userId}/topics/${topicId}/analysis?universalTopicId=${universalTopicId}`
    );
    fetch(
      baseUrl +
        `/analytics/users/${userId}/topics/${topicId}/analysis?universalTopicId=${universalTopicId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          jwt: this.state.token,
        },
      }
    )
      .then((response) => response.json())
      .then((json) => {
        //st data = json.data;
        console.log('topicanalysis data', json.data);
        if (json.code === 201) {
          var topicAnalysisData = json.data;
          if (json.data.topicProgress?.totalProgress) {
            var completion = parseInt(json.data.topicProgress.totalProgress);
            console.log(
              '.anvkdjnvkc',
              completion,
              Math.round(100 - completion)
            );
            var completepercent = completion ? Math.round(completion) : 0;
            var incompletepercent = completion
              ? Math.round(100 - completion)
              : 100;
            var obj1 = {
              y: incompletepercent,
              x: incompletepercent + '%',
              name: 'Incomplete',
            };
            var obj2 = {
              y: completepercent,
              x: completepercent + '%',
              name: 'Complete',
            };
            var newarr = [];
            newarr.push(obj1);
            newarr.push(obj2);
            console.log('ffff.....', newarr);
            this.setState({
              topicpercentarray: newarr,
              loading: false,
            });
          } else {
            var obj1 = { y: 100, x: 100 + '%', name: 'Incomplete' };
            var obj2 = { y: 0, x: 0 + '%', name: 'Complete' };
            var newarr = [];
            newarr.push(obj1);
            newarr.push(obj2);

            this.setState({
              topicpercentarray: newarr,
              loading: false,
              //quesloading: false
            });
          }
          if (topicAnalysisData?.userTestQuestions?.length) {
            console.log('kcmkjckxjcdfk');
            var timeSpentData = json.data.timeSpent;
            let progressItemList = [];
            if (timeSpentData?.length > 0) {
              const timeSpendActivities = timeSpentData.filter(
                (tsd) => !['pre', 'post'].includes(tsd.activityType)
              );
              const totalSpentTime = timeSpendActivities.reduce(
                (accum, item) => accum + Math.round(item.timeSpent),
                0
              );
              timeSpendActivities.map((tsd) => {
                let keyName = !['pre', 'post'].includes(tsd.activityType)
                  ? tsd.activityType === 'conceptual_video'
                    ? 'CONCEPTUAL VIDEO'
                    : tsd.activityType === 'html5'
                    ? 'NOTES'
                    : tsd.activityType
                  : '';
                if (keyName) {
                  let progressItem = {
                    name: keyName.toUpperCase(),
                    y: Math.round((tsd.timeSpent * 100) / totalSpentTime), //tsd.timeSpent / totalSpentTime,
                    value: tsd,
                    percent: (tsd.timeSpent / totalSpentTime).toFixed(2) * 100,
                  };
                  progressItemList.push(progressItem);
                }
              });
            }
            var graphvalue = 0;
            progressItemList =
              progressItemList && progressItemList.filter((pl) => pl.y !== 0);
            progressItemList.map((res, i) => {
              graphvalue = graphvalue + res.percent;
            });
            console.log('dafhjdhfkld', graphvalue);

            if (topicAnalysisData?.userTestQuestions?.length) {
              var diffLevelTopicAnalysisObj = {};
              var questionAnalysis = [];
              const queTypeObj = {
                Remember: 0,
                Understand: 0,
                Apply: 0,
                Analyze: 0,
                Evaluate: 0,
                Create: 0,
              };
              Object.keys(queTypeObj).map((qType) => {
                const correctQuestionsCount =
                  topicAnalysisData.userTestQuestions.filter(
                    (ut) => ut.score === 0 && ut.questionType === qType
                  ).length;
                const wrongQuestionsCount =
                  topicAnalysisData.userTestQuestions.filter(
                    (ut) => ut.score !== 0 && ut.questionType === qType
                  ).length;
                questionAnalysis.push({
                  skill: qType,
                  total: correctQuestionsCount + wrongQuestionsCount,
                  correct: correctQuestionsCount,
                  wrong: wrongQuestionsCount,
                });
              });
              let finalsample = [];
              questionAnalysis.map((res, i) => {
                let sample = [];
                sample.push(res.skill);
                sample.push(res.total);
                sample.push(res.correct);
                sample.push(res.wrong);
                finalsample.push(sample);
              });
              var tableHead = [
                'Skills',
                'Total Questions',
                'No Of Correct Questions',
                'No Of Wrong Questions',
              ];
              var tableData = finalsample;
              console.log('tableHead', tableHead);
              console.log('tabledataaaa', tableData);
              // { correct: 1, inCorrect: 2, unAnswered: 0 }

              const diffLevelObj = {
                Easy: 0,
                Medium: 0,
                Hard: 0,
              };
              Object.keys(diffLevelObj).map((diffLevel) => {
                const correctQuestionsCount =
                  topicAnalysisData.userTestQuestions.filter(
                    (ut) => ut.score === 1 && ut.diffLevel === diffLevel
                  ).length;
                const wrongQuestionsCount =
                  topicAnalysisData.userTestQuestions.filter(
                    (ut) => ut.score === 0 && ut.diffLevel === diffLevel
                  ).length;
                diffLevelTopicAnalysisObj[diffLevel] = {
                  correct: correctQuestionsCount,
                  inCorrect: wrongQuestionsCount,
                };
              });
              console.log('dancjladnckldaf', diffLevelTopicAnalysisObj);
            }

            this.setState(
              {
                topicanalysisdata: json.data,
                topicactivitesdata: progressItemList,
                graphvalue,
                tableHead,
                tableData,
                studenteasydaata: diffLevelTopicAnalysisObj,

                //studenteasydaata: studentTopicPerformanceAnalysisData,

                // queAnalysisData: questionAnalysis,
                // topicAnalysisData: topicAnalysisData,
                // diffLevelTopicAnalysis: diffLevelTopicAnalysisObj
              },
              () => {
                this.setState({
                  // topicpercentarray: newarr,
                  loading: false,
                  // graphvalue: graphvalue,

                  // quesloading:false
                });
                if (tableData || diffLevelTopicAnalysisObj) {
                  this.setState({
                    quesloading: false,
                  });
                }
              }
            );
            // console.log(".dksnack.acnk",diffLevelTopicAnalysisObj,questionAnalysis)
          } else {
            this.setState({
              quesloading: false,
            });
          }
        } else if (json.error?.code === 400) {
          //alert("dknkdf")
          Alert.alert('My Professor', json.error.message, [
            { text: 'OK', onPress: () => this.logout() },
          ]);
        }
      })
      .catch((error) => console.error(error));
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
    //alert("hiii")
    Actions.pop();
    // Actions.topics({ type: "reset", data: this.props.topicsdata, subjectData: this.props.subjectData })
  }

  render() {
    const { data } = this.props;
    var colorarray = [
      '#F94D48',
      '#30A6DC',
      '#C44921',
      '#734F96',
      '#D19DE6',
      '#734F96',
      '#6A5177',
      '#A3BA6D',
    ];
    const isTablet = DeviceConstants.isTablet; // false
    var backheight = 30,
      headfont = 20,
      subfont = 15,
      paddingver = 10,
      pieheight = 300,
      pieinner = 60,
      smallcirlce = 10,
      smallfont = 12;
    if (isTablet) {
      (backheight = 40),
        (headfont = 30),
        (subfont = 25),
        (paddingver = 20),
        (pieheight = 400),
        (pieinner = 90),
        (smallcirlce = 20),
        (smallfont = 20);
    }
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <>
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
              <View style={{ flex: 0.1, flexDirection: 'row' }}>
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
                        marginLeft: 10,
                        marginRight: 20,
                      }}
                    >
                      {data.name} Analysis
                    </Text>
                  </View>
                </View>
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
                <ScrollView>
                  {this.state.loading ? (
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{ fontSize: subfont }}>Loading...</Text>
                    </View>
                  ) : (
                    <>
                      <View
                        style={{
                          width: windowWidth / 1.25,
                          backgroundColor: colors.Themecolor,
                          alignSelf: 'center',
                          borderRadius: 10,
                          marginVertical: 10,
                        }}
                      >
                        <Text
                          style={{
                            textAlign: 'center',
                            paddingVertical: paddingver,
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: subfont,
                          }}
                        >
                          Topic Analysis
                        </Text>
                      </View>
                      {this.state.topicpercentarray.length > 0 ? (
                        <>
                          <VictoryPie
                            data={this.state.topicpercentarray}
                            // width={250}
                            height={pieheight}
                            innerRadius={pieinner}
                            animate={{
                              duration: 2000,
                            }}
                            labels={({ datum }) => null}
                            labelRadius={({ innerRadius }) => innerRadius + 5}
                            colorScale={['#F94D48', '#A3BA6D']}
                            style={{
                              labels: {
                                fill: 'white',
                                fontSize: 15,
                                fontWeight: 'bold',
                                marginLeft: 8,
                              },
                            }}
                          />
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-evenly',
                            }}
                          >
                            {this.state.topicpercentarray.map((res, i) => (
                              <View
                                key={i}
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'center',
                                }}
                              >
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                  }}
                                >
                                  <View
                                    style={{
                                      height: smallcirlce,
                                      width: smallcirlce,
                                      borderRadius: smallcirlce / 2,
                                      backgroundColor:
                                        res.name === 'Incomplete'
                                          ? '#F94D48'
                                          : '#A3BA6D',
                                    }}
                                  />
                                  <Text
                                    style={{
                                      marginLeft: 8,
                                      fontSize: smallfont,
                                    }}
                                  >
                                    {res.name}({res.x})
                                  </Text>
                                </View>
                              </View>
                            ))}
                          </View>
                        </>
                      ) : (
                        <Text style={{ textAlign: 'center' }}>No Data</Text>
                      )}
                      {this.state.graphvalue > 0 ? (
                        <>
                          <VictoryPie
                            data={this.state.topicactivitesdata}
                            // width={250}
                            height={pieheight}
                            innerRadius={0}
                            animate={{
                              duration: 2000,
                            }}
                            labels={({ datum }) => null}
                            colorScale={colorarray}
                            // style={{ labels: { fill: "white", fontSize: 15, fontWeight: "bold" , marginLeft:8} }}
                          />
                          <View
                            style={{
                              flexDirection: 'row',
                              marginHorizontal: 30,
                              flexWrap: 'wrap',
                              marginBottom: 20,
                              justifyContent: 'center',
                            }}
                          >
                            {this.state.topicactivitesdata.map((res, i) =>
                              res.value ? (
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginLeft: 10,
                                  }}
                                >
                                  <View
                                    style={{
                                      height: smallcirlce,
                                      width: smallcirlce,
                                      borderRadius: smallcirlce / 2,
                                      backgroundColor: colorarray[i],
                                    }}
                                  />
                                  <Text
                                    style={{
                                      marginLeft: 8,
                                      fontSize: smallfont,
                                    }}
                                  >
                                    {res.name}({parseInt(res.percent)}%)
                                  </Text>
                                </View>
                              ) : null
                            )}
                          </View>
                        </>
                      ) : null}

                      <>
                        <View
                          style={{
                            width: windowWidth / 1.25,
                            backgroundColor: colors.Themecolor,
                            alignSelf: 'center',
                            borderRadius: 10,
                            marginVertical: 10,
                          }}
                        >
                          <Text
                            style={{
                              textAlign: 'center',
                              paddingVertical: paddingver,
                              fontWeight: 'bold',
                              color: 'white',
                              fontSize: subfont,
                            }}
                          >
                            Performance Analysis By Question Difficulty
                          </Text>
                        </View>
                        {this.state.quesloading ? (
                          <View
                            style={{
                              flex: 1,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            <Text style={{ fontSize: headfont }}>
                              Loading...
                            </Text>
                          </View>
                        ) : (
                          <>
                            <ColumnChart
                              type="Easy"
                              question={this.state.studenteasydaata?.Easy}
                            />

                            <ColumnChart
                              type="Medium"
                              question={this.state.studenteasydaata?.Medium}
                            />

                            <ColumnChart
                              type="Hard"
                              question={this.state.studenteasydaata?.Hard}
                            />
                            {this.state.loading ? (
                              <View
                                style={{
                                  flex: 1,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}
                              >
                                <Text style={{ fontSize: headfont }}>
                                  Loading...
                                </Text>
                              </View>
                            ) : (
                              <>
                                <View
                                  style={{
                                    width: windowWidth / 1.25,
                                    backgroundColor: colors.Themecolor,
                                    alignSelf: 'center',
                                    borderRadius: 10,
                                    marginVertical: 10,
                                  }}
                                >
                                  <Text
                                    style={{
                                      textAlign: 'center',
                                      paddingVertical: paddingver,
                                      color: 'white',
                                      fontWeight: 'bold',
                                      fontSize: subfont,
                                    }}
                                  >
                                    Time Taken For Each Question
                                  </Text>
                                </View>
                                <TimeSpentChart
                                  topicsTimeTakenData={
                                    this.state.topicanalysisdata
                                  }
                                />
                              </>
                            )}
                          </>
                        )}
                      </>
                    </>
                  )}
                </ScrollView>
              </View>
            </View>
          </ImageBackground>
        </>
      </SafeAreaView>
    );
  }
}

export default TopicAnalysis;
