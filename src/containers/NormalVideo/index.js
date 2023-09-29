import React, { Component } from 'react';
import {
  Alert,
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
import Modal from 'react-native-modal';
import { Actions } from 'react-native-router-flux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NormalVideoViewComponent from '../../components/NormalVideoViewComponent/newindex';
import VideoQuestionModal from '../../components/VideoQuestionModal';
import { baseUrl, colors } from '../../constants';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class NormalVideo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinner: true,
      isvisible: false,
      newmodal: false,
      data: {},
      normalvideodata: null,
      questionsArray: null,
      analyticsData: {},
      token: '',
      showfullscreen: false,
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
    // this.getanalytics();
  }
  backAction = () => {
    // this.props.navigation.goBack(null);
    this.onBack();
    return true;
    // Actions.topicmainview({from:this.props.from,type:"reset",data:this.props.topicindata,topicsdata:this.props.topicData,screen:"summary",subjectData:this.props.subjectData})
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
          this.setState(
            {
              token: JSON.parse(token),
              userDetails: data,
            },
            () => this.getanalytics()
          );
          console.log('dmnvcjsad,nv', token);
          // this.getanalytics(JSON.parse(token));
          // this.getVideoquestions();
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
  getanalytics() {
    var url =
      baseUrl +
      '/analytics/users/' +
      this.props.userId +
      '/activities/' +
      this.props.data.activityDimId;
    console.log('value', url);
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        jwt: this.state.token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.data) {
          const data = json.data;
          //   alert(JSON.stringify(json));
          this.setState({
            normalvideodata: data,
          });
          //  Snackbar.show({
          // text: json.message,
          // duration: Snackbar.LENGTH_SHORT,
          // });
        } else {
          console.log(JSON.stringify(json.message));
        }
      })
      .catch((error) => console.error(error));
  }
  updateAnalytics(newdata, duration) {
    console.log('mmmmmm', newdata, this.state.userDetails);
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
    // var body = {
    //   activity_status: 0,
    //   video_played: Math.round(data),
    //   pdf_page: 0,
    //   video_duration: Math.round(duration),
    // };
    // console.log('bodyyy', body, baseUrl + '/analytics/' + this.props.userId);
    // var url = baseUrl + '/analytics/' + this.props.userId;
    // fetch(url, {
    //   method: 'PUT',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     token: this.state.token,
    //   },
    //   body: JSON.stringify(body),
    // })
    //   .then((response) => response.json())
    //   .then((json) => {
    //     if (json.data) {
    //       const data = json.data;
    //       console.log(JSON.stringify(json));
    //       this.setState({
    //         analyticsData: data,
    //       });
    //       //    Snackbar.show({
    //       // 	text: "Analytics Updated succesfully",
    //       // 	duration: Snackbar.LENGTH_SHORT,
    //       //   });
    //     } else {
    //       console.log(JSON.stringify(json.message));
    //     }
    //   })
    //   .catch((error) => console.error(error));
  }
  onBackNew(data, duration) {
    console.log('sasasaa', data, 'vvv', duration);
    if (data) {
      this.updateAnalytics(data, duration);
    } else {
      this.updateAnalytics(0, 0);
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
  onActivityNext(currentTime, duration) {
    console.log('11111111', currentTime, 'vvv', duration);
    if (currentTime) {
      this.updateAnalytics(currentTime, duration);
    } else {
      this.updateAnalytics(0, 0);
    }
    this.onNext1();
  }
  onActivityPrevious(data, duration) {
    console.log('previoussssssssss', data, 'vvv', duration);
    if (data) {
      this.updateAnalytics(data, duration);
    } else {
      this.updateAnalytics(0, 0);
    }
    this.onPrevious1();
  }
  getVideoquestions() {
    const body = {
      test_type: 'Video',
      assignedactivityId: this.props.data.reference_id,
    };
    const url = baseUrl + '/user-test';
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: this.state.token,
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log('dncad,nvkdnkvd', json);
        if (json.data) {
          const data = json.data;
          console.log('youtubeeeevideeoeooo', data);
          this.setState(
            {
              questionsArray: data.questions,
            },
            () => this.getActivityInfo()
          );
          // this.setState({normalvideodata: data1})
        } else {
          this.setState(
            {
              questionsArray: [],
            },
            () => this.getActivityInfo()
          );
          //Toast.show(json.message, Toast.LONG);
          // alert("My Professor"+JSON.stringify(json.message))
        }
      })
      .catch((error) => console.error(error));
  }
  getActivityInfo() {
    //  alert(JSON.stringify(this.props.data))
    const { data } = this.props;
    const url = baseUrl + '/activities/forStudent/' + data.id; //baseUrl+"/activities/info/" + data.reference_id
    fetch(url, {
      method: 'GET',
      headers: {
        // 'Content-Type': 'application/json',
        // 'Access-Control-Allow-Origin' : "https://api.iqcandy.com",
        // 'Access-Control-Allow-Credentials' : "true",

        token: this.state.token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        const data = json.data;
        console.log('videodataaaa', json);

        if (data) {
          this.setState({ normalvideodata: data });
          // this.getVideoquestions(data[0],token)
          //console.log("videoviewwwww", data[0])
        } else if (json.error) {
          Alert.alert('My Professor', 'No  Video Found', [
            {
              text: 'OK',
              onPress: () =>
                Actions.topicmainview({
                  type: 'reset',
                  data: this.props.topicindata,
                  topicsdata: this.props.topicData,
                  screen: 'summary',
                  subjectData: this.props.subjectData,
                  from: this.props.from,
                }),
            },
          ]);
        } else {
          alert(JSON.stringify(json.message));
        }
      })
      .catch((error) => console.error(error));
  }
  onActivityPreviousfirst() {
    this.funcComRef('previous', 'Val');
  }
  onActivityNextfirst() {
    if (this.state.normalvideodata) {
      this.funcComRef('next', 'Val');
    } else {
      this.onActivityNext(null);
    }
  }
  onBack() {
    this.funcComRef('gettime', 'Val');
    //this.refs.ve.getcurrentTime();
    // this.updateAnalytics();
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
    //    this.updateAnalytics()
    var newarray = this.props.smartres;
    var newobj = newarray[this.props.index + 1];
    var index = this.props.index;
    // alert(JSON.stringify(newobj));
    if (newobj) {
      if (newobj.activityType === 'youtube') {
        Actions.videoview({
          type: 'reset',
          index: index + 1,
          smartres: this.props.smartres,
          data: newobj,
          topicData: this.props.topicData,
          subjectData: this.props.subjectData,
          topicindata: this.props.topicindata,
          from: this.props.from,
          data1: this.props.data,
        });
      } else if (newobj.activityType === 'video') {
        Actions.normalvideoview({
          type: 'reset',
          type: 'reset',
          index: index + 1,
          smartres: this.props.smartres,
          data: newobj,
          topicData: this.props.topicData,
          subjectData: this.props.subjectData,
          topicindata: this.props.topicindata,
          from: this.props.from,
          data1: this.props.data,
        });
      } else if (
        newobj.activityType === 'pre' ||
        newobj.activityType === 'obj' ||
        newobj.activityType === 'post' ||
        newobj.activityType === 'sub'
      ) {
        Actions.preassesment({
          type: 'reset',
          index: index + 1,
          smartres: this.props.smartres,
          data: newobj,
          topicData: this.props.topicData,
          subjectData: this.props.subjectData,
          topicindata: this.props.topicindata,
          from: this.props.from,
          data1: this.props.data,
        });
      } else if (
        newobj.activityType === 'pdf' ||
        newobj.activityType === 'html5'
      ) {
        Actions.pdfview({
          type: 'reset',
          index: index + 1,
          smartres: this.props.smartres,
          data: newobj,
          topicData: this.props.topicData,
          subjectData: this.props.subjectData,
          topicindata: this.props.topicindata,
          from: this.props.from,
          data1: this.props.data,
        });
      } else if (newobj.activityType === 'web') {
        Actions.weblinkview({
          type: 'reset',
          index: index + 1,
          smartres: this.props.smartres,
          data: newobj,
          topicData: this.props.topicData,
          subjectData: this.props.subjectData,
          topicindata: this.props.topicindata,
          from: this.props.from,
          data1: this.props.data,
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
          data1: this.props.data,
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
          data1: this.props.data,
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
        data1: this.props.data,
      });
    }
    //  })
  }
  onPrevious1() {
    // this.updateAnalytics()
    this.setState(
      {
        newmodal: false,
      },
      () => {
        var newarray = this.props.smartres;
        var newobj = newarray[this.props.index - 1];
        var index = this.props.index;
        //  alert(JSON.stringify(newobj))
        if (newobj) {
          if (newobj.activityType === 'youtube') {
            Actions.videoview({
              type: 'reset',
              index: index - 1,
              smartres: this.props.smartres,
              data: newobj,
              topicData: this.props.topicData,
              subjectData: this.props.subjectData,
              topicindata: this.props.topicindata,
              from: this.props.from,
              data1: this.props.data,
            });
          } else if (newobj.activityType === 'video') {
            Actions.normalvideoview({
              type: 'reset',
              index: index - 1,
              smartres: this.props.smartres,
              data: newobj,
              topicData: this.props.topicData,
              subjectData: this.props.subjectData,
              topicindata: this.props.topicindata,
              from: this.props.from,
              data1: this.props.data,
            });
          } else if (
            newobj.activityType === 'obj' ||
            newobj.type === 'post' ||
            newobj.activityType === 'sub'
          ) {
            Actions.preassesment({
              type: 'reset',
              index: index - 1,
              smartres: this.props.smartres,
              data: newobj,
              topicData: this.props.topicData,
              subjectData: this.props.subjectData,
              topicindata: this.props.topicindata,
              from: this.props.from,
              data1: this.props.data,
            });
          } else if (
            newobj.activityType === 'pdf' ||
            newobj.activityType === 'html5'
          ) {
            Actions.pdfview({
              type: 'reset',
              index: index - 1,
              smartres: this.props.smartres,
              data: newobj,
              topicData: this.props.topicData,
              subjectData: this.props.subjectData,
              topicindata: this.props.topicindata,
              from: this.props.from,
              data1: this.props.data,
            });
          } else if (newobj.activityType === 'web') {
            Actions.weblinkview({
              type: 'reset',
              index: index - 1,
              smartres: this.props.smartres,
              data: newobj,
              topicData: this.props.topicData,
              subjectData: this.props.subjectData,
              topicindata: this.props.topicindata,
              from: this.props.from,
              data1: this.props.data,
            });
          } else if (newobj.activityType === 'pre') {
            Actions.topicmainview({
              type: 'reset',
              data: this.props.topicindata,
              topicsdata: this.props.topicData,
              screen: 'summary',
              subjectData: this.props.subjectData,
              from: this.props.from,
              data1: this.props.data,
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
              data1: this.props.data,
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
              data1: this.props.data,
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
            data1: this.props.data,
          });
        }
      }
    );
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
    console.log('kjdnfjkdnfjkdsnfkld', data);
    this.setState(
      {
        data,
      },
      () => this.setState({ newmodal: true })
    );
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
    console.log('onreeeee', NormalVideoViewComponent.pausedtime);
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
      //     <View style={styles.mainView}>
      //          {this.state.showfullscreen ? null :
      //           <TouchableOpacity onPress={this.onBack.bind(this)} style={{elevation:10}}>
      //           <Image source={require("../../assets/images/left-arrow.png")}
      //               style={styles.backimage} />
      //               </TouchableOpacity> }
      //           <View style={[styles.mainsubview,{ height:this.state.showfullscreen ? "100%":"80%",}]}>
      //           	<View style={{flex:1}}>
      //             {this.state.normalvideodata ?
      //            <NormalVideoViewComponent ref = "ve" onfullscreen={this.onfullscreen.bind(this)} questionsArray={this.state.questionsArray} onBack={this.onNewBack.bind(this)} onPause={this.onPause.bind(this)} data={this.state.normalvideodata}/>:
      //            <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
      //            <Text>Loading...</Text></View>}
      //           	</View>
      //           </View>
      //           {this.state.showfullscreen ? null :
      //            <View style={styles.nextactivityview}>
      //            <TouchableOpacity style={styles.nextinner} onPress={this.onPrevious.bind(this)}>
      //               <Text style={styles.activitytext}>Previous Activity</Text>
      //               </TouchableOpacity>
      //               <TouchableOpacity style={styles.nextinner} onPress={this.onNext.bind(this)}>
      //               <Text style={styles.activitytext}>Next Activity</Text>
      //               </TouchableOpacity>

      //           </View>}
      //           {this.state.showfullscreen ? null :
      //            <View style={styles.subjectouter}>
      //           <Text style={{color:"white",fontSize:20}}>{this.props.data.activity}</Text>
      //           </View> }
      //           <Modal isVisible={this.state.newmodal}>
      //   <View style={{ flex: 1,justifyContent:"center",alignItems:"center" }}>

      //   <VideoQuestionModal data={this.state.data} onquestionSubmit={this.onquestionSubmit.bind(this,1)} onRewatch={this.onRewatch.bind(this)}/>
      //   </View>
      // </Modal>
      //       </View>
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
                        {this.props.data.activity}
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
              )}
              <View style={stylefull}>
                {this.state.normalvideodata ? (
                  <NormalVideoViewComponent
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
                    questionsArray={[]}
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
                    <Text style={{ fontSize: headfont }}>Loading...</Text>
                  </View>
                )}
              </View>
              {this.state.showfullscreen ? null : (
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
                data={this.state.data}
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

export default NormalVideo;
