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
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

var logowidth = 72,
  logoheight = 72;
class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      spinner: false,
      token: '',
    };
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction
    );
  }
  backAction = () => {
    // this.props.navigation.goBack(null);
    Actions.pop();
    return true;
    // Actions.topicmainview({from:this.props.from,type:"reset",data:this.props.topicindata,topicsdata:this.props.topicData,screen:"summary",subjectData:this.props.subjectData})
  };
  componentWillUnmount() {
    this.backHandler.remove();
  }

  onChangeEmail(text) {
    console.log('lkdfjkdjfk', text);
    this.setState({
      email: text,
    });
  }

  onSubmit() {
    var email = this.state.email;
    if (email === '') {
      alert('Please enter email');
    } else {
      this.setState({ spinner: true });
      var body = { emailOrMobile: email };
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
          console.log('d,njkdfkld', JSON.stringify(json));
          if (json) {
            if (json.code === 201) {
              // this.generateotp(json.data)
              Actions.push('otp', { data: json.data, emailmobile: email });
            } else {
              alert(json.error.message);
            }
            // this.setState({ spinner: false })
            // Actions.push('otp',{email: email})
          }
        })
        .catch((error) => console.error(error));
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
          this.setState({ spinner: false });
          // AsyncStorage.setItem('@user', JSON.stringify(user))
          Actions.push('otp', { user });
        } else {
          this.setState({ spinner: false });

          Alert.alert('My Professor', json.error.message);
        }
      })
      .catch((error) => console.error(error));
  }
  onCancel() {
    Actions.pop();
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
    subfont = 15;
    evilwidth = 35;
    evilright = 9;
    forgotlogo = 96 / 2;
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
      forgotlogo = 96 / 1.2;
    }
    return (
      <>
        <SafeAreaView style={{ flex: 1 }}>
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
          <View style={{ flex: 1, position: 'absolute', alignSelf: 'center' }}>
            <View style={{ flex: 1 }}>
              <View style={{ padding: 30, marginTop: windowHeight / 5.5 }}>
                <ImageBackground
                  source={require('../../assets/images/login/brownrect.png')}
                  style={{
                    width: windowWidth / 1.2,
                    height:
                      Platform.OS === 'android'
                        ? windowHeight / 2
                        : windowHeight / 2.3,
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

                  <Image
                    source={require('../../assets/images/forgoticon.png')}
                    style={{
                      width: forgotlogo,
                      height: forgotlogo,
                      marginVertical: 10,
                      alignSelf: 'center',
                    }}
                  />
                  <View style={{ justifyContent: 'space-evenly' }}>
                    <Text
                      style={{
                        fontSize: smallfont,
                        alignSelf: 'center',
                        color: 'white',
                        marginVertical: 15,
                      }}
                    >
                      {' '}
                      Please Enter your email address or mobile number
                    </Text>
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
                        marginTop: 10,
                        fontSize: smallfont,
                        alignSelf: 'center',
                        height: textinputheight,
                      }}
                      placeholderTextColor={'grey'}
                      blurOnSubmit={false}
                      value={this.state.email}
                      keyboardType={'email-address'}
                      placeholder={'Email/Mobile Number'}
                      onChangeText={this.onChangeEmail}
                      onSubmitEditing={() => Keyboard.dismiss()}
                    />

                    <View
                      style={{
                        marginTop: 20,
                        justifyContent: 'space-evenly',
                        flexDirection: 'row',
                      }}
                    >
                      <TouchableOpacity
                        onPress={this.onCancel.bind(this)}
                        style={{
                          width: loginwidth,
                          height: loginbutton,
                          borderRadius: textinputradius,
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
        </SafeAreaView>
      </>
    );
  }
}
export default ForgotPassword;
