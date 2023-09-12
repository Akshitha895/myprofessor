import React, { Component } from 'react';
import {
  Alert,
  BackHandler,
  Dimensions,
  Image,
  ImageBackground,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DeviceConstants from 'react-native-device-constants';

import { Actions } from 'react-native-router-flux';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Drawer from 'react-native-drawer';
import Footer from '../../components/Footer';
import SideMenu from '../../components/SideMenu';
import TopicsComponent from '../../components/TopicsComponent';
import { baseUrl, colors } from '../../constants';
import styles from './styles';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
var FloatingLabel = require('react-native-floating-labels');

class Topics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isvisible: false,
      topicData: this.props.data,
      topicsArray: [],
      spinner: true,
      token: '',
      userdetails: '',
      analyticsData: {},
    };
  }
  closeControlPanel = () => {
    this._drawer.close();
  };
  openControlPanel = () => {
    this._drawer.open();
  };
  onTopic(item) {
    this.updateAnalytics();
    // alert('dddd' + JSON.stringify(item));

    //	if(item.preasses){
    Actions.push('topicmainview', {
      screen: this.props.screen,
      from: 'topics',
      data: item,
      topicsdata: this.props.data,
      subjectData: this.props.subjectData,
    });
    // }else{
    // 	this.setState({
    // 	isvisible:true
    // })
    // }
  }
  onanalyticspress(item) {
    Actions.push('topicanalysis', {
      from: 'topics',
      data: item,
      topicsdata: this.props.data,
      subjectData: this.props.subjectData,
    });
  }
  updateAnalytics() {
    //alert(this.state.analyticsData.reference_id)
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
          //   alert(JSON.stringify(json));
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
  onOk() {
    this.setState(
      {
        isvisible: false,
      },
      () => Actions.push('preassesment')
    );
  }
  onCancel() {
    this.setState({
      isvisible: false,
    });
  }
  componentDidMount() {
    //alert("dfdfdf"+JSON.stringify(this.props.subjectData))
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction
    );
    this.getData();
  }
  backAction = () => {
    //alert("hi")
    this.onBack();
    return true;
  };
  componentWillUnmount() {
    this.backHandler.remove();
  }
  onBack() {
    //alert(this.props.screen)
    //this.updateAnalytics()

    if (this.props.screen === 'dashboard') {
      Actions.dashboard({ type: 'reset' });
    } else if (this.props.screen === 'classlist') {
      Actions.liveclasslist({ type: 'reset' });
    } else if (this.props.screen === 'searchpage') {
      Actions.searchpage({ type: 'reset' });
    } else {
      //console.log("dajfbjdfnkjd", this.props.subjectData)
      Actions.chapters({ type: 'reset', data: this.props.subjectData });
    }
  }
  getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@user');
      //  alert(JSON.stringify(value))
      if (value !== null) {
        var data = JSON.parse(value);

        const token = await AsyncStorage.getItem('@access_token');
        console.log('sadnsahhjasvkjsavcjklasbcvlkjasbjks', token);
        if (token && data) {
          this.setState({
            token: JSON.parse(token),
            userdetails: data,
          });

          this.getTopics(data, JSON.parse(token));
          //this.getanalytics(data,JSON.parse(token))
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

  getTopics(user, toekn) {
    const { data, subjectData } = this.props;
    console.log(data, '  ', subjectData);
    var userId = user.userInfo.userId;

    var board_id = user.userOrg.boardId;
    var grade_id = user.userOrg.gradeId;
    var subject_id = data.subjectId;
    var chapter_id = data.chapterId;
    const payload = {
      universityId: user.userOrg.universityId,
      branchId: user.userOrg.branchId,
      semesterId: user.userOrg.semesterId,
      subjectId: subject_id,
      chapterId: chapter_id,
      offset: 0,
      limit: 10000,
    };
    var url = baseUrl + `/analytics/users/${userId}/topics`;

    // console.log("  knk ",board_id,"  fadf  ",grade_id,"     vvvvv  ",subjectData,"  dsd  ",chapter_id)
    // var url = baseUrl + '/boards/'+board_id+'/grades/'+grade_id+'/subjects/'+subject_id+'/chapters/'+chapter_id+'/topics'

    console.log('topicvaluesssssss', url);
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        jwt: toekn,
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.code === 201) {
          if (json.data) {
            console.log('topics////////', json);
            this.setState({
              spinner: false,
              topicsArray: json.data.items,
            });
          } else {
            this.setState({
              spinner: false,
              topicsArray: [],
            });
          }
          //  AsyncStorage.setItem('@access-token', data.access_token)
          //  Actions.push('dashboard')
        } else if (json.error?.code === 400) {
          //alert("dknkdf")
          Alert.alert('My Professor', json.error.message, [
            { text: 'OK', onPress: () => this.logout() },
          ]);
        } else {
          alert(JSON.stringify(json.error.message));
          this.setState({
            spinner: false,
            topicsArray: [],
          });
        }
      })
      .catch((error) => console.error(error));
    //Actions.push('boards')
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
  render() {
    var newcolor = 'red';
    if (this.props.data?.color) {
      newcolor = this.props.data.color;
    } else {
      newcolor = colors.Themecolor;
    }
    const isTablet = DeviceConstants.isTablet; // false
    var absheightios = windowHeight / 1.4,
      absheightandroid = windowHeight / 1.3,
      backwidth = 21,
      backheight = 15,
      headfont = 18,
      subfont = 13,
      chapimgwidth = 70,
      chapimgheight = 70,
      marginright = 20,
      drawerwidth = 100;
    if (isTablet) {
      var absheightios = windowHeight / 1.35,
        drawerwidth = 700,
        absheightandroid = windowHeight / 1.35,
        backwidth = 32,
        backheight = 22,
        headfont = 30,
        subfont = 20,
        chapimgwidth = 100,
        chapimgheight = 100,
        marginright = 40;
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
            <View style={styles.mainview}>
              <View style={styles.topview}>
                <ImageBackground
                  source={require('../../assets/images/dashboard/new/chapters_bg.png')}
                  style={{
                    width: '100%',
                    height: 288,
                    backgroundColor: colors.Themecolor,
                  }}
                  opacity={0.5}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      marginLeft: 20,
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <View
                      style={{
                        width: '100%',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 10,
                      }}
                    >
                      <View
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 5,
                        }}
                      >
                        <View
                          style={{
                            flex: 0.7,
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}
                        >
                          <TouchableOpacity onPress={this.onBack.bind(this)}>
                            <Image
                              source={require('../../assets/images/refer/back.png')}
                              style={{
                                width: backwidth,
                                height: backheight,
                                tintColor: 'white',
                              }}
                            />
                          </TouchableOpacity>
                          <Text
                            style={{
                              color: 'white',
                              marginLeft: 30,
                              marginRight: 20,
                              fontSize: headfont,
                            }}
                          >
                            {this.props.data.chapterName}
                          </Text>
                        </View>
                        <View
                          style={{
                            flex: 0.3,
                            alignItems: 'flex-end',
                            marginRight: marginright,
                          }}
                        >
                          {this.props.data.image ? (
                            <Image
                              source={{ uri: this.props.data.image }}
                              style={{
                                width: chapimgwidth,
                                height: chapimgheight,
                                resizeMode: 'contain',
                              }}
                            />
                          ) : (
                            <Image
                              source={require('../../assets/images/noimage.png')}
                              style={{
                                width: chapimgwidth,
                                height: chapimgheight,
                                resizeMode: 'contain',
                              }}
                            />
                          )}
                        </View>
                      </View>
                    </View>
                  </View>
                </ImageBackground>
                <View
                  style={{
                    height:
                      Platform.OS === 'android'
                        ? absheightandroid
                        : absheightios,
                    width: windowWidth,
                    backgroundColor: 'white',
                    alignSelf: 'center',
                    position: 'absolute',
                    bottom: 0,
                    borderTopRightRadius: 25,
                    borderTopLeftRadius: 25,
                  }}
                >
                  {this.state.spinner ? (
                    <View
                      style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text style={{ fontSize: headfont }}>Loading...</Text>
                    </View>
                  ) : (
                    <TopicsComponent
                      subjectData={this.props.subjectData}
                      updateAnalytics={this.updateAnalytics.bind(this)}
                      onTopicPress={this.onTopic.bind(this)}
                      onanalyticspress={this.onanalyticspress.bind(this)}
                      screen={this.props.screen}
                      topicData={this.state.topicData}
                      topicsArray={this.state.topicsArray}
                      role={this.state.userdetails.role.roleName}
                    />
                  )}
                </View>
              </View>
              <View style={styles.footerview}>
                <Footer openControlPanel={this.openControlPanel} />
              </View>
            </View>
          </Drawer>
        </>
      </SafeAreaView>
    );
  }
}
export default Topics;
