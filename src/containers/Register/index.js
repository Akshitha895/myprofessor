/* eslint-disable no-undef */
import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DeviceConstants from 'react-native-device-constants';
import PushNotification from 'react-native-push-notification';
import { Actions } from 'react-native-router-flux';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

import RNPickerSelect from 'react-native-picker-select';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseUrl, colors } from '../../constants';
import { Validations } from '../../helpers';
import styles from './styles';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

var FloatingLabel = require('react-native-floating-labels');
var radio_props = [
  { label: 'Male', value: 0 },
  { label: 'Female', value: 1 },
];
var states = [
  { label: 'Andhra Pradesh', value: 'Andhra Pradesh' },
  { label: 'Arunachal Pradesh', value: 'Arunachal Pradesh' },
  { label: 'Assam', value: 'Assam' },
  { label: 'Bihar', value: 'Bihar' },
  { label: 'Chhattisgarh', value: 'Chhattisgarh' },
  { label: 'Goa', value: 'Goa' },
  { label: 'Gujarat', value: 'Gujarat' },
  { label: 'Haryana', value: 'Haryana' },
  { label: 'Himachal Pradesh', value: 'Himachal Pradesh' },
  { label: 'Jharkhand', value: 'Jharkhand' },
  { label: 'Karnataka', value: 'Karnataka' },
  { label: 'Kerela', value: 'Kerela' },
  { label: 'Madhya Pradesh', value: 'Madhya Pradesh' },
  { label: 'Maharastra', value: 'Maharastra' },
  { label: 'Manipur', value: 'Manipur' },
  { label: 'Meghalaya', value: 'Meghalaya' },
  { label: 'Mizoram', value: 'Mizoram' },
  { label: 'Nagaland', value: 'Nagaland' },
  { label: 'Odisha', value: 'Odisha' },
  { label: 'Punjab', value: 'Punjab' },
  { label: 'Rajasthan', value: 'Rajasthan' },
  { label: 'Sikkim', value: 'Sikkim' },
  { label: 'Tamil Nadu', value: 'Tamil Nadu' },
  { label: 'Tripura', value: 'Tripura' },
  { label: 'Uttarakhand', value: 'Uttarakhand' },
  { label: 'Uttar Pradesh', value: 'Uttar Pradesh' },
  { label: 'West Bengal', value: 'West Bengal' },
  { label: 'Puducherry', value: 'Puducherry' },
  { label: 'Ladakh', value: 'Ladakh' },
  { label: 'Jammu & Kashmir', value: 'Jammu & Kashmir' },
  {
    label: 'MizoramDadra and Nagar Haveli and Daman & Diu',
    value: 'MizoramDadra and Nagar Haveli and Daman & Diu',
  },
  { label: 'Delhi', value: 'Delhi' },
  { label: 'Chandigarh', value: 'Chandigarh' },
  {
    label: 'Andaman and Nicobar Islands',
    value: 'Andaman and Nicobar Islands',
  },
];
var logowidth = 72,
  logoheight = 72;
