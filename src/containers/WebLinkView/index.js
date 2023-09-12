import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import React, { Component } from 'react';
import {
  BackHandler,
  Image,
  ImageBackground,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { WebView } from 'react-native-webview';
import { baseUrl, colors } from '../../constants';
class WebLinkView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinner: true,
      isvisible: false,
      weblinkdata: null,
      token: '',
      analyticsData: {},
      activityStartTime: null,
      userDetails: null,
    };
  }
  componentDidMount() {
    console.log('asdkadklfklad', this.props.topicindata, this.props.topicData);
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
          this.setState({
            token: JSON.parse(token),
            userDetails: data,
          });
          // this.getanalytics(data,JSON.parse(token))
          this.getActivityInfo(data, JSON.parse(token));
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
    // var body = {
    //   activity_status : 0,
    //   video_played: newdata,
    //   pdf_page: 0,
    //   video_duration: duration
    // }
    console.log('asdkadklfklad', this.props.topicindata);
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
    };
    console.log('webkinkbodyyyyy', body);
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
          console.log('ncmxcmnxc', JSON.stringify(json));
        }
      })
      .catch((error) => console.error(error));
  }
  getActivityInfo(user, token) {
    const { data } = this.props;
    var userId = user.userInfo.userId;
    var activityDimId = data.activityDimId;
    const url =
      baseUrl + `/analytics/users/${userId}/activities/${activityDimId}`;
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
        // alert(JSON.stringify(data))
        console.log('swarooppapaapappaa', json);
        if (json) {
          console.log('ljdfkldfd', data);
          this.setState({
            weblinkdata: json.data,
          });
        } else {
          alert('ddd' + JSON.stringify(json.message));
        }
      })
      .catch((error) => console.error(error));
  }
  onBack() {
    this.updateAnalytics();
    Actions.topicmainview({
      type: 'reset',
      data: this.props.topicindata,
      topicsdata: this.props.topicData,
      screen: 'summary',
      subjectData: this.props.subjectData,
      from: this.props.from,
    });
    //Actions.pop()
  }
  onNext() {
    this.updateAnalytics();
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
  onPrevious() {
    this.updateAnalytics();
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

  render() {
    const { topicindata } = this.props;
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
                      {this.props.data.name}
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
                  flex: 0.84,
                  backgroundColor: 'white',
                  marginLeft: 10,
                  marginRight: 10,
                  borderRadius: 20,
                  overflow: 'hidden',
                }}
              >
                {this.state.weblinkdata ? (
                  <WebView
                    androidLayerType="hardware"
                    source={{
                      uri: this.state.weblinkdata.url,
                    }}
                    style={{ marginTop: 20, overfloe: 'hidden', minHeight: 1 }}
                  />
                ) : (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text>Loading.</Text>
                  </View>
                )}
              </View>
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
            </View>
          </ImageBackground>
        </>
      </SafeAreaView>
    );
  }
}

export default WebLinkView;
