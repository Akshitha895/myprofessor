import React, { Component } from 'react';
import {
  BackHandler,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  View,
} from 'react-native';

import DeviceConstants from 'react-native-device-constants';
import PushNotification from 'react-native-push-notification';

import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import Drawer from 'react-native-drawer';
import ImageSlider from 'react-native-image-slider';
import Orientation from 'react-native-orientation-locker';
import { Actions } from 'react-native-router-flux';
import Footer from '../../components/Footer';
import Library from '../../components/Library';
import Loader from '../../components/Loader';
import SideMenu from '../../components/SideMenu';
import { baseUrl, imageUrl } from '../../constants';
import styles from './styles';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
//Orientation.lockToPortrait()

var imagewidth = windowWidth;
class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.getData = this.getData.bind(this);
    this._orientationDidChange = this._orientationDidChange.bind(this);
    this.state = {
      loader: false,
      userName: '',
      profile_pic: 'null',
      gradeName: 'null',
      schoolname: 'null',
      newdata: [],
      imagewidth: windowWidth,
      Orientationloading: true,
    };
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction
    );

    var _this = this;
    //	setTimeout(() => {
    this.setState({ loader: false });
    this.getData();
    //}, 2000)
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister(token) {
        console.log('logintoken:', token);
        _this.setState({
          device_token: token,
        });
      },

      // (required) Called when a remote is received or opened, or local notification is opened
      onNotification(notification) {
        console.log('dashboardnotifca:', notification);
        if (notification.data.notificationType === 'notification') {
          //alert(notification.data.notificationType)
          Actions.push('notifications', { title: 'tabs' });
        }
        // process the notification

        // (required) Called when a remote is received or opened, or local notification is opened
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
      senderID: '916634773599',

      // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
      onAction(notification) {
        //console.log("ACTION:", notification.action);
        console.log('dashonanction:', notification);

        // process the action
      },

      // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
      onRegistrationError(err) {
        console.log('jdkkc', err.message, err);
      },

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       * - if you are not using remote notification or do not have Firebase installed, use this:
       *     requestPermissions: Platform.OS === 'ios'
       */
      requestPermissions: true,
    });

    // PushNotification.createChannel(
    // 	{
    // 		channelId: "stepupchannel", // (required)
    // 		channelName: "stepupchannel", // (required)
    // 		channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
    // 		playSound: true, // (optional) default: true
    // 		soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
    // 		import ance: 4, // (optional) default: 4. Int value of the Android notification import ance
    // 		vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
    // 	},
    // 	(created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    // );
    // PushNotification.localNotification({
    // 	//... You can use all the options from localNotifications
    // 	channelId: "stepupchannel",
    // 	notificationType:"notification",
    // 	"userInteraction": true,
    // 	message: "My Notification Message", // (required)
    // 	allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
    // });
  }

  backAction = () => {
    // this.props.navigation.goBack(null);
    //  Actions.pop()
    return true;
    // Actions.topicmainview({from:this.props.from,type:"reset",data:this.props.topicindata,topicsdata:this.props.topicData,screen:"summary",subjectData:this.props.subjectData})
  };
  componentWillUnmount() {
    this.backHandler.remove();
  }

  _orientationDidChange = (orientation) => {
    console.log('newwwww' + orientation);
    if (orientation === 'LANDSCAPE') {
      imagewidth = windowHeight;
      //	alert("orientation"+orientation)
      this.setState({ imagewidth: windowHeight, Orientationloading: false });
    } else {
      //alert("dcdfjfnj"+orientation)
      imagewidth = windowWidth;
      //alert("orientation"+orientation)
      this.setState({ imagewidth: windowWidth, Orientationloading: false });
    }
  };
  componentWillUnmount() {
    // Remember to remove listener
    Orientation.removeOrientationListener(this._orientationDidChange);
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    //alert(nextProps)
  }

  getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@user');
      console.log(JSON.stringify(value));
      if (value !== null) {
        var data = JSON.parse(value);
        console.log('dataaa', data);
        this.getversion();

        this.setData(data);
      } else {
        //Actions.push('login')
      }
    } catch (e) {
      return null;
    }
  };
  getversion() {
    fetch(baseUrl + `/app-version/latest`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((json) => {
        //alert(JSON.stringify(json))
        if (json.code === 201) {
          console.log('kdjkdjaf', json);
          if (json.data) {
            var appversion = json.data.version;
            var data = appversion.split('v');
            ///alert(data[1])
            if (9.0 < data[1]) {
              Actions.versionupdate();
            }
          }
        } else {
        }
      })
      .catch((error) => console.error(error));
  }
  setData(data) {
    this.setState({
      userName: data.name ? data.name : data.first_name + ' ' + data.last_name,
      profile_pic: data.profile_pic ? imageUrl + data.profile_pic : 'null',
      gradeName: data.grade ? data.grade.name : 'null',
      newdata,
      schoolname: data.school ? data.school.name : 'null',
    });
  }
  closeControlPanel = () => {
    this._drawer.close();
  };
  openControlPanel = () => {
    this._drawer.open();
  };
  onItem(item) {
    if (item.name === 'Previous Papers') {
      Actions.push('previouspapers');
    } else if (item.name === 'Mock Test') {
      Actions.push('mocktest');
    } else if (item.name === 'My Practice') {
      Actions.push('practice');
    } else {
      Actions.push('analysis');
    }
  }

  render() {
    const url = imageUrl + this.state.profile_pic;
    const isTablet = DeviceConstants.isTablet; // false
    var height = 228,
      drawerwidth = 100,
      newarray = [],
      sliderwidth = windowWidth;
    if (isTablet) {
      Orientation.lockToLandscape();
      (height = 370), (drawerwidth = 700);
      newarray = [
        // require('../../assets/images/sliders/new/20+.png'),
        require('../../assets/images/sliders/new/engage.png'),
        require('../../assets/images/sliders/new/explore.png'),
        require('../../assets/images/sliders/new/evaluate.png'),
        //require('../../assets/images/sliders/new/Learning.png'),
      ];
    } else {
      Orientation.lockToPortrait();
      height = 200;
      newarray = [
        // require('../../assets/images/sliders/new/ph20+.png'),
        require('../../assets/images/sliders/new/phengage.png'),
        require('../../assets/images/sliders/new/phexplore.png'),
        require('../../assets/images/sliders/new/phevaluate.png'),
        //require('../../assets/images/sliders/new/phlearning.png'),
      ];
    }
    const images = newarray;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <View style={styles.mainview}>
            {this.state.loader ? (
              <Loader />
            ) : (
              <Drawer
                type="overlay"
                ref={(ref) => (this._drawer = ref)}
                tapToClose
                openDrawerOffset={drawerwidth}
                content={
                  <SideMenu closeControlPanel={this.closeControlPanel} />
                }
              >
                <View style={{ flex: 1 }}>
                  <View style={{ flex: 0.92 }}>
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                      <View style={{ flex: 1 }}>
                        <View style={{ flex: 0.3 }}>
                          <ImageSlider
                            loopBothSides
                            autoPlayWithInterval={5000}
                            images={images}
                            style={{
                              flex: 0,
                              height,
                            }}
                            customSlide={({ index, item, style, width }) => (
                              // It's import ant to put style here because it's got offset inside
                              <>
                                <Image
                                  source={item}
                                  style={{
                                    flex: 1,
                                    width: imagewidth,
                                    height,
                                  }}
                                />

                                {/* </View> */}
                              </>
                            )}
                          />
                        </View>
                        <View
                          style={{
                            flex: 0.7,
                            marginHorizontal: 0,
                            paddingTop: 10,
                          }}
                        >
                          <Library />
                        </View>
                      </View>
                    </ScrollView>
                  </View>
                  <View style={styles.footerview}>
                    <Footer
                      openControlPanel={this.openControlPanel}
                      value="dashboard"
                    />
                  </View>
                </View>
              </Drawer>
            )}
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
export default Dashboard;
