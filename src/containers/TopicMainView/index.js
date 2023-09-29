import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import DeviceConstants from 'react-native-device-constants';
import FastImage from 'react-native-fast-image';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Drawer from 'react-native-drawer';
import Modal from 'react-native-modal';
import * as Progress from 'react-native-progress';
import { Actions } from 'react-native-router-flux';

import moment from 'moment';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import Footer from '../../components/Footer';
import SideMenu from '../../components/SideMenu';
import { baseUrl, colors, imageUrl } from '../../constants';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// const data = [
//   {
//     name: 'Rational Numbers',
//     image: require('../../assets/images/dashboard/new/recomtopic1.png'),
//     insideimg: require('../../assets/images/math.png'),
//     progress: 0.5,
//     test: 6,
//     read: 40,
//   },
//   {
//     name: 'Rational Numbers',
//     image: require('../../assets/images/dashboard/new/recomtopic2.png'),
//     insideimg: require('../../assets/images/math.png'),
//     progress: 0.5,
//     test: 6,
//     read: 40,
//   },
// ];
class TopicMainView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: 'Select Date and Time',
      dateformar: null,
      alreadyschedule: false,
      time: 'Select Time',
      isvisible: false,
      newmodal: false,
      showerrormodel: false,
      topicData: this.props.data,
      smartres: [],
      teacherres: [],
      iconspinner: true,
      teacherspinner: true,
      useDetails: null,
      analyticsData: {},
      recommendedtopics: [],
      spinner: true,
      token: '',
      selectedIndex: 0,
      showmodal: false,
      showpicker: false,
      showtimepicker: false,
      savedate: null,
      scheduledata: null,
      progresscount: 0,
      profspinner: false,
      profres: [],
    };
  }
  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction
    );
    console.log('dklnfjkda', this.props.data);
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
      // alert(JSON.stringify(value));
      if (value !== null) {
        var data = JSON.parse(value);
        this.setState({
          useDetails: data,
        });
        const token = await AsyncStorage.getItem('@access_token');
        if (token && data) {
          this.setState({
            token: JSON.parse(token),
          });
          console.log('sdfdsafadfdfdafadfda', value);
          //  var userdata = JSON.parse(value)
          if (data.role.roleName === 'Student') {
            this.getprofessorresources(data, JSON.parse(token));
          }

          //setTimeout(() => {
          this.getResources(data, JSON.parse(token));

          //}, 2000);

          this.getsavelaterdata(data, JSON.parse(token));
          //this.getanalytics(data, JSON.parse(token))
          //this.getRecommendedTopics(data, JSON.parse(token))
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
  getsavelaterdata(user, token) {
    console.log('dklckdlkcdklcndk', this.props.data);
    console.log('userrrrr', user);
    var scheduleTypeId = this.props.data.topicId;
    var userId = this.state.useDetails.userInfo.userId;
    var scheduleType = 'topic';
    var url =
      baseUrl +
      `/user-schedules?userId=${userId}&scheduleType=${scheduleType}&scheduleTypeId=${scheduleTypeId}`;
    //console.log("URLLLL", url)
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        jwt: this.state.token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        console.log('dalfjnclskjdnvlksdnv', json);
        if (json.code === 201) {
          if (json.data) {
            console.log(
              'dbfkhjdavkjhdakfjdgfkd',
              JSON.stringify(json.data.scheduleDate),
              moment.utc(json.data.scheduleDate).format('MMMM Do YYYY, h:mm a')
            );
            this.setState({
              date: moment.utc(json.data.scheduleDate).format('lll'),
              scheduledata: json.data,
              alreadyschedule: true,
            });
          } else {
            this.setState({
              date: 'Select Date and Time',
              alreadyschedule: false,
              scheduledata: null,
            });
          }
        } else {
          this.setState({
            date: 'Select Date and Time',
            alreadyschedule: false,
            scheduledata: null,
          });
          console.log('toppppp', JSON.stringify(json.message));
        }
      })
      .catch((error) => console.error('error', error));
  }
  getRecommendedTopics(user, token) {
    var url =
      baseUrl + '/student/recommendedTopics/' + this.props.data.reference_id;
    //console.log("URLLLL", url)
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        // alert(JSON.stringify(json))
        if (json.data) {
          console.log('recommenede', JSON.stringify(json.data));
          this.setState({
            recommendedtopics: json.data.topicsList,
            spinner: false,
          });
        } else {
          this.setState({
            recommendedtopics: [],
            spinner: false,
          });
          console.log('toppppp', JSON.stringify(json.message));
        }
      })
      .catch((error) => console.error('error', error));
  }
  getanalytics(user, token) {
    console.log('analyticsss', this.props.subjectData);
    var body = {
      user_id: user.reference_id,
      board_id: user.grade ? user.grade.board_id : null,
      grade_id: user.grade ? user.grade.reference_id : null,
      section_id: user.section ? user.section.reference_id : null,
      school_id: user.school ? user.school.reference_id : null,
      branch_id: user.grade ? user.grade.branch_id : null,
      page: 'MyCourse_Resource',
      type: 'mobile',
      subject_id: this.props.subjectData.reference_id,
      chapter_id: this.props.topicsdata.reference_id,
      topic_id: this.props.data.reference_id,
      activity_id: null,
    };

    var url = baseUrl + '/analytics';
    console.log('value', url);
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token,
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.data) {
          const data = json.data;
          //alert(JSON.stringify(json));
          this.setState({
            analyticsData: data,
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
  getprofessorresources(user, token) {
    console.log('dmc nmanckc', this.props.data);
    var userId = user.userInfo.userId;
    var topicId = this.props.data.topicId;
    console.log('adcsdsadasdsdsd.', userId, topicId);
    var url =
      baseUrl + '/topics/' + topicId + '/activities?resourceType=professor';
    console.log('dlkafjklaflknfkj', url);
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        jwt: token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        // const data = json.data;
        console.log('professordafraaaa', json);
        if (json.code === 201) {
          var count = 0;
          // json.data.map((res, i) => {
          //   count = count + res.progress
          // })
          // console.log("dknfkldf", count)
          this.setState({
            profspinner: false,
            //   progresscount: count,
            profres: json.data,
          });
        } else if (json.error?.code === 400) {
          //alert("dknkdf")
          Alert.alert('My Professor', json.error.message, [
            { text: 'OK', onPress: () => this.logout() },
          ]);
        } else {
        }
      })
      .catch((error) => console.error(error));
  }
  getResources(user, token) {
    console.log('dataaaacalenderr', this.props.data);
    var userId = user.userInfo.userId;
    // console.log("thispors.", userId)
    // var chapterdata = this.props.topicsdata
    //   console.log("chapterssss,", this.props.data)
    const payload = {
      universityId: user.userOrg.universityId,
      branchId: user.userOrg.branchId,
      semesterId: user.userOrg.semesterId,
      subjectId: this.props.data.subjectId
        ? this.props.data.subjectId
        : this.props.topicsdata?.subjectId,
      chapterId: this.props.data.chapterId
        ? this.props.data.chapterId
        : this.props.topicsdata?.chapterId,
      topicId: this.props.data.topicId,
    };
    console.log('payloadnsbcjdsabjcsajchddd', payload);
    var url = baseUrl + '/analytics/users/' + userId + '/activities';
    console.log('dlkafjklaflknfkj', url);
    console.log('sdkjskjbdjsadbjksa', payload);

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        jwt: token,
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((json) => {
        // const data = json.data;
        console.log('resourcesdataaaaaa', json);
        if (json.code === 201) {
          var count = 0;
          json.data.map((res, i) => {
            count = count + res.progress;
          });
          console.log('dknfkldf', count);
          this.setState({
            iconspinner: false,
            progresscount: count,
            smartres: json.data,
          });
        } else if (json.error?.code === 400) {
          //alert("dknkdf")
          Alert.alert('My Professor', json.error.message, [
            { text: 'OK', onPress: () => this.logout() },
          ]);
        } else {
          this.setState({
            teacherspinner: false,
            iconspinner: false,
            topicsArray: [],
            smartres: [],
          });
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
  renderItem({ item }) {
    return (
      <TouchableHighlight
        style={{ paddingVertical: 20 }}
        underlayColor="transparent"
        activeOpacity={0.9}
      >
        <View
          style={{
            width: windowWidth / 2.5,
            height: 150,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'red',
            overflow: 'hidden',
            margin: 10,

            //left: -240,
          }}
        >
          {item.image !== 'null' ? (
            <Image
              source={{ uri: imageUrl + item.image }}
              style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
            />
          ) : (
            <Image
              source={require('../../assets/images/noimage.png')}
              style={{ width: 60, height: 60, resizeMode: 'contain' }}
            />
          )}
          <View
            style={{
              position: 'absolute',
              backgroundColor: 'rgba(42,42,55,0.7)',
              width: '100%',
              height: 40,
              bottom: 0,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ textAlign: 'center', fontSize: 10, color: 'white' }}>
              {item.name}
            </Text>
          </View>
        </View>
        {/* <View style={styles.bottomsubview}>
              <Text style={styles.subjectname}>{item.name}</Text>
              <View style={{ paddingVertical: 10, width: "100%", borderRadius: 3, }}>
                <View style={{ justifyContent: "space-between", flexDirection: "row", paddingHorizontal: 5 }}>
                  <Text style={{ fontSize: 12 }}>Progress</Text>
                  <Text style={{ color: "black", fontSize: 12 }}>{item.progress * 100}%</Text>
                </View>
                <View style={{ alignItems: "center", marginTop: 10 }}>
                  <Progress.Bar progress={item.progress} width={1724 / 11} height={5} color={'lightgreen'} />
                </View>


              </View>

              <View style={styles.countview}>
              </View>
            </View> */}
      </TouchableHighlight>
    );
  }

  onBack() {
    this.updateAnalytics();
    // alert(this.props.from)
    if (this.props.from === 'dashboard') {
      Actions.dashboard({ type: 'reset' });
    } else if (this.props.from === 'progresstopics') {
      Actions.progresstopics({ type: 'reset' });
    } else if (this.props.from === 'recommended') {
      Actions.recommendedtopics({ type: 'reset' });
    } else if (this.props.from === 'searchpage') {
      Actions.searchpage({ type: 'reset' });
    } else if (this.props.from === 'calander') {
      Actions.calendar({ type: 'reset' });
    } else if (this.props.from === 'heatmap') {
      Actions.heatmap({
        type: 'reset',
        data: this.props.data,
        fromscreen: 'topics',
      });
    } else {
      Actions.topics({
        screen: this.props.screen,
        type: 'reset',
        data: this.props.topicsdata,
        subjectData: this.props.subjectData,
      });
    }
  }
  onPreasses() {
    this.setState({
      isvisible: true,
    });
  }
  onstarttest() {
    this.setState(
      {
        isvisible: false,
      },
      () =>
        this.setState({
          newmodal: true,
        })
    );
  }
  onOk() {
    this.setState(
      {
        newmodal: false,
      },
      () => Actions.push('postassesment')
    );
  }
  onCancel() {
    this.setState({
      newmodal: false,
    });
  }
  onReview() {
    this.setState(
      {
        isvisible: false,
      },
      () => Actions.push('reviewpostsummary')
    );
  }
  onBackdrop() {
    this.setState({
      newmodal: false,
    });
  }

  onYoutube() {
    Actions.push('video');
  }
  closeControlPanel = () => {
    this._drawer.close();
  };
  openControlPanel = () => {
    this._drawer.open();
  };
  updateAnalytics() {
    var url = baseUrl + '/analytics/' + this.state.analyticsData.reference_id;
    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        token: this.state.token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.data) {
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
  onprofessoractivity(item, index, type) {
    let newarray = this.state.profres;
    if (
      item.activityType === 'web' ||
      item.activityType === 'exploratory_learning'
    ) {
      Actions.push('ProWebLinkView', {
        index,
        smartres: newarray,
        data: item,
        topicData: this.props.topicsdata,
        subjectData: this.props.subjectData,
        topicindata: this.props.data,
        from: this.props.from,
      });
    } else if (
      item.activityType === 'pdf' ||
      item.activityType === 'HTML5' ||
      item.activityType === 'html5'
    ) {
      Actions.push('ProfPdfViewNew', {
        index,
        smartres: newarray,
        data: item,
        topicData: this.props.topicsdata,
        subjectData: this.props.subjectData,
        topicindata: this.props.data,
        from: this.props.from,
      });
    } else if (item.activityType === 'video') {
      Actions.push('ProfNormalVideo', {
        index,
        smartres: newarray,
        data: item,
        topicData: this.props.topicsdata,
        subjectData: this.props.subjectData,
        topicindata: this.props.data,
        from: this.props.from,
      });
    } else if (item.activityType === 'youtube') {
      Actions.push('ProVideoView', {
        index,
        smartres: newarray,
        data: item,
        topicData: this.props.topicsdata,
        subjectData: this.props.subjectData,
        topicindata: this.props.data,
        from: this.props.from,
      });
    } else if (
      item.activityType === 'pre' ||
      item.activityType === 'obj' ||
      item.activityType === 'post' ||
      item.activityType === 'SUB'
    ) {
      //  this.onAssesment(item)
      Actions.push('ProfPreAssesment', {
        index,
        smartres: newarray,
        data: item,
        topicData: this.props.topicsdata,
        subjectData: this.props.subjectData,
        topicindata: this.props.data,
        from: this.props.from,
      });
    } else if (item.activityType === 'GAMES') {
      Actions.push('games', {
        index,
        smartres: newarray,
        data: item,
        topicData: this.props.topicsdata,
        subjectData: this.props.subjectData,
        topicindata: this.props.data,
        from: this.props.from,
      });
    } else if (item.activityType === 'conceptual_video') {
      Actions.push('ProfConceptVideo', {
        index,
        smartres: newarray,
        data: item,
        topicData: this.props.topicsdata,
        subjectData: this.props.subjectData,
        topicindata: this.props.data,
        from: this.props.from,
      });
    } else {
      alert('coming soon' + item.type);
    }
  }
  oniconActivity(item, index, type) {
    //this.updateAnalytics()
    //  console.log("Activitvnklsdjkljklvdjy", index)
    let newarray = [];
    // alert(this.state.smartres[index-1].status)
    if (type === 'teacher') {
      newarray = this.state.profres;
    } else if (type === 'icon') {
      newarray = this.state.smartres;
    }
    if (this.state.progresscount === 0) {
      if (
        item.activityType !== 'pre' &&
        newarray.find((activity) => activity.activityType === 'pre')
      ) {
        alert('Please complete Pre Assesment first');
      } else {
        if (
          item.activityType === 'web' ||
          item.activityType === 'exploratory_learning'
        ) {
          Actions.push('weblinkview', {
            index,
            smartres: newarray,
            data: item,
            topicData: this.props.topicsdata,
            subjectData: this.props.subjectData,
            topicindata: this.props.data,
            from: this.props.from,
          });
        } else if (
          item.activityType === 'pdf' ||
          item.activityType === 'HTML5' ||
          item.activityType === 'html5'
        ) {
          Actions.push('pdfview', {
            index,
            smartres: newarray,
            data: item,
            topicData: this.props.topicsdata,
            subjectData: this.props.subjectData,
            topicindata: this.props.data,
            from: this.props.from,
          });
        } else if (
          item.activityType === 'video' ||
          item.activityType === 'conceptual_video'
        ) {
          Actions.push('normalvideoview', {
            index,
            smartres: newarray,
            data: item,
            userId: this.state.useDetails.userInfo.userId,
            topicData: this.props.topicsdata,
            subjectData: this.props.subjectData,
            topicindata: this.props.data,
            from: this.props.from,
          });
        } else if (item.activityType === 'youtube') {
          Actions.push('videoview', {
            index,
            smartres: newarray,
            data: item,
            topicData: this.props.topicsdata,
            subjectData: this.props.subjectData,
            topicindata: this.props.data,
            from: this.props.from,
          });
        } else if (
          item.activityType === 'pre' ||
          item.activityType === 'OBJ' ||
          item.activityType === 'post' ||
          item.activityType === 'SUB'
        ) {
          //  this.onAssesment(item)
          Actions.push('preassesment', {
            index,
            smartres: this.state.smartres,
            data: item,
            topicData: this.props.topicsdata,
            subjectData: this.props.subjectData,
            topicindata: this.props.data,
            from: this.props.from,
          });
        } else if (item.activityType === 'GAMES') {
          Actions.push('games', {
            index,
            smartres: this.state.smartres,
            data: item,
            topicData: this.props.topicsdata,
            subjectData: this.props.subjectData,
            topicindata: this.props.data,
            from: this.props.from,
          });
          // } else if (item.activityType === 'conceptual_video') {
          //   Actions.push('conceptvideo', {
          //     index,
          //     smartres: newarray,
          //     data: item,
          //     topicData: this.props.topicsdata,
          //     subjectData: this.props.subjectData,
          //     topicindata: this.props.data,
          //     from: this.props.from,
          //   });
        } else {
          alert('coming soon  ' + item.activityType);
        }
      }
    } else {
      if (
        item.activityType === 'web' ||
        item.activityType === 'exploratory_learning'
      ) {
        Actions.push('weblinkview', {
          index,
          smartres: newarray,
          data: item,
          topicData: this.props.topicsdata,
          subjectData: this.props.subjectData,
          topicindata: this.props.data,
          from: this.props.from,
        });
      } else if (
        item.activityType === 'pdf' ||
        item.activityType === 'HTML5' ||
        item.activityType === 'html5'
      ) {
        Actions.push('pdfview', {
          index,
          smartres: newarray,
          data: item,
          topicData: this.props.topicsdata,
          subjectData: this.props.subjectData,
          topicindata: this.props.data,
          from: this.props.from,
        });
      } else if (
        item.activityType === 'video' ||
        item.activityType === 'conceptual_video'
      ) {
        Actions.push('normalvideoview', {
          index,
          smartres: newarray,
          data: item,
          userId: this.state.useDetails.userInfo.userId,
          topicData: this.props.topicsdata,
          subjectData: this.props.subjectData,
          topicindata: this.props.data,
          from: this.props.from,
        });
      } else if (item.activityType === 'youtube') {
        Actions.push('videoview', {
          index,
          smartres: newarray,
          data: item,
          topicData: this.props.topicsdata,
          subjectData: this.props.subjectData,
          topicindata: this.props.data,
          from: this.props.from,
        });
      } else if (
        item.activityType === 'pre' ||
        item.activityType === 'OBJ' ||
        item.activityType === 'post' ||
        item.activityType === 'SUB'
      ) {
        //  this.onAssesment(item)
        Actions.push('preassesment', {
          index,
          smartres: this.state.smartres,
          data: item,
          topicData: this.props.topicsdata,
          subjectData: this.props.subjectData,
          topicindata: this.props.data,
          from: this.props.from,
        });
      } else if (item.activityType === 'GAMES') {
        Actions.push('games', {
          index,
          smartres: this.state.smartres,
          data: item,
          topicData: this.props.topicsdata,
          subjectData: this.props.subjectData,
          topicindata: this.props.data,
          from: this.props.from,
        });
        // } else if (item.activityType === 'conceptual_video') {
        //   Actions.push('conceptvideo', {
        //     index,
        //     smartres: newarray,
        //     data: item,
        //     topicData: this.props.topicsdata,
        //     subjectData: this.props.subjectData,
        //     topicindata: this.props.data,
        //     from: this.props.from,
        //   });
      } else {
        alert('coming soon' + item.type);
      }
    }
  }
  onAssesment(item) {
    var url = baseUrl + '/user-test/assigned-activity/' + item.reference_id;

    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: this.state.token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.data) {
          const data = json.data;
          //  alert("dff"+JSON.stringify(data))

          if (json.data.total_count > 0) {
            Alert.alert(
              'My Professor',
              'Sorry you have reached your maximum number of attempts in this assesment',
              [
                {
                  text: 'OK',
                  onPress: () => {
                    // Actions.push('presummary',{testid: this.state.testid,index:this.props.index,smartres:this.props.smartres,topicData: this.props.topicData,topicindata:this.props.topicindata,subjectData:this.props.subjectData})
                  },
                },
              ]
            );
          } else {
          }
        } else {
          alert(JSON.stringify(json.message));
        }
      })
      .catch((error) => console.error(error));
  }
  handleIndexChange = (index) => {
    this.setState({
      ...this.state,
      selectedIndex: index,
    });
  };
  renderIconResource({ item, index }) {
    var percent = item.progress;
    let color;
    console.log('iconssss', item);
    if (percent > 80) {
      color = 'green';
    } else if (percent < 50) {
      color = 'red';
    } else {
      color = 'orange';
    }
    const minutes = Math.floor(item.duration / 60);
    const seconds = item.duration - minutes * 60;
    const isTablet = DeviceConstants.isTablet; // false
    var itemheight = 75,
      iconheight = 25,
      headfont = 15,
      subfont = 12,
      lockheight = 20,
      progressheight = 3;
    if (isTablet) {
      (itemheight = 115),
        (iconheight = 45),
        (headfont = 25),
        (subfont = 19),
        (lockheight = 30),
        (progressheight = 4);
    }
    return (
      <TouchableHighlight
        onPress={this.oniconActivity.bind(this, item, index, 'icon')}
        underlayColor="transparent"
        activeOpacity={0.9}
        style={{
          backgroundColor: 'white',
          width: windowWidth / 1.1,
          margin: 7,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 1,
          shadowRadius: 2,
          shadowColor: 'lightgrey',
          borderRadius: 10,
          height: itemheight,
        }}
      >
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View
              style={{
                flex: 0.15,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#F4F2F4',
              }}
            >
              <FastImage
                style={{ width: iconheight, height: iconheight }}
                // tintColor="#969397"
                source={{
                  uri: `${imageUrl}/activities${item.faIcon}`,
                }}
                //resizeMode={FastImage.resizeMode.contain}
              />
            </View>
            <View
              style={{
                flex: 0.6,
                flexDirection: 'row',
                alignItems: 'center',
                paddingLeft: 10,
                paddingVertical: 15,
              }}
            >
              <View>
                <Text style={{ fontSize: headfont }}>{item.name}</Text>
                {item.activityType === 'pdf' ? (
                  <Text
                    style={{
                      fontSize: subfont,
                      marginTop: 5,
                      color: '#969397',
                    }}
                  >
                    {item.pdfPages} Pages
                  </Text>
                ) : item.activityType === 'conceptual_video' ||
                  item.activityType === 'video' ||
                  item.activityType === 'youtube' ? (
                  <Text
                    style={{
                      fontSize: subfont,
                      marginTop: 5,
                      color: '#969397',
                    }}
                  >
                    `
                    {item.duration
                      ? `1 Video | Duration : ${minutes}:${
                          seconds > 9 ? seconds : '0' + seconds
                        }`
                      : ''}
                    `
                  </Text>
                ) : item.activityType === 'pre' ||
                  item.activityType === 'post' ? (
                  <Text
                    style={{
                      fontSize: subfont,
                      marginTop: 5,
                      color: '#969397',
                    }}
                  >
                    5 Questions
                  </Text>
                ) : item.activityType === 'html5' ? (
                  <Text
                    style={{
                      fontSize: subfont,
                      marginTop: 5,
                      color: '#969397',
                    }}
                  >
                    1 Referral Link
                  </Text>
                ) : (
                  <Text
                    style={{
                      fontSize: subfont,
                      marginTop: 5,
                      color: '#969397',
                    }}
                  >
                    {item.totalQuestions}{' '}
                  </Text>
                )}
              </View>
            </View>
            <View
              style={{
                flex: 0.25,
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 15,
              }}
            >
              {this.state.progresscount === 0 ? (
                index === 0 ? null : (
                  <Image
                    source={require('../../assets/images/lock.png')}
                    style={{ width: lockheight, height: lockheight }}
                  />
                )
              ) : item.status === 'completed' ? (
                <Image
                  source={require('../../assets/images/greentick.png')}
                  style={{ width: lockheight, height: lockheight }}
                />
              ) : item.status === 'in_progress' ? (
                <Image
                  source={require('../../assets/images/orangetick.png')}
                  style={{ width: lockheight, height: lockheight }}
                />
              ) : (
                <Image
                  source={require('../../assets/images/greytick.png')}
                  style={{ width: lockheight, height: lockheight }}
                />
              )}
            </View>
          </View>
          <Progress.Bar
            progress={item.progress / 100}
            width={windowWidth / 1.1}
            height={progressheight}
            color={color}
            unfilledColor={'lightgrey'}
            borderColor={'transparent'}
          />
        </View>
      </TouchableHighlight>
    );
  }

  renderTeacherResource = ({ item, index }) => {
    console.log('mcfnkadnfkad', item);
    // var percent = (item.percentage);
    // let color
    // console.log("iconssss", item.percentage)
    // if (percent > 80) {
    //   color = "green"
    // } else if (percent < 50) {
    //   color = "red"
    // } else {
    //   color = "orange"
    // }
    var itemheight = 75,
      iconheight = 25,
      headfont = 15,
      subfont = 12,
      lockheight = 20,
      progressheight = 3;
    if (isTablet) {
      (itemheight = 115),
        (iconheight = 45),
        (headfont = 25),
        (subfont = 19),
        (lockheight = 30),
        (progressheight = 4);
    }
    console.log('ddddd', imageUrl + item.faIcon);
    return (
      <TouchableHighlight
        onPress={this.onprofessoractivity.bind(this, item, index, 'teacher')}
        underlayColor="transparent"
        activeOpacity={0.9}
        style={{
          backgroundColor: 'white',
          width: windowWidth / 1.1,
          margin: 7,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 1,
          shadowRadius: 2,
          shadowColor: 'lightgrey',
          borderRadius: 10,
          height: itemheight,
        }}
      >
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View
              style={{
                flex: 0.15,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#F4F2F4',
              }}
            >
              <FastImage
                style={{ width: 25, height: 25 }}
                tintColor="#969397"
                source={{
                  uri: `${imageUrl}/activities${item.faIcon}`,
                }}
                //resizeMode={FastImage.resizeMode.contain}
              />
            </View>
            <View
              style={{
                flex: 0.6,
                flexDirection: 'row',
                alignItems: 'center',
                paddingLeft: 10,
                paddingVertical: 15,
              }}
            >
              <View>
                <Text style={{ fontSize: headfont }}>{item.name}</Text>
                {item.activityType === 'youtube' ? (
                  <Text
                    style={{
                      fontSize: subfont,
                      marginTop: 5,
                      color: '#969397',
                    }}
                  >
                    1 Video | Duration : {item.duration} sec{' '}
                  </Text>
                ) : item.activityType === 'web' ||
                  item.activityType === 'HTML5' ||
                  item.activityType === 'pdf' ||
                  item.activityType === 'html5' ? (
                  <Text
                    style={{
                      fontSize: subfont,
                      marginTop: 5,
                      color: '#969397',
                    }}
                  >
                    1 referal link
                  </Text>
                ) : (
                  <Text
                    style={{
                      fontSize: subfont,
                      marginTop: 5,
                      color: '#969397',
                    }}
                  >
                    {item.totalQuestions}
                  </Text>
                )}
              </View>
            </View>
            <View
              style={{
                flex: 0.25,
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 15,
              }}
            >
              {/* {item.isTherePreTest ?
                item.preTestStatus ?
                  item.status === 0 ?
                    <Image source={require('../../assets/images/greytick.png')} style={{ width: 20, height: 20, }} />
                    : item.status === 2 ?
                      <Image source={require('../../assets/images/orangetick.png')} style={{ width: 20, height: 20, }} />
                      : <Image source={require('../../assets/images/greentick.png')} style={{ width: 20, height: 20, }} />


                  :

                  item.type === 'PRE' ? null :

                    <Image source={require('../../assets/images/lock.png')} style={{ width: 20, height: 20, }} />

                :

                item.status === 0 ?
                  <Image source={require('../../assets/images/greytick.png')} style={{ width: 20, height: 20, }} />
                  : item.status === 2 ?
                    <Image source={require('../../assets/images/orangetick.png')} style={{ width: 20, height: 20, }} />
                    : <Image source={require('../../assets/images/greentick.png')} style={{ width: 20, height: 20, }} />


              } */}
            </View>
          </View>
          {/* <Progress.Bar progress={item.percentage / 100} width={windowWidth / 1.1} height={3} color={color}
            unfilledColor={"lightgrey"} borderColor={"transparent"} /> */}
        </View>
      </TouchableHighlight>
    );
  };

  onsavelater() {
    this.setState({
      showmodal: true,
      // showpicker: true
    });
  }

  showDatePicker = () => {
    this.setState({ showpicker: true });
  };

  hideDatePicker = () => {
    this.setState({ showpicker: false });
    //setDatePickerVisibility(false);
  };

  handleConfirm = (date) => {
    console.log(
      'A date has been picked:: ',
      date,
      moment(new Date(date)).format('lll')
    );
    if (date > new Date()) {
      this.setState({
        date: moment(new Date(date)).format('lll'),
        showpicker: false,
        dateformar: moment(new Date(date)).format('YYYY-MM-DD HH:mm:ss'),
        showerrormodel: false,
      });
    } else {
      this.setState({
        date: moment(new Date(date)).format('lll'),
        showpicker: false,
        dateformar: moment(new Date(date)).format('YYYY-MM-DD HH:mm:ss'),
        showerrormodel: true,
      });
    }
    //if()
    //hideDatePicker();
  };
  hideDatePickertime = () => {
    this.setState({ showtimepicker: false });
    //setDatePickerVisibility(false);
  };

  addtocalendernew() {
    console.log('ksdklsjkdslkd', this.state.alreadyschedule);
    if (this.state.alreadyschedule) {
      this.updatecalender();
    } else {
      if (this.props.from === 'dashboard') {
        this.addtocalender();
      } else {
        console.log(
          'dfdfdsfdsfdsfdsfdsf',
          this.props.data,
          this.props.topicsdata
        );
        var newarray = [
          '#6a5177',
          '#d88212',
          '#277292',
          '#a3ba6d',
          '#deb026',
          '#c44921',
        ];
        var newitem = newarray[Math.floor(Math.random() * newarray.length)];
        var url = baseUrl + `/user-schedules`;
        let payload = {
          userId: this.state.useDetails.userInfo.userId,
          scheduleType: 'topic',
          scheduleTypeId: this.props.data.topicId,
          scheduleDate: this.state.dateformar,
          additionalInfo: JSON.stringify({
            semesterId: this.state.useDetails.userOrg.semesterId,
            subjectId: this.props.topicsdata?.subjectId
              ? this.props.topicsdata.subjectId
              : this.props.data.subjectId,
            chapterId: this.props.topicsdata?.chapterId
              ? this.props.topicsdata.chapterId
              : this.props.data.chapterId,
            title: this.props.data.topicName,
          }),
        };
        console.log('dknckdc', url);
        fetch(url, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            jwt: this.state.token,
          },
          body: JSON.stringify(payload),
        })
          .then((response) => response.json())
          .then((json) => {
            console.log('ddd.........', json);
            if (json.code === 201) {
              this.setState({ showmodal: false }, () => {
                this.getsavelaterdata();
                alert('Scheduled Successfully');
              });
            } else {
              this.setState({ showmodal: false }, () => {
                alert(json.error.message);
              });
            }
          })
          .catch((error) => console.error(error));
      }
    }
  }
  updatecalender() {
    console.log('dmnfldf');
    if (this.props.from === 'dashboard') {
      this.addtocalender();
    } else {
      console.log('this.state.scheduledata', this.state.scheduledata);
      var newarray = [
        '#6a5177',
        '#d88212',
        '#277292',
        '#a3ba6d',
        '#deb026',
        '#c44921',
      ];
      var newitem = newarray[Math.floor(Math.random() * newarray.length)];
      var url = baseUrl + `/user-schedules/${this.state.scheduledata.id}`;
      let payload = {
        userId: this.state.useDetails.userInfo.userId,
        scheduleType: 'topic',
        scheduleTypeId: this.props.data.topicId,
        scheduleDate: this.state.date,
        additionalInfo: JSON.stringify({
          semesterId: this.state.useDetails.userOrg.semesterId,
          subjectId: this.props.data.subjectId,
          chapterId: this.props.topicsdata?.chapterId
            ? this.props.topicsdata.chapterId
            : this.props.data.chapterId,
          title: this.props.data.topicName,
        }),
      };

      fetch(url, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          jwt: this.state.token,
        },
        body: JSON.stringify(payload),
      })
        .then((response) => response.json())
        .then((json) => {
          console.log('ddd.........', json);
          if (json.code === 201) {
            this.setState({ showmodal: false }, () => {
              this.getsavelaterdata();
              alert('Scheduled Successfully');
            });
          } else {
            this.setState(
              { showmodal: false, date: 'Select Date and Time' },
              () => {
                alert(json.error);
              }
            );
          }
        })
        .catch((error) => console.error(error));
    }
  }

  addtocalender() {
    if (this.state.dateformar) {
      console.log(
        'dfdfdsfdsfdsfdsfdsf',
        this.props.data,
        this.props.topicsdata
      );
      var newarray = [
        '#6a5177',
        '#d88212',
        '#277292',
        '#a3ba6d',
        '#deb026',
        '#c44921',
      ];
      var newitem = newarray[Math.floor(Math.random() * newarray.length)];
      var url = baseUrl + `/user-schedules`;
      let payload = {
        userId: this.state.useDetails.userInfo.userId,
        scheduleType: 'topic',
        scheduleTypeId: this.props.data.topicId,
        scheduleDate: this.state.dateformar,
        additionalInfo: JSON.stringify({
          semesterId: this.state.useDetails.userOrg.semesterId,
          subjectId: this.props.topicsdata?.subjectId
            ? this.props.topicsdata.subjectId
            : this.props.data.subjectId,
          chapterId: this.props.topicsdata?.chapterId
            ? this.props.topicsdata.chapterId
            : this.props.data.chapterId,
          title: this.props.data.topicName,
        }),
      };
      console.log('dknckdc', url);
      fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          jwt: this.state.token,
        },
        body: JSON.stringify(payload),
      })
        .then((response) => response.json())
        .then((json) => {
          console.log('ddd.........', json);
          if (json.code === 201) {
            this.setState({ showmodal: false }, () => {
              this.getsavelaterdata();
              alert('Scheduled Successfully');
            });
          } else {
            this.setState({ showmodal: false }, () => {
              alert(json);
            });
          }
        })
        .catch((error) => console.error(error));
    } else {
      alert('Please select date and time');
    }
  }

  render() {
    var newcolor;
    if (this.props.topicsdata?.color) {
      newcolor = this.props.topicsdata.color;
    } else {
      newcolor = colors.Themecolor;
    }
    var title = 'notitle';
    if (this.state.topicData.topicName) {
      // console.log("d.,ndk")
      title = this.state.topicData.topicName;
    } else if (this.props.data) {
      // console.log("elsejdfjdv")
      title = this.props.data.title;
    } else {
      title = 'notitle';
    }
    const isTablet = DeviceConstants.isTablet; // false
    var topheight = windowHeight / 3.5,
      logoheight = 100,
      backheight = 30,
      headfont = 15,
      segheight = 35,
      drawerwidth = 100;
    if (isTablet) {
      (topheight = windowHeight / 2.3),
        (logoheight = 200),
        (backheight = 50),
        (headfont = 25),
        (segheight = 65),
        (drawerwidth = 700);
    }
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <>
          <Drawer
            type="overlay"
            ref={(ref) => (this._drawer = ref)}
            tapToClose
            openDrawerOffset={drawerwidth}
            content={<SideMenu closeControlPanel={this.closeControlPanel} />}
          >
            <View style={{ flex: 1 }}>
              <View style={{ flex: 0.92 }}>
                <ScrollView>
                  <View style={{ flex: 1 }}>
                    <View
                      style={{
                        overflow: 'hidden',
                        width: windowWidth,
                        height: topheight,
                        marginBottom: 20,
                        justifyContent: 'center',
                        backgroundColor: colors.Themecolor,
                        alignSelf: 'center',
                        resizeMode: 'cover',
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        {this.props.data.image ? (
                          <Image
                            source={{ uri: this.props.data.image }}
                            style={{ width: windowWidth, height: '100%' }}
                          />
                        ) : (
                          <Image
                            source={require('../../assets/images/logo_icon1.png')}
                            style={{
                              height: logoheight,
                              width: logoheight,
                              alignSelf: 'center',
                              marginTop: logoheight / 2,
                            }}
                          />
                        )}
                        <TouchableOpacity
                          style={{
                            position: 'absolute',
                            marginLeft: 20,
                            marginTop: 15,
                          }}
                          onPress={this.onBack.bind(this)}
                        >
                          <Image
                            source={require('../../assets/images/topicback.png')}
                            style={{ width: backheight, height: backheight }}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View style={{ flex: 1 }}>
                      <View
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                          paddingVertical: 10,
                        }}
                      >
                        <View style={{ flex: 0.8, justifyContent: 'center' }}>
                          <Text
                            style={{
                              fontSize: headfont,
                              marginHorizontal: 15,
                              marginVertical: 10,
                              color: 'red',
                            }}
                          >
                            {title}
                          </Text>
                        </View>
                        <View
                          style={{
                            flex: 0.2,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <TouchableOpacity
                            onPress={this.onsavelater.bind(this)}
                            style={{ marginRight: 15 }}
                          >
                            <Image
                              source={require('../../assets/images/newsave.jpeg')}
                              style={{ width: backheight, height: backheight }}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                      {this.state.profres.length > 0 ? (
                        <View>
                          <SegmentedControlTab
                            values={[
                              'Activity Resources',
                              'Professor Resources',
                            ]}
                            tabsContainerStyle={{ margin: 15 }}
                            borderRadius={20}
                            tabStyle={{
                              height: segheight,
                              borderColor: colors.Themecolor,
                            }}
                            firstTabStyle={{ borderRightWidth: 0 }}
                            activeTabStyle={{
                              backgroundColor: colors.Themecolor,
                            }}
                            activeTabTextStyle={{ color: 'white' }}
                            tabTextStyle={{
                              fontSize: headfont,
                              color: colors.Themecolor,
                            }}
                            selectedIndex={this.state.selectedIndex}
                            onTabPress={this.handleIndexChange}
                          />
                          {this.state.selectedIndex === 0 ? (
                            <View style={{ flex: 1 }}>
                              {this.state.iconspinner ? (
                                <ActivityIndicator color="black" />
                              ) : this.state.smartres.length > 0 ? (
                                <View
                                  style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}
                                >
                                  <FlatList
                                    data={this.state.smartres}
                                    renderItem={this.renderIconResource.bind(
                                      this
                                    )}
                                    // horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                  />
                                </View>
                              ) : null}
                            </View>
                          ) : (
                            <View
                              style={{
                                flex: 1,
                                backgroundColor: 'transaprent',
                              }}
                            >
                              {this.state.profspinner ? (
                                <ActivityIndicator color="black" />
                              ) : this.state.profres.length > 0 ? (
                                <View
                                  style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}
                                >
                                  <FlatList
                                    data={this.state.profres}
                                    renderItem={this.renderTeacherResource.bind(
                                      this
                                    )}
                                    //  horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                  />
                                </View>
                              ) : (
                                <View
                                  style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  }}
                                >
                                  <Text>No Resources</Text>
                                </View>
                              )}
                            </View>
                          )}
                        </View>
                      ) : this.state.iconspinner ? (
                        <ActivityIndicator color="black" />
                      ) : this.state.smartres.length > 0 ? (
                        <View
                          style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <View
                            style={{
                              backgroundColor: colors.Themecolor,
                              paddingHorizontal: 30,
                              borderRadius: 10,
                              marginVertical: 10,
                              height: segheight,
                              justifyContent: 'center',
                            }}
                          >
                            <Text
                              style={{ fontSize: headfont, color: 'white' }}
                            >
                              Activity Resources
                            </Text>
                          </View>

                          <FlatList
                            data={this.state.smartres}
                            renderItem={this.renderIconResource.bind(this)}
                            // horizontal={true}
                            showsHorizontalScrollIndicator={false}
                          />
                        </View>
                      ) : null}
                    </View>
                  </View>
                </ScrollView>
              </View>
              <View style={{ flex: 0.08 }}>
                <Footer openControlPanel={this.openControlPanel} />
              </View>
            </View>
            <TouchableWithoutFeedback
              onPress={() => this.setState({ showmodal: false })}
            >
              <Modal isVisible={this.state.showmodal}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <View
                    style={{
                      width: windowWidth / 1.2,
                      backgroundColor: 'white',
                      marginVertical: 15,
                    }}
                  >
                    <View style={{ backgroundColor: 'white' }}>
                      <TouchableOpacity
                        onPress={() => this.setState({ showmodal: false })}
                      >
                        <Image
                          source={require('../../assets/images/cancel.png')}
                          style={{
                            width: 30,
                            height: 30,
                            tintColor: colors.Themecolor,
                            alignSelf: 'flex-end',
                            marginVertical: 10,
                            marginRight: 10,
                          }}
                        />
                      </TouchableOpacity>
                      <View style={{ paddingBottom: 20 }}>
                        <View
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                            Schedule for later
                          </Text>
                        </View>
                        <View
                          style={{
                            paddingVertical: 20,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <TouchableOpacity
                            onPress={() => this.setState({ showpicker: true })}
                            style={{
                              height: 50,
                              width: windowWidth / 1.5,
                              borderWidth: 1,
                              borderColor: 'lightgrey',
                              paddingLeft: 10,
                              justifyContent: 'center',
                            }}
                          >
                            <Text style={{ fontSize: 18 }}>
                              {this.state.date}
                            </Text>
                          </TouchableOpacity>

                          <DateTimePickerModal
                            isVisible={this.state.showpicker}
                            mode="datetime"
                            minimumDate={new Date()}
                            // minimumDate={new Date(Date.now())}
                            onConfirm={this.handleConfirm.bind(this)}
                            onCancel={this.hideDatePicker.bind(this)}
                          />
                          {this.state.showerrormodel ? (
                            <Text style={{ color: 'red' }}>
                              Please select the time in future
                            </Text>
                          ) : null}
                        </View>
                        {this.state.showerrormodel ? null : (
                          <TouchableOpacity
                            onPress={this.addtocalendernew.bind(this)}
                            style={{
                              height: 50,
                              paddingHorizontal: 10,
                              justifyContent: 'center',
                              alignItems: 'center',
                              backgroundColor: colors.Themecolor,
                              alignSelf: 'center',
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 18,
                                color: 'white',
                                fontWeight: 'bold',
                              }}
                            >
                              Add To Calendar
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  </View>
                </View>
              </Modal>
            </TouchableWithoutFeedback>
          </Drawer>
        </>
      </SafeAreaView>
    );
  }
}
export default TopicMainView;
