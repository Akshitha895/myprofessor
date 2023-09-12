import React, { Component } from 'react';
import {
  BackHandler,
  Dimensions,
  Image,
  ImageBackground,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DeviceConstants from 'react-native-device-constants';

import moment from 'moment';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import { Actions } from 'react-native-router-flux';
import VideoQuestionModal from '../../components/VideoQuestionModal';
import VideoViewComponent from '../../components/VideoViewComponent';

import { baseUrl, colors } from '../../constants';
import StringsOfLanguages from '../../StringsOfLanguages';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class VideoView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinner: true,
      isvisible: false,
      newmodal: false,
      data: {},
      youtubedata: null,
      questionsArray: [],
      analyticsData: {},
      token: '',
      userDetails: '',
      showfullscreen: false,
      isLoading: true,
      questiondata: null,
      activityStartTime: null,
    };
  }
  componentDidMount() {
    const activityStartTime = moment().format('YYYY-MM-DD HH:mm:ss');
    this.setState({
      activityStartTime,
    });
    // setStartTime(activityStartTime)
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction
    );

    this.getData();
  }
  backAction = () => {
    // this.props.navigation.goBack(null);
    this.onBack();
    return true;
    // Actions.topicmainview({from:this.props.from,type:"reset",data:this.props.topicindata,topicsdata:this.props.topicData,screen:"summary",subjectData:this.props.subjectData})
  };

  getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@user');
      //  alert(JSON.stringify(value))
      if (value !== null) {
        var data = JSON.parse(value);

        const token = await AsyncStorage.getItem('@access_token');
        if (token && data) {
          this.setState(
            {
              token: JSON.parse(token),
              userDetails: data,
            },
            () => {
              this.getActivityInfo();
            }
          );
          // this.getanalytics(data,JSON.parse(token))
          // this.getVideoquestions(JSON.parse(token))
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

  updateAnalytics(newdata, duration) {
    console.log('adjbcjkadcjbd', this.props.topicindata, this.props.topicData);
    const { data, topicindata, topicData } = this.props;
    var body = {
      activityDimId: data.activityDimId,
      universityId: this.state.userDetails.userOrg.universityId,
      branchId: this.state.userDetails.userOrg.branchId,
      semesterId: this.state.userDetails.userOrg.semesterId,

      subjectId: topicData?.subjectId
        ? topicData.subjectId
        : topicindata?.subjectId
        ? topicindata.subjectId
        : null,
      chapterId: topicData?.chapterId
        ? topicData.chapterId
        : topicindata?.chapterId
        ? topicindata.chapterId
        : null,
      topicId: topicData?.topicId
        ? topicData.topicId
        : topicindata?.topicId
        ? topicindata.topicId
        : null,
      activityStartedAt: this.state.activityStartTime,
      activityEndedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      videoWatchedInSec: duration,
      videoPausedAt: newdata,
    };
    console.log('bodyyy', body);
    var userId = this.state.userDetails.userInfo.userId;
    var url = baseUrl + `/users/${userId}/analytics/capture-activity`;
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        jwt: this.state.token,
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log('kanckanCKACKD', JSON.stringify(json));
        if (json.data) {
          const data = json.data;

          this.setState({
            analyticsData: data,
          });
          //    Snackbar.show({
          // 	text: "Analytics Updated succesfully",
          // 	duration: Snackbar.LENGTH_SHORT,
          //   });
        } else {
          console.log(JSON.stringify(json.message));
        }
      })
      .catch((error) => console.error(error));
  }
  onNext1() {
    var newarray = this.props.smartres;
    var newobj = newarray[this.props.index + 1];
    var index = this.props.index;
    console.log('sdlkjfkaldjkladfjklad', this.props.index, ' ', newobj);
    if (newobj) {
      if (newobj.activityType === 'youtube') {
        Actions.push('videoview', {
          type: 'reset',
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
          type: 'reset',
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
          type: 'reset',
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
          type: 'reset',
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
          type: 'reset',
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
          type: 'reset',
          data: this.props.topicindata,
          topicsdata: this.props.topicData,
          screen: 'summary',
          subjectData: this.props.subjectData,
          from: this.props.from,
        });
      } else if (newobj.activityType === 'games') {
        Actions.push('games', {
          type: 'reset',
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
          type: 'reset',
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
        type: 'reset',
        data: this.props.topicindata,
        topicsdata: this.props.topicData,
        screen: 'summary',
        subjectData: this.props.subjectData,
        from: this.props.from,
      });
    }
  }
  onPrevious2() {
    var newarray = this.props.smartres;
    var newobj = newarray[this.props.index - 1];
    var index = this.props.index;
    console.log('ajdnfkjfkldfkljkdflkldf', this.props.index, ' ', newobj);
    if (newobj) {
      if (newobj.activityType === 'youtube') {
        Actions.push('videoview', {
          type: 'reset',
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
          type: 'reset',
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
          type: 'reset',
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
          type: 'reset',
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
          type: 'reset',
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
          type: 'reset',
          data: this.props.topicindata,
          topicsdata: this.props.topicData,
          screen: 'summary',
          subjectData: this.props.subjectData,
          from: this.props.from,
        });
      } else if (newobj.activityType === 'games') {
        Actions.push('games', {
          type: 'reset',
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
          type: 'reset',
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
        type: 'reset',
        data: this.props.topicindata,
        topicsdata: this.props.topicData,
        screen: 'summary',
        subjectData: this.props.subjectData,
        from: this.props.from,
      });
    }
  }

  getVideoquestions() {
    const { data } = this.props;
    var userId = this.state.userDetails.userInfo.userId;
    var activityDimId = data.activityDimId;
    var assignedActivityId = data.assignedActivityId;
    const url =
      baseUrl +
      `/analytics/users/${userId}/activities/${activityDimId}/videos/test-questions?assignedActivityId=${assignedActivityId}`;
    console.log('skcnkaldjFKAF', url);
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        jwt: this.state.token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        console.log('djakbckjadhjkldhvdas', json);
        if (json.data) {
          const data = json.data;
          console.log('youtubeeeevideeoeooo', data);
          this.setState({
            questionsArray: data,
            isLoading: false,
          });
        } else {
          //Toast.show(json.message, Toast.LONG);
          this.setState({ questionsArray: [], isLoading: false });
          // alert("My Professor"+JSON.stringify(json.message))
        }
      })
      .catch((error) => console.error(error));
  }
  getActivityInfo() {
    const { data } = this.props;
    var userId = this.state.userDetails.userInfo.userId;
    var activityDimId = data.activityDimId;
    const url =
      baseUrl + `/analytics/users/${userId}/activities/${activityDimId}`;
    fetch(url, {
      method: 'GET',
      headers: {
        jwt: this.state.token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        const data = json.data;
        console.log('youutbedattaaaaaa', data);

        if (data) {
          this.setState({ youtubedata: data }, () => this.getVideoquestions());
        } else {
          this.setState({ isLoading: false });
          // alert(JSON.stringify(json.message))
        }
      })
      .catch((error) => console.error(error));
  }
  onBackNew(data, duration) {
    console.log('fffff', data, 'vvv', duration);
    if (data) {
      this.updateAnalytics(data, duration);
    } else {
      this.updateAnalytics(0, duration);
    }
    Actions.topicmainview({
      type: 'reset',
      data: this.props.topicindata,
      topicsdata: this.props.topicData,
      screen: 'summary',
      subjectData: this.props.subjectData,
      from: this.props.from,
    });
  }
  onActivityNext(data, duration) {
    console.log('11111111', data, 'vvv', duration);
    if (data) {
      this.updateAnalytics(data, duration);
    } else {
      this.updateAnalytics(0);
    }
    this.onNext1();
  }
  onActivityPrevious(data, duration) {
    console.log('fffff', data, 'vvv', duration);
    if (data) {
      this.updateAnalytics(data, duration);
    } else {
      this.updateAnalytics(0);
    }
    this.onPrevious2();
  }
  onBack() {
    // alert(":hii")
    if (this.funcComRef) {
      this.funcComRef('gettime', 'Val');
    } else {
      Actions.pop({ type: 'reset' });
    }
    // this.refs.ve.getcurrentTime();
    //this.updateAnalytics()
  }
  onNext() {
    this.funcComRef('next');
  }
  onPrevious() {
    this.funcComRef('previous');
  }
  onOk() {
    this.setState(
      {
        isvisible: false,
      },
      () => Actions.push('postassesment')
    );
  }
  onCancel() {
    this.setState({
      isvisible: false,
    });
  }
  onPlayvideo() {
    Actions.push('video');
  }
  onPause(data) {
    console.log('dataaaajdjkd', data);
    this.setState(
      {
        data,
      },
      () => this.getQuestionbyid(data)
      //this.setState({ newmodal : true})
    );
  }
  getQuestionbyid(data) {
    // this.setState({ loading: true })
    var userId = this.state.userDetails.userInfo.userId;
    var activityDimId = this.props.data.activityDimId;
    var assignedActivityId = this.props.data.assignedActivityId;
    var index = data.index;
    //console.log("Sdksklafdsf", this.state.getquestionsdata[questionindex])
    var questionId = data.questionId;
    var testId = data.userTestId;

    var url =
      baseUrl +
      `/analytics/users/${userId}/activities/${activityDimId}/test-questions/${index}?assignedActivityId=${assignedActivityId}&userTestId=${testId}&questionId=${questionId}`;
    console.log('skldklskls', url);
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        jwt: this.state.token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        console.log('getquestiondetails', JSON.stringify(json));

        if (json) {
          if (json.code === 201) {
            this.setState(
              {
                questiondata: json.data,
              },
              () => {
                this.setState({
                  newmodal: true,
                });
              }
            );
          } else {
          }
        }
      });
  }
  onquestionSubmit(value) {
    this.setState(
      {
        newmodal: false,
      },
      () => this.funcComRef('questionsubmit', value)
    );
  }
  onRewatch() {
    this.setState(
      {
        newmodal: false,
      },
      () => this.funcComRef('rewatch', this.state.data)
    );
  }
  onfullscreen(value) {
    if (this.funcComRef) {
      //alert(this.refs.ve)
      this.setState(
        {
          showfullscreen: !this.state.showfullscreen,
        },
        () => this.funcComRef('fullscreen', this.state.showfullscreen)
      );
    }
  }
  render() {
    const { topicindata } = this.props;
    var stylefull;
    var width;
    var height;
    if (this.state.showfullscreen) {
      stylefull = {
        height: this.state.showfullscreen ? '100%' : '80%',
        alignSelf: 'center',
        backgroundColor: 'white',
        borderRadius: 20,
        width: '95%',
      };
      width = windowHeight;
      height = windowWidth;
    } else {
      stylefull = {
        flex: 0.84,
        backgroundColor: 'white',
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 20,
        overflow: 'hidden',
      };
      width = windowWidth;
      height = windowHeight;
    }
    const isTablet = DeviceConstants.isTablet; // false

    var headfont = 18,
      backheight = 25,
      subfont = 12,
      paddingver = 40,
      paddinghori = 10,
      radius = 20;
    if (isTablet) {
      //  Orientation.lockToLandscape()
      (headfont = 30),
        (backheight = 40),
        (subfont = 20),
        (paddingver = 50),
        (paddinghori = 20),
        (radius = 30);
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
              {this.state.showfullscreen ? null : (
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
                        }}
                      >
                        {this.props.data.name}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
              <View style={stylefull}>
                {!this.state.isLoading ? (
                  <VideoViewComponent
                    forwardRef={(c) => {
                      this.funcComRef = c;
                    }}
                    resourcedata={
                      this.props.data1 ? this.props.data1 : this.props.data
                    }
                    onActivityNext={this.onActivityNext.bind(this)}
                    onBackNew={this.onBackNew.bind(this)}
                    onActivityPrevious={this.onActivityPrevious.bind(this)}
                    onfullscreen={this.onfullscreen.bind(this)}
                    onPause={this.onPause.bind(this)}
                    data={this.state.youtubedata}
                    questionsArray={this.state.questionsArray}
                  />
                ) : (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text>{StringsOfLanguages.loading}</Text>
                  </View>
                )}
              </View>
              {this.state.showfullscreen ? null : this.state
                  .isLoading ? null : (
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
                      height: paddingver,
                      borderRadius: radius,
                      backgroundColor: 'white',
                      paddingHorizontal: paddinghori,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={this.onPrevious.bind(this)}
                  >
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: subfont,
                        color: colors.Themecolor,
                      }}
                    >
                      {StringsOfLanguages.previousactivity}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      height: paddingver,
                      borderRadius: radius,
                      backgroundColor: 'white',
                      paddingHorizontal: paddinghori,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={this.onNext.bind(this)}
                  >
                    {this.props.smartres[this.props.index + 1] ? (
                      <Text
                        style={{
                          textAlign: 'center',
                          fontSize: subfont,
                          color: colors.Themecolor,
                        }}
                      >
                        {StringsOfLanguages.nextactivity}
                      </Text>
                    ) : (
                      <Text
                        style={{
                          textAlign: 'center',
                          fontSize: subfont,
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
          {/* {this.state.showfullscreen ? null :
    <View style={{position:"absolute",height:44,backgroundColor:topicindata.color,paddingHorizontal:20,alignSelf:"center",
    borderRadius:20,top: Platform.OS === 'android' ? 90 : 100,justifyContent:"center",alignItems:"center"}}>
        <Text style={{color:"white",fontSize:17}}>{this.props.data.activity}</Text>
        </View>} */}
          <Modal isVisible={this.state.newmodal}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <VideoQuestionModal
                questiondata={this.state.questiondata}
                data={this.state.data}
                activitydata={this.props.data}
                userDetails={this.state.userDetails}
                onquestionSubmit={this.onquestionSubmit.bind(this, 20)}
                onRewatch={this.onRewatch.bind(this)}
              />
            </View>
          </Modal>
        </>
      </SafeAreaView>
    );
  }
}

export default VideoView;
