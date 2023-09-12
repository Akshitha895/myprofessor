import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Actions } from 'react-native-router-flux';

import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceConstants from 'react-native-device-constants';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../constants';
import { baseUrl } from '../../constants';
import styles from './styles';

const windowWidth = Dimensions.get('window').width;

class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refercode: 'SMART123',
      currentpassword: '',
      newpass: '',
      cnfPass: '',
      oldpass: '',
      email: '',
      hidePassword: true,
      hidenewpss: true,
      hidecnfpass: true,
      userDetails: '',
      token: '',
    };
  }
  componentDidMount() {
    this.getData();
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
            userDetails: data,
            email: data.userInfo.email,
            token: JSON.parse(token),
          });
          //   this.getChapters(data,JSON.parse(token))
        } else {
          console.log('errorr');
        }
      } else {
        console.log('errorr');
      }
    } catch (e) {
      return null;
    }
  };
  onChangeText(text) {
    this.setState({
      currentpassword: text,
    });
  }
  onChangeTextConf(text) {
    this.setState({
      cnfPass: text,
    });
  }
  onChangeNew(text) {
    this.setState({
      newpass: text,
    });
  }
  onBack() {
    Actions.pop();
  }
  onsubmit() {
    var { newpass, cnfPass, currentpassword } = this.state;
    var email = this.state.email;
    if (currentpassword === '') {
      alert('please enter Old Password');
    } else if (newpass === '') {
      alert('please enter New Password');
    } else if (cnfPass === '') {
      alert('please enter Confirm Password');
    } else if (currentpassword === newpass) {
      alert(
        'Old and New Password cannot be same please enter different password'
      );
    } else if (currentpassword.length < 8 || currentpassword.length > 24) {
      alert('please enter valid old password with minimum 8 characters');
    } else if (newpass.length < 8 || newpass.length > 24) {
      alert('please enter valid New password with minimum 8');
    } else if (newpass !== cnfPass) {
      alert("password and confirm password doesn't match");
    } else {
      this.setState({ loading: true });
      var body = {
        userId: this.state.userDetails.userInfo.userId,
        oldPassword: currentpassword,
        newPassword: newpass,
        confirmPassword: cnfPass,
      };

      console.log('dfwdfdwfdfdf', body);
      fetch(baseUrl + `/users/change-password`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          jwt: this.state.token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
        .then((response) => response.json())
        .then((json) => {
          if (json) {
            console.log(JSON.stringify(json));
            this.setState({ loading: false });
            if (json.code === 201) {
              Alert.alert('My Professor', 'Password Changed Successfully', [
                {
                  text: 'OK',
                  onPress: () => Actions.dashboard({ type: 'reset' }),
                },
              ]);
            } else if (json.error?.code === 400) {
              //alert("dknkdf")
              Alert.alert('My Professor', json.error.message, [
                { text: 'OK', onPress: () => this.logout() },
              ]);
            } else {
              alert(JSON.stringify(json.error.message));
            }
          }
        })
        .catch((error) => console.error(error));
    }
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
  setPasswordVisibility = () => {
    this.setState({ hidePassword: !this.state.hidePassword });
  };
  setnewPasswordVisibility = () => {
    this.setState({ hidenewpss: !this.state.hidenewpss });
  };
  setcnfPasswordVisibility = () => {
    this.setState({ hidecnfpass: !this.state.hidecnfpass });
  };
  render() {
    const isTablet = DeviceConstants.isTablet;
    var backheight = 16,
      backwidth = 21,
      headfont = 16,
      topflex = 0.08,
      textinptheight = 45,
      subfont = 15,
      eyewidth = 25,
      submitheight = 41;
    if (isTablet) {
      (backheight = 20),
        (backwidth = 33),
        (headfont = 25),
        (topflex = 0.1),
        (textinptheight = 55),
        (subfont = 20),
        (eyewidth = 30),
        (submitheight = 51);
    }
    return (
      <>
        <View style={styles.mainView}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={50}
            style={{ flex: 1 }}
          >
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
                style={{ flex: topflex, overflow: 'hidden', paddingBottom: 5 }}
              >
                <View style={styles.topShadow}>
                  <TouchableOpacity onPress={this.onBack.bind(this)}>
                    <Image
                      source={require('../../assets/images/refer/back.png')}
                      style={{
                        height: backheight,
                        width: backwidth,
                        marginLeft: 20,
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
                    Change Password
                  </Text>
                </View>
              </View>

              <View style={styles.bottomView}>
                <View style={styles.bottomtopvieW}>
                  <LinearGradient
                    colors={[
                      ' rgba(105, 80, 119, 0.08)',
                      'rgba(132, 115, 147, 0.064)',
                    ]}
                    style={styles.gradientview}
                  >
                    <Image
                      source={require('../../assets/images/refer/changelock.png')}
                      style={styles.changelogo}
                    />
                  </LinearGradient>
                </View>
                <View style={styles.bottomsubView}>
                  {/* <View style={{
                                        width: windowWidth / 1.4, alignSelf: "center", height: 50, marginTop: 30,
                                        borderWidth: 1, backgroundColor: "#E5E2E2", borderColor: "#E5E2E2", borderRadius: 20, flexDirection: "row", justifyContent: 'center',
                                    }}>

                                        <TextInput
                                            ref={(input) => { this.secondTextInput = input; }}
                                            placeholderTextColor={"grey"}
                                            style={{
                                                paddingLeft: 8, width: "85%",

                                                borderColor: '#2e2e2e'
                                            }}
                                            placeholder={"Old Password"}
                                            value={this.state.currentpassword}
                                            secureTextEntry={this.state.hidePassword}
                                            onChangeText={this.onChangeText.bind(this)}
                                            onSubmitEditing={() => Keyboard.dismiss()}
                                        ></TextInput>
                                        <TouchableOpacity activeOpacity={0.8}
                                            style={{ width: "15%", height: 50, justifyContent: "center", alignItems: "center" }}
                                            onPress={this.setPasswordVisibility}>
                                            <Image source={(this.state.hidePassword) ? require('../../assets/images/ic_visibility.png') : require('../../assets/images/ic_visibility_off.png')} style={{ resizeMode: 'contain', height: '50%', width: '50%', }} />
                                        </TouchableOpacity>
                                    </View> */}

                  <View
                    style={{
                      alignSelf: 'center',
                      marginVertical: 10,
                      height: textinptheight + 5,
                      width: windowWidth / 1.4,
                      borderWidth: 1,
                      borderColor: '#E5E2E2',
                      borderRadius: 20,
                      backgroundColor: '#E5E2E2',
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        borderRadius: 20,
                        borderWidth: 1,
                        borderColor: '#E5E2E2',
                      }}
                    >
                      <View
                        style={{
                          flex: 0.85,
                          backgroundColor: '#E5E2E2',
                          borderRadius: 20,
                          borderWidth: 1,
                          justifyContent: 'center',
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
                            borderRadius: 20,
                            marginHorizontal: 15,
                            fontSize: subfont,
                            borderColor: '#E5E2E2',
                            backgroundColor: '#E5E2E2',
                            paddingLeft: 10,
                            //  fontSize: smallfont,
                            alignSelf: 'center',
                            height: textinptheight,
                          }}
                          placeholder="Old Password"
                          value={this.state.currentpassword}
                          secureTextEntry={this.state.hidePassword}
                          onChangeText={this.onChangeText.bind(this)}
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
                          style={{ width: eyewidth, height: eyewidth }}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* <View style={{
                                        width: windowWidth / 1.4, alignSelf: "center", height: 50, marginTop: 30,
                                        borderWidth: 1, backgroundColor: "#E5E2E2", borderColor: "#E5E2E2", borderRadius: 20, flexDirection: "row", justifyContent: 'center',
                                    }}>

                                        <TextInput
                                            ref={(input) => { this.secondTextInput = input; }}
                                            placeholderTextColor={"grey"}
                                            style={{
                                                paddingLeft: 8, width: "85%",

                                                borderColor: '#2e2e2e'
                                            }}
                                            placeholder={"New Password"}
                                            value={this.state.newpass}
                                            secureTextEntry={this.state.hidenewpss}
                                            onChangeText={this.onChangeNew.bind(this)}
                                            onSubmitEditing={() => Keyboard.dismiss()}
                                        ></TextInput>
                                        <TouchableOpacity activeOpacity={0.8}
                                            style={{ width: "15%", height: 50, justifyContent: "center", alignItems: "center" }}
                                            onPress={this.setnewPasswordVisibility}>
                                            <Image source={(this.state.hidenewpss) ? require('../../assets/images/ic_visibility.png') : require('../../assets/images/ic_visibility_off.png')} style={{ resizeMode: 'contain', height: '50%', width: '50%', }} />
                                        </TouchableOpacity>
                                    </View> */}

                  <View
                    style={{
                      alignSelf: 'center',
                      marginVertical: 10,
                      height: textinptheight + 5,
                      width: windowWidth / 1.4,
                      borderWidth: 1,
                      borderColor: '#E5E2E2',
                      borderRadius: 20,
                      backgroundColor: '#E5E2E2',
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        borderRadius: 20,
                        borderWidth: 1,
                        borderColor: '#E5E2E2',
                      }}
                    >
                      <View
                        style={{
                          flex: 0.85,
                          backgroundColor: '#E5E2E2',
                          borderRadius: 20,
                          borderWidth: 1,
                          borderColor: '#E5E2E2',
                          justifyContent: 'center',
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
                            borderRadius: 20,
                            marginHorizontal: 15,
                            fontSize: subfont,
                            borderColor: '#E5E2E2',
                            backgroundColor: '#E5E2E2',
                            paddingLeft: 10,
                            //// fontSize: smallfont,
                            alignSelf: 'center',
                            height: textinptheight,
                          }}
                          placeholder="New Password"
                          value={this.state.newpass}
                          secureTextEntry={this.state.hidenewpss}
                          onChangeText={this.onChangeNew.bind(this)}
                          onSubmitEditing={() => Keyboard.dismiss()}
                        />
                      </View>
                      <TouchableOpacity
                        style={{
                          flex: 0.15,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                        onPress={this.setnewPasswordVisibility}
                      >
                        <Image
                          source={
                            this.state.hidenewpss
                              ? require('../../assets/images/ic_visibility.png')
                              : require('../../assets/images/ic_visibility_off.png')
                          }
                          style={{ width: eyewidth, height: eyewidth }}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* <View style={{
                                        width: windowWidth / 1.4, alignSelf: "center", height: 50, marginTop: 30,
                                        borderWidth: 1, backgroundColor: "#E5E2E2", borderColor: "#E5E2E2", borderRadius: 20, flexDirection: "row", justifyContent: 'center',
                                    }}>

                                        <TextInput
                                            ref={(input) => { this.secondTextInput = input; }}
                                            placeholderTextColor={"grey"}
                                            style={{
                                                paddingLeft: 8, width: "85%",

                                                borderColor: '#2e2e2e'
                                            }}
                                            placeholder={"Confirm Password"}
                                            value={this.state.cnfPass}
                                            secureTextEntry={this.state.hidecnfpass}
                                            onChangeText={this.onChangeTextConf.bind(this)}
                                            onSubmitEditing={() => Keyboard.dismiss()}
                                        ></TextInput>
                                        <TouchableOpacity activeOpacity={0.8}
                                            style={{ width: "15%", height: 50, justifyContent: "center", alignItems: "center" }}
                                            onPress={this.setcnfPasswordVisibility}>
                                            <Image source={(this.state.hidecnfpass) ? require('../../assets/images/ic_visibility.png') : require('../../assets/images/ic_visibility_off.png')} style={{ resizeMode: 'contain', height: '50%', width: '50%', }} />
                                        </TouchableOpacity>
                                    </View> */}

                  <View
                    style={{
                      alignSelf: 'center',
                      marginVertical: 10,
                      height: textinptheight + 5,
                      width: windowWidth / 1.4,
                      borderWidth: 1,
                      borderColor: '#E5E2E2',
                      borderRadius: 20,
                      backgroundColor: '#E5E2E2',
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        borderRadius: 20,
                        borderWidth: 1,
                        borderColor: '#E5E2E2',
                      }}
                    >
                      <View
                        style={{
                          flex: 0.85,
                          backgroundColor: '#E5E2E2',
                          borderRadius: 20,
                          borderWidth: 1,
                          borderColor: '#E5E2E2',
                          justifyContent: 'center',
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
                            borderRadius: 20,
                            marginHorizontal: 15,
                            fontSize: subfont,
                            borderColor: '#E5E2E2',
                            backgroundColor: '#E5E2E2',
                            paddingLeft: 10,
                            //fontSize:,
                            alignSelf: 'center',
                            height: textinptheight,
                          }}
                          placeholder="Confirm Password"
                          value={this.state.cnfPass}
                          secureTextEntry={this.state.hidecnfpass}
                          onChangeText={this.onChangeTextConf.bind(this)}
                          onSubmitEditing={() => Keyboard.dismiss()}
                        />
                      </View>
                      <TouchableOpacity
                        style={{
                          flex: 0.15,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                        onPress={this.setcnfPasswordVisibility}
                      >
                        <Image
                          source={
                            this.state.hidecnfpass
                              ? require('../../assets/images/ic_visibility.png')
                              : require('../../assets/images/ic_visibility_off.png')
                          }
                          style={{ width: eyewidth, height: eyewidth }}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={this.onsubmit.bind(this)}
                    style={[styles.submitbutton, { height: submitheight }]}
                  >
                    <Text style={[styles.buttonText, { fontSize: headfont }]}>
                      UPDATE PASSWORD
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
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
    );
  }
}
export default ChangePassword;
