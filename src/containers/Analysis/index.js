import React, { Component } from 'react';
import {
  SafeAreaView,
  ImageBackground,
  ScrollView,
  View,
  Text,
  BackHandler,
  Dimensions,
  Image,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as _ from 'lodash';
import { Actions } from 'react-native-router-flux';
import RNSpeedometer from 'react-native-speedometer';
const windowWidth = Dimensions.get('window').width;
import * as Progress from 'react-native-progress';
const windowHeight = Dimensions.get('window').height;
import AsyncStorage from '@react-native-async-storage/async-storage';
import Drawer from 'react-native-drawer';
import ActivityRings from 'react-native-activity-rings';
import DeviceConstants from 'react-native-device-constants';
import { baseUrl } from '../../constants';
import SideMenu from '../../components/SideMenu';
import StringsOfLanguages from '../../StringsOfLanguages';
import Footer from '../../components/Footer';
import { colors } from '../../constants';

class Analysis extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: {},
      subjectsData: null,
      spinner: true,
      chaptersData: [],
      chapterAvgData: [],
      loading: false,
      piesections: [],
      piesectiondatacount: null,
      pieloading: true,
      allavergae: '',
      allsectiondata: [],
      mainsubjects: [],
      allSubjectData: [],
      user: {},
      blommsData: '',
      bloomsloading: false,
      speedometercount: 0,
      pieloading: true,
      bloomsectioncount: null,
      learningAnalysisSubjectAveragesData: {},
      chapterlist: [],
    };
  }
  async componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction
    );
    this.getData();
  }
  backAction = () => {
    Actions.dashboard();
    return true;
  };
  componentWillUnmount() {
    this.backHandler.remove();
  }
  getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@user');

      if (value !== null) {
        var data = JSON.parse(value);
        const token = await AsyncStorage.getItem('@access_token');
        if (token) {
          this.setState({
            token: JSON.parse(token),
            user: data,
          });
          this.getSubjects(data, JSON.parse(token));
        } else {
        }
      } else {
        console.log('errorr');
      }
    } catch (e) {
      return null;
    }
  };
  getSubjects(user, toekn) {
    var userId = user.userInfo.userId;
    var url = baseUrl + `/analytics/users/${userId}/assessment/subjects`;
    var body = {
      universityId: user.userOrg.universityId,
      branchId: user.userOrg.branchId,
      semesterId: user.userOrg.semesterId,
      offset: 0,
      limit: 10000,
    };
    console.log('value', url, 'dvnklsdnvklsd', body);
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        jwt: toekn,
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.code === 201) {
          if (json.data) {
            console.log('analysis subjects', json);
            const data = json.data;
            if (data.items.length > 0) {
              let newArray = data.items;
              var newarray1 = [];
              var count = 0;
              data.items.map((res, i) => {
                count = count + res.percent;
                var obj = {
                  y: 20,
                  x: +parseInt(res.progress) + '%',
                  name: res.name,
                };
                newarray1.push(obj);
              });

              this.setState({
                allsectiondata: newarray1,
                allavergae: Math.floor(count / data.items.length),
              });
              console.log('dknflkdaf', newArray);
              this.setState(
                {
                  spinner: false,
                  mainsubjects: data.items,
                  subjectsData: newArray,
                  selectedTab: newArray[0],
                  loading: true,
                },
                () => this.getChapter(user, toekn)
              );
            } else {
              this.setState({
                spinner: false,
                subjectsData: [],
                selectedTab: {},
              });
            }
          } else {
            alert(JSON.stringify(json.message));
            this.setState({
              spinner: false,
              subjectsData: [],
              selectedTab: {},
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
  getChapter() {
    this.getprevioustestdata();
    this.getpiechatdata();
  }

  getpiechatdata() {
    const { user, token } = this.state;
    var url;
    var userId = user.userInfo.userId;
    var subjectId = this.state.selectedTab.subjectId;
    console.log('uuuuuuuuuuuuuuu', this.state.selectedTab);
    this.setState({ pieloading: true });
    var url =
      baseUrl +
      `/subjects/${subjectId}/learning-analysis/averages?userId=${userId}`;

    console.log('1111111', url);
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        jwt: token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        console.log('dnfdnkd', json);
        const data = json.data;
        if (data) {
          if (data) {
            var count = 0;
            var subjectTaxonomyData = data?.bloomTaxonamyAverage;
            if (subjectTaxonomyData && subjectTaxonomyData?.length > 0) {
              var colorsarray = [
                '#6A5177',
                '#A3BA6D',
                '#D88212',
                '#F94D48',
                '#D19DE6',
                '#30A6DC',
              ];
              var newarraynew = [];
              var count = 0;
              const questionsTotal = subjectTaxonomyData
                .map((tb) => +tb.totalQuestions)
                .reduce((pv, cv) => pv + cv, 0);
              data.bloomTaxonamyAverage.map((res, i) => {
                var obj = {
                  label: res.questionType,
                  value: res.totalQuestions
                    ? parseFloat((+res.totalQuestions * 100) / questionsTotal) /
                      100
                    : 0,
                  totalQuestions: res.totalQuestions,
                  color: colorsarray[i],
                  backgroundColor: 'lightgrey',
                };

                newarraynew.push(obj);
              });

              console.log('dacbjdcbjadc', newarraynew);
              this.setState({
                blommsData: newarraynew,
                learningAnalysisSubjectAveragesData: data,
                pieloading: false,
              });
            } else {
              var newarry = [
                {
                  label: 'Analyze',
                  value: 0,
                  totalQuestions: 0,
                  color: '#6A5177',
                  backgroundColor: 'lightgrey',
                },
                {
                  label: 'Understand',
                  value: 0,
                  totalQuestions: 0,
                  color: '#A3BA6D',
                  backgroundColor: 'lightgrey',
                },
                {
                  label: 'Remember',
                  value: 0,
                  totalQuestions: 0,
                  color: '#D88212',
                  backgroundColor: 'lightgrey',
                },
                {
                  label: 'Apply',
                  value: 0,
                  totalQuestions: 0,
                  color: '#F94D48',
                  backgroundColor: 'lightgrey',
                },
                {
                  label: 'Evaluate',
                  value: 0,
                  totalQuestions: 0,
                  color: '#D19DE6',
                  backgroundColor: 'lightgrey',
                },
              ];
              this.setState({
                learningAnalysisSubjectAveragesData: null,
                pieloading: false,
                blommsData: [],
              });
            }
          } else {
            this.setState({
              learningAnalysisSubjectAveragesData: null,
              pieloading: false,
            });
          }
        } else {
          alert(JSON.stringify(json.message));
          this.setState({
            piesections: [],
            pieloading: false,
          });
        }
      })
      .catch((error) => console.error(error));
  }
  getprevioustestdata() {
    const { user, token } = this.state;

    var userId = user.userInfo.userId;
    var subjectId = this.state.selectedTab.subjectId;
    var url =
      baseUrl +
      `/universities/${user.userOrg.universityId}/subjects/${subjectId}/practice-tests?userId=${userId}`;
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        jwt: token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        if (json?.data) {
          console.log('dknfcjkadnfkaf', json.data);
          var previousTestsData = json.data;
          if (
            previousTestsData &&
            previousTestsData?.userPracticeTest?.length
          ) {
            let testChapters = [];
            let uniqueTestChapters = _.uniqBy(
              previousTestsData?.userPracticeTest,
              'chapterId'
            );
            uniqueTestChapters = uniqueTestChapters.map((ctc) => {
              return { ...ctc, testType: ctc.testType.toLowerCase() };
            });
            const previousTestChapters = _.sortBy(
              uniqueTestChapters,
              (o) => o.testType
            );
            previousTestChapters.map((up, i) => {
              if (i !== previousTestChapters.length - 1) {
                testChapters.push({
                  ...up,
                  name: up.chapterName,
                  index: up.chapterIndex,
                });
              }
            });
            const chapterList = _.sortBy(testChapters, 'index');
            console.log('kdfkdafk', chapterList);
            this.setState(
              {
                chapterlist: chapterList,
              },
              () => this.getChaptersdata()
            );
          }
        }
      })
      .catch((error) => console.error(error));
  }
  getChaptersdata() {
    const { user, token } = this.state;
    var url;
    var userId = user.userInfo.userId;
    var subjectId = this.state.selectedTab.subjectId;
    (url =
      baseUrl + `/subjects/${subjectId}/learning-analysis?userId=${userId}`),
      fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          jwt: token,
        },
      })
        .then((response) => response.json())
        .then((json) => {
          const data = json.data;
          console.log('sss', data);
          if (json) {
            if (json.data) {
              var listChapters = this.state.chapterlist;
              //  console.log("sdsadsdsd", listChapters.length)

              var learningAnalysisSubjectData = json.data;
              if (learningAnalysisSubjectData?.length > 0) {
                if (listChapters.length > 0) {
                  var chapterAvgData = listChapters.map((chapter, i) => {
                    const chapterInfo = !_.isEmpty(learningAnalysisSubjectData)
                      ? learningAnalysisSubjectData?.find(
                          (chp) => chp.chapterId === chapter.chapterId
                        )
                      : null;

                    let diffLevelAnalysisObj = {};
                    const diffLevelObj = {
                      Easy: 0,
                      Medium: 0,
                      Hard: 0,
                    };
                    console.log('chapterInfochapterInfo', chapterInfo);
                    if (chapterInfo) {
                      Object.keys(diffLevelObj).map((diffLevel) => {
                        const questionObj = chapterInfo?.diffLevelAnalysis.find(
                          (ut) => ut.diffLevel === diffLevel
                        );
                        diffLevelAnalysisObj[diffLevel] =
                          questionObj?.totalQuestions || 0;
                      });

                      return {
                        avgQueTime: Math.round(chapterInfo.averageTimeTaken),
                        correctAnswer: chapterInfo.totalQuestions
                          ? chapterInfo.totalQuestions -
                            chapterInfo.totalWrongQuestions
                          : 0,
                        easy:
                          parseInt(diffLevelAnalysisObj.Easy * 100) /
                          parseInt(chapterInfo.totalQuestions),
                        hard:
                          parseInt(diffLevelAnalysisObj.Hard * 100) /
                          parseInt(chapterInfo.totalQuestions),
                        index: i + 1,
                        medium:
                          parseInt(diffLevelAnalysisObj.Medium * 100) /
                          parseInt(chapterInfo.totalQuestions),
                        name: chapterInfo.chapterName,
                        testAttempts: chapter.totalTestsAttempted,
                        totalQuestions: chapterInfo.totalQuestions,
                        testAttempts: chapterInfo?.totalTestsAttempted || 0,
                        totalQuestions: chapterInfo?.totalQuestions || 0,
                      };
                    } else {
                      console.log('m,,dcnjan,cjanjkankank', chapter);
                      return {
                        avgQueTime: 0,
                        correctAnswer: 0,
                        easy: 0,
                        hard: 0,
                        index: i + 1,
                        medium: 0,
                        name: chapter.chapterName,
                        testAttempts: 0,
                        totalQuestions: 0,
                        testAttempts: 0,
                        totalQuestions: 0,
                      };
                    }
                  });
                  console.log('chapterAvgData,f,', chapterAvgData);
                  // chapterAvgData = chapterAvgData.filter(function( element ) {
                  //     return element !== undefined;
                  //  });
                  console.log('newchaptersdata,f,', chapterAvgData);

                  this.setState({
                    chaptersData: learningAnalysisSubjectData,
                    loading: false,
                    chapterAvgData,
                  });
                }
              } else {
                var chapterAvgData = listChapters.map((chapter, i) => {
                  return {
                    avgQueTime: 0,
                    correctAnswer: 0,
                    easy: 0,
                    hard: 0,
                    index: i + 1,
                    medium: 0,
                    name: chapter.chapterName,
                    testAttempts: 0,
                    totalQuestions: 0,
                    testAttempts: 0,
                    totalQuestions: 0,
                  };
                });
                console.log('mdncjanc,', chapterAvgData);
                this.setState({
                  loading: false,
                  chaptersData: [],
                  chapterAvgData,
                });
              }
            }
          } else {
            this.setState({
              loading: false,
              chaptersData: [],
              chapterAvgData: [],
            });
          }
        })
        .catch((error) => console.error(error));
  }

  onBack() {
    Actions.pop();
  }
  onTab(res) {
    console.log('snckanckc', res);
    this.setState(
      {
        selectedTab: res,
      },
      () => {
        this.getprevioustestdata();
        this.getpiechatdata();
      }
    );
  }
  closeControlPanel = () => {
    this._drawer.close();
  };
  openControlPanel = () => {
    this._drawer.open();
  };
  render() {
    const isTablet = DeviceConstants.isTablet; // false
    var headfont = 20,
      backgeight = 30,
      subwidth = 40,
      subview = 75,
      normalfont = 15,
      meterwidth = windowWidth / 1.5,
      headingfont = 18,
      absandroidheight = windowHeight / 1.15,
      activityConfig = {
        width: 300,
        height: 300,
        radius: 32,
        ringSize: 12,
      },
      ringcirc = 10,
      ringfont = 15,
      chaptersize = 18,
      chapterinnersize = 15,
      progresswidth = windowWidth / 2,
      drawerwidth = 100,
      topflex = 0.2,
      bottomflex = 0.8;

    if (isTablet) {
      (headfont = 30),
        (backgeight = 45),
        (subwidth = 50),
        (subview = 95),
        (normalfont = 20),
        (meterwidth = windowWidth / 2.4),
        (headingfont = 25),
        (topflex = 0.3),
        (bottomflex = 0.7),
        (activityConfig = {
          width: 400,
          height: 400,
          radius: 42,
          ringSize: 22,
        }),
        (absandroidheight = windowHeight / 1.2),
        (ringcirc = 20),
        (ringfont = 20),
        (chaptersize = 25),
        (chapterinnersize = 20),
        (progresswidth = windowWidth / 1.7),
        (drawerwidth = 700);
    }
    return (
      <>
        <SafeAreaView style={{ flex: 1 }}>
          <Drawer
            type="overlay"
            ref={(ref) => (this._drawer = ref)}
            tapToClose
            openDrawerOffset={drawerwidth}
            content={<SideMenu closeControlPanel={this.closeControlPanel} />}
          >
            <ImageBackground
              source={require('../../assets/images/dashboard/new/learningbg.png')}
              style={{ width: '100%', height: 288 }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 20,
                  marginLeft: 10,
                  alignItems: 'center',
                }}
              >
                <TouchableOpacity onPress={this.onBack.bind(this)}>
                  <Image
                    source={require('../../assets/images/left-arrow.png')}
                    style={{
                      width: backgeight,
                      height: backgeight,
                      tintColor: 'white',
                    }}
                  />
                </TouchableOpacity>
                <Text
                  style={{ color: 'white', marginLeft: 20, fontSize: headfont }}
                >
                  {StringsOfLanguages.learninganalysis}
                </Text>
              </View>
            </ImageBackground>
            <View
              style={{
                height:
                  Platform.OS === 'android'
                    ? absandroidheight
                    : windowHeight / 1.2,
                width: windowWidth,
                backgroundColor: 'white',
                alignSelf: 'center',
                position: 'absolute',
                bottom: 0,
                borderTopRightRadius: 20,
                borderTopLeftRadius: 20,
                overflow: 'hidden',
              }}
            >
              {this.state.spinner ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <ActivityIndicator color={'black'} />
                </View>
              ) : (
                <View style={{ flex: 1 }}>
                  <View style={{ flex: 0.98 }}>
                    <View style={{ flex: 1, paddingTop: 20 }}>
                      <View
                        style={{
                          flex: topflex,
                          flexDirection: 'row',
                          borderBottomWidth: 1,
                          borderColor: 'lightgrey',
                        }}
                      >
                        <ScrollView
                          horizontal
                          showsHorizontalScrollIndicator={false}
                        >
                          {this.state.subjectsData.map((res, i) => {
                            return (
                              <TouchableOpacity
                                key={i}
                                onPress={this.onTab.bind(this, res)}
                                style={{
                                  borderBottomWidth: 3,
                                  borderColor:
                                    this.state.selectedTab.name === res.name
                                      ? '#A44084'
                                      : 'transparent',
                                  paddingHorizontal: 10,
                                  marginHorizontal: 10,
                                  justifyContent: 'center',
                                }}
                              >
                                <View
                                  style={{
                                    width: subview,
                                    height: subview,
                                    borderRadius: subview / 2,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                    backgroundColor: colors.Themecolor,
                                  }}
                                >
                                  {res.image ? (
                                    <Image
                                      source={{ uri: res.image }}
                                      style={{
                                        width: subwidth,
                                        height: subwidth,
                                        alignSelf: 'center',
                                      }}
                                    />
                                  ) : (
                                    <Image
                                      source={require('../../assets/images/logo_icon1.png')}
                                      style={{
                                        width: subwidth,
                                        height: subwidth,
                                        alignSelf: 'center',
                                      }}
                                    />
                                  )}
                                </View>
                                <Text
                                  style={{
                                    fontSize: normalfont,
                                    textAlign: 'center',
                                    color: colors.Themecolor,
                                    paddingTop: Platform.OS === 'ios' ? 10 : 0,
                                  }}
                                >
                                  {res.name}
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                        </ScrollView>
                      </View>

                      <View style={{ flex: bottomflex, flexDirection: 'row' }}>
                        {this.state.loading ? (
                          <View
                            style={{
                              flex: 1,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            <ActivityIndicator color={'black'} />
                          </View>
                        ) : (
                          <ScrollView>
                            <View style={{ flex: 1, paddingTop: 20 }}>
                              <Text
                                style={{
                                  marginVertical: 10,
                                  textAlign: 'center',
                                  fontWeight: 'bold',
                                  fontSize: headingfont,
                                }}
                              >
                                Course Progress Average
                              </Text>

                              <RNSpeedometer
                                size={meterwidth}
                                minValue={0}
                                maxValue={100}
                                value={
                                  this.state.learningAnalysisSubjectAveragesData
                                    ?.subjectAverage?.averageScore
                                    ? Math.round(
                                        this.state
                                          .learningAnalysisSubjectAveragesData
                                          ?.subjectAverage?.averageScore
                                      )
                                    : 0
                                }
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
                            <View style={{ marginTop: 70 }}>
                              {this.state.blommsData.length > 0 ? (
                                <>
                                  <Text
                                    style={{
                                      marginVertical: 10,
                                      textAlign: 'center',
                                      fontWeight: 'bold',
                                      fontSize: headingfont,
                                    }}
                                  >
                                    {`Bloom's Taxonomy Average`}
                                  </Text>

                                  <ActivityRings
                                    data={this.state.blommsData}
                                    config={activityConfig}
                                  />
                                  <View
                                    style={{
                                      flexDirection: 'row',
                                      flexWrap: 'wrap',
                                      marginHorizontal: 30,
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                    }}
                                  >
                                    {this.state.blommsData.map((res, i) => (
                                      <View
                                        key={i}
                                        style={{
                                          flexDirection: 'row',
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                          marginLeft: 10,
                                        }}
                                      >
                                        <View
                                          style={{
                                            width: ringcirc,
                                            height: ringcirc,
                                            borderRadius: ringcirc / 2,
                                            backgroundColor: res.color,
                                          }}
                                        />
                                        <Text
                                          style={{
                                            marginLeft: 5,
                                            fontSize: ringfont,
                                          }}
                                        >
                                          {res.label}
                                        </Text>
                                        <Text
                                          style={{
                                            marginLeft: 5,
                                            fontSize: ringfont,
                                          }}
                                        >
                                          {'('}
                                          {Math.round(res.value * 100)}
                                          {'%)'}
                                        </Text>
                                      </View>
                                    ))}
                                  </View>
                                </>
                              ) : null}
                            </View>
                            {this.state.chapterAvgData.map((res, i) => (
                              <View
                                key={i}
                                style={{
                                  paddingVertical: 20,
                                  width: windowWidth,
                                  marginVertical: 5,
                                  backgroundColor: 'white',
                                  alignSelf: 'center',
                                  borderBottomWidth: 1,
                                  borderColor: '#DFDFDF',
                                  justifyContent: 'center',
                                }}
                              >
                                <Text
                                  style={{
                                    marginLeft: 20,
                                    fontSize: chaptersize,
                                  }}
                                >
                                  {res.name}
                                </Text>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-evenly',
                                    marginTop: 30,
                                  }}
                                >
                                  <View>
                                    <Image
                                      source={require('../../assets/images/dashboard/new/correct.png')}
                                      style={{
                                        width: 40,
                                        height: 40,
                                        alignSelf: 'center',
                                        resizeMode: 'contain',
                                      }}
                                    />
                                    <Text
                                      style={{
                                        textAlign: 'center',
                                        color: '#656565',
                                        fontSize: chapterinnersize,
                                      }}
                                    >
                                      {StringsOfLanguages.correct}
                                    </Text>
                                    <Text
                                      style={{
                                        textAlign: 'center',
                                        color: '#656565',
                                        fontWeight: 'bold',
                                        fontSize: chapterinnersize,
                                      }}
                                    >
                                      {res.correctAnswer}/{res.totalQuestions}
                                    </Text>
                                  </View>
                                  <View>
                                    <Image
                                      source={require('../../assets/images/dashboard/new/attempted.png')}
                                      style={{
                                        width: 40,
                                        height: 40,
                                        alignSelf: 'center',
                                        resizeMode: 'contain',
                                      }}
                                    />
                                    <Text
                                      style={{
                                        textAlign: 'center',
                                        color: '#656565',
                                        fontSize: chapterinnersize,
                                      }}
                                    >
                                      {StringsOfLanguages.attempted}
                                    </Text>
                                    <Text
                                      style={{
                                        textAlign: 'center',
                                        color: '#656565',
                                        fontWeight: 'bold',
                                        fontSize: chapterinnersize,
                                      }}
                                    >
                                      {res.testAttempts}
                                    </Text>
                                  </View>
                                  <View>
                                    <Image
                                      source={require('../../assets/images/dashboard/new/speed.png')}
                                      style={{
                                        width: 40,
                                        height: 40,
                                        alignSelf: 'center',
                                        resizeMode: 'contain',
                                      }}
                                    />
                                    <Text
                                      style={{
                                        textAlign: 'center',
                                        color: '#656565',
                                        fontSize: chapterinnersize,
                                      }}
                                    >
                                      {StringsOfLanguages.avgspeed}
                                    </Text>
                                    <Text
                                      style={{
                                        textAlign: 'center',
                                        color: '#656565',
                                        fontWeight: 'bold',
                                        fontSize: chapterinnersize,
                                      }}
                                    >
                                      {res.avgQueTime}s
                                    </Text>
                                  </View>
                                </View>
                                <View
                                  style={{
                                    marginTop: 30,
                                    marginHorizontal: 20,
                                  }}
                                >
                                  <View>
                                    <View style={{ flexDirection: 'row' }}>
                                      <View
                                        style={{
                                          flex: 0.2,
                                          justifyContent: 'center',
                                        }}
                                      >
                                        <Text
                                          style={{
                                            textAlign: 'left',
                                            fontSize: chapterinnersize,
                                            color: '#88C400',
                                          }}
                                        >
                                          {StringsOfLanguages.easy}
                                        </Text>
                                      </View>
                                      <View
                                        style={{
                                          flex: 0.65,
                                          justifyContent: 'center',
                                        }}
                                      >
                                        <Progress.Bar
                                          progress={Math.round(res.easy) / 100}
                                          width={progresswidth}
                                          height={10}
                                          borderColor={'#88C400'}
                                          color={'#88C400'}
                                          //  color={res.easy > 80 ? "#88C400" : 50 < res.easy < 30 ? "#0A7FD7" : "#FE3939"}
                                        />
                                      </View>
                                      <View
                                        style={{
                                          flex: 0.15,
                                          justifyContent: 'center',
                                        }}
                                      >
                                        <Text
                                          style={{
                                            textAlign: 'center',
                                            fontSize: chapterinnersize,
                                          }}
                                        >
                                          {Math.round(res.easy)}%
                                        </Text>
                                      </View>
                                    </View>

                                    <View
                                      style={{
                                        flexDirection: 'row',
                                        marginTop: 20,
                                      }}
                                    >
                                      <View
                                        style={{
                                          flex: 0.2,
                                          justifyContent: 'center',
                                        }}
                                      >
                                        <Text
                                          style={{
                                            textAlign: 'left',
                                            fontSize: chapterinnersize,
                                            color: '#0A7FD7',
                                          }}
                                        >
                                          {StringsOfLanguages.medium}
                                        </Text>
                                      </View>
                                      <View
                                        style={{
                                          flex: 0.65,
                                          justifyContent: 'center',
                                        }}
                                      >
                                        <Progress.Bar
                                          progress={
                                            Math.round(res.medium) / 100
                                          }
                                          width={progresswidth}
                                          height={10}
                                          borderColor={'#0A7FD7'}
                                          color={'#0A7FD7'}
                                          //color={res.medium > 80 ? "#88C400" : 50 < res.medium < 30 ? "#0A7FD7" : "#FE3939"}
                                        />
                                      </View>
                                      <View
                                        style={{
                                          flex: 0.15,
                                          justifyContent: 'center',
                                        }}
                                      >
                                        <Text
                                          style={{
                                            textAlign: 'center',
                                            fontSize: chapterinnersize,
                                          }}
                                        >
                                          {Math.round(res.medium)}%
                                        </Text>
                                      </View>
                                    </View>

                                    <View
                                      style={{
                                        flexDirection: 'row',
                                        marginTop: 20,
                                      }}
                                    >
                                      <View
                                        style={{
                                          flex: 0.2,
                                          justifyContent: 'center',
                                        }}
                                      >
                                        <Text
                                          style={{
                                            textAlign: 'left',
                                            fontSize: chapterinnersize,
                                            color: '#FE3939',
                                          }}
                                        >
                                          {StringsOfLanguages.hard}
                                        </Text>
                                      </View>
                                      <View
                                        style={{
                                          flex: 0.65,
                                          justifyContent: 'center',
                                        }}
                                      >
                                        <Progress.Bar
                                          progress={Math.round(res.hard) / 100}
                                          width={progresswidth}
                                          height={10}
                                          borderColor={'#FE3939'}
                                          color={'#FE3939'}
                                          // color={res.hard < 30 ? "#FE3939" : res.hard < 70 ? "#0A7FD7" : "#88C400"}
                                        />
                                      </View>
                                      <View
                                        style={{
                                          flex: 0.15,
                                          justifyContent: 'center',
                                        }}
                                      >
                                        <Text
                                          style={{
                                            textAlign: 'center',
                                            fontSize: chapterinnersize,
                                          }}
                                        >
                                          {Math.round(res.hard)}%
                                        </Text>
                                      </View>
                                    </View>
                                  </View>
                                </View>
                              </View>
                            ))}
                          </ScrollView>
                        )}
                      </View>
                    </View>
                  </View>
                  <View style={{ flex: 0.12 }}>
                    <Footer openControlPanel={this.openControlPanel} />
                  </View>
                </View>
              )}
            </View>
          </Drawer>
        </SafeAreaView>
      </>
    );
  }
}
export default Analysis;
