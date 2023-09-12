import { _ } from 'lodash';
import React, { Component } from 'react';
import {
  Alert,
  BackHandler,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import DeviceConstants from 'react-native-device-constants';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Drawer from 'react-native-drawer';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import { Actions } from 'react-native-router-flux';
import Footer from '../../components/Footer';
import { baseUrl, colors } from '../../constants';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

import SideMenu from '../../components/SideMenu';
import styles from './styles';

class PracticeChapter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
      isvisible: false,
      isvisiblenew: false,
      newmodal: false,
      token: '',
      chaptersData: null,
      subject: {},
      chaptersDataNew: [],
      spinner: true,
      newchapters: [],
      selectedItem: {},
      setCompletionLevelTest: 1,
      validpackages: {},
      userDetails: {},
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
    Actions.practice();
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
            userDetails: data,
            token: JSON.parse(token),
          });
          this.getPreviousTest(data, JSON.parse(token));
          this.validatepackages(data, JSON.parse(token));
        } else {
        }
      } else {
        console.log('errorr');
      }
    } catch (e) {
      return null;
    }
  };
  validatepackages(data) {
    //package/validate/${email}

    var userId = data.userInfo.userId;
    //console.log("userIduserIduserIduserIduserId",this.state.token)
    var url = baseUrl + `/users/${userId}/subscription-status`;
    console.log('kvkdjfkdf', url);
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        jwt: this.state.token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        console.log('sadsd', json);
        if (json.data) {
          console.log('validpackages', json.data);
          var data = {
            subscriptionStatus: 'active',
          };
          this.setState({ validpackages: json.data });
        } else {
          console.log(JSON.stringify(json.message));
        }
      })
      .catch((error) => console.error(error));
  }
  getPreviousTest(user, token) {
    var userId = user.userInfo.userId;
    console.log('daflkadjfkldaf', user);
    var data = this.props.data;
    console.log('.....adadcdfc', data);

    var url =
      baseUrl +
      `/universities/${user.userOrg.universityId}/subjects/${data.subjectId}/practice-tests?userId=${userId}`;
    console.log('newvalue', url);
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        jwt: token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        console.log('skjbdksjbdkjsbcjksdb', json);
        const previousTestsData = json.data;
        if (previousTestsData) {
          if (
            previousTestsData &&
            previousTestsData?.userPracticeTest?.length
          ) {
            let testChapters = [];
            let uniqueTestChapters = _.uniqBy(
              previousTestsData?.userPracticeTest,
              'chapterId'
            );
            let previousTestChapters = _.sortBy(
              uniqueTestChapters,
              'chapterIndex'
            );
            for (l = 1; l < previousTestChapters.length; l++) {
              previousTestChapters[l]['attempts'] = 0;
            }
            //	console.log("Dkncakdcnkd",previousTestChapters,)
            //console.log("this.state.newchapters?.attempts",previousTestsData?.attempts)

            //console.log("sDasaSAaSaaSasa",previousTestChapters[i].chapterId,"       ",previousTestsData?.attempts)

            for (j = 0; j < previousTestsData.attempts.length; j++) {
              for (i = 0; i < previousTestChapters.length; i++) {
                if (
                  previousTestChapters[i].chapterId ===
                  previousTestsData?.attempts[j].chapterId
                ) {
                  console.log('dnjasdnjksdnc');
                  previousTestChapters[i]['attempts'] = 1;
                } else {
                  //previousTestChapters[i]["attempts"] = 0
                }
              }
            }
            console.log(
              'previousTestChapterspreviousTestChapters',
              previousTestChapters
            );

            previousTestChapters.map((up) => {
              testChapters.push({
                ...up,
                name: up.chapterName,
                index: up.chapterIndex,
              });
            });
            var newdtaanewdtaa = this.props.data;
            console.log('sdxascascacda', testChapters);
            //testChapters.push()
            let listChapters = [
              { name: 'Start', index: -1000 },
              ...testChapters,
            ];
            listChapters = _.sortBy(listChapters, 'index');
            console.log('sksmaksf', listChapters);
            this.setState({
              spinner: false,
              newchapters: previousTestsData,
              chaptersDataNew: listChapters,
            });
          } else {
            this.setState({
              spinner: false,
              newchapters: [],
            });
          }
        } else {
          if (json.error) {
            alert(json.error.message);
          }
          this.setState({
            spinner: false,
            newchapters: [],
          });
        }
      })
      .catch((error) => console.error(error));
  }

  onItem(item, index, type, newindex) {
    //	alert("m,c"+JSON.stringify(this.state.userDetails?.role?.roleName))
    if (index === 1) {
      if (item.testType === 'subject' || item.testType === 'Subject') {
        if (newindex > 0) {
          if (
            this.state.newchapters?.attempts
              ?.map((pta) => pta.chapterId)
              .includes(item.chapterId)
          ) {
            this.setState(
              {
                selectedItem: item,
              },
              () => {
                this.setState({
                  newmodal: true,
                });
              }
            );
          } else {
            Actions.push('practiceassesment', {
              data: item,
              subjectData: this.state.data,
              type: 'Subject',
              attempttime: 1,
            });
          }
        } else {
          alert('Please complete before chapter first');
        }
        //Actions.push('practiceassesment', { data: item, subjectData: this.state.data, type: "Subject", attempttime: 1 })
      } else {
        //alert(newindex)
        if (newindex > 0) {
          if (item.testType === 'chapter' || item.testType === 'Chapter') {
            console.log('itemmm,item', item.name, this.state.newchapters);
            //if (index === 1) {
            //	alert(this.state.chaptersDataNew[index].tests.length)
            if (
              this.state.newchapters?.attempts
                ?.map((pta) => pta.chapterId)
                .includes(item.chapterId)
            ) {
              this.setState(
                {
                  selectedItem: item,
                },
                () => {
                  this.setState({
                    newmodal: true,
                  });
                }
              );
            } else {
              Actions.push('practiceassesment', {
                data: item,
                subjectData: this.state.data,
                type: 'Chapter',
                attempttime: 1,
              });
            }
          } else {
            Actions.push('practiceassesment', {
              data: item,
              subjectData: this.state.data,
              type: 'Chapter',
              attempttime: 1,
            });
          }
        } else {
          alert('Please complete before chapter first');
        }
      }
    } else {
      if (this.state.userDetails?.role?.roleName !== 'General Student') {
        if (item.testType === 'subject' || item.testType === 'Subject') {
          if (newindex > 0) {
            if (
              this.state.newchapters?.attempts
                ?.map((pta) => pta.chapterId)
                .includes(item.chapterId)
            ) {
              this.setState(
                {
                  selectedItem: item,
                },
                () => {
                  this.setState({
                    newmodal: true,
                  });
                }
              );
            } else {
              Actions.push('practiceassesment', {
                data: item,
                subjectData: this.state.data,
                type: 'Subject',
                attempttime: 1,
              });
            }
          } else {
            alert('Please complete before chapter first');
          }
          //Actions.push('practiceassesment', { data: item, subjectData: this.state.data, type: "Subject", attempttime: 1 })
        } else {
          //alert(newindex)
          if (newindex > 0) {
            if (item.testType === 'chapter' || item.testType === 'Chapter') {
              console.log('itemmm,item', item.name, this.state.newchapters);
              //if (index === 1) {
              //	alert(this.state.chaptersDataNew[index].tests.length)
              if (
                this.state.newchapters?.attempts
                  ?.map((pta) => pta.chapterId)
                  .includes(item.chapterId)
              ) {
                this.setState(
                  {
                    selectedItem: item,
                  },
                  () => {
                    this.setState({
                      newmodal: true,
                    });
                  }
                );
              } else {
                Actions.push('practiceassesment', {
                  data: item,
                  subjectData: this.state.data,
                  type: 'Chapter',
                  attempttime: 1,
                });
              }
            } else {
              Actions.push('practiceassesment', {
                data: item,
                subjectData: this.state.data,
                type: 'Chapter',
                attempttime: 1,
              });
            }
          } else {
            alert('Please complete before chapter first');
          }
        }
      } else {
        if (
          this.state.validpackages &&
          this.state.validpackages.subscriptionStatus === 'active'
        ) {
          if (item.testType === 'subject' || item.testType === 'Subject') {
            if (newindex > 0) {
              if (
                this.state.newchapters?.attempts
                  ?.map((pta) => pta.chapterId)
                  .includes(item.chapterId)
              ) {
                this.setState(
                  {
                    selectedItem: item,
                  },
                  () => {
                    this.setState({
                      newmodal: true,
                    });
                  }
                );
              } else {
                Actions.push('practiceassesment', {
                  data: item,
                  subjectData: this.state.data,
                  type: 'Subject',
                  attempttime: 1,
                });
              }
            } else {
              alert('Please complete before chapter first');
            }
            //Actions.push('practiceassesment', { data: item, subjectData: this.state.data, type: "Subject", attempttime: 1 })
          } else {
            //alert(newindex)
            if (newindex > 0) {
              if (item.testType === 'chapter' || item.testType === 'Chapter') {
                console.log('itemmm,item', item.name, this.state.newchapters);
                //if (index === 1) {
                //	alert(this.state.chaptersDataNew[index].tests.length)
                if (
                  this.state.newchapters?.attempts
                    ?.map((pta) => pta.chapterId)
                    .includes(item.chapterId)
                ) {
                  this.setState(
                    {
                      selectedItem: item,
                    },
                    () => {
                      this.setState({
                        newmodal: true,
                      });
                    }
                  );
                } else {
                  Actions.push('practiceassesment', {
                    data: item,
                    subjectData: this.state.data,
                    type: 'Chapter',
                    attempttime: 1,
                  });
                }
              } else {
                Actions.push('practiceassesment', {
                  data: item,
                  subjectData: this.state.data,
                  type: 'Chapter',
                  attempttime: 1,
                });
              }
            } else {
              alert('Please complete before chapter first');
            }
          }
        } else {
          Alert.alert(
            'My Professor',
            'You are not subscribed to access this chapter, Do you want to subscribe?',
            [
              {
                text: 'No',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {
                text: 'Yes',
                onPress: () => {
                  Actions.push('buypackages', { from: 'heatmap' });
                },
              },
            ]
          );
        }
      }
    }
  }
  onNo() {
    this.setState({
      isvisiblenew: false,
    });
  }
  onYes() {
    this.setState(
      {
        isvisiblenew: false,
      },
      () => {
        Actions.push('buypackages');
      }
    );
  }
  onCancel() {
    this.setState({
      isvisible: false,
    });
  }
  onOk() {
    // this.setState({
    // 	isvisible:false,
    // 	newmodal:false,
    // },()=>Actions.push('practiceassesment',{data: this.state.selectedItem}))
  }
  onStarttext() {
    console.log('dmbvjndsd', this.state.data);
    this.setState(
      {
        isvisible: false,
        newmodal: false,
      },
      () =>
        Actions.push('practiceassesment', {
          data: this.state.selectedItem,
          subjectData: this.state.data,
          attempttime: 2,
        })
    );
  }
  onReview() {
    this.setState(
      {
        isvisible: false,
        newmodal: false,
      },
      () =>
        Actions.push('practicereview', {
          data: this.state.selectedItem,
          subjectData: this.state.data,
        })
    );
  }
  renderItem({ item, index }) {
    var newindex = 0;
    console.log(
      'lknlnknkl',
      this.state.chaptersDataNew[index],
      this.state.userDetails?.role?.roleName,
      this.state.validpackages.subscriptionStatus
    );

    var color;
    if (item.locked) {
      color = colors.Themecolor;
    } else {
      color = colors.Themecolor;
    }
    var chapterItem = item;
    const isTablet = DeviceConstants.isTablet;
    var newflex = 0.58,
      newreightflex = 0.45,
      newreightflex2 = 0.55,
      indexflex1 = 0.45,
      indexflex2 = 0.55,
      headfont = 15,
      imagesize = 50;
    if (isTablet) {
      (newflex = 0.525),
        (newreightflex = 0.55),
        (newreightflex2 = 0.59),
        (indexflex1 = 0.51),
        (indexflex2 = 0.55),
        (headfont = 20),
        (imagesize = 55);
    }
    return (
      <View style={{ transform: [{ scaleY: -1 }] }}>
        <View>
          {index !== 0 ? (
            index === 1 ? (
              <>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity
                    onPress={() => this.onItem(item, index, 'Chapter', index)}
                    style={{ flex: 1, flexDirection: 'row' }}
                  >
                    <View
                      style={{
                        flex: indexflex1,
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                        marginRight: 10,
                      }}
                    >
                      <Text numberOfLines={2} style={{ fontSize: headfont }}>
                        {chapterItem.name}
                      </Text>
                    </View>
                    <View style={{ flex: indexflex2 }}>
                      <View
                        style={{
                          width: imagesize,
                          height: imagesize,
                          backgroundColor: 'orange',
                          borderRadius: imagesize / 2,
                          borderColor: 'white',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Image
                          style={{
                            height: 20,
                            width: 20,
                            alignSelf: 'center',
                            tintColor: 'white',
                          }}
                          source={require('../../assets/images/practiceplay.png')}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    width: 2,
                    height: 80,
                    backgroundColor: 'orange',
                    alignSelf: 'center',
                    marginLeft: 5,
                  }}
                />
              </>
            ) : index % 2 === 0 ? (
              <>
                <View style={{}}>
                  <TouchableOpacity
                    onPress={() =>
                      this.onItem(
                        item,
                        index,
                        chapterItem.testType,
                        this.state.chaptersDataNew[index - 1]?.attempts
                      )
                    }
                    style={{ flex: 1, flexDirection: 'row' }}
                  >
                    <View style={{ flex: newflex, alignItems: 'flex-end' }}>
                      <View
                        style={{
                          width: imagesize,
                          height: imagesize,
                          backgroundColor: 'orange',
                          borderRadius: imagesize / 2,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        {this.state.chaptersDataNew[index - 1]?.attempts > 0 ? (
                          <Image
                            style={{
                              height: 20,
                              width: 20,
                              alignSelf: 'center',
                              tintColor: 'white',
                            }}
                            source={require('../../assets/images/practiceplay.png')}
                          />
                        ) : (
                          <Image
                            style={{
                              height: 20,
                              width: 20,
                              alignSelf: 'center',
                              tintColor: 'white',
                            }}
                            source={require('../../assets/images/practicelock.png')}
                          />
                        )}
                      </View>
                      {this.state.userDetails?.role?.roleName ===
                        'General Student' &&
                      this.state.validpackages.subscriptionStatus !==
                        'active' ? (
                        <View
                          style={{
                            position: 'absolute',
                            backgroundColor: 'orange',
                            width: imagesize,
                            height: imagesize,
                            borderRadius: imagesize / 2,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <Image
                            style={{
                              height: 20,
                              width: 20,
                              alignSelf: 'center',
                              tintColor: 'white',
                            }}
                            source={require('../../assets/images/practicelock.png')}
                          />
                        </View>
                      ) : null}
                    </View>
                    <View style={{ flex: 0.42, justifyContent: 'center' }}>
                      {chapterItem.testType === 'Subject' ? (
                        <Text
                          numberOfLines={2}
                          style={{ fontSize: headfont, marginLeft: 5 }}
                        >
                          {chapterItem.subjectName}
                        </Text>
                      ) : (
                        <Text
                          numberOfLines={2}
                          style={{ fontSize: headfont, marginLeft: 5 }}
                        >
                          {chapterItem.name}
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    width: 2,
                    height: 80,
                    backgroundColor: 'orange',
                    alignSelf: 'center',
                    marginLeft: 5,
                  }}
                />
              </>
            ) : (
              <>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity
                    onPress={() => {
                      this.onItem(
                        item,
                        index,
                        chapterItem.testType,
                        this.state.chaptersDataNew[index - 1]?.attempts
                      );
                    }}
                    style={{ flex: 1, flexDirection: 'row' }}
                  >
                    <View
                      style={{
                        flex: newreightflex,
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                        marginRight: 5,
                      }}
                    >
                      {chapterItem.testType === 'Subject' ? (
                        <Text
                          numberOfLines={2}
                          style={{ fontSize: headfont, marginLeft: 5 }}
                        >
                          {chapterItem.subjectName}
                        </Text>
                      ) : (
                        <Text
                          numberOfLines={2}
                          style={{ fontSize: headfont, marginLeft: 5 }}
                        >
                          {chapterItem.name}
                        </Text>
                      )}
                    </View>
                    <View style={{ flex: newreightflex2 }}>
                      <View
                        style={{
                          width: imagesize,
                          height: imagesize,
                          backgroundColor: 'orange',
                          borderRadius: imagesize / 2,
                          borderColor: 'white',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        {this.state.chaptersDataNew[index - 1]?.attempts > 0 ? (
                          <Image
                            style={{
                              height: 20,
                              width: 20,
                              alignSelf: 'center',
                              tintColor: 'white',
                            }}
                            source={require('../../assets/images/practiceplay.png')}
                          />
                        ) : (
                          <Image
                            style={{
                              height: 20,
                              width: 20,
                              alignSelf: 'center',
                              tintColor: 'white',
                            }}
                            source={require('../../assets/images/practicelock.png')}
                          />
                        )}
                      </View>
                      {this.state.userDetails?.role?.roleName ===
                        'General Student' &&
                      this.state.validpackages.subscriptionStatus !==
                        'active' ? (
                        <View
                          style={{
                            position: 'absolute',
                            backgroundColor: 'orange',
                            width: imagesize,
                            height: imagesize,
                            borderRadius: imagesize / 2,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <Image
                            style={{
                              height: 20,
                              width: 20,
                              alignSelf: 'center',
                              tintColor: 'white',
                            }}
                            source={require('../../assets/images/practicelock.png')}
                          />
                        </View>
                      ) : null}
                    </View>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    width: 2,
                    height: 80,
                    backgroundColor: 'orange',
                    alignSelf: 'center',
                    marginLeft: 5,
                  }}
                />
              </>
            )
          ) : (
            <Image
              style={{
                height: imagesize,
                width: imagesize,
                bottom: 10,
                alignSelf: 'center',
                marginLeft: 5,
              }}
              source={require('../../assets/images/img_start.png')}
            />
          )}
        </View>
      </View>
    );
  }
  onBack() {
    Actions.practice();
  }
  onBackdrop() {
    this.setState({
      newmodal: false,
    });
  }
  closeControlPanel = () => {
    this._drawer.close();
  };
  openControlPanel = () => {
    this._drawer.open();
  };
  render() {
    const isTablet = DeviceConstants.isTablet;
    var headfont = 15,
      imgheight = 20,
      backheight = 30,
      drawerwidth = 100,
      absheight = windowHeight / 1.25;
    if (isTablet) {
      (headfont = 25),
        (imgheight = 30),
        (backheight = 50),
        (drawerwidth = 700),
        (absheight = windowHeight / 1.3);
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
          <View style={styles.mainview}>
            <View style={styles.middleview}>
              <ImageBackground
                source={require('../../assets/images/dashboard/new/learningbg.png')}
                style={{ width: '100%', height: 288 }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 20,
                    marginLeft: 10,
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
                    style={{ color: 'white', marginLeft: 20, fontSize: 20 }}
                  >
                    {this.state.subject.name}
                  </Text>
                </View>
              </ImageBackground>
              <View
                style={{
                  height:
                    Platform.OS === 'android' ? absheight : windowHeight / 1.3,
                  width: windowWidth,
                  backgroundColor: 'white',
                  alignSelf: 'center',
                  position: 'absolute',
                  bottom: 0,
                  borderTopRightRadius: 30,
                  borderTopLeftRadius: 30,
                }}
              >
                {this.state.spinner ? (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text>Loading...</Text>
                  </View>
                ) : (
                  <View style={{ flex: 1, paddingTop: 20 }}>
                    <FlatList
                      data={this.state.chaptersDataNew}
                      style={{ transform: [{ scaleY: -1 }] }}
                      renderItem={this.renderItem.bind(this)}
                    />
                  </View>
                )}
              </View>
              {/* {this.state.spinner ? <View style={{flex:1,justifyContent:"center",alignItems:"center"}}><Text>Loading...</Text></View>:
			<View style={{flex:1,}}>
				<View style={{flex:0.2,flexDirection:"row",justifyContent:"space-between",}}>
							<View style={{marginTop: 20,marginLeft:20}}>
						<TouchableOpacity onPress={this.onBack.bind(this)}>
						<Image source={require('../../assets/images/left-arrow.png')} style={{width:30,height:30,tintColor:colors.Themecolor}}/>
						</TouchableOpacity>
						<Text style={{marginTop: 20,fontSize:15}}>{this.state.subject.name}</Text>
						</View>
						<Image source={require('../../assets/images/practiceabs.png')} style={{width:339/2,height:242/2}}/>
				 </View>
				<View style={{flex:0.8,paddingVertical:10}}>
					
				<FlatList data={this.state.chaptersDataNew}
			  style={{ transform: [{ scaleY: -1 }] }}
					renderItem={this.renderItem.bind(this)}
					 />
				</View>
			</View>} */}
            </View>
            <View style={styles.footerview}>
              <Footer openControlPanel={this.openControlPanel} />
            </View>
            <TouchableWithoutFeedback
              onPress={() => this.setState({ isvisible: false })}
            >
              <Modal isVisible={this.state.isvisible}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onBackdropPress={() => this.setState({ isvisible: false })}
                >
                  <View
                    style={{
                      padding: 10,
                      backgroundColor: 'white',
                      borderRadius: 15,
                      marginVertical: 15,
                    }}
                  >
                    <Text
                      style={{
                        color: 'black',
                        fontSize: 20,
                        textAlign: 'center',
                        marginTop: 10,
                      }}
                    >
                      Your are about to begin your Practice Test
                    </Text>
                    <Text
                      style={{
                        fontSize: 15,
                        marginHorizontal: 30,
                        textAlign: 'center',
                        marginTop: 10,
                      }}
                    >
                      Once you begin you have 20 minutes to finish the test
                    </Text>
                    <Text
                      style={{
                        fontSize: 20,
                        textAlign: 'center',
                        marginTop: 10,
                      }}
                    >
                      Are you ready to begin?
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        marginTop: 20,
                      }}
                    >
                      <TouchableOpacity onPress={this.onOk.bind(this)}>
                        <LinearGradient
                          colors={['#239816', '#32e625']}
                          style={{
                            paddingHorizontal: 30,
                            paddingVertical: 10,
                            borderRadius: 20,
                          }}
                        >
                          <Text style={{ color: 'white' }}>OK</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={this.onCancel.bind(this)}>
                        <LinearGradient
                          colors={['#f14d65', '#fc8798']}
                          style={{
                            paddingHorizontal: 30,
                            paddingVertical: 10,
                            borderRadius: 20,
                          }}
                        >
                          <Text style={{ color: 'white' }}>CANCEL</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => this.setState({ newmodal: false })}
            >
              <Modal
                isVisible={this.state.newmodal}
                style={{ justifyContent: 'center', margin: 0 }}
                onBackdropPress={() => this.setState({ newmodal: false })}
              >
                <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                  <View
                    style={{
                      padding: 20,
                      backgroundColor: 'white',
                      borderTopLeftRadius: 15,
                      borderTopRightRadius: 15,
                    }}
                  >
                    <Text style={{ marginLeft: 10, fontSize: 20 }}>
                      Go With..
                    </Text>
                    <TouchableOpacity
                      onPress={this.onReview.bind(this)}
                      style={{
                        flexDirection: 'row',
                        marginLeft: 20,
                        marginTop: 10,
                      }}
                    >
                      <Image
                        source={require('../../assets/images/icon_1.png')}
                        style={{ width: imgheight, height: imgheight }}
                      />
                      <Text style={{ marginLeft: 15, fontSize: headfont }}>
                        Review Previous Test
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={this.onStarttext.bind(this)}
                      style={{
                        flexDirection: 'row',
                        marginLeft: 20,
                        marginTop: 10,
                      }}
                    >
                      <Image
                        source={require('../../assets/images/icon_2.png')}
                        style={{ width: imgheight, height: imgheight }}
                      />
                      <Text style={{ marginLeft: 15, fontSize: headfont }}>
                        Start New Test
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => this.setState({ isvisiblenew: false })}
            >
              <Modal
                isVisible={this.state.isvisiblenew}
                onBackdropPress={() => this.setState({ isvisiblenew: false })}
              >
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <View
                    style={{
                      padding: 10,
                      backgroundColor: 'white',
                      borderRadius: 15,
                      marginVertical: 15,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 15,
                        textAlign: 'center',
                        marginTop: 10,
                      }}
                    >
                      You are not subscribed to view this chapter
                    </Text>
                    <Text
                      style={{
                        fontSize: 18,
                        textAlign: 'center',
                        marginTop: 10,
                        fontWeight: '600',
                      }}
                    >
                      {' '}
                      Do you want to subscribe?{' '}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        marginTop: 20,
                      }}
                    >
                      <TouchableOpacity onPress={this.onNo.bind(this)}>
                        <LinearGradient
                          colors={['#f14d65', '#fc8798']}
                          style={{
                            paddingHorizontal: 30,
                            paddingVertical: 10,
                            borderRadius: 20,
                          }}
                        >
                          <Text style={{ color: 'white' }}>No</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={this.onYes.bind(this)}>
                        <LinearGradient
                          colors={['#239816', '#32e625']}
                          style={{
                            paddingHorizontal: 30,
                            paddingVertical: 10,
                            borderRadius: 20,
                          }}
                        >
                          <Text style={{ color: 'white' }}>YES</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
            </TouchableWithoutFeedback>
          </View>
        </Drawer>
      </SafeAreaView>
    );
  }
}
export default PracticeChapter;
