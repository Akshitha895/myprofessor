import React, { Component } from 'react';
import {
  ActivityIndicator,
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

import AsyncStorage from '@react-native-async-storage/async-storage';
import Drawer from 'react-native-drawer';
import { Actions } from 'react-native-router-flux';
import Footer from '../../components/Footer';
import PracticeComponent from '../../components/PracticeComponent';
import SideMenu from '../../components/SideMenu';
import { baseUrl } from '../../constants';
import styles from './styles';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class Practice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      spinner: true,
      subjectsData: null,
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
    Actions.dashboard({ type: 'reset' });
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
        if (token) {
          this.setState({
            token: JSON.parse(token),
          });
          this.getSubjects(data, JSON.parse(token));
          //this.getanalytics(data,JSON.parse(token))
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
    //grade?offset=0&limit=10&order_by=name&sort_order=DESC&board=1a060a8b-2e02-4bdf-8b70-041070f3747c&branch=-1
    var userId = user.userInfo.userId;
    var body = {
      universityId: user.userOrg.universityId,
      branchId: user.userOrg.branchId,
      semesterId: user.userOrg.semesterId,
    };
    var url = baseUrl + `/analytics/users/${userId}/assessment/subjects`;
    console.log('value', url);
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
        console.log('sljacfljkasncf', json);
        if (json.code === 201) {
          const data = json.data;
          if (data) {
            if (data.items) {
              console.log('subjects', data.items);
              var newarr = data.items;
              newarr = [...newarr];
              this.setState({
                spinner: false,
                subjectsData: data.items,
              });
            } else {
              this.setState({
                spinner: false,
                subjectsData: [],
              });
            }
            //  AsyncStorage.setItem('@access-token', data.access_token)
            //  Actions.push('dashboard')
          } else {
            //  alert(JSON.stringify(json))
            this.setState({
              spinner: false,
              subjectsData: [],
            });
          }
        } else if (json.error?.code === 400) {
          //alert("dknkdf")
          Alert.alert('My Professor', json.error.message, [
            { text: 'OK', onPress: () => this.logout() },
          ]);
        } else {
          this.setState({
            spinner: false,
            subjectsData: [],
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
  onBack() {
    Actions.dashboard({ type: 'reset' });
  }
  closeControlPanel = () => {
    this._drawer.close();
  };
  openControlPanel = () => {
    this._drawer.open();
  };
  render() {
    const isTablet = DeviceConstants.isTablet;
    var headfont = 20,
      backheight = 30,
      drawerwidth = 100,
      androidabsview = windowHeight / 1.25;
    if (isTablet) {
      (headfont = 30),
        (backheight = 45),
        (drawerwidth = 700),
        (androidabsview = windowHeight / 1.3);
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
                        width: backheight,
                        height: backheight,
                        tintColor: 'white',
                      }}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      color: 'white',
                      marginLeft: 20,
                      fontSize: headfont,
                    }}
                  >
                    My Practice
                  </Text>
                </View>
              </ImageBackground>
              <View
                style={{
                  height:
                    Platform.OS === 'android'
                      ? androidabsview
                      : windowHeight / 1.3,
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
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <ActivityIndicator color="black" />
                  </View>
                ) : (
                  <PracticeComponent
                    onBack={this.onBack.bind(this)}
                    subjectsData={this.state.subjectsData}
                  />
                )}
              </View>
            </View>
            <View style={styles.footerview}>
              <Footer openControlPanel={this.openControlPanel} />
            </View>
          </View>
        </Drawer>
      </SafeAreaView>
    );
  }
}
export default Practice;
