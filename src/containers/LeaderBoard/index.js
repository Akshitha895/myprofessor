import React, { Component } from 'react';
import {
  Alert,
  BackHandler,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DeviceConstants from 'react-native-device-constants';
import Modal from 'react-native-modal';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Drawer from 'react-native-drawer';
import FastImage from 'react-native-fast-image';
import { Actions } from 'react-native-router-flux';
import Footer from '../../components/Footer';
import SideMenu from '../../components/SideMenu';
import { baseUrl, colors } from '../../constants';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class LeaderBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userDetails: '',
      token: '',
      spinner: true,
      currentstudent: {},
      leaderdata: [],
      logsspinner: false,
      isvisible: false,
      leadercriteria: [],
      ismypoints: false,
      currentUserRanking: {},
      studentRankings: [],
      studentTopRankings: [],
      mypointsdata: {},
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
    // this.props.navigation.goBack(null);
    this.onBack();
    return true;
    // Actions.topicmainview({from:this.props.from,type:"reset",data:this.props.topicindata,topicsdata:this.props.topicData,screen:"summary",subjectData:this.props.subjectData})
  };
  componentWillUnmount() {
    this.backHandler.remove();
  }
  onBack() {
    Actions.pop();
  }
  closeControlPanel = () => {
    this._drawer.close();
  };
  openControlPanel = () => {
    this._drawer.open();
  };

  getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@user');
      //  alert(JSON.stringify(value))
      if (value !== null) {
        var data = JSON.parse(value);

        const token = await AsyncStorage.getItem('@access_token');
        console.log('leaderdataaa', data);
        if (token) {
          this.setState(
            {
              token: JSON.parse(token),
              userDetails: data,
            },
            () => {
              this.getrules(data);
              this.getCriteria();
            }
          );
        } else {
        }
      } else {
        console.log('errorrr');
      }
    } catch (e) {
      return null;
    }
  };
  getrules() {
    var url = baseUrl + `/leader-board/rules`;
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        jwt: this.state.token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        console.log('ruleebook', json.data);
        if (json.code === 201) {
          this.setState({
            loading: false,
            ruleebook: json.data,
          });
        } else {
          this.setState({
            loading: false,
            ruleebook: [],
          });
        }
      })
      .catch((error) => console.error(error));
  }

  getCriteria() {
    var userId = this.state.userDetails.userInfo.userId;
    var universityId = this.state.userDetails.userOrg.universityId;
    var userrole = this.state.userDetails.role.roleName;
    var collegeId = this.state.userDetails.userOrg.collegeId;

    var url =
      baseUrl +
      `/users/${userId}/leader-board?universityId=${universityId}&collegeId=${collegeId}&role=${userrole}`;
    console.log('cnkakldsfls', url);
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        jwt: this.state.token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        // console.log("leadercriteria", json.data)
        if (json.code === 201) {
          console.log('dnldnfkld', json.data);
          if (json.data.userLeaderBoardInfo?.leaderBoard?.length > 0) {
            this.setState({
              spinner: false,
              leaderdata: [],
            });
          }
          this.setState({
            currentUserRanking: json.data.userLeaderBoardInfo,
            studentTopRankings: json.data.leaderBoard.slice(0, 2),
            spinner: false,
            leaderdata: json.data.leaderBoard,
            // currentstudent: newObj
          });
        } else if (json.error?.code === 400) {
          //alert("dknkdf")
          Alert.alert('My Professor', json.error.message, [
            { text: 'OK', onPress: () => this.logout() },
          ]);
        } else {
          this.setState({
            spinner: false,
            leaderdata: [],
          });
        }
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
  onviewlogs() {
    var userId = this.state.userDetails.userInfo.userId;
    var universityId = this.state.userDetails.userOrg.universityId;
    var url =
      baseUrl +
      `/users/${userId}/leader-board/logs?universityId=${universityId}`;
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        jwt: this.state.token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        console.log('viewlogssssss', json);
        if (json.code === 201) {
          this.setState({
            mypointsdata: json.data,
            logsspinner: false,
          });
        } else {
          this.setState({
            logsdata: [],
            logsspinner: false,
          });
        }
      })
      .catch((error) => console.error(error));
  }

  onlogs() {
    this.setState(
      {
        ismypoints: true,
        logsspinner: true,
      },
      () => this.onviewlogs()
    );
  }

  onrulebook() {
    this.setState({
      isvisible: true,
    });
  }

  renderViewItem({ item, index }) {
    const isTablet = DeviceConstants.isTablet;
    var indexwidth = 30,
      headfont = 15,
      imglogo = 40;
    if (isTablet) {
      (indexwidth = 40), (headfont = 20), (imglogo = 50);
    }
    return (
      <View
        style={{ paddingVertical: 10, paddingHorizontal: 10, marginTop: 10 }}
      >
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View
            style={{
              flex: 0.1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                width: indexwidth,
                height: indexwidth,
                borderRadius: indexwidth / 2,
                backgroundColor: colors.Themecolor,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: 'white', fontSize: headfont }}>
                {item.rank}
              </Text>
            </View>
          </View>
          <View
            style={{
              flex: 0.15,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {item.profilePic && item.profilePic !== 'null' ? (
              <FastImage
                source={{ uri: item.profilePic }}
                style={{
                  width: imglogo,
                  height: imglogo,
                  borderRadius: imglogo / 2,
                }}
              />
            ) : (
              <FastImage
                source={require('../../assets/images/user.png')}
                style={{
                  width: imglogo,
                  height: imglogo,
                  borderRadius: imglogo / 2,
                }}
              />
            )}
          </View>
          <View
            style={{
              flex: 0.5,
              justifyContent: 'center',
              alignItems: 'flex-start',
              paddingLeft: 10,
            }}
          >
            {item.firstName ? (
              <Text style={{ color: colors.Themecolor, fontSize: headfont }}>
                {item.firstName} {item.lastName}
              </Text>
            ) : (
              <Text style={{ color: colors.Themecolor, fontSize: headfont }}>
                Test User
              </Text>
            )}
          </View>
          <View
            style={{
              flex: 0.25,
              justifyContent: 'center',
              alignItems: 'flex-end',
              paddingRight: 5,
            }}
          >
            <Text style={{ color: colors.Themecolor, fontSize: headfont }}>
              {item.points} {item.points > 1 ? 'Points' : 'Point'}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  render() {
    const isTablet = DeviceConstants.isTablet;
    var headfont = 20,
      backheight = 30,
      topflex = 0.08,
      subfont = 15,
      subtopflex = 0.33,
      imglogog = 60,
      rileiwdth = 70,
      drawerwidth = 100,
      topheight = 220;
    if (isTablet) {
      (headfont = 30),
        (backheight = 45),
        (topflex = 0.1),
        (subfont = 20),
        (imglogog = 70),
        (rileiwdth = 80),
        (drawerwidth = 700),
        (topheight = 300);
    }
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Drawer
          type="overlay"
          ref={(ref) => (this._drawer = ref)}
          tapToClose
          openDrawerOffset={drawerwidth}
          content={<SideMenu closeControlPanel={this.closeControlPanel} />}
        >
          <View style={{ flex: 1 }}>
            <View
              style={{
                flex: topflex,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: colors.Themecolor,
                justifyContent: 'space-between',
              }}
            >
              <TouchableOpacity onPress={this.onBack.bind(this)}>
                <Image
                  source={require('../../assets/images/left-arrow.png')}
                  style={{
                    width: backheight,
                    height: backheight,
                    tintColor: 'white',
                    marginLeft: 10,
                  }}
                />
              </TouchableOpacity>
              <Text style={{ color: 'white', fontSize: headfont }}>
                {'Leader Board'}
              </Text>
              <TouchableOpacity
                style={{ marginRight: 10 }}
                onPress={this.onrulebook.bind(this)}
              >
                <Image
                  source={require('../../assets/images/book.png')}
                  style={{
                    width: backheight,
                    height: backheight,
                    tintColor: 'lightgrey',
                  }}
                />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 0.84 }}>
              {this.state.spinner ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: headfont }}>Loading...</Text>
                </View>
              ) : this.state.leaderdata.length > 0 ? (
                <>
                  <View
                    style={{
                      height: topheight + 10,
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                    }}
                  >
                    <View style={{ flex: subtopflex }}>
                      <View
                        style={{
                          height: topheight,
                          margin: 5,
                          backgroundColor: 'lightgrey',
                          borderWidth: 1,
                          borderColor: 'lightgrey',
                          justifyContent: 'space-around',
                          alignItems: 'center',
                        }}
                      >
                        {this.state.currentUserRanking.profilePic &&
                        this.state.currentUserRanking.profilePic !== 'null' ? (
                          <FastImage
                            source={{
                              uri: this.state.currentUserRanking.profilePic,
                            }}
                            style={{
                              width: imglogog,
                              height: imglogog,
                              borderRadius: imglogog / 2,
                            }}
                          />
                        ) : (
                          <FastImage
                            source={require('../../assets/images/user.png')}
                            style={{
                              width: imglogog,
                              height: imglogog,
                              borderRadius: imglogog / 2,
                            }}
                          />
                        )}
                        {this.state.currentUserRanking.firstName ? (
                          <Text
                            style={{
                              color: colors.Themecolor,
                              fontWeight: '700',
                              paddingHorizontal: 10,
                              textAlign: 'center',
                              fontSize: subfont,
                            }}
                          >
                            {this.state.currentUserRanking.firstName}{' '}
                            {this.state.currentUserRanking.lastName}
                          </Text>
                        ) : (
                          <Text
                            style={{
                              color: colors.Themecolor,
                              fontWeight: '700',
                              fontSize: subfont,
                            }}
                          >
                            Test User
                          </Text>
                        )}
                        <Text
                          style={{
                            color: 'grey',
                            fontWeight: '700',
                            fontSize: subfont,
                          }}
                        >
                          {this.state.currentUserRanking.points}{' '}
                          {this.state.currentUserRanking.points > 1
                            ? 'Points'
                            : 'Point'}
                        </Text>

                        <View
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            backgroundColor: colors.Themecolor,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <Text
                            style={{
                              color: 'white',
                              fontWeight: '700',
                              fontSize: subfont,
                            }}
                          >
                            {this.state.currentUserRanking.rank}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={this.onlogs.bind(this)}
                          style={{
                            paddingHorizontal: 10,
                            paddingVertical: 5,
                            borderRadius: 10,
                            backgroundColor: colors.Themecolor,
                            justifyContent: 'center',
                          }}
                        >
                          <Text
                            style={{
                              color: 'white',
                              fontWeight: '700',
                              fontSize: subfont,
                            }}
                          >
                            View Logs
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    {this.state.studentTopRankings.length > 0
                      ? this.state.studentTopRankings.map((res, i) => {
                          return (
                            <View style={{ flex: 0.33 }} key={i}>
                              <View
                                style={{
                                  height: topheight,
                                  margin: 5,
                                  backgroundColor:
                                    i === 0 ? '#d88212' : '#a3ba6d',
                                  borderWidth: 1,
                                  borderColor: 'lightgrey',
                                  justifyContent: 'space-around',
                                  alignItems: 'center',
                                }}
                              >
                                {res.profilePic && res.profilePic !== 'null' ? (
                                  <FastImage
                                    source={{ uri: res.profilePic }}
                                    style={{
                                      width: imglogog,
                                      height: imglogog,
                                      borderRadius: imglogog / 2,
                                    }}
                                  />
                                ) : (
                                  <FastImage
                                    source={require('../../assets/images/user.png')}
                                    style={{
                                      width: imglogog,
                                      height: imglogog,
                                      borderRadius: imglogog / 2,
                                    }}
                                  />
                                )}
                                {res.firstName ? (
                                  <Text
                                    style={{
                                      color: colors.Themecolor,
                                      fontWeight: '700',
                                      paddingHorizontal: 10,
                                      textAlign: 'center',
                                      fontSize: subfont,
                                    }}
                                  >
                                    {res.firstName} {res.lastName}
                                  </Text>
                                ) : (
                                  <Text
                                    style={{
                                      color: colors.Themecolor,
                                      fontWeight: '700',
                                      fontSize: subfont,
                                    }}
                                  >
                                    Test User
                                  </Text>
                                )}
                                <Text
                                  style={{ color: 'white', fontSize: subfont }}
                                >
                                  {res.points}{' '}
                                  {res.points > 1 ? 'Points' : 'Point'}
                                </Text>

                                <View
                                  style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 20,
                                    backgroundColor: colors.Themecolor,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  }}
                                >
                                  <Text
                                    style={{
                                      color: 'white',
                                      fontWeight: '700',
                                      fontSize: subfont,
                                    }}
                                  >
                                    {res.rank}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    paddingHorizontal: 10,
                                    paddingVertical: 5,
                                    borderRadius: 10,
                                    backgroundColor: 'transparent',
                                    justifyContent: 'center',
                                  }}
                                >
                                  <Text
                                    style={{
                                      color: 'transparent',
                                      fontWeight: '700',
                                      fontSize: subfont,
                                    }}
                                  >
                                    View Logs
                                  </Text>
                                </View>
                              </View>
                            </View>
                          );
                        })
                      : null}
                  </View>

                  {this.state.leaderdata.length > 0 ? (
                    <FlatList
                      data={this.state.leaderdata}
                      renderItem={this.renderViewItem.bind(this)}
                    />
                  ) : (
                    <Text>No Data</Text>
                  )}
                </>
              ) : (
                <View
                  style={{
                    flex: 0.9,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: headfont }}>No Data</Text>
                </View>
              )}
            </View>
            <View
              style={{
                flex: 0.08,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: colors.Themecolor,
              }}
            >
              <Footer openControlPanel={this.openControlPanel} />
            </View>
          </View>

          <Modal isVisible={this.state.isvisible}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  width: windowWidth / 1.2,
                  height: windowHeight / 1.5,
                  backgroundColor: 'white',
                  marginVertical: 15,
                }}
              >
                <View
                  style={{
                    paddingVertical: 20,
                    backgroundColor: colors.Themecolor,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      textAlign: 'center',
                      color: 'white',
                      fontSize: headfont,
                    }}
                  >
                    Rule Book
                  </Text>
                  <TouchableOpacity
                    onPress={() => this.setState({ isvisible: false })}
                  >
                    <Image
                      source={require('../../assets/images/cancel.png')}
                      style={{
                        width: backheight,
                        height: backheight,
                        tintColor: 'white',
                      }}
                    />
                  </TouchableOpacity>
                </View>
                <View style={{ backgroundColor: 'white' }}>
                  {this.state.ruleebook && this.state.ruleebook.length > 0 ? (
                    <ScrollView>
                      {this.state.ruleebook.map((res, i) => (
                        <View
                          key={i}
                          style={{
                            padding: 20,
                            margin: 10,
                            flexDirection: 'row',
                          }}
                        >
                          <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View
                              style={{ flex: 0.7, justifyContent: 'center' }}
                            >
                              <Text
                                style={{
                                  color: colors.Themecolor,
                                  fontSize: subfont,
                                }}
                              >
                                {res.description}
                              </Text>
                            </View>
                            <View
                              style={{
                                flex: 0.3,
                                justifyContent: 'center',
                                alignItems: 'flex-end',
                              }}
                            >
                              <View
                                style={{
                                  backgroundColor: colors.Themecolor,
                                  width: rileiwdth,
                                  paddingVertical: 5,
                                  borderRadius: 10,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}
                              >
                                <Text
                                  style={{ color: 'white', fontSize: subfont }}
                                >
                                  {res.points} pts
                                </Text>
                              </View>
                            </View>
                          </View>
                        </View>
                      ))}
                    </ScrollView>
                  ) : (
                    <View
                      style={{ justifyContent: 'center', alignItems: 'center' }}
                    >
                      <Text style={{ fontSize: subfont }}>No data</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </Modal>

          <Modal isVisible={this.state.ismypoints}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  width: windowWidth / 1.2,
                  height: windowHeight / 1.5,
                  backgroundColor: 'white',
                  marginVertical: 15,
                }}
              >
                <View
                  style={{
                    paddingVertical: 20,
                    backgroundColor: colors.Themecolor,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      textAlign: 'center',
                      color: 'white',
                      fontSize: headfont,
                    }}
                  >
                    My Points
                  </Text>
                  <TouchableOpacity
                    onPress={() => this.setState({ ismypoints: false })}
                  >
                    <Image
                      source={require('../../assets/images/cancel.png')}
                      style={{
                        width: backheight,
                        height: backheight,
                        tintColor: 'white',
                      }}
                    />
                  </TouchableOpacity>
                </View>
                <View style={{ backgroundColor: 'white' }}>
                  {this.state.logsspinner ? (
                    <View
                      style={{ justifyContent: 'center', alignItems: 'center' }}
                    >
                      <Text style={{ fontSize: subfont }}>Loading...</Text>
                    </View>
                  ) : this.state.mypointsdata.leaderBoardLogs &&
                    this.state.mypointsdata.leaderBoardLogs.length > 0 ? (
                    <ScrollView>
                      <View
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                          marginTop: 10,
                          justifyContent: 'center',
                          alignSelf: 'flex-end',
                          marginRight: 10,
                          alignItems: 'center',
                        }}
                      >
                        <Text
                          style={{
                            fontSize: subfont,
                            color: colors.Themecolor,
                            fontWeight: '600',
                          }}
                        >
                          Total Ponts:{' '}
                        </Text>
                        <View
                          style={{
                            paddingHorizontal: 10,
                            paddingVertical: 5,
                            borderWidth: 1,
                            backgroundColor: colors.Themecolor,
                            borderRadius: 10,
                            borderColor: colors.Themecolor,
                          }}
                        >
                          <Text style={{ color: 'white', fontSize: subfont }}>
                            {
                              this.state.mypointsdata.totalLeaderBoardPoints
                                .totalLeaderBoardPoints
                            }
                          </Text>
                        </View>
                      </View>

                      {this.state.mypointsdata.leaderBoardLogs.map((res, i) => (
                        <View
                          key={i}
                          style={{
                            padding: 20,
                            margin: 10,
                            flexDirection: 'row',
                          }}
                        >
                          <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View
                              style={{ flex: 0.7, justifyContent: 'center' }}
                            >
                              <Text
                                style={{
                                  color: colors.Themecolor,
                                  fontSize: subfont,
                                }}
                              >
                                {res.description}
                              </Text>
                            </View>
                            <View
                              style={{
                                flex: 0.3,
                                justifyContent: 'center',
                                alignItems: 'flex-end',
                              }}
                            >
                              <View
                                style={{
                                  backgroundColor: colors.Themecolor,
                                  width: rileiwdth,
                                  paddingVertical: 5,
                                  borderRadius: 10,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}
                              >
                                <Text
                                  style={{ color: 'white', fontSize: subfont }}
                                >
                                  {res.points} pts
                                </Text>
                              </View>
                            </View>
                          </View>
                        </View>
                      ))}
                    </ScrollView>
                  ) : (
                    <View
                      style={{ justifyContent: 'center', alignItems: 'center' }}
                    >
                      <Text style={{ fontSize: subfont }}>No data</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </Modal>
        </Drawer>
      </SafeAreaView>
    );
  }
}
export default LeaderBoard;
