import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';

import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceConstants from 'react-native-device-constants';
import Drawer from 'react-native-drawer';
import LinearGradient from 'react-native-linear-gradient';
import { Actions } from 'react-native-router-flux';
import Footer from '../../components/Footer';
import NotifyComponent from '../../components/NotifyComponent';
import SideMenu from '../../components/SideMenu';
import { baseUrl, colors } from '../../constants';
import styles from './styles';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class Notifications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notifications: [],
      absloading: false,
      userdata: {},
      notification_count: 0,
      isvisible: false,
      unreadnotificationcount: 0,
      spinner: true,
      token: '',
      selectedItem: {},
    };
  }

  onBack() {
    Actions.dashboard({ type: 'reset' });
  }
  closeControlPanel = () => {
    this._drawer.close();
  };
  openControlPanel = () => {
    this._drawer.open();
  };
  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction
    );
    this.getData();
  }

  async getData() {
    try {
      const value = await AsyncStorage.getItem('@user');
      //  alert(JSON.stringify(value))
      if (value !== null) {
        var data = JSON.parse(value);
        // alert("subjectass", data)
        const token = await AsyncStorage.getItem('@access_token');
        if (token) {
          this.setState({
            token: JSON.parse(token),
            userdata: data,
          });
          this.getnotifications();
        } else {
        }
      } else {
        console.log('errorrr');
      }
    } catch (e) {
      return null;
    }
  }
  onclose() {
    this.setState(
      {
        isvisible: false,
      },
      () => this.getnotifications()
    );
  }
  getnotifications(user, token) {
    var url = baseUrl + `/notifications`;

    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        jwt: this.state.token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        console.log('notificationssss', json);
        if (json.code === 201) {
          if (json.data) {
            var newarray = [];
            json.data.items.map((res, i) => {
              if (res.isRead === 0) {
                newarray.push(res);
              }
            });
            //  alert(newarray.length)
            this.setState({
              spinner: false,
              absloading: false,
              notifications: json.data.items,
              notification_count: json.data.items.length,
              unreadnotificationcount: newarray.length,
            });
          }
        } else if (json.error?.code === 400) {
          //alert("dknkdf")
          Alert.alert('My Professor', json.error.message, [
            { text: 'OK', onPress: () => this.logout() },
          ]);
        } else {
          alert(JSON.stringify(json.error.message));
          this.setState({
            spinner: false,
            absloading: false,
            notifications: [],
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
  backAction = () => {
    Actions.dashboard({ type: 'reset' });
  };
  onItemPress(item) {
    this.setState(
      {
        selectedItem: item,
      },
      () => {
        // alert(JSON.stringify(item))
        if (item.isRead === 1) {
          this.setState({
            isvisible: true,
          });
        } else {
          console.log('sdnasbdfkjabjkakfaf', this.state.selectedItem);
          this.setState({
            isvisible: true,
          });
          var notificationId = item.id;
          var body = {
            notificationId: item.id,
            isRead: true,
          };
          fetch(baseUrl + `/notifications/${notificationId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              jwt: this.state.token,
            },
            body: JSON.stringify(body),
          })
            .then((response) => response.json())
            .then((json) => {
              console.log('isread....', json);
              this.setState({ absloading: true });
            })
            .catch((error) => console.error(error));
        }

        //  }
      }
    );
  }
  render() {
    const isTablet = DeviceConstants.isTablet;
    var headfont = 18,
      backheight = 16,
      backwidth = 21,
      drawerwidth = 100,
      subtext = 16,
      topflex = 0.08;
    if (isTablet) {
      (headfont = 30),
        (backheight = 20),
        (backwidth = 30),
        (drawerwidth = 700),
        (subtext = 20),
        (topflex = 0.1);
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
            <View
              style={{ flex: topflex, overflow: 'hidden', paddingBottom: 5 }}
            >
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
                      Notifications
                    </Text>
                  </View>
                  <View style={styles.toprightview}>
                    <Text
                      style={{
                        fontSize: subtext,
                        textAlign: 'center',
                        fontWeight: '800',
                        color: colors.Themecolor,
                      }}
                    >
                      {this.state.notification_count}
                    </Text>
                    <Text
                      style={{
                        fontSize: subtext,
                        textAlign: 'center',
                        marginLeft: 5,
                        color: colors.Themecolor,
                      }}
                    >
                      Inbox
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            {this.state.spinner ? (
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <ActivityIndicator />
              </View>
            ) : this.state.notifications.length === 0 ? (
              <View style={{ flex: 0.92 }}>
                <View style={{ flex: 1 }}>
                  <View style={{ flex: 0.92, justifyContent: 'center' }}>
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'center',
                      }}
                    >
                      <Image
                        source={require('../../assets/images/refer/notify.png')}
                        style={{
                          width: 120 / 1.3,
                          height: 93 / 1.3,
                          alignSelf: 'center',
                          tintColor: colors.Themecolor,
                        }}
                      />
                    </View>
                    <Text
                      style={{
                        fontSize: 24,
                        lineHeight: 28,
                        textAlign: 'center',
                        marginTop: 20,
                        color: colors.Themecolor,
                      }}
                    >
                      Can’t find notifications
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        lineHeight: 28,
                        textAlign: 'center',
                        marginTop: 20,
                        color: colors.Themecolor,
                      }}
                    >
                      Let’s explore more content around you.
                    </Text>
                    <TouchableOpacity
                      onPress={() => Actions.dashboard({ type: 'reset' })}
                    >
                      <LinearGradient
                        colors={['#e03744', '#E24B57', '#D8848B']}
                        style={styles.gradientstyles}
                      >
                        <Text style={styles.buttonText}>Back to Feed</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                  <View style={{ flex: 0.08 }}>
                    <Footer
                      openControlPanel={this.openControlPanel}
                      value="notifications"
                      notification_count={this.state.notification_count}
                      unreadnotificationcount={
                        this.state.unreadnotificationcount
                      }
                    />
                  </View>
                </View>
              </View>
            ) : (
              <View style={{ flex: 0.92 }}>
                <View style={{ flex: 1 }}>
                  <View style={{ flex: 0.92 }}>
                    <NotifyComponent
                      onItemPress={this.onItemPress.bind(this)}
                      data={this.state.notifications}
                    />
                    {this.state.absloading ? (
                      <View
                        style={{
                          width: windowWidth,
                          height: windowHeight,
                          position: 'absolute',
                          backgroundColor: 'transparent',
                          justifyContent: 'center',
                        }}
                      >
                        <ActivityIndicator />
                      </View>
                    ) : null}
                  </View>
                  <View style={{ flex: 0.08 }}>
                    <Footer
                      unreadnotificationcount={
                        this.state.unreadnotificationcount
                      }
                      openControlPanel={this.openControlPanel}
                      value="notifications"
                      notification_count={this.state.notification_count}
                    />
                  </View>
                </View>
              </View>
            )}
          </View>
          <Modal isVisible={this.state.isvisible}>
            <View
              style={{
                padding: 10,
                backgroundColor: 'white',
                borderRadius: 15,
                marginVertical: 15,
                width: windowWidth / 1.2,
                height: '50%',
                justifyContent: 'center',
                alignSelf: 'center',
              }}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: 'space-around',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: headfont,
                    color: colors.Themecolor,
                    marginTop: 10,
                    marginBottom: 10,
                    textAlign: 'center',
                  }}
                >
                  {this.state.selectedItem.title}
                </Text>
                <View
                  style={{
                    width: '100%',
                    height: 1,
                    backgroundColor: colors.Themecolor,
                    marginTop: 20,
                  }}
                />
                <View style={{ height: 200, marginTop: 20 }}>
                  <ScrollView contentContainerStyle={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: subtext,
                        color: colors.Themecolor,
                        marginHorizontal: 20,
                        paddingVertical: 10,
                        textAlign: 'center',
                      }}
                    >
                      {this.state.selectedItem.body}
                    </Text>
                  </ScrollView>
                </View>

                {/* <View>
                                <Text>{StringsOfLanguages.fromdate}:  {moment(this.state.selectedItem.from_date).format('L')}</Text>
                                <Text style={{ marginTop: 10 }}>{StringsOfLanguages.todate}:   {moment(this.state.selectedItem.to_date).format('L')}</Text>
                            </View> */}
                <TouchableOpacity
                  onPress={this.onclose.bind(this)}
                  style={{
                    paddingVertical: 10,
                    marginTop: 20,
                    marginBottom: 20,
                    paddingHorizontal: 30,
                    backgroundColor: colors.Themecolor,
                  }}
                >
                  <Text style={{ color: 'white', fontSize: subtext }}>
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </Drawer>
      </SafeAreaView>
    );
  }
}
export default Notifications;
