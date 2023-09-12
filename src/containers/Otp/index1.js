import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  BackHandler,
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
import DeviceConstants from 'react-native-device-constants';
import { Actions } from 'react-native-router-flux';
import { baseUrl } from '../../constants';
import styles from './styles';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
var logowidth = 72,
  logoheight = 72;
class Otp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobile: '',
      password: '',
      confpassword: false,
      showCnfpass: false,
      hidecnfPassword: true,
      hidePassword: true,
      spinner: false,
      loading: false,
    };
    this.onChangeMobile = this.onChangeMobile.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onConfirmPass = this.onConfirmPass.bind(this);

    this.onSubmit = this.onSubmit.bind(this);
  }
  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction
    );
  }
  backAction = () => {
    //Actions.dashboard({type:"reset"})
    return true;
  };
  componentWillUnmount() {
    this.backHandler.remove();
  }
  onChangeMobile(text) {
    this.setState({
      mobile: text,
    });
  }
  onChangePassword(text) {
    this.setState({
      password: text,
    });
  }
  onConfirmPass(text) {
    this.setState({
      confpassword: text,
    });
  }
  onresend() {
    this.setState({ spinner: true });
    // var mobile = this.state.mobile;
    var userdata = this.props.data;
    var body = { emailOrMobile: userdata.email };
    console.log('Boyyy', body);
    fetch(baseUrl + '/users/forgot-password', {
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
          if (json.code === 201) {
            Alert.alert('My Professor', 'An OTP has been sent to your email', [
              { text: 'OK' },
            ]);
          } else {
            alert(json.error.message);
          }
          this.setState({ spinner: false });
          // Actions.push('otp',{email: email})
        }
      })
      .catch((error) => console.error(error));
  }

  onSubmit() {
    var { mobile, password, confpassword } = this.state;
    var userdata = this.props.data;
    if (mobile === '') {
      alert('please enter OTP');
    } else if (password === '') {
      alert('please enter Password');
    } else if (confpassword === '') {
      alert('please enter Confirm Password');
    } else if (password !== confpassword) {
      alert("password and confirm password doesn't match");
    } else {
      this.setState({ loading: true });
      var body = {
        otp: mobile,
        userId: userdata.id,
        emailOrMobile: this.props.emailmobile,
        password,
        confirmPassword: confpassword,
      };
      console.log(
        'Boydfdafdyy',
        body,
        baseUrl + '/users/forgot-password/validate-otp'
      );
      fetch(baseUrl + '/users/forgot-password/validate-otp', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
        .then((response) => response.json())
        .then((json) => {
          if (json) {
            console.log('aklnclkasncklsnc', json);
            this.setState({ loading: false });
            if (json.code === 201) {
              Alert.alert(
                'My Professor',
                'Password Changed Successfully, Please login again',
                [
                  {
                    text: 'OK',
                    onPress: () => Actions.login({ type: 'reset' }),
                  },
                ]
              );
            } else {
              alert(json.error.message);
            }
          }
        })
        .catch((error) => console.error(error));
    }
  }
  setPasswordVisibility = () => {
    this.setState({
      hidePassword: !this.state.hidePassword,
    });
  };
  setNewPasswordVisibility = () => {
    this.setState({
      hidecnfPassword: !this.state.hidecnfPassword,
    });
  };
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
    subfont = 15;
    evilwidth = 35;
    evilright = 9;
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
      evilright = 20;
      evilwidth = 50;
    }
    return (
      <SafeAreaView style={{ flex: 1 }}>
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
              <View style={{ padding: 30 }}>
                <ImageBackground
                  source={require('../../assets/images/login/brownrect.png')}
                  style={{
                    width: windowWidth / 1.2,
                    height: windowHeight / 1.5,
                    justifyContent: 'space-evenly',
                  }}
                >
                  <Image
                    source={require('../../assets/images/logo_icon1.png')}
                    style={{
                      width: logowidth,
                      height: logoheight,
                      alignSelf: 'center',
                      marginTop: 20,
                    }}
                  />

                  <View>
                    <Text
                      style={{
                        fontSize: smallfont,
                        alignSelf: 'center',
                        color: 'white',
                        marginVertical: 15,
                      }}
                    >
                      An OTP has been sent to your email/mobile number
                    </Text>
                    <View style={{ marginVertical: 10 }}>
                      <TextInput
                        style={{
                          borderWidth: 1,
                          borderColor: '#E5E2E2',
                          width: windowWidth / 1.4,
                          borderRadius: textinputradius,
                          marginHorizontal: 15,
                          borderColor: '#E5E2E2',
                          backgroundColor: '#E5E2E2',
                          paddingLeft: 10,
                          fontSize: smallfont,
                          alignSelf: 'center',
                          height: textinputheight,
                        }}
                        placeholderTextColor={'grey'}
                        blurOnSubmit={false}
                        value={this.state.mobile}
                        keyboardType={'number-pad'}
                        returnKeyType={'done'}
                        placeholder={'Enter OTP'}
                        onChangeText={this.onChangeMobile}
                        onSubmitEditing={() => Keyboard.dismiss()}
                      />
                    </View>

                    {/* <View style={{ marginVertical: 10 }}>
                                        <TextInput
                                            placeholderTextColor={"grey"}
                                            ref={(input) => { this.firstTextInput = input; }}
                                            labelStyle={styles.labelstyle}
                                            inputStyle={styles.input}
                                            style={{
                                                borderWidth: 1, borderColor: "#E5E2E2", width: windowWidth / 1.4, borderRadius: textinputradius,
                                                marginHorizontal: 15,
                                                borderColor: '#E5E2E2',
                                                backgroundColor: "#E5E2E2",
                                                paddingLeft: 10,
                                                fontSize: smallfont,
                                                alignSelf: "center",
                                                height: textinputheight
                                            }}
                                            placeholder="Create Password"
                                            value={this.state.password}
                                            secureTextEntry={this.state.hidePassword}
                                            onChangeText={this.onChangePassword}
                                            onSubmitEditing={() => Keyboard.dismiss()}
                                        ></TextInput>
                                    </View>
                                    <TouchableOpacity activeOpacity={0.8}
                                        style={{ position: "absolute", height: textinputheight, width: evilwidth, right: 25, top: windowHeight / 7.6 }}
                                        onPress={this.setPasswordVisibility}>
                                        <Image source={(this.state.hidePassword) ? require('../../assets/images/ic_visibility.png') : require('../../assets/images/ic_visibility_off.png')}
                                            style={{ resizeMode: 'contain', height: '100%', width: '70%', }} />
                                    </TouchableOpacity> */}
                    <View
                      style={{
                        alignSelf: 'center',
                        marginVertical: 10,
                        height: textinputheight,
                        width: windowWidth / 1.4,
                        borderWidth: 1,
                        borderColor: '#E5E2E2',
                        borderRadius: textinputradius,
                        backgroundColor: '#E5E2E2',
                      }}
                    >
                      <View
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                          borderRadius: textinputradius,
                          borderWidth: 1,
                          borderColor: '#E5E2E2',
                        }}
                      >
                        <View
                          style={{
                            flex: 0.85,
                            backgroundColor: '#E5E2E2',
                            borderRadius: textinputradius,
                            borderWidth: 1,
                            borderColor: '#E5E2E2',
                          }}
                        >
                          <TextInput
                            placeholderTextColor={'grey'}
                            ref={(input) => {
                              this.firstTextInput = input;
                            }}
                            labelStyle={styles.labelstyle}
                            inputStyle={styles.input}
                            style={{
                              borderWidth: 1,
                              borderColor: '#E5E2E2',
                              width: '100%',
                              borderRadius: textinputradius,
                              marginHorizontal: 15,
                              borderColor: '#E5E2E2',
                              backgroundColor: '#E5E2E2',
                              paddingLeft: 10,
                              fontSize: smallfont,
                              alignSelf: 'center',
                              height: '100%',
                            }}
                            placeholder="Create Password"
                            value={this.state.password}
                            secureTextEntry={this.state.hidePassword}
                            onChangeText={this.onChangePassword}
                            onSubmitEditing={() => Keyboard.dismiss()}
                          />
                        </View>
                        <TouchableOpacity
                          style={{
                            flex: 0.15,
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
                            style={{ width: 25, height: 25 }}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View
                      style={{
                        alignSelf: 'center',
                        marginVertical: 10,
                        height: textinputheight,
                        width: windowWidth / 1.4,
                        borderWidth: 1,
                        borderColor: '#E5E2E2',
                        borderRadius: textinputradius,
                        backgroundColor: '#E5E2E2',
                      }}
                    >
                      <View
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                          borderRadius: textinputradius,
                          borderWidth: 1,
                          borderColor: '#E5E2E2',
                        }}
                      >
                        <View
                          style={{
                            flex: 0.85,
                            backgroundColor: '#E5E2E2',
                            borderRadius: textinputradius,
                            borderWidth: 1,
                            borderColor: '#E5E2E2',
                          }}
                        >
                          <TextInput
                            placeholderTextColor={'grey'}
                            ref={(input) => {
                              this.secondTextInput = input;
                            }}
                            labelStyle={styles.labelstyle}
                            inputStyle={styles.input}
                            style={{
                              width: '100%',
                              borderRadius: textinputradius,
                              marginHorizontal: 15,
                              borderColor: '#E5E2E2',
                              backgroundColor: '#E5E2E2',
                              paddingLeft: 10,
                              fontSize: smallfont,
                              alignSelf: 'center',
                              height: '100%',
                            }}
                            placeholder="Confirm Password"
                            value={this.state.confpassword}
                            secureTextEntry={this.state.hidecnfPassword}
                            onChangeText={this.onConfirmPass}
                            onSubmitEditing={() => Keyboard.dismiss()}
                          />
                        </View>
                        <TouchableOpacity
                          style={{
                            flex: 0.15,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                          onPress={this.setNewPasswordVisibility}
                        >
                          <Image
                            source={
                              this.state.hidecnfPassword
                                ? require('../../assets/images/ic_visibility.png')
                                : require('../../assets/images/ic_visibility_off.png')
                            }
                            style={{ width: 25, height: 25 }}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>

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
                    <View style={styles.subview}>
                      <TouchableOpacity onPress={this.onSubmit.bind(this)}>
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
                            Submit
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </ImageBackground>
              </View>
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
      </SafeAreaView>
    );
  }
}
export default Otp;
