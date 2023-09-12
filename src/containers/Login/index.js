import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  Keyboard,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import DeviceConstants from 'react-native-device-constants';
import PushNotification from 'react-native-push-notification';
import { Actions } from 'react-native-router-flux';
import StringsOfLanguages from '../../StringsOfLanguages';
import { baseUrl } from '../../constants';
import styles from './styles';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
var textinoutwidth = windowWidth / 1.4,
  brownwidth = windowWidth / 1.2,
  brownheight = windowHeight / 2;
var logowidth = 72,
  logoheight = 72;
var isAuthTokenValid;
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      checked: false,
      hidePassword: true,
      spinner: false,
      device_token: '',
      showOTP: false,
      otp: '',
    };
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onCheck = this.onCheck.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  async componentDidMount() {
    //alert(this.props.localevalue)
    var _this = this;
    // Orientation.addOrientationListener(this._orientationDidChange);
    // Orientation.getOrientation((err, orientation) => {
    //     if (orientation === 'LANDSCAPE') {
    //         this.setState({ imgwidth: windowHeight / 1.2 })
    //         textinoutwidth = windowHeight / 3
    //         margintop = 90
    //         brownwidth = windowWidth / 1.5, brownheight = windowHeight / 2
    //     } else {
    //         this.setState({ imgwidth: windowWidth / 1.2 })
    //         textinoutwidth = windowWidth / 1.4
    //         margintop = 90
    //         brownwidth = windowWidth / 1.2, brownheight = windowHeight / 2
    //     }

    // });
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
        console.log('loginnnnNOTIFICATION:', notification);
        if (notification.data.notificationType === 'notification') {
          //alert(notification.data.notificationType)
          Actions.push('notifications', { title: 'tabs' });
        }
        // process the notification

        // (required) Called when a remote is received or opened, or local notification is opened
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },

      // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
      onAction(notification) {
        // console.log("ACTION:", notification.action);
        console.log('loginnNOTIFICATION:', notification);

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

    //         PushNotification.createChannel(
    //             {
    //               channelId: "stepupchannel", // (required)
    //               channelName: "stepupchannel", // (required)
    //               channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
    //               playSound: true, // (optional) default: true
    //               soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
    //               import ance: 4, // (optional) default: 4. Int value of the Android notification import ance
    //               vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
    //             },
    //             (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    //           );
    //     PushNotification.localNotification({
    //   //... You can use all the options from localNotifications
    //   channelId: "stepupchannel",
    //   message: "My Notification Message", // (required)
    //   allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
    // });
    const username = await AsyncStorage.getItem('@email');

    if (username !== null) {
      const password = await AsyncStorage.getItem('@password');

      if (password !== null) {
        //

        var details = {
          email: username,
          password,
        };

        this.setState(
          {
            email: username,
            password,
            checked: true,
          },
          () => console.log(this.state.email)
        );
      } else {
      }
    } else {
    }
    console.log('detailslogin,', this.props.user);
  }

  renderRedirectToRoot = async () => {
    isAuthTokenValid = await isUserAuthenticated();
    console.log('ddd', isAuthTokenValid);
    if (isAuthTokenValid) {
      Actions.push('main');
    }
  };

  onChangeEmail(text) {
    console.log('lkdfjkdjfk', text);
    this.setState({
      email: text,
    });
  }
  onChangePassword(text) {
    console.log('lkdfjkdjfk', text);
    this.setState({
      password: text,
    });
  }
  onCheck(value) {
    // alert(value)
    this.setState(
      {
        checked: value,
      },
      () => console.log(this.state.checked)
    );
    if (value === true) {
      //user wants to be remembered.

      AsyncStorage.setItem('@email', this.state.email);
      AsyncStorage.setItem('@password', this.state.password);
    } else {
      this.forgetUser();
    }
  }
  rememberUser = async () => {};
  getRememberedUser = async () => {};
  forgetUser = async () => {
    try {
      await AsyncStorage.removeItem('@email');
      await AsyncStorage.removeItem('@password');
      this.setState({
        email: '',
        password: '',
      });
    } catch (error) {
      // Error removing
    }
  };
  createAccount() {
    Actions.push('register', { email: 'email' });
  }
  forgotPassword() {
    Actions.push('forgotPassword', { forgotPassword: 'forgotPassword' });
  }
  onSubmit() {
    var email = this.state.email;
    var password = this.state.password;
    if (email === '') {
      alert('Please enter email or mobile number');
    } else if (password === '') {
      alert('please enter password');
    }
    // else if(password.length < 8 || password.length > 24){
    //     alert("please enter vaalidp pass")
    // }
    // else if (!Validations.email(email)) {
    //    // alert("please enter valid email")
    // }
    else {
      this.setState({ spinner: true });

      console.log('hello');
      const body = {
        userIdentifier: email,
        password,
        deviceType: 'android', //this.state.device_token.os,
        deviceId: DeviceConstants.deviceId,
        deviceToken: this.state.device_token.token,
        killSession: false,
      };
      console.log('dfsdafgdsfdsfgds', baseUrl + '/users/login', body);
      fetch(baseUrl + '/users/login', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
        .then((response) => response.json())
        .then((json) => {
          console.log('ddd.........', json);
          if (json.code === 201) {
            if (json.data?.loginResponse === 'session_exists') {
              Alert.alert(
                'Session Already Exists',
                'Do you want to terminate the existing session?',
                [
                  {
                    text: 'Cancel',
                    onPress: () => {
                      this.setState({
                        email: '',
                        password: '',
                        spinner: false,
                      });
                    },
                    style: 'cancel',
                  },
                  {
                    text: 'Terminate Session',
                    onPress: () => {
                      this.newloginapi();
                    },
                  },
                ]
              );
            } else {
              if (!json.data.userOrg.universityId) {
                const data = json.data;
                this.setState({ spinner: false });
                AsyncStorage.setItem('@user', JSON.stringify(data));
                AsyncStorage.setItem('@access_token', JSON.stringify(data.jwt));
                Actions.boards();
              } else {
                const data = json.data;
                this.setState({ spinner: false });
                AsyncStorage.setItem('@user', JSON.stringify(data));
                AsyncStorage.setItem('@access_token', JSON.stringify(data.jwt));
                Actions.dashboard();
              }
            }
          } else {
            this.setState({ spinner: false });
            if (json.error) {
              Alert.alert('My Professor', json.error.message);
            } else {
              Alert.alert('My Professor', json.message);
            }
          }
        })
        .catch((error) => console.log('dsfadFSD', error));
      //Actions.push('boards')
    }
  }

  newloginapi() {
    var email = this.state.email;
    var password = this.state.password;
    if (email === '') {
      alert('Please enter email or mobile number');
    } else if (password === '') {
      alert('please enter password');
    }
    // else if(password.length < 8 || password.length > 24){
    //     alert("please enter vaalidp pass")
    // }
    // else if (!Validations.email(email)) {
    //    // alert("please enter valid email")
    // }
    else {
      this.setState({ spinner: true });
      const body = {
        userIdentifier: email,
        password,
        deviceType: this.state.device_token.os,
        deviceId: DeviceConstants.deviceId,
        deviceToken: this.state.device_token.token,
        killSession: true,
      };
      console.log('dfsdafgdsfdsfgds', baseUrl + '/users/login', body);
      fetch(baseUrl + '/users/login', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
        .then((response) => response.json())
        .then((json) => {
          console.log('ddd.........', json);
          if (json.code === 201) {
            if (json.data?.loginResponse === 'session_exists') {
              Alert.alert(
                'Session Already Exists',
                'Do you want to terminate the existing session?',
                [
                  {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                  {
                    text: 'Terminate Session',
                    onPress: () => {
                      this.newloginapi();
                    },
                  },
                ]
              );
            } else {
              if (!json.data.userOrg.universityId) {
                const data = json.data;
                this.setState({ spinner: false });
                AsyncStorage.setItem('@user', JSON.stringify(data));
                AsyncStorage.setItem('@access_token', JSON.stringify(data.jwt));
                Actions.boards();
              } else {
                const data = json.data;
                this.setState({ spinner: false });
                AsyncStorage.setItem('@user', JSON.stringify(data));
                AsyncStorage.setItem('@access_token', JSON.stringify(data.jwt));
                Actions.dashboard();
              }
            }
          } else {
            this.setState({ spinner: false });
            if (json.error) {
              Alert.alert('My Professor', json.error.message);
            } else {
              Alert.alert('My Professor', json.message);
            }
          }
        })
        .catch((error) => console.log('dsfadFSD', error));
      //Actions.push('boards')
    }
  }
  setPasswordVisibility = () => {
    this.setState({ hidePassword: !this.state.hidePassword });
  };
  onchangeotp(text) {
    this.setState({ otp: text }, () => console.log('otppp', this.state.otp));
  }
  onVerify() {
    var mobile = this.state.otp;
    var email = this.state.email;
    if (mobile === '') {
      alert('Please enter OTP');
    } else {
      this.setState({ loading: true });
      var body = { email, otp: mobile };
      console.log('Boyyy', body);

      // this.loginapi()
      fetch(baseUrl + '/user/verify-otp', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
        .then((response) => response.json())
        .then((json) => {
          //   alert(JSON.stringify(json))
          if (json) {
            if (json.statusCode === 200) {
              this.setState({ loading: false });
              this.loginapi();
            } else {
              this.setState({ loading: false, otp: '' });
              //this.loginapi()
              alert(json.message);
            }
          }
        })
        .catch((error) => console.error(error));
    }
  }
  loginapi() {
    const body = {
      email: this.state.email,
      password: this.state.password,
      device_type: this.state.device_token.os,
      device_id: DeviceConstants.deviceId,
      device_token: this.state.device_token.token,
    };

    console.log('hello', body);
    fetch(baseUrl + '/user/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((json) => {
        const data = json.data;
        console.log('ddd', json);
        if (data) {
          const userdata = data.user;
          AsyncStorage.setItem('@user', JSON.stringify(data.user));
          AsyncStorage.setItem(
            '@access_token',
            JSON.stringify(data.access_token)
          );
          this.setState({ spinner: false });
          Actions.push('boards', { userData: data.user });
        } else {
          this.setState({ spinner: false });
          alert(json.message);
        }
      })
      .catch((error) => console.error(error));
  }
  onresend() {
    this.setState({ spinner: true });
    var body = { email: this.state.email, verified_account: true };
    console.log('Boyyy', body);
    fetch(baseUrl + '/user/forgot-password', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((json) => {
        // alert(JSON.stringify(json))
        if (json) {
          this.setState({ spinner: false });
          if (json.statusCode === 200) {
            Alert.alert('My Professor', json.message, [{ text: 'OK' }]);
          } else {
            alert(json.message);
          }
          // this.setState({ spinner: false })
          // Actions.push('otp',{email: email})
        }
      })
      .catch((error) => console.error(error));
  }
  render() {
    const isTablet = DeviceConstants.isTablet; // false
    var textinputheight = 50;
    textinputradius = 30;
    smallfont = 15;
    checkbox = 17;
    evileye = 15;
    loginbutton = 30;
    loginradius = 10;
    loginwidth = 100;
    createwidth = 150;
    //  textinoutwidth= windowWidth/1.4,
    subfont = 15;
    margintop = 130;

    if (isTablet) {
      (logowidth = 150), (logoheight = 150);
      textinputheight = 70;
      // textinoutwidth= windowWidth/1.3
      margintop = 50;
      textinputradius = 30;
      smallfont = 25;
      evileye = 30;
      subfont = 25;
      checkbox = 30;
      loginwidth = 250;
      loginbutton = 50;
      loginradius = 20;
      createwidth = 300;
      (brownwidth = windowWidth / 1.2), (brownheight = windowHeight / 1.5);
    }

    return (
      <SafeAreaView style={{ flex: 1 }}>
        {this.state.showOTP ? (
          <>
            <>
              <View style={{ flex: 1 }}>
                <ImageBackground
                  source={require('../../assets/images/login/newloginbg.png')}
                  style={{ width: '100%', height: '100%' }}
                >
                  <Image
                    source={require('../../assets/images/login/newloginabs.png')}
                    style={{
                      width: 247 / 1.1,
                      height: 318 / 1.1,
                      alignSelf: 'flex-end',
                    }}
                  />
                </ImageBackground>
              </View>
              <View
                style={{
                  flex: 1,
                  position: 'absolute',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  alignItems: 'center',
                }}
              >
                <View style={{ flex: 1 }}>
                  <View style={{ padding: 30, marginTop: margintop }}>
                    <ImageBackground
                      source={require('../../assets/images/login/brownrect.png')}
                      style={{
                        width: brownwidth,
                        height: brownheight,
                        justifyContent: 'space-evenly',
                      }}
                    >
                      <Image
                        source={require('../../assets/images/logo_icon1.png')}
                        style={{
                          width: logowidth,
                          height: logoheight,
                          alignSelf: 'center',
                        }}
                      />

                      <Text
                        style={{
                          fontSize: smallfont,
                          alignSelf: 'center',
                          color: 'white',
                        }}
                      >
                        An OTP has been sent to your email/mobile number
                      </Text>
                      <TextInput
                        placeholderTextColor={'grey'}
                        style={{
                          borderWidth: 1,
                          borderColor: '#E5E2E2',
                          width: textinoutwidth,
                          borderRadius: textinputradius,
                          alignSelf: 'center',
                          marginHorizontal: 15,
                          borderColor: '#E5E2E2',
                          backgroundColor: '#E5E2E2',
                          paddingLeft: 10,
                          fontSize: smallfont,
                          height: textinputheight,
                        }}
                        blurOnSubmit={false}
                        value={this.state.otp}
                        keyboardType={'number-pad'}
                        returnKeyType={'done'}
                        placeholder={'Enter OTP'}
                        onChangeText={this.onchangeotp.bind(this)}
                        onSubmitEditing={() => Keyboard.dismiss()}
                      />
                      <TouchableOpacity
                        onPress={this.onresend.bind(this)}
                        style={{
                          marginTop: 10,
                          marginRight: 10,
                          fontSize: smallfont,
                          alignSelf: 'flex-end',
                        }}
                      >
                        <Text style={{ color: '#F5AF77', fontSize: smallfont }}>
                          Resend OTP?
                        </Text>
                      </TouchableOpacity>
                      <View
                        style={{
                          marginHorizontal: 15,
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <TouchableOpacity onPress={this.onVerify.bind(this)}>
                          <View
                            style={{
                              width: loginwidth,
                              height: loginbutton,
                              borderRadius: textinputradius,
                              overflow: 'hidden',
                              justifyContent: 'center',
                              alignSelf: 'center',
                              backgroundColor: '#D94C2D',
                            }}
                          >
                            <Text
                              style={{
                                textAlign: 'center',
                                color: 'white',
                                fontSize: smallfont,
                              }}
                            >
                              Verify
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    </ImageBackground>
                  </View>
                </View>
              </View>
            </>
            {this.state.loading ? (
              <View
                style={{
                  position: 'absolute',
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  justifyContent: 'center',
                  height: '100%',
                  width: '100%',
                }}
              >
                <ActivityIndicator color={'black'} />
              </View>
            ) : null}
          </>
        ) : (
          <>
            <View style={{ flex: 1 }}>
              <ImageBackground
                source={require('../../assets/images/login/newloginbg.png')}
                style={{ width: '100%', height: '100%' }}
              >
                <Image
                  source={require('../../assets/images/login/newloginabs.png')}
                  style={{
                    width: 247 / 1.1,
                    height: 318 / 1.1,
                    alignSelf: 'flex-end',
                  }}
                />
              </ImageBackground>
            </View>
            <View
              style={{
                width: windowWidth,
                height: windowHeight,
                position: 'absolute',
                justifyContent: 'center',
                alignSelf: 'center',
                alignItems: 'center',
              }}
            >
              <View style={{ flex: 1, marginTop: margintop }}>
                <ImageBackground
                  source={require('../../assets/images/login/brownrect.png')}
                  style={{
                    width: brownwidth,
                    height: brownheight,
                    justifyContent: 'space-evenly',
                  }}
                >
                  <Image
                    source={require('../../assets/images/logo_icon1.png')}
                    style={{
                      width: logowidth,
                      height: logoheight,
                      alignSelf: 'center',
                    }}
                  />
                  <View
                    style={{
                      width: textinoutwidth,
                      alignSelf: 'center',
                      height: textinputheight,
                      borderWidth: 1,
                      backgroundColor: '#E5E2E2',
                      borderColor: '#E5E2E2',
                      borderRadius: textinputradius,
                      justifyContent: 'center',
                    }}
                  >
                    <TextInput
                      style={{
                        paddingLeft: 10,
                        width: '85%',
                        fontSize: smallfont,
                        borderColor: '#2e2e2e',
                      }}
                      placeholderTextColor={'grey'}
                      placeholder={StringsOfLanguages.emailtextinput}
                      blurOnSubmit={false}
                      value={this.state.email}
                      keyboardType={'email-address'}
                      onChangeText={this.onChangeEmail}
                      onSubmitEditing={() => this.secondTextInput.focus()}
                    />
                  </View>
                  <View
                    style={{
                      width: textinoutwidth,
                      alignSelf: 'center',
                      height: textinputheight,
                      borderWidth: 1,
                      backgroundColor: '#E5E2E2',
                      borderColor: '#E5E2E2',
                      borderRadius: textinputradius,
                      flexDirection: 'row',
                      justifyContent: 'center',
                    }}
                  >
                    <TextInput
                      ref={(input) => {
                        this.secondTextInput = input;
                      }}
                      placeholderTextColor={'grey'}
                      style={{
                        paddingLeft: 10,
                        width: '85%',
                        fontSize: smallfont,
                        borderColor: '#2e2e2e',
                      }}
                      placeholder={StringsOfLanguages.passwordtextinput}
                      value={this.state.password}
                      secureTextEntry={this.state.hidePassword}
                      onChangeText={this.onChangePassword}
                      onSubmitEditing={() => Keyboard.dismiss()}
                    />
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={{
                        width: '15%',
                        height: textinputheight,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      onPress={this.setPasswordVisibility}
                    >
                      <Image
                        source={
                          this.state.hidePassword
                            ? require('../../assets/images/ic_visibility.png')
                            : require('../../assets/images/ic_visibility_off.png')
                        }
                        style={{
                          resizeMode: 'contain',
                          height: '50%',
                          width: '50%',
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: textinoutwidth,
                      justifyContent: 'space-between',
                      alignSelf: 'center',
                    }}
                  >
                    <View style={{ flexDirection: 'row' }}>
                      {this.state.checked ? (
                        <TouchableOpacity
                          onPress={() => this.onCheck(false)}
                          style={styles.checkboxview}
                        >
                          <Image
                            source={require('../../assets/images/check.png')}
                            style={{
                              width: checkbox,
                              height: checkbox,
                              alignSelf: 'center',
                              tintColor: 'lightgrey',
                            }}
                          />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={() => this.onCheck(true)}
                          style={styles.checkboxview}
                        >
                          <Image
                            source={require('../../assets/images/uncheck.png')}
                            style={{
                              width: checkbox,
                              height: checkbox,
                              alignSelf: 'center',
                              tintColor: 'lightgrey',
                            }}
                          />
                        </TouchableOpacity>
                      )}

                      <Text
                        style={{
                          color: '#F5AF77',
                          fontSize: subfont,
                          marginLeft: 10,
                        }}
                      >
                        {StringsOfLanguages.rememberme}
                      </Text>
                    </View>
                    <TouchableOpacity onPress={this.forgotPassword}>
                      <Text style={{ color: '#F5AF77', fontSize: subfont }}>
                        {StringsOfLanguages.forgotpassword}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      paddingHorizontal: 10,
                    }}
                  >
                    <TouchableOpacity onPress={this.onSubmit}>
                      <View
                        style={{
                          backgroundColor: '#D94C2D',
                          borderRadius: textinputradius,
                          overflow: 'hidden',
                          justifyContent: 'center',
                          width: loginwidth,
                          alignItems: 'center',
                          height: loginbutton,
                        }}
                      >
                        <Text
                          style={{
                            textAlign: 'center',
                            color: 'white',
                            fontSize: smallfont,
                          }}
                        >
                          {StringsOfLanguages.login}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <View
                      style={{
                        borderRadius: textinputradius,
                        borderWidth: 1.5,
                        borderColor: '#D94C2D',
                        justifyContent: 'center',
                        width: loginwidth + 30,
                      }}
                    >
                      <TouchableOpacity onPress={this.createAccount}>
                        <Text
                          style={{
                            textAlign: 'center',
                            color: '#D94C2D',
                            fontSize: smallfont,
                          }}
                        >
                          {StringsOfLanguages.createaccount}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </ImageBackground>
              </View>
            </View>
            {this.state.spinner ? (
              <View
                style={{
                  position: 'absolute',
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  justifyContent: 'center',
                  height: windowHeight,
                  width: windowWidth,
                }}
              >
                <ActivityIndicator color={'black'} />
              </View>
            ) : null}
          </>
        )}
      </SafeAreaView>
    );
  }
}

export default Login;