class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      FName: '',
      LName: '',
      pincode: '',
      password: '',
      confPassword: '',
      mobile_number: '',
      spinner: false,
      device_token: '',
      showOTP: this.props.showotpscreen ? true : false,
      loading: false,
      genderval: null,
      otp: '',
      statevalue: '',
      university: '',
      branch: '',
      semester: '',
      userData: null,
      refercode: '',
      universities: [],
      branches: [],
      semesters: [],
    };
    this.onInputOrSelectChange = this.onInputOrSelectChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  getUniversities() {
    fetch(baseUrl + `/universities?offset=${0}&limit=${1000}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.data) {
          var data = json.data;
          if (data.items) {
            this.setState({
              spinner: false,
              universities: data.items.map((uni) => ({
                label: uni.name,
                value: uni.id,
              })),
            });
          }
        } else {
          this.setState({
            spinner: false,
            universities: [],
          });
        }
      });
  }

  getBranches() {
    fetch(
      baseUrl +
        `/universities/${
          this.state.university
        }/branches?offset=${0}&limit=${1000}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    )
      .then((response) => response.json())
      .then((json) => {
        if (json.data) {
          var data = json.data;
          if (data.items) {
            this.setState({
              spinner: false,
              branches: data.items.map((branch) => ({
                label: branch.name,
                value: branch.id,
              })),
            });
          }
        } else {
          this.setState({
            spinner: false,
            branches: [],
          });
        }
      });
  }

  getSemesters() {
    fetch(
      baseUrl +
        `/universities/${this.state.university}/branches/${
          this.state.branch
        }/semesters?offset=${0}&limit=${1000}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    )
      .then((response) => response.json())
      .then((json) => {
        if (json.data) {
          var data = json.data;
          if (data.items) {
            this.setState({
              spinner: false,
              semesters: data.items.map((sem) => ({
                label: sem.name,
                value: sem.id,
              })),
            });
          }
        } else {
          this.setState({
            spinner: false,
            semesters: [],
          });
        }
      });
  }

  async componentDidMount() {
    var _this = this;

    //  alert(_this.props.showotpscreen)
    const value = await AsyncStorage.getItem('@user');
    if (value !== null) {
      _this.setState({
        userData: JSON.parse(value),
      });
      if (_this.props.showotpscreen) {
        //alert("kncjkncvkancknc")
        _this.generateotp(JSON.parse(value));
      }
    }

    this.getUniversities();

    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister(token) {
        console.log('TOKEN:', token);
        _this.setState({
          device_token: token,
        });
      },

      // (required) Called when a remote is received or opened, or local notification is opened
      onNotification(notification) {
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
        console.log('ACTION:', notification.action);
        console.log('NOTIFICATION:', notification);

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
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.university !== this.state.university &&
      this.state.university !== '' &&
      this.state.branches.length === 0
    ) {
      this.getBranches();
    } else if (
      prevState.branch !== this.state.branch &&
      this.state.branch !== '' &&
      this.state.semesters.length === 0
    ) {
      this.getSemesters();
    }
  }

  onInputOrSelectChange = (key, value) => {
    this.setState((s) => ({ ...s, [key]: value }));
  };

  onSubmit() {
    var {
      email,
      mobile_number,
      FName,
      LName,
      pincode,
      password,
      confPassword,
      genderval,
      statevalue,
      university,
      branch,
      semester,
    } = this.state;
    if (FName === '') {
      Alert.alert('My Professor', 'Please enter First Name');
    } else if (LName === '') {
      Alert.alert('My Professor', 'please enter Last Name');
    } else if (genderval === null) {
      Alert.alert('My Professor', 'please select gender');
    } else if (email === '') {
      Alert.alert('My Professor', 'please enter Email');
    } else if (password === '') {
      Alert.alert('My Professor', 'please enter Password');
    } else if (confPassword === '') {
      Alert.alert('My Professor', 'please enter Confirm Password');
    } else if (mobile_number === '') {
      Alert.alert('My Professor', 'please enter Mobile number');
    } else if (statevalue === '') {
      Alert.alert('My Professor', 'please select state');
    } else if (pincode === '') {
      Alert.alert('My Professor', 'please enter Pincode');
    } else if (!Validations.email(email)) {
      Alert.alert('My Professor', 'please enter valid email');
    } else if (password.length < 8 || confPassword.length > 24) {
      alert('please enter valid password with minimum 8 characters');
    } else if (password !== confPassword) {
      Alert.alert(
        'My Professor',
        "password and confirm password doesn't match"
      );
    } else if (university === '') {
      Alert.alert('My Professor', 'please select university');
    } else if (branch === '') {
      Alert.alert('My Professor', 'please select branch');
    } else if (semester === '') {
      Alert.alert('My Professor', 'please select semester');
    } else if (!Validations.phoneNumber(mobile_number)) {
      Alert.alert('My Professor', 'please enter valid phone number');
    } else if (!Validations.validatePincode(pincode)) {
      Alert.alert('My Professor', 'please enter valid pincode');
    } else {
      var genderva;
      if (this.state.genderval === 0) {
        genderva = 'Male';
      } else if (this.state.genderval === 1) {
        genderva = 'Female';
      }
      this.setState({ spinner: true });
      var inviteCode = null;
      if (this.state.refercode !== '') {
        inviteCode = this.state.refercode;
      }
      const body = {
        // name: FName + " " + LName,
        firstName: FName,
        lastName: LName,
        email,
        mobile: mobile_number,
        gender: genderva,
        state: this.state.statevalue,
        //  provision: this.state.statevalue,
        zipCode: pincode,
        password,
        confirmPassword: confPassword,
        inviteCode,
        user_role: 'General Student',
        universityId: university,
        branchId: branch,
        semesterId: semester,
      };
      // this.props.registerUser(body)
      console.log('hello', body);
      fetch(baseUrl + '/users/new-registration', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
        .then((response) => response.json())
        .then((json) => {
          console.log('rgisrteerrrrrrr', json);
          if (json.data) {
            this.setState({
              userData: json.data.user,
            });
            AsyncStorage.setItem('@user', JSON.stringify(json.data.user));
            this.generateotp(json.data.user);
          } else {
            this.setState({ spinner: false });

            Alert.alert('My Professor', json.error.message);
          }
        })
        .catch((error) => console.error(error));
      //Actions.push('boards')
    }
  }

  generateotp(user) {
    var url = baseUrl + '/users/' + user.id + '/validate-account/generate-otp';
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((json) => {
        console.log('otpgenerate', json);
        if (json.code === 201) {
          // AsyncStorage.setItem('@user', JSON.stringify(user))
          this.setState({
            showOTP: true,
            spinner: false,
          });
        } else {
          this.setState({ spinner: false });

          Alert.alert('My Professor', json.error.message);
        }
      })
      .catch((error) => console.error(error));
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
        console.log('ddd', json);
        if (json.code === 201) {
          const data = json.data;
          AsyncStorage.setItem('@user', JSON.stringify(data));
          AsyncStorage.setItem('@access_token', JSON.stringify(data.jwt));
          this.setState({ spinner: false });
          Actions.push('boards', { userData: data });
        } else {
          this.setState({ spinner: false });
          alert(json.message);
        }
      })
      .catch((error) => console.error(error));
  }

  onCancel() {
    Actions.login({ type: 'reset' });
  }
  onchangeotp(text) {
    this.setState({ otp: text }, () => console.log('otppp', this.state.otp));
  }

  onVerify() {
    var mobile = this.state.otp;
    if (mobile === '') {
      alert('Please enter OTP');
    } else {
      this.setState({ loading: true });
      var body = { otp: mobile };
      console.log('Boyyy', body);

      // this.loginapi()
      fetch(
        baseUrl + '/users/' + this.state.userData.id + '/validate-web-account',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      )
        .then((response) => response.json())
        .then((json) => {
          console.log('verifiredcaaa', json);
          if (json) {
            if (json.data) {
              this.setState({ loading: false });
              AsyncStorage.setItem('@user', JSON.stringify(json.data));
              // AsyncStorage.setItem('@access_token', JSON.stringify(data.jwt))
              this.setState({ spinner: false });
              // Actions.push('boards', { userData: json.data });
              Alert.alert(
                'My Professor',
                'Account created successfully. Please login.',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      Actions.login({ type: 'reset' });
                    },
                  },
                ]
              );
              // Actions.push('login');
            } else {
              this.setState({ loading: false });
              //  this.loginapi()
              alert(json.error.message);
            }
          }
        })
        .catch((error) => console.error(error));
      //  this.setState({
      //      showCnfpass: true
      //  })
    }
  }
  onsubjectclick(value, index) {
    // console.log("val", value, this.state.subjectslist[index - 1]);
    this.setState({
      statevalue: value,
      //selectedsubid: this.state.subjectslist[index - 1].id
    });
  }
  onresend() {
    this.setState({ spinner: true });
    var url =
      baseUrl +
      '/users/' +
      this.state.userData.id +
      '/validate-account/generate-otp';
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((json) => {
        console.log('otpgenerate', json);
        if (json.code === 201) {
          this.setState({
            showOTP: true,
            spinner: false,
          });
        } else {
          this.setState({ spinner: false });

          Alert.alert('My Professor', json.error.message);
        }
      })
      .catch((error) => console.error(error));
  }

  render() {
    const placeholder = {
      label: 'Select  State...',
      value: null,
      color: 'black',
    };
    const universityPlaceholder = {
      label: 'Select  University...',
      value: null,
      color: 'black',
    };
    const branchPlaceholder = {
      label: 'Select  Branch...',
      value: null,
      color: 'black',
    };
    const semesterPlaceholder = {
      label: 'Select  Semester...',
      value: null,
      color: 'black',
    };
    const isTablet = DeviceConstants.isTablet; // false
    var textinputheight = 50,
      textinputradius = 30,
      smallfont = 15,
      checkbox = 17,
      evileye = 15,
      loginbutton = 30,
      loginradius = 10,
      loginwidth = 100,
      createwidth = 150,
      subfont = 15,
      buttonSize = 10,
      buttonOutersize = 20,
      buttonwidth = 367 / 3,
      buttonheight = 90 / 3;
    if (isTablet) {
      (logowidth = 82), (logoheight = 82);
      textinputheight = 70;
      textinputradius = 30;
      smallfont = 20;
      evileye = 30;
      subfont = 22;
      checkbox = 26;
      loginwidth = 200;
      loginbutton = 50;
      loginradius = 20;
      createwidth = 300;
      buttonSize = 15;
      buttonOutersize = 30;
      (buttonwidth = 367 / 2), (buttonheight = 90 / 2);
    }
    return (
      <SafeAreaView style={{ flex: 1 }}>
        {this.state.showOTP ? (
          <>
            <>
              <View style={{ flex: 1 }}>
                <TouchableOpacity onPress={() => AsyncStorage.clear()}>
                  <Text>Clear</Text>
                </TouchableOpacity>
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
                  <View style={{ padding: 30, marginTop: windowHeight / 5.5 }}>
                    <ImageBackground
                      source={require('../../assets/images/login/brownrect.png')}
                      style={{
                        width: windowWidth / 1.2,
                        height: windowHeight / 2.5,
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
                        An OTP has been sent to your email
                      </Text>
                      <TextInput
                        placeholderTextColor={'grey'}
                        style={{
                          borderWidth: 1,
                          borderColor: '#E5E2E2',
                          width: windowWidth / 1.4,
                          borderRadius: textinputradius,
                          marginHorizontal: 15,
                          alignSelf: 'center',
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
                          fontSize: 18,
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
        ) : Platform.OS === 'android' ? (
          <>
            <ImageBackground
              style={{
                width: '100%', //Dimensions.get("window").width, //for full screen
                height: '100%', // Dimensions.get("window").height, //for full screen
                zIndex: -1,
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
              source={require('../../assets/images/login/newloginbg.png')}
            />

            <ScrollView
              contentInsetAdjustmentBehavior="automatic"
              keyboardShouldPersistTaps={'handled'}
              contentContainerStyle={{ flexGrow: 1 }}
              style={{
                backgroundColor: 'transparent',
                overflow: 'hidden',
              }}
            >
              <View
                style={{
                  backgroundColor: 'rgba(124, 61, 76,0.2)',
                  //height:"100%",
                  margin: 20,
                  borderWidth: 1,
                  borderRadius: 20,
                  borderColor: 'transparent',
                  overflow: 'hidden',
                }}
              >
                <Image
                  source={require('../../assets/images/logo_icon1.png')}
                  style={{
                    width: logowidth,
                    height: logoheight,
                    alignSelf: 'center',
                    marginTop: 10,
                  }}
                />
                <View
                  style={{
                    width: windowWidth / 1.3,
                    alignSelf: 'center',
                    height: textinputheight,
                    marginTop: 20,
                    borderWidth: 1,
                    backgroundColor: '#E5E2E2',
                    borderColor: '#E5E2E2',
                    borderRadius: textinputradius,
                    justifyContent: 'center',
                  }}
                >
                  <TextInput
                    style={{
                      width: '100%',
                      paddingLeft: 10,
                      fontSize: smallfont,
                    }}
                    placeholderTextColor={'grey'}
                    placeholder={'First Name'}
                    blurOnSubmit={false}
                    value={this.state.FName}
                    onChangeText={(val) =>
                      this.onInputOrSelectChange('FName', val)
                    }
                    onSubmitEditing={() => this.secondTextInput.focus()}
                  />
                </View>
                <View
                  style={{
                    width: windowWidth / 1.3,
                    alignSelf: 'center',
                    height: textinputheight,
                    marginTop: 20,
                    borderWidth: 1,
                    backgroundColor: '#E5E2E2',
                    borderColor: '#E5E2E2',
                    borderRadius: textinputradius,
                    justifyContent: 'center',
                  }}
                >
                  <TextInput
                    ref={(input) => {
                      this.secondTextInput = input;
                    }}
                    style={{
                      width: '100%',
                      paddingLeft: 10,
                      fontSize: smallfont,
                    }}
                    placeholderTextColor={'grey'}
                    placeholder={'Last Name'}
                    blurOnSubmit={false}
                    value={this.state.LName}
                    onChangeText={(val) =>
                      this.onInputOrSelectChange('LName', val)
                    }
                    onSubmitEditing={() => this.thirdTextInput.focus()}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 20,
                    width: windowWidth / 1.3,
                    alignSelf: 'center',
                    height: textinputheight,
                  }}
                >
                  <View style={{}}>
                    <RadioForm formHorizontal animation>
                      {/* To create radio buttons, loop through your array of options */}
                      {radio_props.map((obj, i) => (
                        <RadioButton labelHorizontal key={i}>
                          {/*  You can set RadioButtonLabel before RadioButtonInput */}
                          <RadioButtonInput
                            obj={obj}
                            index={i}
                            isSelected={this.state.genderval === i}
                            onPress={(value) => {
                              //  alert(value)
                              this.setState({ genderval: value });
                            }}
                            borderWidth={1}
                            buttonInnerColor={'#E5E2E2'}
                            buttonOuterColor={'#E5E2E2'}
                            buttonSize={buttonSize}
                            buttonOuterSize={buttonOutersize}
                            buttonStyle={{}}
                            buttonWrapStyle={{ marginLeft: 10 }}
                          />
                          <RadioButtonLabel
                            obj={obj}
                            index={i}
                            labelHorizontal
                            onPress={(value) =>
                              this.setState({ genderval: value })
                            }
                            labelStyle={{
                              fontSize: smallfont,
                              color: '#E5E2E2',
                            }}
                            labelWrapStyle={{}}
                          />
                        </RadioButton>
                      ))}
                    </RadioForm>
                  </View>
                </View>
                <View
                  style={{
                    width: windowWidth / 1.3,
                    alignSelf: 'center',
                    height: textinputheight,
                    marginTop: 20,
                    borderWidth: 1,
                    backgroundColor: '#E5E2E2',
                    borderColor: '#E5E2E2',
                    borderRadius: textinputradius,
                    justifyContent: 'center',
                  }}
                >
                  <TextInput
                    ref={(input) => {
                      this.thirdTextInput = input;
                    }}
                    style={{
                      width: '100%',
                      paddingLeft: 10,
                      fontSize: smallfont,
                    }}
                    placeholderTextColor={'grey'}
                    placeholder={'Email'}
                    blurOnSubmit={false}
                    value={this.state.email}
                    keyboardType={'email-address'}
                    onChangeText={(val) =>
                      this.onInputOrSelectChange('email', val)
                    }
                    onSubmitEditing={() => this.fourthInputText.focus()}
                  />
                </View>
                <View
                  style={{
                    width: windowWidth / 1.3,
                    alignSelf: 'center',
                    height: textinputheight,
                    marginTop: 20,
                    borderWidth: 1,
                    backgroundColor: '#E5E2E2',
                    borderColor: '#E5E2E2',
                    borderRadius: textinputradius,
                    justifyContent: 'center',
                  }}
                >
                  <TextInput
                    ref={(input) => {
                      this.fourthInputText = input;
                    }}
                    style={{
                      width: '100%',
                      paddingLeft: 10,
                      fontSize: smallfont,
                    }}
                    placeholderTextColor={'grey'}
                    secureTextEntry
                    placeholder={'Create Password'}
                    blurOnSubmit={false}
                    value={this.state.password}
                    onChangeText={(val) =>
                      this.onInputOrSelectChange('password', val)
                    }
                    onSubmitEditing={() => this.fifthTextInput.focus()}
                  />
                </View>
                <View
                  style={{
                    width: windowWidth / 1.3,
                    alignSelf: 'center',
                    height: textinputheight,
                    marginTop: 20,
                    borderWidth: 1,
                    backgroundColor: '#E5E2E2',
                    borderColor: '#E5E2E2',
                    borderRadius: textinputradius,
                    justifyContent: 'center',
                  }}
                >
                  <TextInput
                    ref={(input) => {
                      this.fifthTextInput = input;
                    }}
                    style={{
                      width: '100%',
                      paddingLeft: 10,
                      fontSize: smallfont,
                    }}
                    placeholderTextColor={'grey'}
                    secureTextEntry
                    placeholder={'Confirm Password'}
                    blurOnSubmit={false}
                    value={this.state.confPassword}
                    onChangeText={(val) =>
                      this.onInputOrSelectChange('confPassword', val)
                    }
                    onSubmitEditing={() => this.sixthTextInput.focus()}
                  />
                </View>
                <View
                  style={{
                    width: windowWidth / 1.3,
                    alignSelf: 'center',
                    height: textinputheight,
                    marginTop: 20,
                    borderWidth: 1,
                    backgroundColor: '#E5E2E2',
                    borderColor: '#E5E2E2',
                    borderRadius: textinputradius,
                    justifyContent: 'center',
                  }}
                >
                  <TextInput
                    ref={(input) => {
                      this.sixthTextInput = input;
                    }}
                    style={{
                      width: '100%',
                      paddingLeft: 10,
                      fontSize: smallfont,
                    }}
                    placeholderTextColor={'grey'}
                    placeholder={'Mobile Number'}
                    blurOnSubmit={false}
                    value={this.state.mobile_number}
                    onChangeText={(val) =>
                      this.onInputOrSelectChange('mobile_number', val)
                    }
                    keyboardType={'number-pad'}
                    returnKeyType={'done'}
                    onSubmitEditing={() => Keyboard.dismiss()}
                  />
                </View>

                <View
                  style={{
                    width: windowWidth / 1.3,
                    marginTop: 20,
                    alignSelf: 'center',
                    borderColor: colors.Themecolor,
                    flexDirection: 'row',
                    borderBottomWidth: 1,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <RNPickerSelect
                    placeholder={universityPlaceholder}
                    value={this.state.university}
                    style={pickerSelectStyles}
                    useNativeAndroidPickerStyle={false}
                    onValueChange={(val) =>
                      this.onInputOrSelectChange('university', val)
                    }
                    items={this.state.universities}
                  />
                  <Image
                    source={require('../../assets/images/downarrow.png')}
                    style={{
                      position: 'absolute',
                      width: 15,
                      height: 15,
                      tintColor: colors.Themecolor,
                      right: 10,
                    }}
                  />
                </View>

                <View
                  style={{
                    width: windowWidth / 1.3,
                    marginTop: 20,
                    alignSelf: 'center',
                    borderColor: colors.Themecolor,
                    flexDirection: 'row',
                    borderBottomWidth: 1,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <RNPickerSelect
                    placeholder={branchPlaceholder}
                    value={this.state.branch}
                    style={pickerSelectStyles}
                    useNativeAndroidPickerStyle={false}
                    onValueChange={(val) =>
                      this.onInputOrSelectChange('branch', val)
                    }
                    items={this.state.branches}
                  />
                  <Image
                    source={require('../../assets/images/downarrow.png')}
                    style={{
                      position: 'absolute',
                      width: 15,
                      height: 15,
                      tintColor: colors.Themecolor,
                      right: 10,
                    }}
                  />
                </View>

                <View
                  style={{
                    width: windowWidth / 1.3,
                    marginTop: 20,
                    alignSelf: 'center',
                    borderColor: colors.Themecolor,
                    flexDirection: 'row',
                    borderBottomWidth: 1,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <RNPickerSelect
                    placeholder={semesterPlaceholder}
                    value={this.state.semester}
                    style={pickerSelectStyles}
                    useNativeAndroidPickerStyle={false}
                    onValueChange={(val) =>
                      this.onInputOrSelectChange('semester', val)
                    }
                    items={this.state.semesters}
                  />
                  <Image
                    source={require('../../assets/images/downarrow.png')}
                    style={{
                      position: 'absolute',
                      width: 15,
                      height: 15,
                      tintColor: colors.Themecolor,
                      right: 10,
                    }}
                  />
                </View>

                <View
                  style={{
                    width: windowWidth / 1.3,
                    marginTop: 20,
                    alignSelf: 'center',
                    borderColor: colors.Themecolor,
                    flexDirection: 'row',
                    borderBottomWidth: 1,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <RNPickerSelect
                    placeholder={placeholder}
                    value={this.state.statevalue}
                    style={pickerSelectStyles}
                    useNativeAndroidPickerStyle={false}
                    onValueChange={this.onsubjectclick.bind(this)}
                    items={states}
                  />
                  <Image
                    source={require('../../assets/images/downarrow.png')}
                    style={{
                      position: 'absolute',
                      width: 15,
                      height: 15,
                      tintColor: colors.Themecolor,
                      right: 10,
                    }}
                  />
                </View>
                <View
                  style={{
                    width: windowWidth / 1.3,
                    alignSelf: 'center',
                    height: textinputheight,
                    marginTop: 20,
                    borderWidth: 1,
                    backgroundColor: '#E5E2E2',
                    borderColor: '#E5E2E2',
                    borderRadius: textinputradius,
                    justifyContent: 'center',
                  }}
                >
                  <TextInput
                    style={{
                      width: '100%',
                      paddingLeft: 10,
                      fontSize: smallfont,
                    }}
                    placeholderTextColor={'grey'}
                    keyboardType={'number-pad'}
                    placeholder={'Pin Code'}
                    blurOnSubmit={false}
                    value={this.state.pincode}
                    onChangeText={(val) =>
                      this.onInputOrSelectChange('pincode', val)
                    }
                    onSubmitEditing={() => Keyboard.dismiss()}
                  />
                </View>
                <View
                  style={{
                    width: windowWidth / 1.3,
                    alignSelf: 'center',
                    height: textinputheight,
                    marginTop: 20,
                    borderWidth: 1,
                    backgroundColor: '#E5E2E2',
                    borderColor: '#E5E2E2',
                    borderRadius: textinputradius,
                    justifyContent: 'center',
                  }}
                >
                  <TextInput
                    style={{
                      width: '100%',
                      paddingLeft: 10,
                      fontSize: smallfont,
                    }}
                    placeholderTextColor={'grey'}
                    returnKeyType={'done'}
                    placeholder={'Referal Code(If any)'}
                    blurOnSubmit={false}
                    value={this.state.refercode}
                    onChangeText={(val) =>
                      this.onInputOrSelectChange('refercode', val)
                    }
                    onSubmitEditing={() => Keyboard.dismiss()}
                  />
                </View>
                {/* <FloatingLabel
                                        labelStyle={styles.labelstyle}
                                        inputStyle={styles.input}
                                        style={styles.textinput}
                                        keyboardType={"number-pad"}
                                        returnKeyType={"done"}
                                        blurOnSubmit={false}
                                        onChangeText={(val) => this.onInputOrSelectChange('pincode', val)}
                                        onSubmitEditing={() => Keyboard.dismiss()}
                                    >Pin Code</FloatingLabel> */}

                <View
                  style={{
                    marginHorizontal: 20,
                    marginVertical: 30,
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                  }}
                >
                  <TouchableOpacity
                    onPress={this.onCancel.bind(this)}
                    style={{
                      width: buttonwidth,
                      height: buttonheight,
                      borderRadius: 20,
                      borderWidth: 1.5,
                      borderColor: '#D94C2D',
                      justifyContent: 'center',
                    }}
                  >
                    <Text
                      style={{
                        textAlign: 'center',
                        color: '#D94C2D',
                        fontSize: smallfont,
                      }}
                    >
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={this.onSubmit}>
                    <View
                      style={{
                        width: buttonwidth,
                        height: buttonheight,
                        borderRadius: 20,
                        overflow: 'hidden',
                        justifyContent: 'center',
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
                        Submit
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              {this.state.spinner ? (
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
            </ScrollView>
            {/* </KeyboardAvoidingView> */}
          </>
        ) : (
          <>
            <ImageBackground
              style={{
                width: '100%', //Dimensions.get("window").width, //for full screen
                height: '100%', // Dimensions.get("window").height, //for full screen
                zIndex: -1,
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
              source={require('../../assets/images/login/newloginbg.png')}
            />

            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={50}
              style={{ flex: 1 }}
            >
              <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                keyboardShouldPersistTaps={'handled'}
                contentContainerStyle={{ flexGrow: 1 }}
                style={styles.scrollView}
              >
                <View
                  style={{
                    backgroundColor: 'rgba(124, 61, 76,0.2)',
                    //height:"100%",
                    margin: 20,
                    borderWidth: 1,
                    borderRadius: 20,
                    borderColor: 'transparent',
                    overflow: 'hidden',
                  }}
                >
                  <Image
                    source={require('../../assets/images/logo_icon1.png')}
                    style={{
                      width: logowidth,
                      height: logoheight,
                      alignSelf: 'center',
                      marginTop: 10,
                    }}
                  />
                  <View
                    style={{
                      width: windowWidth / 1.3,
                      alignSelf: 'center',
                      height: textinputheight,
                      marginTop: 30,
                      borderWidth: 1,
                      backgroundColor: '#E5E2E2',
                      borderColor: '#E5E2E2',
                      borderRadius: textinputradius,
                      justifyContent: 'center',
                    }}
                  >
                    <TextInput
                      style={{
                        width: '100%',
                        paddingLeft: 10,
                        fontSize: smallfont,
                      }}
                      placeholderTextColor={'grey'}
                      placeholder={'First Name'}
                      blurOnSubmit={false}
                      value={this.state.FName}
                      onChangeText={(val) =>
                        this.onInputOrSelectChange('FName', val)
                      }
                      onSubmitEditing={() => this.secondTextInput.focus()}
                    />
                  </View>
                  <View
                    style={{
                      width: windowWidth / 1.3,
                      alignSelf: 'center',
                      height: textinputheight,
                      marginTop: 30,
                      borderWidth: 1,
                      backgroundColor: '#E5E2E2',
                      borderColor: '#E5E2E2',
                      borderRadius: textinputradius,
                      justifyContent: 'center',
                    }}
                  >
                    <TextInput
                      ref={(input) => {
                        this.secondTextInput = input;
                      }}
                      style={{
                        width: '100%',
                        paddingLeft: 10,
                        fontSize: smallfont,
                      }}
                      placeholderTextColor={'grey'}
                      placeholder={'Last Name'}
                      blurOnSubmit={false}
                      value={this.state.LName}
                      onChangeText={(val) =>
                        this.onInputOrSelectChange('LName', val)
                      }
                      onSubmitEditing={() => this.thirdTextInput.focus()}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 30,
                      width: windowWidth / 1.3,
                      alignSelf: 'center',
                      height: textinputheight,
                    }}
                  >
                    <View style={{}}>
                      <RadioForm formHorizontal animation>
                        {/* To create radio buttons, loop through your array of options */}
                        {radio_props.map((obj, i) => (
                          <RadioButton labelHorizontal key={i}>
                            {/*  You can set RadioButtonLabel before RadioButtonInput */}
                            <RadioButtonInput
                              obj={obj}
                              index={i}
                              isSelected={this.state.genderval === i}
                              onPress={(value) => {
                                //  alert(value)
                                this.setState({ genderval: value });
                              }}
                              borderWidth={1}
                              buttonInnerColor={'#E5E2E2'}
                              buttonOuterColor={'#E5E2E2'}
                              buttonSize={buttonSize}
                              buttonOuterSize={buttonOutersize}
                              buttonStyle={{}}
                              buttonWrapStyle={{ marginLeft: 10 }}
                            />
                            <RadioButtonLabel
                              obj={obj}
                              index={i}
                              labelHorizontal
                              onPress={(value) =>
                                this.setState({ genderval: value })
                              }
                              labelStyle={{
                                fontSize: smallfont,
                                color: '#E5E2E2',
                              }}
                              labelWrapStyle={{}}
                            />
                          </RadioButton>
                        ))}
                      </RadioForm>
                    </View>
                  </View>
                  <View
                    style={{
                      width: windowWidth / 1.3,
                      alignSelf: 'center',
                      height: textinputheight,
                      marginTop: 30,
                      borderWidth: 1,
                      backgroundColor: '#E5E2E2',
                      borderColor: '#E5E2E2',
                      borderRadius: textinputradius,
                      justifyContent: 'center',
                    }}
                  >
                    <TextInput
                      ref={(input) => {
                        this.thirdTextInput = input;
                      }}
                      style={{
                        width: '100%',
                        paddingLeft: 10,
                        fontSize: smallfont,
                      }}
                      placeholderTextColor={'grey'}
                      placeholder={'Email'}
                      blurOnSubmit={false}
                      value={this.state.email}
                      keyboardType={'email-address'}
                      onChangeText={(val) =>
                        this.onInputOrSelectChange('email', val)
                      }
                      onSubmitEditing={() => this.fourthInputText.focus()}
                    />
                  </View>
                  <View
                    style={{
                      width: windowWidth / 1.3,
                      alignSelf: 'center',
                      height: textinputheight,
                      marginTop: 30,
                      borderWidth: 1,
                      backgroundColor: '#E5E2E2',
                      borderColor: '#E5E2E2',
                      borderRadius: textinputradius,
                      justifyContent: 'center',
                    }}
                  >
                    <TextInput
                      ref={(input) => {
                        this.fourthInputText = input;
                      }}
                      style={{
                        width: '100%',
                        paddingLeft: 10,
                        fontSize: smallfont,
                      }}
                      placeholderTextColor={'grey'}
                      secureTextEntry
                      placeholder={'Create Password'}
                      blurOnSubmit={false}
                      value={this.state.password}
                      onChangeText={(val) =>
                        this.onInputOrSelectChange('password', val)
                      }
                      onSubmitEditing={() => this.fifthTextInput.focus()}
                    />
                  </View>
                  <View
                    style={{
                      width: windowWidth / 1.3,
                      alignSelf: 'center',
                      height: textinputheight,
                      marginTop: 30,
                      borderWidth: 1,
                      backgroundColor: '#E5E2E2',
                      borderColor: '#E5E2E2',
                      borderRadius: textinputradius,
                      justifyContent: 'center',
                    }}
                  >
                    <TextInput
                      ref={(input) => {
                        this.fifthTextInput = input;
                      }}
                      style={{
                        width: '100%',
                        paddingLeft: 10,
                        fontSize: smallfont,
                      }}
                      placeholderTextColor={'grey'}
                      secureTextEntry
                      placeholder={'Confirm Password'}
                      blurOnSubmit={false}
                      value={this.state.confPassword}
                      onChangeText={(val) =>
                        this.onInputOrSelectChange('confPassword', val)
                      }
                      onSubmitEditing={() => this.sixthTextInput.focus()}
                    />
                  </View>
                  <View
                    style={{
                      width: windowWidth / 1.3,
                      alignSelf: 'center',
                      height: textinputheight,
                      marginTop: 30,
                      borderWidth: 1,
                      backgroundColor: '#E5E2E2',
                      borderColor: '#E5E2E2',
                      borderRadius: textinputradius,
                      justifyContent: 'center',
                    }}
                  >
                    <TextInput
                      ref={(input) => {
                        this.sixthTextInput = input;
                      }}
                      style={{
                        width: '100%',
                        paddingLeft: 10,
                        fontSize: smallfont,
                      }}
                      placeholderTextColor={'grey'}
                      placeholder={'Mobile Number'}
                      blurOnSubmit={false}
                      value={this.state.mobile_number}
                      onChangeText={(val) =>
                        this.onInputOrSelectChange('mobile_number', val)
                      }
                      keyboardType={'number-pad'}
                      returnKeyType={'done'}
                      onSubmitEditing={() => Keyboard.dismiss()}
                    />
                  </View>

                  <View
                    style={{
                      height: textinputheight,
                      width: windowWidth / 1.3,
                      marginTop: 30,
                      alignSelf: 'center',
                      borderColor: colors.Themecolor,
                      flexDirection: 'row',
                      borderBottomWidth: 1,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <RNPickerSelect
                      placeholder={universityPlaceholder}
                      value={this.state.university}
                      style={pickerSelectStyles}
                      useNativeAndroidPickerStyle={false}
                      onValueChange={(val) =>
                        this.onInputOrSelectChange('university', val)
                      }
                      items={this.state.universities}
                    />
                    <Image
                      source={require('../../assets/images/downarrow.png')}
                      style={{
                        position: 'absolute',
                        width: 15,
                        height: 15,
                        tintColor: colors.Themecolor,
                        right: 10,
                      }}
                    />
                  </View>

                  <View
                    style={{
                      height: textinputheight,
                      width: windowWidth / 1.3,
                      marginTop: 30,
                      alignSelf: 'center',
                      borderColor: colors.Themecolor,
                      flexDirection: 'row',
                      borderBottomWidth: 1,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <RNPickerSelect
                      placeholder={branchPlaceholder}
                      value={this.state.branch}
                      style={pickerSelectStyles}
                      useNativeAndroidPickerStyle={false}
                      onValueChange={(val) =>
                        this.onInputOrSelectChange('branch', val)
                      }
                      items={this.state.branches}
                    />
                    <Image
                      source={require('../../assets/images/downarrow.png')}
                      style={{
                        position: 'absolute',
                        width: 15,
                        height: 15,
                        tintColor: colors.Themecolor,
                        right: 10,
                      }}
                    />
                  </View>

                  <View
                    style={{
                      height: textinputheight,
                      width: windowWidth / 1.3,
                      marginTop: 30,
                      alignSelf: 'center',
                      borderColor: colors.Themecolor,
                      flexDirection: 'row',
                      borderBottomWidth: 1,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <RNPickerSelect
                      placeholder={semesterPlaceholder}
                      value={this.state.semester}
                      style={pickerSelectStyles}
                      useNativeAndroidPickerStyle={false}
                      onValueChange={(val) =>
                        this.onInputOrSelectChange('semester', val)
                      }
                      items={this.state.semesters}
                    />
                    <Image
                      source={require('../../assets/images/downarrow.png')}
                      style={{
                        position: 'absolute',
                        width: 15,
                        height: 15,
                        tintColor: colors.Themecolor,
                        right: 10,
                      }}
                    />
                  </View>

                  <View
                    style={{
                      height: textinputheight,
                      width: windowWidth / 1.3,
                      marginTop: 30,
                      alignSelf: 'center',
                      borderColor: colors.Themecolor,
                      flexDirection: 'row',
                      borderBottomWidth: 1,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <RNPickerSelect
                      placeholder={placeholder}
                      value={this.state.statevalue}
                      style={pickerSelectStyles}
                      useNativeAndroidPickerStyle={false}
                      onValueChange={this.onsubjectclick.bind(this)}
                      items={states}
                    />
                    <Image
                      source={require('../../assets/images/downarrow.png')}
                      style={{
                        position: 'absolute',
                        width: 15,
                        height: 15,
                        tintColor: colors.Themecolor,
                        right: 10,
                      }}
                    />
                  </View>
                  <View
                    style={{
                      width: windowWidth / 1.3,
                      alignSelf: 'center',
                      height: textinputheight,
                      marginTop: 30,
                      borderWidth: 1,
                      backgroundColor: '#E5E2E2',
                      borderColor: '#E5E2E2',
                      borderRadius: textinputradius,
                      justifyContent: 'center',
                    }}
                  >
                    <TextInput
                      style={{
                        width: '100%',
                        paddingLeft: 10,
                        fontSize: smallfont,
                      }}
                      placeholderTextColor={'grey'}
                      keyboardType={'number-pad'}
                      placeholder={'Pin Code'}
                      blurOnSubmit={false}
                      value={this.state.pincode}
                      onChangeText={(val) =>
                        this.onInputOrSelectChange('pincode', val)
                      }
                      onSubmitEditing={() => Keyboard.dismiss()}
                    />
                  </View>
                  <View
                    style={{
                      width: windowWidth / 1.3,
                      alignSelf: 'center',
                      height: textinputheight,
                      marginTop: 20,
                      borderWidth: 1,
                      backgroundColor: '#E5E2E2',
                      borderColor: '#E5E2E2',
                      borderRadius: textinputradius,
                      justifyContent: 'center',
                    }}
                  >
                    <TextInput
                      style={{
                        width: '100%',
                        paddingLeft: 10,
                        fontSize: smallfont,
                      }}
                      placeholderTextColor={'grey'}
                      returnKeyType={'done'}
                      placeholder={'Referal Code(If any)'}
                      blurOnSubmit={false}
                      value={this.state.refercode}
                      onChangeText={(val) =>
                        this.onInputOrSelectChange('refercode', val)
                      }
                      onSubmitEditing={() => Keyboard.dismiss()}
                    />
                  </View>
                  {/* <FloatingLabel
                                        labelStyle={styles.labelstyle}
                                        inputStyle={styles.input}
                                        style={styles.textinput}
                                        keyboardType={"number-pad"}
                                        returnKeyType={"done"}
                                        blurOnSubmit={false}
                                        onChangeText={(val) => this.onInputOrSelectChange('pincode', val)}
                                        onSubmitEditing={() => Keyboard.dismiss()}
                                    >Pin Code</FloatingLabel> */}

                  <View
                    style={{
                      marginHorizontal: 20,
                      marginVertical: 30,
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                    }}
                  >
                    <TouchableOpacity
                      onPress={this.onCancel.bind(this)}
                      style={{
                        width: buttonwidth,
                        height: buttonheight,
                        borderRadius: 20,
                        borderWidth: 1.5,
                        borderColor: '#D94C2D',
                        justifyContent: 'center',
                      }}
                    >
                      <Text
                        style={{
                          textAlign: 'center',
                          color: '#D94C2D',
                          fontSize: smallfont,
                        }}
                      >
                        Cancel
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.onSubmit}>
                      <View
                        style={{
                          width: buttonwidth,
                          height: buttonheight,
                          borderRadius: 20,
                          overflow: 'hidden',
                          justifyContent: 'center',
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
                          Submit
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
                {this.state.spinner ? (
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
              </ScrollView>
            </KeyboardAvoidingView>
          </>
        )}
      </SafeAreaView>
    );
  }
}
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: DeviceConstants.isTablet ? 22 : 15,
    borderWidth: 1,
    width: windowWidth / 1.3,
    borderColor: 'transparent',
    borderRadius: 8,
    color: '#E5E2E2',
    marginTop: 10,
    // marginBottom:10,
    paddingRight: 10, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: DeviceConstants.isTablet ? 23 : 16,
    borderWidth: 1,
    borderWidth: 0.5,
    width: windowWidth / 1.3,

    borderColor: 'transparent',
    borderRadius: 8,
    marginTop: 10,
    color: '#E5E2E2',
    paddingRight: 10, // to ensure the text is never behind the icon
  },
});
export default Register;
