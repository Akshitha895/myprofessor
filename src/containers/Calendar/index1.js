import React, { Component } from 'react';
import {
  Alert,
  BackHandler,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import DeviceConstants from 'react-native-device-constants';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Actions } from 'react-native-router-flux';

import moment from 'moment';
import { CalendarList } from 'react-native-calendars';
import Drawer from 'react-native-drawer';
import Modal from 'react-native-modal';
import Footer from '../../components/Footer';
import SideMenu from '../../components/SideMenu';
import { baseUrl, colors } from '../../constants';
import styles from './styles';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
// let { width } = Dimensions.get('window');
// const events = [
//   {
//     start: '2021-05-10 09:30:00',
//     end: '2021-05-10 10:30:00',
//     title: 'Physics Live Class',
//     summary: '3412 Piedmont Rd NE, GA 3032',
//   },
//   {
//     start: '2021-05-10 11:30:00',
//     end: '2021-05-10 12:30:00',
//     title: 'Maths Live Class',
//     summary: '3412 Piedmont Rd NE, GA 3032',
//   },
// ];

class CalendarNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      basicview: true,
      token: '',
      userDetails: '',
      spinner: false,
      showmodal: false,
      eventtapped: null,
      evemnsdata: [],
      newmodal: false,
      neweventsdata: [],
      markeddata: [],
      visiblemonths: [],
    };
  }
  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction
    );
    this.getData();
  }
  getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@user');
      //  alert(JSON.stringify(value))
      if (value !== null) {
        var data = JSON.parse(value);

        const token = await AsyncStorage.getItem('@access_token');
        console.log('leaderdataaa', token);
        if (token) {
          this.setState(
            {
              token: JSON.parse(token),
              userDetails: data,
            },
            () => {
              // this.getevents()
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
  unique = (value, index, self) => {
    return self.indexOf(value) === index;
  };
  getmonts(months) {
    console.log('dkcnkldjkd', months);
    this.setState({ visiblemonths: months, spinner: false }, () =>
      this.getevents()
    );
  }
  getevents() {
    var startdate = moment(new Date(this.state.visiblemonths[0].dateString)); // Now
    var enddate = moment(
      new Date(
        this.state.visiblemonths[this.state.visiblemonths.length - 1].dateString
      )
    ); // Now
    console.log('cnkladckdajcvdc', startdate, enddate);
    //var enddate =
    var data = {
      userId: this.state.userDetails.userInfo?.userId,
      fromDate: moment(startdate)
        .startOf('month')
        .format('YYYY-MM-DD HH:mm:ss'),
      toDate: moment(enddate).endOf('month').format('YYYY-MM-DD HH:mm:ss'),
    };

    var url = baseUrl + `/user-schedules/filtered`;
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        jwt: this.state.token,
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log('dsknaskfks', json);
        if (json.code === 201) {
          if (json.data) {
            var newarray = [];
            json.data.map((res, i) => {
              console.log('dlfl;dfd', res);
              newarray.push(moment.utc(res.scheduleDate).format('YYYY-MM-DD'));
            });
            console.log('eventsdata', newarray);
            const uniqueAges = newarray.filter(this.unique);

            var newmarkedarray = [];
            var newitemsarray = [];
            var newobj = {};
            var newmarkedobjarr = {};
            uniqueAges.map((res, i) => {
              var subobjarr = [];
              json.data.map((newres, i) => {
                if (
                  res === moment.utc(newres.scheduleDate).format('YYYY-MM-DD')
                ) {
                  subobjarr.push(newres);
                }
              });
              newobj[res] = subobjarr;
            });
            uniqueAges.map((res, i) => {
              var newmarkedobj = {};
              json.data.map((newres, i) => {
                if (
                  res === moment.utc(newres.scheduleDate).format('YYYY-MM-DD')
                ) {
                  newmarkedobj = {
                    customStyles: {
                      container: {
                        backgroundColor: colors.Themecolor,
                      },
                      text: {
                        color: 'white',
                        fontWeight: 'bold',
                      },
                    },
                  };
                }
              });
              newmarkedobjarr[res] = newmarkedobj;
            });
            console.log('markeddata', newmarkedobjarr);
            this.setState({
              // spinner: false,
              evemnsdata: newobj,
              markeddata: newmarkedobjarr,
              // currentstudent: newObj
            });
          } else {
            this.setState({
              spinner: false,
              evemnsdata: [],
            });
          }
        } else if (json.error?.code === 400) {
          //alert("dknkdf")
          Alert.alert('My Professor', json.error.message, [
            { text: 'OK', onPress: () => this.logout() },
          ]);
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
  backAction = () => {
    Actions.dashboard({ type: 'reset' });
    return true;
  };
  onBack() {
    Actions.dashboard({ type: 'reset' });
  }
  closeControlPanel = () => {
    this._drawer.close();
  };
  openControlPanel = () => {
    this._drawer.open();
  };

  _eventTapped(event) {
    this.setState({ eventtapped: event }, () => {
      console.log('mnmewmewe');
      this.setState({ showmodal: true });
    });
    console.log('JSON.stringify(event)', JSON.stringify(event));
  }
  onMainTopic(item) {
    var additionalitem = JSON.parse(item.additionalInfo);
    console.log('additionalitemadditionalitem', additionalitem);
    console.log('this.state', this.state.userDetails);
    var userdata = this.state.userDetails;
    var subjectId = additionalitem.subjectId;
    var chapterId = additionalitem.chapterId;
    //  var chapterId = item.chapterId
    var topicId = item.scheduleTypeId;
    var url =
      baseUrl +
      `/universities/${userdata.userOrg.universityId}/branches/${userdata.userOrg.branchId}/semesters/${userdata.userOrg.semesterId}/subjects/${subjectId}/chapters/${chapterId}/topics/${topicId}`;
    console.log('dckkd', url);
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        jwt: this.state.token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        if (json) {
          console.log('Dvnkdsvkl;sd', json);
          if (json.data) {
            additionalitem['image'] = json.data.image;
          }
        }
      })
      .catch((error) => console.error(error));

    additionalitem['topicId'] = item.scheduleTypeId;
    // additionalitem['title'] = item.title
    console.log('asdfsDFASDasd', additionalitem);
    Actions.push('topicmainview', {
      from: 'calander',
      data: additionalitem,
    });

    //
  }
  ongo(item) {
    this.setState({ eventtapped: item }, () => {
      this.setState({ newmodal: false }, () => {
        this.onMainTopic(this.state.eventtapped);
      });
    });
  }
  basicview() {
    this.setState({
      basicview: true,
    });
  }

  renderItem({ item }) {
    return (
      <View style={{ padding: 20, backgroundColor: 'red', margin: 10 }}>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{ flex: 0.2, justifyContent: 'center' }}>
            <View
              style={{
                height: 50,
                width: 50,
                borderRadius: 20,
                backgroundColor: 'lightpink',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text>{'SUN'}</Text>
              <Text>11</Text>
            </View>
          </View>
          <View style={{ flex: 0.8, justifyContent: 'center' }}>
            <Text>{item.title}</Text>
            <Text>{item.summary}</Text>
          </View>
        </View>
      </View>
    );
  }
  renderdataItem(item) {
    console.log('newiteeme', item);
    return (
      <TouchableOpacity
        testID={'item'}
        style={{
          backgroundColor: 'white',
          flex: 1,
          borderRadius: 5,
          padding: 10,
          marginRight: 10,
          justifyContent: 'space-around',
          marginTop: 17,
        }}
        onPress={this._eventTapped.bind(this, item)}
      >
        <Text style={{ color: colors.Themecolor }}>{item.title}</Text>
        <Text style={{ color: colors.Themecolor }}>
          {moment.utc(item.start).format('LT')} -{' '}
          {moment.utc(item.end).format('LT')}
        </Text>
      </TouchableOpacity>
    );
  }
  closenewmodal() {
    this.setState({ newmodal: false });
  }

  renderEmptyDate() {
    console.log('dknkldnfdf');
    return (
      <View style={styles.emptyDate}>
        <Text>No events in this date</Text>
      </View>
    );
  }

  rowHasChanged(r1, r2) {
    return r1.name !== r2.name;
  }
  onDayPress(day) {
    //data => moment(data.scheduleDate).format('YYYY-MM-DD') === day.dateStringconst result
    var result = [];
    console.log('dattaaa', day, this.state.evemnsdata);
    if (Object.keys(this.state.evemnsdata).length > 0) {
      const keys = Object.keys(this.state.evemnsdata);
      keys.forEach((key, index) => {
        if (key === day.dateString) {
          console.log(`bello    ${key}: ${this.state.evemnsdata[key]}`);
          result = this.state.evemnsdata[key];
        }
      });
      console.log('result', result);
      //  if(result.length > 0){
      this.setState({ neweventsdata: result }, () => {
        this.setState({ newmodal: true });
      });
      //  }
    } else {
      console.log('Sknsackldaj');
      this.setState({ neweventsdata: [] }, () => {
        this.setState({ newmodal: true });
      });
    }
  }
  modalclose() {
    this.setState({ newmodal: false });
  }
  renderfootor() {
    return (
      <TouchableOpacity
        onPress={this.modalclose.bind(this)}
        style={{
          backgroundColor: colors.Themecolor,
          padding: 10,
          justifyContent: 'center',
          width: 200,
          alignSelf: 'center',
        }}
      >
        <Text
          style={{
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'center',
            fontSize: 20,
          }}
        >
          CANCEL
        </Text>
      </TouchableOpacity>
    );
  }
  newrenderitem({ item }) {
    // var newdate = moment.utc(item.scheduleDate).format('LT')
    var newdate = new Date(item.scheduleDate).setTime(
      new Date(item.scheduleDate).getTime() + 1 * 60 * 60 * 1000
    );
    var enddate = moment.utc(newdate).format('LT');

    console.log('dcfsdfsd', item);
    var additionalinfo = JSON.parse(item.additionalInfo);
    return (
      <View style={{ height: 90, marginBottom: 20 }}>
        <View
          style={{ flex: 1, flexDirection: 'row', backgroundColor: 'white' }}
        >
          <View
            style={{
              flex: 0.25,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: colors.Themecolor, fontSize: 15 }}>
              {moment.utc(new Date(item.scheduleDate)).format('MM/DD')}
            </Text>
            <Text style={{ color: colors.Themecolor, fontSize: 15 }}>
              {moment.utc(new Date(item.scheduleDate)).format('ddd')}
            </Text>
          </View>
          <View
            style={{
              flex: 0.55,
              justifyContent: 'space-evenly',
              alignItems: 'flex-start',
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: colors.Themecolor,
              }}
            >
              {additionalinfo.title}
            </Text>
            <Text style={{ fontSize: 15, color: colors.Themecolor }}>
              {moment.utc(item.scheduleDate).format('LT')}-{enddate}
            </Text>
          </View>
          <View
            style={{
              flex: 0.2,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <TouchableOpacity
              onPress={this.ongo.bind(this, item)}
              style={{ backgroundColor: colors.Themecolor, padding: 20 }}
            >
              <Text style={{ fontWeight: 'bold', color: 'white' }}>GO</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  render() {
    const isTablet = DeviceConstants.isTablet; // false
    var titlesize = 20,
      backwidth = 21,
      backheight = 15,
      textfont = 16,
      textfontday = 13,
      drawerwidth = 100,
      crossheight = 30,
      crossview = 70;
    if (isTablet) {
      var titlesize = 28,
        backwidth = 29,
        backheight = 20,
        textfont = 25,
        textfontday = 15,
        drawerwidth = 700,
        crossheight = 40,
        crossview = 70;
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
          <View style={styles.mainView}>
            <View style={styles.topView}>
              <View style={styles.topShadow}>
                <View style={styles.topsubview}>
                  <View style={styles.topleftview}>
                    <TouchableOpacity onPress={this.onBack.bind(this)}>
                      <Image
                        source={require('../../assets/images/refer/back.png')}
                        style={{
                          width: backwidth,
                          height: backheight,
                          marginLeft: 20,
                          tintColor: colors.Themecolor,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.topmiddleview}>
                    <Text style={[styles.topHead, { fontSize: titlesize }]}>
                      Calendar
                    </Text>
                  </View>
                  <View style={styles.toprightview} />
                </View>
              </View>
            </View>

            <View style={{ flex: 0.92 }}>
              <View style={{ flex: 1 }}>
                <View style={{ flex: 0.92 }}>
                  {this.state.spinner ? (
                    <Text>Loading.</Text>
                  ) : (
                    <CalendarList
                      // theme={{
                      //     textDayFontSize:textfont,
                      //     textMonthFontSize:textfont,
                      //     textDayHeaderFontSize:textfontday,
                      //     //width:windowWidth
                      // }}
                      onVisibleMonthsChange={(months) => {
                        this.getmonts(months);
                      }}
                      pastScrollRange={50}
                      futureScrollRange={50}
                      scrollEnabled
                      showScrollIndicator
                      current={new Date()}
                      onDayPress={this.onDayPress.bind(this)}
                      renderItem={this.renderdataItem.bind(this)}
                      renderEmptyData={this.renderEmptyDate.bind(this)}
                      rowHasChanged={this.rowHasChanged.bind(this)}
                      showClosingKnob
                      markingType={'custom'}
                      markedDates={this.state.markeddata}
                    />
                  )}
                </View>
                <View style={{ flex: 0.08 }}>
                  <Footer
                    openControlPanel={this.openControlPanel}
                    value="calendar"
                  />
                </View>
              </View>
            </View>
          </View>
          <TouchableWithoutFeedback
            onPress={() => this.setState({ showmodal: false })}
          >
            <Modal isVisible={this.state.showmodal} hasBackdrop={false}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'red',
                }}
              >
                <View
                  style={{
                    width: windowWidth / 1.2,
                    backgroundColor: 'white',
                    marginVertical: 15,
                  }}
                >
                  <View style={{ backgroundColor: 'white' }}>
                    <TouchableOpacity
                      onPress={() => this.setState({ showmodal: false })}
                    >
                      <Image
                        source={require('../../assets/images/cancel.png')}
                        style={{
                          width: crossheight,
                          height: crossheight,
                          tintColor: colors.Themecolor,
                          alignSelf: 'flex-end',
                          marginVertical: 10,
                          marginRight: 10,
                        }}
                      />
                    </TouchableOpacity>
                    {this.state.eventtapped !== null ? (
                      <View style={{ padding: 20 }}>
                        <View
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                            {this.state.eventtapped.title}
                          </Text>
                        </View>
                        <View
                          style={{
                            paddingVertical: 20,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <Text style={{ fontSize: 15 }}>
                            Event Start:{' '}
                            {moment
                              .utc(this.state.eventtapped.start)
                              .format('llll')}{' '}
                          </Text>
                          <Text style={{ fontSize: 15, marginTop: 10 }}>
                            Event End:{' '}
                            {moment
                              .utc(this.state.eventtapped.end)
                              .format('llll')}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={this.ongo.bind(this)}
                          style={{
                            height: 50,
                            width: 100,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: colors.Themecolor,
                            alignSelf: 'center',
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 18,
                              color: 'white',
                              fontWeight: 'bold',
                            }}
                          >
                            sdsad
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <Text>NoData</Text>
                    )}
                  </View>
                </View>
              </View>
            </Modal>
          </TouchableWithoutFeedback>

          <Modal
            testID={'modal'}
            isVisible={this.state.newmodal}
            // onSwipeComplete={this.closenewmodal.bind(this)}
          >
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <View
                style={{
                  height: windowHeight / 1.2,
                  backgroundColor: 'lightgrey',
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    marginVertical: 20,
                    fontWeight: 'bold',
                    color: colors.Themecolor,
                    textAlign: 'center',
                  }}
                >
                  Scheduled Topics
                </Text>

                {this.state.neweventsdata.length > 0 ? (
                  <>
                    <FlatList
                      style={{ marginBottom: 30 }}
                      keyExtractor={(item) => item.additionalInfo.scheduleId}
                      ListFooterComponent={this.renderfootor.bind(this)}
                      data={this.state.neweventsdata}
                      renderItem={this.newrenderitem.bind(this)}
                    />
                  </>
                ) : (
                  <>
                    <View style={{ alignItems: 'center' }}>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          color: colors.Themecolor,
                          fontSize: 18,
                        }}
                      >
                        No Events
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={this.modalclose.bind(this)}
                      style={{
                        backgroundColor: colors.Themecolor,
                        padding: 10,
                        justifyContent: 'center',
                        width: 200,
                        alignSelf: 'center',
                        marginTop: 30,
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: 'bold',
                          color: 'white',
                          textAlign: 'center',
                          fontSize: 20,
                        }}
                      >
                        CANCEL
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          </Modal>
        </Drawer>
      </SafeAreaView>
    );
  }
}
export default CalendarNew;
