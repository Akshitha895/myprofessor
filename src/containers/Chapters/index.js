import React, { Component } from 'react';
import {
  Alert,
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
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Drawer from 'react-native-drawer';
import { Actions } from 'react-native-router-flux';
import ChapterComponent from '../../components/ChapterComponent';
import Footer from '../../components/Footer';
import SideMenu from '../../components/SideMenu';
import { baseUrl, colors } from '../../constants';
import styles from './styles';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class Chapters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: this.props.data,
      spinner: true,
      chaptersData: [],
      analyticsData: {},
      token: '',
      validpackages: {},
      userDetails: '',
      isvisible: false,
    };
  }
  onBack() {
    // this.updateAnalytics()
    Actions.dashboard({ type: 'reset' });
  }
  closeControlPanel = () => {
    this._drawer.close();
  };
  openControlPanel = () => {
    this._drawer.open();
  };
  componentDidMount() {
    // alert(JSON.stringify(this.props.data))
    console.log('dadfdadafdafdafdafdafaddd', this.state.userData);
    this.getData();
  }
  getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@user');
      //  alert(JSON.stringify(value))
      if (value !== null) {
        var data = JSON.parse(value);
        console.log('chapterssssujjj', data);
        const token = await AsyncStorage.getItem('@access_token');
        if (token) {
          this.setState({
            token: JSON.parse(token),
            userDetails: data,
          });
          this.getChapter(data, JSON.parse(token));
          // this.getanalytics(data, JSON.parse(token))
          console.log('tokenn', token);
          if (data.userOrg.roleName === 'General Student') {
            this.validatepackages(data);
          }
        } else {
        }
      } else {
        console.log('errorrr');
      }
    } catch (e) {
      return null;
    }
  };
  validatepackages(data) {
    //package/validate/${email}

    var userId = data.userInfo.userId;
    console.log('userIduserIduserIduserIduserId', this.state.token);
    var url = baseUrl + `/users/${userId}/subscription-status`;
    console.log('kvkdjfkdf', url);
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        jwt: this.state.token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        console.log('chaptervalidate', json);
        if (json.data) {
          console.log('validpackages', json.data);
          this.setState({ validpackages: json.data });
        } else {
          console.log(JSON.stringify(json.message));
        }
      })
      .catch((error) => console.error(error));
  }
  onFront() {
    // this.updateAnalytics()
  }

  getChapter(user, toekn) {
    console.log('this.props.data', this.props.data);
    var board_id = user.userOrg.boardId;
    var grade_id = user.userOrg.gradeId;
    var subject_id = this.props.data.subjectId;
    var userId = user.userInfo.userId;

    var url = baseUrl + `/analytics/users/${userId}/chapters`;

    console.log(
      'sacmklsncklncklxnckncvkl',
      board_id,
      '   ',
      grade_id,
      'subject_id',
      subject_id
    );
    const body = {
      universityId: user.userOrg.universityId,
      branchId: user.userOrg.branchId,
      semesterId: user.userOrg.semesterId,
      subjectId: subject_id,
      offset: 0,
      limit: 10000,
    };

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
        console.log('knckvk', json);
        if (json.code === 201) {
          if (json.data.items) {
            console.log('chaptersssss', json.data.items[0]);
            this.setState({
              spinner: false,
              chaptersData: json.data.items,
            });
          } else {
            this.setState({
              spinner: false,
              chaptersData: [],
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
            chaptersData: [],
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
  onlockmodal(value) {
    this.setState({
      isvisible: value,
    });
  }
  onNo() {
    this.setState({
      isvisible: false,
    });
  }
  onYes() {
    this.setState(
      {
        isvisible: false,
      },
      () => {
        Actions.push('buypackages');
      }
    );
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
      drawerwidth = 100,
      paddingwdth = 30,
      paddingheigjt = 10;
    if (isTablet) {
      var absheightios = windowHeight / 1.35,
        absheightandroid = windowHeight / 1.35,
        backwidth = 32,
        backheight = 22,
        headfont = 30,
        subfont = 20,
        chapimgwidth = 100,
        chapimgheight = 100,
        marginright = 40,
        drawerwidth = 700,
        paddingwdth = 40,
        paddingheigjt = 20;
    }
    return (
      <SafeAreaView style={{ flex: 1 }}>
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
                    marginLeft: 10,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: 10,
                    }}
                  >
                    <View style={{ flex: 0.75, marginLeft: 10 }}>
                      <View
                        style={{ flex: 1, flexDirection: 'row', marginTop: 10 }}
                      >
                        <View style={{ flex: 0.1, marginTop: 10 }}>
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
                        </View>
                        <View
                          style={{ flex: 0.9, justifyContent: 'flex-start' }}
                        >
                          <Text
                            style={{
                              color: 'white',
                              fontSize: headfont,
                              marginLeft: 15,
                            }}
                          >
                            {this.props.data.name}
                          </Text>
                          <Text
                            style={{
                              color: 'white',
                              marginLeft: 15,
                              marginTop: 5,
                              fontSize: subfont,
                            }}
                          >
                            {this.props.data.noOfChapters} Chapters |{' '}
                            {this.props.data.noOfTopics} Topics
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View
                      style={{
                        flex: 0.25,
                        alignItems: 'flex-end',
                        marginRight: marginright,
                      }}
                    >
                      {this.props.data.image !== 'null' ? (
                        <Image
                          source={{ uri: this.props.data.image }}
                          style={{
                            width: chapimgwidth,
                            height: chapimgwidth,
                            resizeMode: 'contain',
                          }}
                        />
                      ) : (
                        <Image
                          source={require('../../assets/images/noimage.png')}
                          style={{
                            width: chapimgwidth,
                            height: chapimgwidth,
                            resizeMode: 'contain',
                          }}
                        />
                      )}
                    </View>
                  </View>
                </View>
              </ImageBackground>
              <View
                style={{
                  height:
                    Platform.OS === 'android' ? absheightandroid : absheightios,
                  width: windowWidth,
                  backgroundColor: 'white',
                  alignSelf: 'center',
                  position: 'absolute',
                  bottom: 0,
                  borderTopRightRadius: 30,
                  borderTopLeftRadius: 30,
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
                  <ChapterComponent
                    validpackages={this.state.validpackages}
                    userDetails={this.state.userDetails}
                    onlockmodal={this.onlockmodal.bind(this)}
                    onBack={this.onBack.bind(this)}
                    onFront={this.onFront.bind(this)}
                    userData={this.state.userData}
                    chapters={this.state.chaptersData}
                  />
                )}
              </View>
            </View>
            <View style={styles.footerview}>
              <Footer openControlPanel={this.openControlPanel} />
            </View>
          </View>
          <Modal isVisible={this.state.isvisible}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  padding: 10,
                  backgroundColor: 'white',
                  borderRadius: 15,
                  marginVertical: 15,
                }}
              >
                <Text
                  style={{
                    fontSize: headfont,
                    textAlign: 'center',
                    marginTop: 10,
                  }}
                >
                  Please subscribe for full access
                </Text>
                <Text
                  style={{
                    fontSize: headfont,
                    textAlign: 'center',
                    marginTop: 10,
                    fontWeight: '600',
                  }}
                >
                  {' '}
                  Please subscribe now{' '}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    marginTop: 20,
                  }}
                >
                  <TouchableOpacity onPress={this.onNo.bind(this)}>
                    <LinearGradient
                      colors={['#f14d65', '#fc8798']}
                      style={{
                        paddingHorizontal: paddingwdth,
                        paddingVertical: paddingheigjt,
                        borderRadius: 20,
                      }}
                    >
                      <Text style={{ color: 'white', fontSize: subfont }}>
                        No
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={this.onYes.bind(this)}>
                    <LinearGradient
                      colors={['#239816', '#32e625']}
                      style={{
                        paddingHorizontal: paddingwdth,
                        paddingVertical: paddingheigjt,
                        borderRadius: 20,
                      }}
                    >
                      <Text style={{ color: 'white', fontSize: subfont }}>
                        YES
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </Drawer>
      </SafeAreaView>
    );
  }
}
export default Chapters;
