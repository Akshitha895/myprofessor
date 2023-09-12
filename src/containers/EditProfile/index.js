import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Dimensions,
  Image,
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
import FastImage from 'react-native-fast-image';

//import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Actions } from 'react-native-router-flux';
//import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import moment from 'moment';
import ImagePicker from 'react-native-image-crop-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { baseUrl, colors } from '../../constants';

import StringsOfLanguages from '../../StringsOfLanguages';
import styles from './styles';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// var radio_props = [
//   { label: 'Male', value: 0 },
//   { label: 'Female', value: 1 },
// ];

class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profilepic: null,
      initialspinnerr: true,
      name: '',
      firstName: '',
      lastName: '',
      dob: 'dob',
      mobile_number: '',
      email: '',
      state: '',
      boardvalue: '',
      grade: '',
      profile_pic: '',
      genderval: null,
      boardsData: [],
      gradesData: [],
      updateloading: false,
      picture: '',
      token: '',
      userID: '',
      picker: false,
      countrycode: '+91',
      branc: '',
    };
  }
  async componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction
    );

    this.getData();
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
        const token = await AsyncStorage.getItem('@access_token');
        if (token) {
          var data = JSON.parse(value);
          this.setState({
            userID: data.userInfo.userId,
            token: JSON.parse(token),
          });
          console.log('dabfkjahdfjkdhfkjdf', data);
          if (data.userInfo.gender) {
            if (data.userInfo.gender === 'Female') {
              this.setState({
                genderval: 1,
              });
            } else if (data.userInfo.gender === 'Male') {
              this.setState({
                genderval: 0,
              });
            }
          }

          this.seData(data);
        }
      } else {
        //Actions.push('login')
      }
    } catch (e) {
      return null;
    }
  };
  seData(data) {
    console.log('ddddd', data);
    var username;
    if (data.userInfo.name) {
      username = data.userInfo.name;
    } else {
      if (data.userInfo.firstName) {
        if (data.userInfo.lastName) {
          username = data.userInfo.firstName + ' ' + data.userInfo.lastName;
        } else {
          username = data.userInfo.firstName;
        }
      } else if (data.userInfo.lastName) {
        username = data.userInfo.lastName;
      }
    }
    var countrycoide = '';
    var numberphone = '';
    if (data.userInfo.mobileNumber) {
      (countrycoide = data.userInfo.mobileNumber.substring(
        0,
        data.userInfo.mobileNumber.length - 10
      )),
        (numberphone = data.userInfo.mobileNumber.substring(
          data.userInfo.mobileNumber.length - 10,
          data.userInfo.mobileNumber.length
        ));
    }

    this.setState(
      {
        name: username,
        firstName: data.userInfo.firstName,
        lastName: data.userInfo.lastName,
        dob: data.userInfo.dob ? data.userInfo.dob : '',
        mobile_number: numberphone,
        countrycode: countrycoide,
        email: data.userInfo.email ? data.userInfo.email : '',
        state: data.userInfo.state ? data.userInfo.state : '',
        boardvalue: data.userOrg.universityName
          ? data.userOrg.universityName
          : '',
        grade: data.userOrg.semesterName ? data.userOrg.semesterName : '',
        branch: data.userOrg.branchName ? data.userOrg.branchName : '',
        profilepic: data.userInfo.profilePic ? data.userInfo.profilePic : null,
        gradeselect: data.userInfo.gradeId,
        initialspinnerr: false,
      },
      () => console.log('JSasfdf')
    );
  }
  getBoards(value) {
    console.log(value);
    fetch(baseUrl + '/boards', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((json) => {
        //const data = json.data;
        if (json.code === 201) {
          if (json.data) {
            var data = json.data;
            if (data.items) {
              console.log('boards', json.data.items);
              var boardarray = [];
              {
                data.items.map((res, i) => {
                  var obj = { label: res.name, value: res.id };
                  boardarray.push(obj);
                });
              }
              this.setState({
                spinner: false,
                boardsData: boardarray,
              });
            } else {
              this.setState({
                spinner: false,
                boardsData: [],
              });
            }
            this.getData();
            //  AsyncStorage.setItem('@access-token', data.access_token)
            //  Actions.push('dashboard')
          } else {
            this.setState({
              spinner: false,
              boardsData: [],
            });
            alert(JSON.stringify(json.error.message));
          }
        } else if (json.error?.code === 400) {
          //alert("dknkdf")
          Alert.alert('My Professor', json.error.message, [
            { text: 'OK', onPress: () => this.logout() },
          ]);
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
    Actions.pop();
  }
  selectPhotoTapped = () => {
    Alert.alert(
      'Choose Option',
      '',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
        },
        {
          text: 'Open Camera',
          onPress: () => this.openCamera(),
        },
        { text: 'Choose from Gallery', onPress: () => this.openPicker() },
      ],
      { cancelable: false }
    );
  };
  openCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      includeBase64: true,
      compressImageQuality: 0.8,
    }).then((image) => {
      this.setState({ profilepic: image.data, picture: image });
      // onSubmit(image.data)
    });
    // launchCamera(
    //     {
    //         mediaType: 'photo',
    //         includeBase64: true,
    //         maxHeight: 200,
    //         maxWidth: 200,
    //     },
    //     (response) => {
    //       //  console.log("imageee", response)
    //         let source = { uri: response.uri };
    //         this.setState({ profilepic: response.base64, picture: response });
    //     },
    // )
  };
  openPicker = () => {
    ImagePicker.openPicker({
      width: 400,
      height: 400,
      cropping: true,
      includeBase64: true,
      compressImageQuality: 0.8,
    }).then((image) => {
      console.log('imagefrom', image);

      this.setState({ profilepic: image.data, picture: image });
      // this.showPicker(false)
    });
    // launchImageLibrary(
    //     {
    //         mediaType: 'photo',
    //         includeBase64: true,
    //         maxHeight: 200,
    //         maxWidth: 200,
    //     },
    //     (response) => {
    //        // console.log("adsfbakjfhkjdhkjd", response)
    //         let source = { uri: response.uri };
    //         this.setState({ profilepic: response.base64, picture: response });
    //     },
    // )
  };

  createFormData = (photo, body) => {
    const data = new FormData();
    if (photo) {
      data.append('profile_pic', {
        name: photo.fileName,
        type: photo.type,
        uri:
          Platform.OS === 'android'
            ? photo.uri
            : photo.uri.replace('file://', ''),
      });
    }

    Object.keys(body).forEach((key) => {
      data.append(key, body[key]);
    });
    console.log('dkjhjkdfkd', data);
    return data;
  };
  update() {
    var newnumber = Math.random();
    this.setState({
      updateloading: true,
    });
    //   alert(this.state.profilepic)
    console.log(this.state.firstName, this.state.lastName);
    if (this.state.firstName === '') {
      this.setState({
        updateloading: false,
      });
      alert('Please enter First Name');
    } else {
      let result = this.state.profilepic?.includes('http');
      console.log('dknckd', result, this.state.profilepic);
      var profilepicnew, normladata;
      if (result) {
        var normladata = {
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          profilePic: this.state.profilepic,
          // fileName:"profilepic"+newnumber+".png"
        };
      } else if (this.state.profilepic !== null) {
        var normladata = {
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          profilePic: 'data:image/png;base64,' + this.state.profilepic,
          fileName: 'profilepic' + newnumber + '.png',
        };
      } else {
        var normladata = {
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          profilePic: null,
          // fileName:"profilepic"+newnumber+".png"
        };
      }

      console.log('dfndknfk', normladata);

      fetch(baseUrl + `/users/${this.state.userID}/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          jwt: this.state.token,
        },
        body: JSON.stringify(normladata),
      })
        .then((response) => response.json())
        .then((json) => {
          console.log('jsonjson', json);
          const data = json.data;
          if (json.code === 201) {
            this.getuserrbyId();
          } else if (json.error?.code === 400) {
            //alert("dknkdf")
            Alert.alert('My Professor', json.error.message, [
              { text: 'OK', onPress: () => this.logout() },
            ]);
          } else {
            this.setState({
              loading: false,
              updateloading: false,
            });
            alert(JSON.stringify(json.errorr.message));
          }
        })
        .catch((error) => consojsonjsonle.log(error));
    }
  }
  getuserrbyId() {
    fetch(baseUrl + `/users/${this.state.userID}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        jwt: this.state.token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.code === 201) {
          this.setState({
            loading: false,
            updateloading: false,
          });
          console.log('updateeeee', json.data);
          var data = json.data;
          AsyncStorage.setItem('@user', JSON.stringify(data));
          Alert.alert('My Professor', 'Profile Updated.', [
            {
              text: 'OK',
              onPress: () => {
                Actions.dashboard({ type: 'reset' });
              },
            },
          ]);
        }
      })
      .catch((error) => console.log(error));
  }
  showDatePicker = () => {
    this.setState({
      picker: true,
    });
  };

  hideDatePicker = () => {
    this.setState({
      picker: false,
    });
  };

  handleConfirm = (date) => {
    console.warn('A date has been picked: ', moment(date).format('L'));
    this.setState({ dob: moment(date).format('L') });
    this.hideDatePicker();
  };
  render() {
    const selectedItem = {
      title: 'Selected item title',
      description: 'Secondary long descriptive text ...',
    };
    var backheight = 16,
      backwidth = 21,
      headfont = 18,
      profileimg = 100,
      iconwidth = 23,
      textinutheight = 40,
      textinputwidth = windowWidth / 1.3,
      textfont = 13,
      updateheight = 41;
    const isTablet = DeviceConstants.isTablet;
    if (isTablet) {
      (backheight = 20),
        (backwidth = 30),
        (headfont = 27),
        (profileimg = 150),
        (iconwidth = 33),
        (textinutheight = 60),
        (textinputwidth = windowWidth / 1.15),
        (textfont = 23),
        (updateheight = 51);
    }
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.mainView}>
          <View style={styles.topView}>
            <View style={styles.topShadow}>
              <View style={styles.topsubview}>
                <View style={styles.topleftview}>
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
                </View>
                <View style={styles.topmiddleview}>
                  <Text
                    style={{
                      marginLeft: 20,
                      color: colors.Themecolor,
                      fontSize: headfont,
                    }}
                  >
                    {StringsOfLanguages.editprofile}
                  </Text>
                </View>
                <View style={styles.toprightview} />
              </View>
            </View>
          </View>

          <View style={styles.bottomView}>
            <View style={{ flex: 1 }}>
              <View
                style={{ flex: 0.2, justifyContent: 'center', marginTop: 10 }}
              >
                {this.state.initialspinnerr ? null : (
                  <TouchableOpacity onPress={this.selectPhotoTapped}>
                    {this.state.profilepic ? (
                      this.state.profilepic?.indexOf('https') !== '-1' ? (
                        <FastImage
                          source={{ uri: this.state.profilepic }}
                          style={{
                            width: profileimg,
                            height: profileimg,
                            borderRadius: profileimg / 2,
                            alignSelf: 'center',
                          }}
                        />
                      ) : this.state.profilepic.indexOf('https') === '-1' ? (
                        <FastImage
                          source={{
                            uri: `data:image/gif;base64,${this.state.profilepic}`,
                          }}
                          style={{
                            width: profileimg,
                            height: profileimg,
                            borderRadius: profileimg / 2,
                            alignSelf: 'center',
                          }}
                        />
                      ) : (
                        <FastImage
                          style={{
                            width: profileimg - 20,
                            height: profileimg - 20,
                            tintColor: colors.Themecolor,
                            alignSelf: 'center',
                          }}
                          source={require('../../assets/images/dashboard/user.png')}
                        />
                      )
                    ) : (
                      <FastImage
                        style={{
                          width: profileimg - 20,
                          height: profileimg - 20,
                          tintColor: colors.Themecolor,
                          alignSelf: 'center',
                        }}
                        source={require('../../assets/images/dashboard/user.png')}
                      />
                    )}
                  </TouchableOpacity>
                )}
              </View>
              <View style={{ flex: 0.8 }}>
                <ScrollView
                  contentInsetAdjustmentBehavior="automatic"
                  keyboardShouldPersistTaps={'handled'}
                  style={{
                    backgroundColor: 'transparent',
                    overflow: 'hidden',
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 10,
                    }}
                  >
                    <Image
                      source={require('../../assets/images/refer/profileicon.png')}
                      style={{
                        width: iconwidth,
                        height: iconwidth + iconwidth,
                        tintColor: colors.Themecolor,
                      }}
                    />
                    <TextInput
                      placeholder="First Name"
                      value={this.state.firstName}
                      onChangeText={(text) =>
                        this.setState({ firstName: text })
                      }
                      style={{
                        color: colors.Themecolor,
                        height: textinutheight,
                        fontSize: textfont,
                        width: textinputwidth,
                        borderColor: colors.Themecolor,
                        borderBottomWidth: 1,
                        marginLeft: 20,
                      }}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 10,
                    }}
                  >
                    <Image
                      source={require('../../assets/images/refer/profileicon.png')}
                      style={{
                        width: iconwidth,
                        height: iconwidth + iconwidth,
                        tintColor: colors.Themecolor,
                      }}
                    />
                    <TextInput
                      placeholder="Last Name"
                      value={this.state.lastName}
                      onChangeText={(text) => this.setState({ lastName: text })}
                      style={{
                        color: colors.Themecolor,
                        height: textinutheight,
                        fontSize: textfont,
                        width: textinputwidth,
                        borderColor: colors.Themecolor,
                        borderBottomWidth: 1,
                        marginLeft: 20,
                      }}
                    />
                  </View>

                  {/* <View style={{ flexDirection: 'row', alignItems: "center", paddingVertical: 20 }}>
                                    <Image
                                        source={require('../../assets/images/refer/gendericon.png')}
                                        style={{ width: 23, height: 25  ,tintColor:colors.Themecolor}} />
                                    <View style={{ paddingLeft: 20 }}>
                                        <RadioForm
                                            formHorizontal={true}
                                            animation={true}
                                        >
                                           
                                            {
                                                radio_props.map((obj, i) => (
                                                    <RadioButton labelHorizontal={true} key={i} >
                                                 
                                                        <RadioButtonInput
                                                            obj={obj}
                                                            index={i}
                                                            isSelected={this.state.genderval === i}
                                                            onPress={(value) => {
                                                                //  alert(value)
                                                                this.setState({ genderval: value })
                                                            }}
                                                            borderWidth={1}
                                                            buttonInnerColor={ colors.Themecolor}
                                                            buttonOuterColor={ colors.Themecolor}
                                                            buttonSize={10}
                                                            buttonOuterSize={20}
                                                            buttonStyle={{}}
                                                            buttonWrapStyle={{ marginLeft: 10 }}
                                                        />
                                                        <RadioButtonLabel
                                                            obj={obj}
                                                            index={i}
                                                            labelHorizontal={true}
                                                            onPress={(value) => this.setState({ genderval: value })}
                                                            labelStyle={{ fontSize: 15, color:  colors.Themecolor}}
                                                            labelWrapStyle={{}}
                                                        />
                                                    </RadioButton>
                                                ))
                                            }
                                        </RadioForm>
                                    </View>

                                </View> */}

                  {/* <View style={{ flexDirection: 'row', alignItems: "center", paddingVertical: 10 }}>
                                    <Image
                                        source={require('../../assets/images/refer/dobicon.png')}
                                        style={{ width: 23, height: 23  ,tintColor:colors.Themecolor}} />
                                    <TouchableOpacity onPress={() => this.setState({ picker: !this.state.picker })}
                                        style={{ height: 40, width: windowWidth / 1.3, borderColor: colors.Themecolor, borderBottomWidth: 1, marginLeft: 20, justifyContent: "center" }}>
                                        <Text style={{ color:  colors.Themecolor, }}>{this.state.dob === "" ? "Enter dob" : this.state.dob}</Text>
                                    </TouchableOpacity>


                                </View> */}

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 10,
                    }}
                  >
                    <Image
                      source={require('../../assets/images/refer/boardicon.png')}
                      style={{
                        width: iconwidth,
                        height: iconwidth,
                        tintColor: colors.Themecolor,
                      }}
                    />
                    <TextInput
                      editable={false}
                      placeholder="Board"
                      value={this.state.boardvalue}
                      style={{
                        color: colors.Themecolor,
                        height: textinutheight,
                        fontSize: textfont,
                        width: textinputwidth,
                        borderColor: colors.Themecolor,
                        borderBottomWidth: 1,
                        marginLeft: 20,
                      }}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 10,
                    }}
                  >
                    <Image
                      source={require('../../assets/images/refer/gradeicon.png')}
                      style={{
                        width: iconwidth,
                        height: iconwidth,
                        tintColor: colors.Themecolor,
                      }}
                    />
                    <TextInput
                      editable={false}
                      placeholder="Branch"
                      value={this.state.branch}
                      style={{
                        color: colors.Themecolor,
                        height: textinutheight,
                        fontSize: textfont,
                        width: textinputwidth,
                        borderColor: colors.Themecolor,
                        borderBottomWidth: 1,
                        marginLeft: 20,
                      }}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 10,
                    }}
                  >
                    <Image
                      source={require('../../assets/images/refer/gradeicon.png')}
                      style={{
                        width: iconwidth,
                        height: iconwidth,
                        tintColor: colors.Themecolor,
                      }}
                    />
                    <TextInput
                      editable={false}
                      placeholder="Semester"
                      value={this.state.grade}
                      style={{
                        color: colors.Themecolor,
                        height: textinutheight,
                        fontSize: textfont,
                        width: textinputwidth,
                        borderColor: colors.Themecolor,
                        borderBottomWidth: 1,
                        marginLeft: 20,
                      }}
                    />
                  </View>

                  <TouchableOpacity
                    onPress={this.update.bind(this)}
                    style={{
                      height: updateheight,
                      width: '80%',
                      borderRadius: 10,
                      alignSelf: 'center',
                      backgroundColor: colors.Themecolor,
                      alignItems: 'center',
                      marginVertical: 30,
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ color: 'white', fontSize: headfont }}>
                      {'Update Profile'}
                    </Text>
                  </TouchableOpacity>
                </ScrollView>
                <DateTimePickerModal
                  isVisible={this.state.picker}
                  mode="date"
                  onConfirm={this.handleConfirm}
                  onCancel={this.hideDatePicker}
                />
              </View>
            </View>
          </View>
        </View>
        {this.state.updateloading ? (
          <View
            style={{
              position: 'absolute',
              height: windowHeight,
              width: windowWidth,
              backgroundColor: 'transparent',
              justifyContent: 'center',
            }}
          >
            <ActivityIndicator color={'black'} />
          </View>
        ) : null}
      </SafeAreaView>
    );
  }
}
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    borderWidth: 1,
    borderWidth: 0.5,
    borderColor: 'transparent',
    borderRadius: 8,
    color: colors.Themecolor,
    // marginBottom:10,
    paddingRight: 10, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    borderWidth: 1,
    borderWidth: 0.5,
    borderColor: 'transparent',
    borderRadius: 8,
    color: colors.Themecolor,
    // marginBottom:10,
    paddingRight: 10, // to ensure the text is never behind the icon
  },
});
export default EditProfile;
