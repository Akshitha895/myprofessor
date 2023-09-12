import React, { Component } from 'react';
import {
  Alert,
  BackHandler,
  Dimensions,
  Image,
  ImageBackground,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DeviceConstants from 'react-native-device-constants';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Actions } from 'react-native-router-flux';
import StringsOfLanguages from '../../StringsOfLanguages';
import { baseUrl, colors } from '../../constants';
import styles from './styles';
const windowWidth = Dimensions.get('window').width;

// var FloatingLabel = require('react-native-floating-labels');

class PracticeReview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isvisible: false,
      testdata: [],
      spinner: true,
      token: '',
      activityid: this.props.activityid,
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
    Actions.practicechapter({ type: 'reset', data: this.props.data });
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
          this.gettestsdata(data, JSON.parse(token));
        } else {
        }
      } else {
        console.log('errorr');
      }
    } catch (e) {
      return null;
    }
  };
  gettestsdata(data, token) {
    console.log('dnkldac', this.props.data);
    var userId = data.userInfo.userId;
    var universityId = data.userOrg.universityId;
    var subjectId = this.props.data.subjectId;
    var type;
    var body;
    var url;
    if (this.props.data.testType === 'Chapter') {
      type = 'Chapter';
      body = {
        chapterId: this.props.data.chapterId,
      };
      var chapterId = this.props.data.chapterId;
      url =
        baseUrl +
        `/universities/${universityId}/subjects/${subjectId}/practice-tests/${type}/list?userId=${userId}&chapterId=${chapterId}&testType=Chapter`;
    } else {
      type = 'Subject';
      url =
        baseUrl +
        `/universities/${universityId}/subjects/${subjectId}/practice-tests/${type}/list?userId=${userId}`;
    }
    console.log('dawfdfdasfdsafdsfds', url);
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        jwt: token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        console.log('smnkjabcnjkabcjkandcljkdnjkld', json);
        if (json.code === 201) {
          if (json.data) {
            const data = json.data;
            var newarra = [];

            if (data) {
              this.setState(
                {
                  spinner: false,
                  testdata: data,
                },
                () => console.log('previous tests', data)
              );
            } else {
              this.setState({
                spinner: false,
                testdata: [],
              });
            }
            //  AsyncStorage.setItem('@access-token', data.access_token)
            //  Actions.push('dashboard')
          } else {
            //alert(JSON.stringify(json.message))
            this.setState({
              spinner: false,
              testdata: [],
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
            testdata: [],
          });
        }
        // }
      })
      .catch((error) => console.error(error));
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
    Actions.practicechapter({ type: 'reset', data: this.props.data });
  }

  onTest(item) {
    console.log('dvbnjksadvjkds', item);
    Actions.push('practicesummary', {
      from: 'reviewscreen',
      testid: item.userTestId,
      data: this.props.data,
      subjectData: this.props.subjectData,
    });
  }

  render() {
    const isTablet = DeviceConstants.isTablet; // false
    var backheight = 25,
      headfont = 18,
      headfonttest = 18,
      linewidth = 60,
      subtext = 15,
      circleheight = 30,
      leftwidth = 30;
    if (isTablet) {
      (backheight = 35),
        (headfont = 30),
        (headfonttest = 25),
        (linewidth = windowWidth / 4.5),
        (subtext = 20),
        (circleheight = 40),
        (leftwidth = 50);
    }
    const { topicindata } = this.props;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <>
          <ImageBackground
            source={require('../../assets/images/dashboard/new/activitybg.jpg')}
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: colors.Themecolor,
            }}
            opacity={0.5}
          >
            <View style={{ flex: 1 }}>
              <View style={{ flex: 0.08, flexDirection: 'row' }}>
                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      flex: 1,
                      marginLeft: 20,
                      flexDirection: 'row',
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
                        fontSize: headfont,
                        marginLeft: 20,
                      }}
                    >
                      {StringsOfLanguages.review}
                    </Text>
                  </View>
                </View>
                {/* <View style={{flex:0.3,justifyContent:"center"}}>
              { topicindata.image !== "null" ?
              <Image source={{ uri: imageUrl + topicindata.image }} style={{ width: 100, height: 100, resizeMode: "contain", marginRight: 10, }} />

              : <Image source={require('../../assets/images/noimage.png')}
              style={{ width: 80, height: 80, resizeMode: "contain", marginRight: 10, }} />}
              </View> */}
              </View>
              <View
                style={{
                  flex: 0.9,
                  backgroundColor: 'white',
                  marginLeft: 10,
                  marginRight: 10,
                  borderRadius: 20,
                  overflow: 'hidden',
                }}
              >
                <View style={styles.middleview}>
                  <View style={styles.subview}>
                    <Text style={[styles.headtext, { fontSize: headfont }]}>
                      {StringsOfLanguages.score}
                    </Text>
                    <View style={styles.lineview} />
                    {this.state.spinner ? (
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Text style={{ fontSize: headfont }}>
                          {StringsOfLanguages.loading}
                        </Text>
                      </View>
                    ) : this.state.testdata.length > 0 ? (
                      this.state.testdata.map((item, i) => (
                        <TouchableOpacity
                          key={i}
                          onPress={this.onTest.bind(this, item)}
                          style={styles.scoreview}
                        >
                          <Text
                            style={{
                              marginLeft: 10,
                              fontWeight: 'bold',
                              fontSize: headfonttest,
                            }}
                          >
                            {StringsOfLanguages.test} {i + 1}
                          </Text>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-around',
                              marginTop: 20,
                              marginLeft: leftwidth,
                              alignItems: 'center',
                            }}
                          >
                            <View
                              style={{
                                flexDirection: 'row',
                                height: 70,
                                width: '100%',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                            >
                              {/* {analysis.map((res,j)=> */}
                              <View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                  }}
                                >
                                  <View
                                    style={{
                                      width: circleheight,
                                      height: circleheight,
                                      borderRadius: circleheight / 2,
                                      backgroundColor:
                                        item.analysis === 'Poor'
                                          ? '#c54721'
                                          : 'grey',
                                    }}
                                  />
                                  <View
                                    style={{
                                      width: linewidth,
                                      height: 1,
                                      backgroundColor: 'black',
                                    }}
                                  />
                                </View>
                                <Text
                                  style={{
                                    textAlign: 'left',
                                    fontSize: subtext,
                                  }}
                                >
                                  {'Poor'}
                                </Text>
                              </View>
                              {/* )} */}
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                                height: 70,
                                width: '100%',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                            >
                              {/* {analysis.map((res,j)=> */}
                              <View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                  }}
                                >
                                  <View
                                    style={{
                                      width: circleheight,
                                      height: circleheight,
                                      borderRadius: circleheight / 2,
                                      backgroundColor:
                                        item.analysis === 'Average'
                                          ? '#d88414'
                                          : 'grey',
                                    }}
                                  />
                                  <View
                                    style={{
                                      width: linewidth,
                                      height: 1,
                                      backgroundColor: 'black',
                                    }}
                                  />
                                </View>
                                <Text
                                  style={{
                                    textAlign: 'left',
                                    fontSize: subtext,
                                  }}
                                >
                                  {'Average'}
                                </Text>
                              </View>
                              {/* )} */}
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                                height: 70,
                                width: '100%',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                            >
                              {/* {analysis.map((res,j)=> */}
                              <View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                  }}
                                >
                                  <View
                                    style={{
                                      width: circleheight,
                                      height: circleheight,
                                      borderRadius: circleheight / 2,
                                      backgroundColor:
                                        item.analysis === 'Fair'
                                          ? '#267093'
                                          : 'grey',
                                    }}
                                  />
                                  <View
                                    style={{
                                      width: linewidth,
                                      height: 1,
                                      backgroundColor: 'black',
                                    }}
                                  />
                                </View>
                                <Text
                                  style={{
                                    textAlign: 'left',
                                    fontSize: subtext,
                                  }}
                                >
                                  {'Good'}
                                </Text>
                              </View>
                              {/* )} */}
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                                height: 70,
                                width: '100%',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                            >
                              {/* {analysis.map((res,j)=> */}
                              <View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                  }}
                                >
                                  <View
                                    style={{
                                      width: circleheight,
                                      height: circleheight,
                                      borderRadius: circleheight / 2,
                                      backgroundColor:
                                        item.analysis === 'Good'
                                          ? '#a4b96e'
                                          : 'grey',
                                    }}
                                  />
                                  <View
                                    style={{
                                      width: linewidth,
                                      height: 1,
                                      backgroundColor: 'transparent',
                                    }}
                                  />
                                </View>
                                <Text
                                  style={{
                                    textAlign: 'left',
                                    fontSize: subtext,
                                  }}
                                >
                                  {'Excellent'}
                                </Text>
                              </View>
                              {/* )} */}
                            </View>
                          </View>
                        </TouchableOpacity>
                      ))
                    ) : null}
                  </View>
                </View>
              </View>
            </View>
          </ImageBackground>
        </>
      </SafeAreaView>
    );
  }
}
export default PracticeReview;
