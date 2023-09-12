import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import {
  Alert,
  BackHandler,
  Dimensions,
  Image,
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
import LinearGradient from 'react-native-linear-gradient';
import RNPickerSelect from 'react-native-picker-select';
import * as Progress from 'react-native-progress';
import { Actions } from 'react-native-router-flux';
import { baseUrl, colors } from '../../constants';
import styles from './styles';

// var states = [
//   { label: 'Andhra Pradesh', value: 'Andhra Pradesh' },
//   { label: 'Arunachal Pradesh', value: 'Arunachal Pradesh' },
//   { label: 'Assam', value: 'Assam' },
//   { label: 'Bihar', value: 'Bihar' },
// ];

const windowWidth = Dimensions.get('window').width;

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userDetails: null,
      profile_pic: null,
      profileprcent: 0,
      username: '',
      packageGradeList: [],
      currentActiveGrade: null,
      selectedGrade: null,
      gradevalue: '',
      gradeList: [],
      activeUserGrade: null,
      loading: true,
      token: '',
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
            token: JSON.parse(token),
          });
          // this.setData(data)
          this.getuserrbyId(data, JSON.parse(token));
        }
      } else {
        //Actions.push('login')
      }
    } catch (e) {
      return null;
    }
  };
  getuserrbyId(data, token) {
    //alert(data.userInfo.userId)
    fetch(baseUrl + `/users/${data.userInfo.userId}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        jwt: token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        //alert(JSON.stringify(json))
        if (json.code === 201) {
          this.setState({
            loading: false,
          });
          console.log('sabdhjkasbcjkabcjksab', json.data);
          if (json?.data) {
            AsyncStorage.setItem('@user', JSON.stringify(json.data));

            this.setData(json.data);
          } else {
            this.setData(data);
          }
        } else if (json.error?.code === 400) {
          //alert("dknkdf")
          Alert.alert('My Professor', json.error.message, [
            { text: 'OK', onPress: () => this.logout() },
          ]);
        }
      })
      .catch((error) => console.log(error));
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
  setData(data) {
    if (Object.keys(data)?.length > 0) {
      //let totalTime=Object.values(data).reduce((a, b) => a + b, 0)
      var count = 0;
      // Object.keys(data).map((key,value)=>{
      // console.log("objjjj",data[key])
      if (data.userInfo['profilePic']) {
        count = count + 1;
      }
      //    if(data['first_name']){
      //        count = count +1
      //    }
      if (data.userInfo.lastName) {
        count = count + 1;
      }
      if (data.userInfo.dob) {
        count = count + 1;
      }
      if (data.userInfo.mobileNumber) {
        count = count + 1;
      }
      if (data.userInfo.email) {
        count = count + 1;
      }
      if (data.userOrg.universityId) {
        count = count + 1;
      }
      if (data.userOrg.branchId) {
        count = count + 1;
      }
      if (data.userOrg.semesterId) {
        count = count + 1;
      }
      if (data.userInfo.gender) {
        count = count + 1;
      }
      // })

      var profileprcent = count / 8;
      console.log('c........ounttt', count, profileprcent);
    }
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
    this.setState({
      userDetails: data,
      username,
      profile_pic: data.userInfo.profilePic,
      profileprcent: profileprcent.toFixed(2),
      loading: false,
    });

    console.log('data.payment.payment_status', this.state.profile_pic);
    if (data?.payment?.payment_status) {
      console.log('da,xckkjxnvckxnvckxz.n,.xzmnc');
      this.getActiveUserGrade(JSON.parse(value));
    } else {
      console.log('da,jjdhfjlkdhfkldjfk');
    }
  }
  async getActiveUserGrade(user) {
    const value = await AsyncStorage.getItem('@access_token');
    if (value !== null) {
      var userId = user.reference_id;
      var url = baseUrl + '/user-grade/user/active-grade/' + userId;

      fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          token: JSON.parse(value),
        },
      })
        .then((response) => response.json())
        .then((json) => {
          console.log('newactivegrade', json.data);
          this.setState(
            {
              activeUserGrade: json.data,
              selectedGrade: json.data,
              gradevalue: json.data.grade_id,
            },
            () => {
              this.getgrades(user);
            }
          );
        });
    }
  }
  async getgrades(user) {
    console.log('dkanflknf', user);
    //  var gradeList =[]
    const value = await AsyncStorage.getItem('@access_token');
    if (value !== null) {
      var url =
        baseUrl +
        '/grade?board=' +
        user.board_id +
        '&order_by=index&sort_order=ASC&offset=0&limit=10000';
      console.log('value', url);
      fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          token: JSON.parse(value),
        },
      })
        .then((response) => response.json())
        .then((json) => {
          const data = json.data;
          console.log('sss', data);
          if (data) {
            if (data.grades) {
              var grades = json.data.grades;
              console.log('ancknxkgradesgradesxcmx', grades.length);
              if (grades && grades?.length > 0) {
                let gradeList = grades?.map((gr) => {
                  return { label: gr.name, value: gr.reference_id };
                });
                console.log('ancknxkxcmx', gradeList);
                this.setState({ gradeList }, () => {
                  this.newlogic(user);
                });
              }
            } else {
              this.setState({
                spinner: false,
                gradesData: [],
              });
            }
          } else {
            alert(JSON.stringify(json));
            this.setState({
              spinner: false,
              gradesData: [],
            });
          }
        })
        .catch((error) => console.error(error));
    }
  }
  newlogic(user) {
    const gradeList = this.state.gradeList;
    if (user?.payment?.package) {
      const packageInfo = JSON.parse(user?.payment.package);
      const gradeArr = gradeList.filter((g) =>
        [packageInfo.fromGrade, packageInfo.toGrade].includes(g.value)
      );
      if (
        (packageInfo.fromGrade !== packageInfo.toGrade &&
          packageInfo.fromGrade.indexOf('11') > -1) ||
        packageInfo.toGrade.indexOf('12') > -1
      ) {
        const currentActiveGrade = gradeList.find((g) =>
          [this.state.activeUserGrade.grade_id].includes(g.value)
        );
        console.log('gradearrayyaa', gradeArr, currentActiveGrade);
        this.setState({
          packageGradeList: gradeArr,
          currentActiveGrade,
          selectedGrade: currentActiveGrade,
        });
      }
    }
  }
  onBack() {
    Actions.dashboard();
  }
  onsubjectclick(value, index) {
    console.log('ndbhjasbfjdbj', value, this.state.packageGradeList[index - 1]);
    this.setState(
      {
        gradevalue: value,
        selectedGrade: this.state.packageGradeList[index - 1],
      },
      async () => {
        var userDetails = this.state.userDetails;
        if (this.state.selectedGrade.value !== userDetails.grade.reference_id) {
          this.setState({
            currentUserGrade: this.state.selectedGrade,
          });
          const tokenvalue = await AsyncStorage.getItem('@access_token');
          if (tokenvalue !== null) {
            var userId = this.state.userDetails.reference_id;
            var gradeId = value;
            var url =
              baseUrl +
              '/user-grade/user/active-grade/' +
              userId +
              '/' +
              gradeId;
            console.log('value', url);
            fetch(url, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                token: JSON.parse(tokenvalue),
              },
            })
              .then((response) => response.json())
              .then((json) => {
                console.log('adknknk.', json);
                this.getuser();
              })
              .catch((error) => console.error(error));
          }
        }
      }
    );
  }
  async getuser() {
    const tokenvalue = await AsyncStorage.getItem('@access_token');
    if (tokenvalue !== null) {
      var url = baseUrl + '/user/' + this.state.userDetails.reference_id;
      console.log('value', url);
      fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          token: JSON.parse(tokenvalue),
        },
      })
        .then((response) => response.json())
        .then((json) => {
          if (json) {
            if (json.data) {
              console.log('adknuserdataaaaaaknk.', json);
              this.setState({
                userDetails: json.data,
              });
              AsyncStorage.setItem('@user', JSON.stringify(json.data));
            }
          }
        })
        .catch((error) => console.error(error));
    }
  }
  render() {
    const isTablet = DeviceConstants.isTablet;
    var backheight = 16,
      backwidth = 21,
      headfont = 20,
      subfont = 15,
      progressheight = 5,
      progresswidth = windowWidth / 1.25,
      imgwidth = 80,
      verticalpadding = 10,
      textinutheight = 40,
      textinputwidth = windowWidth / 1.3,
      textfont = 13,
      iconwidth = 23,
      iconprofile = 46;
    if (isTablet) {
      (backheight = 20),
        (backwidth = 30),
        (headfont = 30),
        (subfont = 25),
        (progressheight = 8),
        (progresswidth = windowWidth / 1.18),
        (imgwidth = 100),
        (verticalpadding = 20),
        (textinutheight = 60),
        (textinputwidth = windowWidth / 1.15),
        (textfont = 23),
        (iconwidth = 23),
        (iconwidth = 33),
        (iconprofile = 56);
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
                    Profile
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => Actions.push('editprofile')}
                  style={styles.toprightview}
                >
                  <Text
                    style={{
                      fontSize: subfont,
                      textAlign: 'center',
                      marginLeft: 5,
                      color: colors.Themecolor,
                    }}
                  >
                    Edit
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {this.state.loading ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text>Loading..</Text>
            </View>
          ) : (
            <View style={{ flex: 0.92 }}>
              <View style={styles.bottomtopvieW}>
                <LinearGradient
                  colors={[
                    ' rgba(105, 80, 119, 0.08)',
                    'rgba(132, 115, 147, 0.064)',
                  ]}
                  style={styles.gradientview}
                >
                  <View style={{ flex: 1 }}>
                    <View
                      style={{
                        flex: 0.5,
                        paddingLeft: 15,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                    >
                      {this.state.userDetails?.userInfo?.profilePic ? (
                        <FastImage
                          style={{
                            width: imgwidth,
                            height: imgwidth,
                            borderRadius: imgwidth / 2,
                            backgroundColor: 'red',
                            borderColor: 'white',
                          }}
                          source={{
                            uri: this.state.userDetails.userInfo.profilePic,
                          }}
                        />
                      ) : (
                        <Image
                          style={{
                            width: imgwidth,
                            height: imgwidth,
                            tintColor: colors.Themecolor,
                          }}
                          source={require('../../assets/images/dashboard/user.png')}
                        />
                      )}
                      <View
                        style={{
                          flexDirection: 'column',
                          marginLeft: 15,
                          justifyContent: 'center',
                        }}
                      >
                        <Text
                          style={{
                            fontSize: headfont,
                            lineHeight: 28,
                            color: colors.Themecolor,
                          }}
                        >
                          {this.state.userDetails
                            ? this.state.userDetails.userInfo.firstName
                            : null}
                        </Text>
                        <Text
                          style={{
                            fontSize: subfont,
                            lineHeight: 19,

                            color: colors.Themecolor,
                          }}
                        >
                          {this.state.userDetails
                            ? this.state.userDetails.userOrg.gradeId
                              ? this.state.userDetails.userOrg.gradeId
                              : null
                            : null}
                        </Text>
                      </View>
                    </View>
                    <View style={{ flex: 0.5, marginTop: 10 }}>
                      <View style={{}}>
                        <Text
                          style={{
                            fontSize: headfont,
                            //lineHeight: 19,
                            paddingLeft: 15,
                            color: colors.Themecolor,
                          }}
                        >
                          Profile Completion
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            marginTop: 10,
                            paddingVertical: verticalpadding,
                            marginHorizontal: 10,
                            borderRadius: 10,
                            backgroundColor: 'white',
                            justifyContent: 'space-evenly',
                            alignItems: 'center',
                            boxShadow: ' 0px 4px 28px rgba(105, 80, 119, 0.2)',
                          }}
                        >
                          <View>
                            <Progress.Bar
                              progress={this.state.profileprcent}
                              width={progresswidth}
                              height={progressheight}
                              color={colors.Themecolor}
                            />
                          </View>

                          <Text
                            style={{
                              color: colors.Themecolor,
                              fontSize: subfont,
                            }}
                          >
                            {Math.round(this.state.profileprcent * 100) > 100
                              ? 100
                              : Math.round(this.state.profileprcent * 100)}
                            %
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </LinearGradient>
              </View>
              <View style={styles.bottomsubView}>
                <View
                  style={{
                    paddingHorizontal: 15,
                    paddingVertical: 10,
                    marginLeft: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: headfont,
                      //  lineHeight: 21,

                      color: colors.Themecolor,
                    }}
                  >
                    Profile Details
                  </Text>
                </View>
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
                      marginLeft: 20,
                      paddingVertical: 10,
                    }}
                  >
                    <Image
                      source={require('../../assets/images/refer/profileicon.png')}
                      style={{
                        width: iconwidth,
                        height: iconprofile,
                        tintColor: colors.Themecolor,
                      }}
                    />
                    <TextInput
                      placeholder="Name"
                      editable={false}
                      placeholderTextColor="black"
                      value={this.state.username}
                      style={{
                        fontSize: textfont,
                        color: 'black',
                        height: textinutheight,
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
                      marginLeft: 20,
                      paddingVertical: 20,
                    }}
                  >
                    <Image
                      source={require('../../assets/images/refer/gendericon.png')}
                      style={{
                        width: iconwidth,
                        height: iconwidth + 2,
                        tintColor: colors.Themecolor,
                      }}
                    />
                    <TextInput
                      placeholder="gender"
                      placeholderTextColor="black"
                      editable={false}
                      value={
                        this.state.userDetails
                          ? this.state.userDetails.userInfo.gender
                          : null
                      }
                      style={{
                        height: textinutheight,
                        color: 'black',
                        fontSize: textfont,
                        width: textinputwidth,
                        borderColor: colors.Themecolor,
                        borderBottomWidth: 1,
                        marginLeft: 20,
                      }}
                    />
                  </View>

                  {/* <View style={{ flexDirection: 'row', alignItems: "center", marginLeft: 20, paddingVertical: 20 }}>
                                <Image
                                    source={require('../../assets/images/refer/dobicon.png')}
                                    style={{ width: 23, height: 23,tintColor:colors.Themecolor  }} />
                                <TextInput
                                    placeholder="dob"
                                    editable={false}
                                    value={this.state.userDetails ? this.state.userDetails.userInfo.dob ? moment(this.state.userDetails.userInfo.dob).format('L') : "" : ""}
                                    style={{ height: 40, width: windowWidth / 1.3, borderColor: colors.Themecolor, borderBottomWidth: 1, marginLeft: 20 }} />
                            </View> */}

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginLeft: 20,
                      paddingVertical: 20,
                    }}
                  >
                    <Image
                      source={require('../../assets/images/refer/phoneicon.png')}
                      style={{
                        width: iconwidth,
                        height: iconwidth - 1,
                        tintColor: colors.Themecolor,
                      }}
                    />
                    <TextInput
                      placeholder="phone number"
                      placeholderTextColor="black"
                      editable={false}
                      value={
                        this.state.userDetails
                          ? this.state.userDetails.userInfo.mobileNumber
                          : null
                      }
                      style={{
                        height: textinutheight,
                        color: 'black',
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
                      marginLeft: 20,
                      paddingVertical: 20,
                    }}
                  >
                    <Image
                      source={require('../../assets/images/refer/emailicon.png')}
                      style={{
                        width: iconwidth,
                        height: iconwidth + 8,
                        tintColor: colors.Themecolor,
                      }}
                    />
                    <TextInput
                      placeholder="email"
                      placeholderTextColor="black"
                      editable={false}
                      value={
                        this.state.userDetails
                          ? this.state.userDetails.userInfo.email
                          : null
                      }
                      style={{
                        height: textinutheight,
                        color: 'black',
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
                      marginLeft: 20,
                      paddingVertical: 20,
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
                      placeholder="board"
                      placeholderTextColor="black"
                      editable={false}
                      value={
                        this.state.userDetails
                          ? this.state.userDetails.userOrg.universityName
                            ? this.state.userDetails.userOrg.universityName
                            : null
                          : null
                      }
                      style={{
                        height: textinutheight,
                        color: 'black',
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
                      marginLeft: 20,
                      paddingVertical: 20,
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
                      placeholder="branch"
                      placeholderTextColor="black"
                      editable={false}
                      value={
                        this.state.userDetails
                          ? this.state.userDetails.userOrg.branchName
                            ? this.state.userDetails.userOrg.branchName
                            : null
                          : null
                      }
                      style={{
                        height: textinutheight,
                        color: 'black',
                        fontSize: textfont,
                        width: textinputwidth,
                        borderColor: colors.Themecolor,
                        borderBottomWidth: 1,
                        marginLeft: 20,
                      }}
                    />
                  </View>

                  {this.state.packageGradeList.length > 0 ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginLeft: 20,
                        paddingVertical: 20,
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
                      <View
                        style={{
                          height: 50,
                          width: windowWidth / 1.3,
                          alignSelf: 'center',
                          marginLeft: 20,
                          borderColor: colors.Themecolor,
                          flexDirection: 'row',
                          borderBottomWidth: 1,
                          color: 'black',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <RNPickerSelect
                          //   placeholder={placeholder}
                          value={this.state.gradevalue}
                          style={pickerSelectStyles}
                          useNativeAndroidPickerStyle={false}
                          onValueChange={this.onsubjectclick.bind(this)}
                          items={this.state.packageGradeList}
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
                    </View>
                  ) : (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginLeft: 20,
                        paddingVertical: 20,
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
                        placeholder="grade"
                        placeholderTextColor="black"
                        editable={false}
                        value={
                          this.state.userDetails
                            ? this.state.userDetails.userOrg.semesterName
                              ? this.state.userDetails.userOrg.semesterName
                              : null
                            : null
                        }
                        style={{
                          height: textinutheight,
                          color: 'black',
                          fontSize: textfont,
                          width: textinputwidth,
                          borderColor: colors.Themecolor,
                          borderBottomWidth: 1,
                          marginLeft: 20,
                        }}
                      />
                    </View>
                  )}
                </ScrollView>
              </View>
            </View>
          )}
        </View>
      </SafeAreaView>
    );
  }
}
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 15,
    borderWidth: 1,
    width: windowWidth / 1.3,
    borderColor: 'transparent',
    borderRadius: 8,
    color: 'black',
    marginTop: 10,
    // marginBottom:10,
    paddingRight: 10, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    borderWidth: 1,
    borderWidth: 0.5,
    width: windowWidth / 1.3,

    borderColor: 'transparent',
    borderRadius: 8,
    marginTop: 10,
    color: 'black',
    // marginBottom:10,
    paddingRight: 10, // to ensure the text is never behind the icon
  },
});
