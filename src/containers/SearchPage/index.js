import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DeviceConstants from 'react-native-device-constants';
import Drawer from 'react-native-drawer';
import { TextInput } from 'react-native-gesture-handler';
import { Actions } from 'react-native-router-flux';
import { t } from 'i18n-js';
import Footer from '../../components/Footer';
import SideMenu from '../../components/SideMenu';
import { baseUrl, colors } from '../../constants';
import styles from './styles';
//import Share from 'react-native-share';

class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchvalue: '',
      token: '',
      userDetails: '',
      searchlist: [],
      spinner: false,
      nodata: false,
      topicItem: null,
      subjectData: null,
      chapterData: null,
      validpackages: {},
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
        var data = JSON.parse(value);
        const token = await AsyncStorage.getItem('@access_token');
        if (token) {
          this.setState({
            token: JSON.parse(token),
            userDetails: data,
          });
          this.validatepackages(data);
          //this.getanalytics(data,JSON.parse(token))
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
    //  console.log("userIduserIduserIduserIduserId", this.state.token)
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
        console.log('validpresponseeeeeackages', json);
        if (json.data) {
          console.log('validpackages', json.data);
          this.setState({ validpackages: json.data });
        } else if (json.error?.code === 400) {
          //alert("dknkdf")
          Alert.alert('My Professor', json.error.message, [
            { text: 'OK', onPress: () => this.logout() },
          ]);
        } else {
          console.log(JSON.stringify(json.message));
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
  onBack() {
    Actions.dashboard({ type: 'reset' });
  }
  onmchnagetetxt(text) {
    this.setState(
      {
        searchvalue: text,
        spinner: true,
      },
      () => {
        this.ongetserached();
      }
    );
  }
  ongetserached() {
    var userId = this.state.userDetails.userInfo.userId;
    var url =
      baseUrl +
      `/global-search?userId=${userId}&searchValue=${this.state.searchvalue}`;

    console.log('value', url);
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        jwt: this.state.token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        console.log('serachdataaa', json);
        if (json.data) {
          this.setState({
            searchlist: json.data,
            spinner: false,
            nodata: false,
          });
        } else {
          this.setState({
            searchlist: [],
            spinner: false,
            nodata: true,
          });
        }
      })
      .catch((error) => console.error(error));
  }
  oncross() {
    this.setState({
      searchvalue: '',
      searchlist: [],
      nodata: false,
      spinner: false,
    });
  }
  onMainTopic(item) {
    console.log('Dfndajn,c', item);
    if (item.searchEntity === 'topic') {
      var userdata = this.state.userDetails;
      var subjectId = item.subjectId;
      var chapterId = item.chapterId;
      var topicId = item.topicId;
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
            console.log('topicsjkcbjkasdh', json);
            if (json.data) {
              item['image'] = json.data.image;
            }
          }
        })
        .catch((error) => console.error(error));
      Actions.push('topicmainview', { from: 'searchpage', data: item });
    } else if (item.searchEntity === 'chapter') {
      var userdata = this.state.userDetails;
      var subjectId = item.subjectId;
      var chapterId = item.chapterId;
      var url =
        baseUrl +
        `/universities/${userdata.userOrg.universityId}/branches/${userdata.userOrg.branchId}/semesters/${userdata.userOrg.semesterId}/subjects/${subjectId}/chapters/${chapterId}`;
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
              item['image'] = json.data.image;
            }
          }
        })
        .catch((error) => console.error(error));
      Actions.push('topics', { screen: 'searchpage', data: item });
    }
  }
  onmainchapter(item) {
    console.log('dfdfdsfdsfdsfdsfdsf', item);
    var newarray = [
      '#6a5177',
      '#d88212',
      '#277292',
      '#a3ba6d',
      '#deb026',
      '#c44921',
    ];
    var newitem = newarray[Math.floor(Math.random() * newarray.length)];
    var url = baseUrl + '/chapter/' + item.chapterId;
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: this.state.token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        console.log('chapterrrddddddd', json);
        if (json.data) {
          this.setState(
            {
              // topicItem: json.data.topic,
              subjectData: json.data.chapter.subject,
              chapterData: json.data.chapter,
            },
            () => {
              var bgcolor;
              if (json.data.chapter.subject.color) {
                bgcolor = json.data.chapter.subject.color;
              } else {
                bgcolor = newitem;
              }
              this.setState((s) => ({
                ...s,
                chapterData: { ...s.chapterData, color: bgcolor },
              }));
              Actions.push('topics', {
                data: this.state.chapterData,
                subjectData: this.state.subjectData,
                screen: 'seaechpage',
              });
            }
          );
        } else {
          var obj1 = {
            reference_id: item.chapterId,
            name: 'Chapter1',
          };
          var obj2 = {
            reference_id: item.subjectId,
            name: 'subject1',
          };
          this.setState(
            {
              chapterData: obj1,
              subjectData: obj2,
            },
            () =>
              Actions.push('topics', {
                data: this.state.chapterData,
                subjectData: this.state.subjectData,
                screen: 'seaechpage',
              })
          );
        }
      });
  }
  renderItem({ item, index }) {
    return (
      <TouchableOpacity onPress={this.onItem.bind(this, item)}>
        <View style={{ padding: 10, paddingVertical: 20 }}>
          <Text>
            {item.searchEntity === 'chapter'
              ? item.chapterName
              : item.topicName}
          </Text>
        </View>
        <View style={{ height: 1, backgroundColor: 'lightgrey' }} />
      </TouchableOpacity>
    );
  }
  onItem(item) {
    console.log('Dcldf', JSON.stringify(item));

    this.onMainTopic(item);
  }
  itemseperator() {
    return <View style={{ height: 1, backgroundColor: 'grey' }} />;
  }
  closeControlPanel = () => {
    this._drawer.close();
  };
  openControlPanel = () => {
    this._drawer.open();
  };
  onYes() {
    Actions.push('buypackages');
  }
  render() {
    const isTablet = DeviceConstants.isTablet; // false
    var drawerwidth = 100;
    if (isTablet) {
      drawerwidth = 700;
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
                <TouchableOpacity onPress={this.onBack.bind(this)}>
                  <Image
                    source={require('../../assets/images/refer/back.png')}
                    style={styles.backIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.bottomView}>
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    flex: 0.1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <View
                    style={{
                      height: 40,
                      borderWidth: 1,
                      borderColor: 'lightgrey',
                      width: '90%',
                      borderRadius: 20,
                      color: 'grey',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <TextInput
                      value={this.state.searchvalue}
                      editable={
                        (this.state.userDetails?.role?.roleName ===
                          'General Student' &&
                          this.state.validpackages?.subscriptionStatus ===
                            'active') ||
                        this.state.userDetails?.role?.roleName === 'Student'
                          ? true
                          : false
                      }
                      placeholder={'Search for Chapters and Topics...'}
                      style={{
                        height: 50,
                        width: '89%',
                        borderRadius: 20,
                        color: 'black',
                        paddingLeft: 8,
                      }}
                      onChangeText={this.onmchnagetetxt.bind(this)}
                    />
                    {this.state.searchvalue !== '' ? (
                      <TouchableOpacity onPress={this.oncross.bind(this)}>
                        <Image
                          source={require('../../assets/images/closesearch.png')}
                          style={{
                            width: 15,
                            height: 15,
                            tintColor: 'grey',
                            marginRight: 10,
                          }}
                        />
                      </TouchableOpacity>
                    ) : null}
                  </View>
                </View>

                <View style={{ flex: 0.82 }}>
                  {this.state.spinner ? (
                    <View style={{ flex: 1, alignItems: 'center' }}>
                      <ActivityIndicator />
                    </View>
                  ) : (this.state.userDetails?.role?.roleName ===
                      'General Student' &&
                      this.state.validpackages?.subscriptionStatus ===
                        'active') ||
                    this.state.userDetails?.role?.roleName === 'Student' ? (
                    this.state.searchlist.length > 0 ? (
                      <FlatList
                        data={this.state.searchlist}
                        renderItem={this.renderItem.bind(this)}
                        keyExtractor={(item) => item.name}
                        //ItemSeparatorComponent={this.itemseperator.bind(this)}
                      />
                    ) : this.state.nodata ? (
                      <View style={{ flex: 1, alignItems: 'center' }}>
                        <Text>No Data</Text>
                      </View>
                    ) : null
                  ) : (
                    <View style={{ flex: 1, alignItems: 'center' }}>
                      <Text
                        style={{
                          fontSize: 15,
                          textAlign: 'center',
                          marginTop: 10,
                          marginHorizontal: 20,
                        }}
                      >
                        You need to subscribe to access this feature of
                        searching
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
                        Please subscribe now{' '}
                      </Text>
                      <TouchableOpacity onPress={this.onYes.bind(this)}>
                        <View
                          style={{
                            paddingHorizontal: 30,
                            paddingVertical: 15,
                            borderRadius: 20,
                            backgroundColor: colors.Themecolor,
                            marginTop: 50,
                          }}
                        >
                          <Text style={{ color: 'white' }}>Subscribe</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
                <View style={{ flex: 0.08 }}>
                  <Footer
                    openControlPanel={this.openControlPanel}
                    value="search"
                  />
                </View>
              </View>
            </View>
          </View>
        </Drawer>
      </SafeAreaView>
    );
  }
}
export default SearchPage;
