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

import AsyncStorage from '@react-native-async-storage/async-storage';
import getVideoId from 'get-video-id';
import moment from 'moment';
import Modal from 'react-native-modal';
import { Actions } from 'react-native-router-flux';
import ConceptVideoViewComponent from '../../components/ConceptVideoViewComponent';
import VideoQuestionModal from '../../components/VideoQuestionModal';
import { baseUrl, colors } from '../../constants';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class ConceptVideo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinner: true,
      isLoading: true,
      isvisible: false,
      newmodal: false,
      data: {},
      normalvideodata: null,
      questionsArray: null,
      analyticsData: {},
      token: '',
      showfullscreen: false,
      vimeothumbnailUrl: '',
      vimeoUrl: '',
      vimeovideo: '',
      questiondata: null,
      userDetails: '',
      activityStartTime: null,
    };
    this.videocomref = React.createRef();

    this.onRewatch = this.onRewatch.bind(this);
  }
  componentDidMount() {
    const activityStartTime = moment().format('YYYY-MM-DD HH:mm:ss');
    this.setState({
      activityStartTime,
    });
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
        } else {
          //console.log("hihii")
        }
      } else {
        alert('errorrr');
      }
    } catch (e) {
      return null;
    }
  };

  updateAnalytics(newdata, duration, type) {
    const { data, topicindata, topicData } = this.props;
    var body = {
      activityDimId: data.activityDimId,
      universityId: this.state.userDetails.userOrg.universityId,
      branchId: this.state.userDetails.userOrg.branchId,
      semesterId: this.state.userDetails.userOrg.semesterId,

      gradeId: this.state.userDetails.userOrg.gradeId,
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
    console.log(
      'dfnbdkjhfbkjhdbfkjdbfkj',
      body,
      baseUrl +
        `/users/${this.state.userDetails.userInfo.userId}/analytics/capture-activity`
    );
    var userId = this.state.userDetails.userInfo.userId;
    var url = baseUrl + `/users/${userId}/analytics/capture-activity`;
    console.log('dknckladkldf', url);
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
        if (json.code === 201) {
          const data = json.data;

          this.setState({
            analyticsData: data,
          });
        } else {
          console.log(JSON.stringify(json.message));
        }
      })
      .catch((error) => console.error(error));
  }
  onBackNew(data, duration) {
    console.log('axcsdafafdafa', data, 'vvv', duration);
    if (data) {
      this.updateAnalytics(data, duration, 'topics');
    } else {
      this.updateAnalytics(0, 0, 'topics');
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
      this.updateAnalytics(data, duration, 'next');
    } else {
      this.updateAnalytics(0, 0, 'next');
    }
    this.onNext1();
  }
  onActivityPrevious(data, duration) {
    console.log('previoussssssssss', data, 'vvv', duration);
    if (data) {
      this.updateAnalytics(data, duration, 'previous');
    } else {
      this.updateAnalytics(0, 0, 'previous');
    }
    this.onPrevious2();
  }
  getVideoquestions() {
    const { data } = this.props;
    var userId = this.state.userDetails.userInfo.userId;
    var activityDimId = data.activityDimId;
    var assignedActivityId = data.assignedActivityId;
    const url =
      baseUrl +
      `/analytics/users/${userId}/activities/${activityDimId}/videos/test-questions?assignedActivityId=${assignedActivityId}`;
    //console.log("skcnkaldjFKAF",url)
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        jwt: this.state.token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        // console.log("conceotvideo..jhvhghjgjhgh..", json)
        if (json.data) {
          const data = json.data;
          // console.log("youtubeeeevideeoeooo....", data)
          this.setState({
            questionsArray: data.questions,
            isLoading: false,
          });
        } else {
          this.setState({
            questionsArray: [],
            isLoading: false,
          });
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
        const data = json;
        console.log('videodataaa.......a', data);

        if (json.data) {
          const data = json.data;
          // console.log("videodataaaa",data.url)
          var VIMEO_ID = getVideoId(data.url);
          fetch(`https://player.vimeo.com/video/${VIMEO_ID.id}/config`, {
            method: 'GET',
            headers: {
              Referer:
                'http://my-professor-ui-test.s3-website.ap-south-1.amazonaws.com/',
            },
          })
            .then((res) => res.json())
            .then((res) => {
              // console.log("ddjf",res);
              if (res.title === 'Sorry') {
                this.setState({ normalvideodata: data, isLoading: true }, () =>
                  this.getVideoquestions(json.data)
                );
              } else {
                this.setState(
                  {
                    vimeothumbnailUrl: res.video.thumbs['640'],
                    vimeoUrl:
                      res.request.files.hls.cdns[
                        res.request.files.hls.default_cdn
                      ].url,
                    vimeovideo: res.video,
                    normalvideodata: data,
                    isLoading: true,
                  },
                  () => this.getVideoquestions(json.data)
                );
              }
              //
            })
            .catch((err) => {
              this.setState({ normalvideodata: null, isLoading: false });
            });
        } else {
          this.setState({ normalvideodata: null, isLoading: false });
        }
      })
      .catch((error) => console.error(error));
  }
  onActivityPreviousfirst() {
    if (this.state.normalvideodata) {
      this.funcComRef('previous', 'Val');
    } else {
      this.onActivityPrevious(null);
    }
  }
  onActivityNextfirst() {
    if (this.state.normalvideodata) {
      this.funcComRef('next', 'Val');
    } else {
      this.onActivityNext(null);
    }
  }
  onBack() {
    if (this.state.normalvideodata) {
      this.funcComRef('gettime', 'Val');
    } else {
      this.onBackNew(null);
    }
    //this.refs.ve.getcurrentTime();
    //  this.updateAnalytics();
    //  Actions.topicmainview({type:"reset",data:this.props.topicindata,topicsdata:this.props.topicData,screen:"summary",subjectData:this.props.subjectData,from :this.props.from})
  }
  onNewBack() {
    this.setState(
      {
        newmodal: false,
      },
      () => {
        // Actions.topicmainview({data:this.props.topicindata,topicsdata:this.props.topicData,screen:"summary",subjectData:this.props.subjectData})
      }
    );
  }
  onNext1() {
    var newarray = this.props.smartres;
    var newobj = newarray[this.props.index + 1];
    var index = this.props.index;
    //console.log("sdlkjfkaldjkladfjklad",this.props.index," ",newobj)
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
    //console.log("dfnlajdkfjkdhflkdfhkldfkld",this.props.index, " " ,newobj)
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
    //console.log("dataaaajdjkd",data)
    this.setState(
      {
        data,
      },
      () => this.getQuestionbyid(data)
    );
    //thi
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
    //  console.log("skldklskls", url)
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        jwt: this.state.token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        //  console.log("getquestiondetails", JSON.stringify(json))

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
  onquestionSubmit = (value) => {
    //s console.log("dklkdjfkdjfk",NormalVideoViewComponent)
    this.setState(
      {
        newmodal: false,
      },
      () => this.funcComRef('questionsubmit', value)
    );
    // this.refs.ve.onquestionSubmit(value))
  };
  onRewatch() {
    //  console.log("onreeeee",NormalVideoViewComponent.pausedtime)
    this.setState(
      {
        newmodal: false,
      },
      () => this.funcComRef('rewatch', this.state.data)
      //this.videocomref.onRewatch(this.state.data)
      // setTimeout(() => {
      //   this.refs.ve.onRewatch(this.state.data)
      // }, 200)
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
      //this.refs.ve.handlescreenfull(this.state.showfullscreen))
    }
  }

  render() {
    const { topicindata } = this.props;
    //  console.log("skjjkafhkjdhfkldfkldshfkldsjfkljklf",topicindata)
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
      <>
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
                  <ConceptVideoViewComponent
                    forwardRef={(c) => {
                      this.funcComRef = c;
                    }}
                    resourcedata={
                      this.props.data1 ? this.props.data1 : this.props.data
                    }
                    vimeoUrl={this.state.vimeoUrl}
                    onActivityNext={this.onActivityNext.bind(this)}
                    onBackNew={this.onBackNew.bind(this)}
                    onActivityPrevious={this.onActivityPrevious.bind(this)}
                    onfullscreen={this.onfullscreen.bind(this)}
                    questionsArray={this.state.questionsArray}
                    onBack={this.onNewBack.bind(this)}
                    onPause={this.onPause.bind(this)}
                    data={this.state.normalvideodata}
                  />
                ) : (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ fontSize: subfont }}>Loading...</Text>
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
                    onPress={this.onActivityPreviousfirst.bind(this)}
                  >
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: subfont,
                        color: colors.Themecolor,
                      }}
                    >
                      Previous Activity
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
                    onPress={this.onActivityNextfirst.bind(this)}
                  >
                    {this.props.smartres[this.props.index + 1] ? (
                      <Text
                        style={{
                          textAlign: 'center',
                          fontSize: subfont,
                          color: colors.Themecolor,
                        }}
                      >
                        Next Activity
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
        </SafeAreaView>
      </>
    );
  }
}

export default ConceptVideo;
