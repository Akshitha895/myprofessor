import React, { Component } from 'react';
import {
  Alert,
  BackHandler,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DeviceConstants from 'react-native-device-constants';
import * as Progress from 'react-native-progress';
import { Actions } from 'react-native-router-flux';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Drawer from 'react-native-drawer';
import Footer from '../../components/Footer';
import SideMenu from '../../components/SideMenu';
import { colors } from '../../constants';

import { baseUrl } from '../../constants';
import styles from './styles';

const windowWidth = Dimensions.get('window').width;

class Subjects extends Component {
  constructor(props) {
    super(props);
    this.getData = this.getData.bind(this);
    this.state = {
      spinner: true,
      subjectsData: [],
      token: '',
    };
  }
  componentDidMount() {
    // setTimeout(() => {
    // 	this.setState({loader: false});
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction
    );

    this.getData();
    //}, 2000)
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
    var userId = user.userInfo.userId;

    //grade?offset=0&limit=10&order_by=name&sort_order=DESC&board=1a060a8b-2e02-4bdf-8b70-041070f3747c&branch=-1
    var url = baseUrl + `/analytics/users/${userId}/subjects`;
    var body = {
      universityId: user.userOrg.universityId,
      branchId: user.userOrg.branchId,
      semesterId: user.userOrg.semesterId,
      offset: 0,
      limit: 10000,
    };
    // baseUrl+'/boards/'+board_id+'/grades/'+grade_id+'/subjects'
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
        console.log('adfasdgsgsfa', json);
        // const data = json.data;
        if (json.code === 201) {
          if (json.data.items) {
            const data = json.data;
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
        } else if (json.error?.code === 400) {
          //alert("dknkdf")
          Alert.alert('My Professor', json.error.message, [
            { text: 'OK', onPress: () => this.logout() },
          ]);
        } else {
          if (json.error) {
            alert(json.error.message);
          }
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
  closeControlPanel = () => {
    this._drawer.close();
  };
  openControlPanel = () => {
    this._drawer.open();
  };
  onBack() {
    Actions.dashboard({ type: 'reset' });
  }
  onChapter(item) {
    //this.updateAnalytics()
    Actions.push('chapters', { data: item });
  }
  renderItem({ item, index }) {
    // var imagesarray=[
    //     require('../../assets/images/dashboard/new/sub1.png'),
    //     require('../../assets/images/dashboard/new/sub2.png'),
    //     require('../../assets/images/dashboard/new/sub3.png'),
    //     require('../../assets/images/dashboard/new/sub4.png')
    // ]
    var colorsarray = [
      '#6a5177',
      '#d88212',
      '#277292',
      '#a3ba6d',
      '#deb026',
      '#c44921',
    ];
    var randomItem =
      colorsarray[Math.floor(Math.random() * colorsarray.length)];
    var bgcolor;

    colorsarray.splice(randomItem);
    const url = item.image;
    console.log('ssssss', item.color);
    var progress = 0 + 0.4 * Math.random();
    var percent = parseInt(item.progress);
    var color;
    if (item.progress > 80) {
      color = 'green';
    } else if (percent < 50) {
      color = 'red';
    } else {
      color = 'orange';
    }
    console.log('urlll', url);
    colorsarray.push(randomItem);
    if (item.color) {
      bgcolor = item.color;
    } else {
      item['color'] = randomItem;
      bgcolor = randomItem;
    }
    //item["color"] = bgcolor
    const isTablet = DeviceConstants.isTablet; // false
    var boxheight = 155,
      innerbox = 135,
      innerimageview = 70,
      innerimage = 60,
      noimage = 80,
      innerradius = 35,
      innertextsize = 15,
      innerbottomtext = 10,
      innerbottomnum = 12,
      innericon = 15,
      boxwidth = windowWidth / 1.7;
    console.log('jnjj', isTablet);
    if (isTablet) {
      //headfont = 25;
      //headsubtext = 20;
      boxheight = 225;
      innerbox = 205;
      innerimageview = 100;
      innerimage = 90;
      noimage = 110;
      innerradius = 50;
      innertextsize = 25;
      innerbottomtext = 18;
      innerbottomnum = 18;
      innericon = 20;
      boxwidth = windowWidth / 2;
    }
    return (
      <TouchableOpacity
        onPress={this.onChapter.bind(this, item)}
        underlayColor="transparent"
        activeOpacity={0.9}
        style={{
          height: boxheight,
          backgroundColor: 'transparent',
          width: windowWidth / 1.1,
          borderWidth: 0.1,
          borderColor: 'transparent',
          marginVertical: 5,
          overflow: 'hidden',
          borderRadius: 10,
          alignSelf: 'center',
        }}
      >
        <ImageBackground
          source={require('../../assets/images/dashboard/new/subjects_bg.png')}
          style={{
            width: windowWidth / 1.1,
            height: innerbox,
            alignSelf: 'center',
            backgroundColor: item.color,
          }}
          opacity={0.5}
        >
          <View style={{ flex: 1 }}>
            <View style={{ flex: 0.6 }}>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <View
                  style={{
                    flex: 0.3,
                    paddingLeft: 20,
                    justifyContent: 'center',
                  }}
                >
                  <View
                    style={{
                      width: innerimageview,
                      height: innerimageview,
                      borderRadius: innerimageview / 2,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    {item.image ? (
                      <Image
                        source={{ uri: url }}
                        style={{
                          width: innerimage,
                          height: innerimage,
                          resizeMode: 'cover',
                          borderRadius: innerimage / 2,
                        }}
                      />
                    ) : (
                      <Image
                        source={require('../../assets/images/noimage.png')}
                        style={{
                          width: noimage,
                          height: noimage,
                          resizeMode: 'contain',
                        }}
                      />
                    )}
                  </View>
                </View>
                <View
                  style={{
                    flex: 0.7,
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                  }}
                >
                  <Text
                    style={{
                      color: 'white',
                      fontSize: innertextsize,
                      fontWeight: 'bold',
                      paddingLeft: 20,
                    }}
                  >
                    {item.name}
                  </Text>
                </View>
              </View>
            </View>

            <View
              style={{
                flex: 0.4,
                flexDirection: 'row',
                justifyContent: 'space-around',
              }}
            >
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <View style={styles.innercountview}>
                  <Image
                    source={require('../../assets/images/1.png')}
                    style={{
                      width: innericon,
                      height: innericon,
                      tintColor: 'white',
                    }}
                  />
                  <Text style={[styles.icontext, { fontSize: innerbottomnum }]}>
                    {item.noOfChapters}
                  </Text>
                </View>
                <Text style={{ color: 'white', fontSize: innerbottomtext }}>
                  Chapters
                </Text>
              </View>
              {/* <View style={styles.innercountview}>
									 <Image source={require('../../assets/images/magnifier.png')} style={styles.iconview} />
								 </View> */}
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <View style={styles.innercountview}>
                  <Image
                    source={require('../../assets/images/2.png')}
                    style={{
                      width: innericon,
                      height: innericon,
                      tintColor: 'white',
                    }}
                  />
                  <Text style={[styles.icontext, { fontSize: innerbottomnum }]}>
                    {item.noOfTopics}
                  </Text>
                </View>
                <Text style={{ color: 'white', fontSize: innerbottomtext }}>
                  Topics
                </Text>
              </View>
            </View>
          </View>
        </ImageBackground>
        <Progress.Bar
          progress={percent / 100}
          width={windowWidth / 1.1}
          height={5}
          color={color}
          unfilledColor={'lightgrey'}
          borderColor={'transparent'}
        />
      </TouchableOpacity>
    );
  }
  render() {
    const isTablet = DeviceConstants.isTablet; // false
    var headfont = 20,
      backarrowheight = 15,
      backarrowwidth = 21,
      drawerwidth = 100;
    if (isTablet) {
      headfont = 30;
      backarrowheight = 20;
      backarrowwidth = 26;
      drawerwidth = 700;
    }
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <>
          <View style={styles.mainview}>
            <Drawer
              type="overlay"
              ref={(ref) => (this._drawer = ref)}
              tapToClose
              openDrawerOffset={drawerwidth}
              content={<SideMenu closeControlPanel={this.closeControlPanel} />}
            >
              <View style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      flex: 0.15,
                      justifyContent: 'center',
                      flexDirection: 'row',
                    }}
                  >
                    <View
                      style={{
                        flex: 0.7,
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginLeft: 20,
                      }}
                    >
                      <TouchableOpacity onPress={this.onBack.bind(this)}>
                        <Image
                          source={require('../../assets/images/refer/back.png')}
                          style={{
                            width: backarrowwidth,
                            height: backarrowheight,
                            tintColor: colors.Themecolor,
                          }}
                        />
                      </TouchableOpacity>
                      <Text
                        style={{
                          marginLeft: 20,
                          color: colors.Themecolor,
                          fontSize: headfont,
                        }}
                      >
                        My Courses
                      </Text>
                    </View>
                    <View style={{ flex: 0.3 }}>
                      <Image
                        source={require('../../assets/images/dashboard/new/subjabs.png')}
                        style={{
                          width: '100%',
                          height: '120%',
                          resizeMode: 'cover',
                        }}
                      />
                    </View>
                  </View>
                  <View style={{ flex: 0.85, marginHorizontal: 0 }}>
                    {this.state.spinner ? (
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Text style={{ fontSize: headfont }}>Loading.....</Text>
                      </View>
                    ) : this.state.subjectsData.length > 0 ? (
                      <FlatList
                        data={this.state.subjectsData}
                        renderItem={this.renderItem.bind(this)}
                      />
                    ) : null}
                  </View>
                </View>
                <View style={styles.footerview}>
                  <Footer openControlPanel={this.openControlPanel} />
                </View>
              </View>
            </Drawer>
          </View>
          {/* </View> */}
        </>
      </SafeAreaView>
    );
  }
}
export default Subjects;
