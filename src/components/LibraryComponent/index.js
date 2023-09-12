import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import * as Progress from 'react-native-progress';
import { Actions } from 'react-native-router-flux';

import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceConstants from 'react-native-device-constants';
import { colors } from '../../constants';
import { baseUrl } from '../../constants';
import StringsOfLanguages from './../../StringsOfLanguages';

var headfont = 16,
  headsubtext = 14;
// var imagesarray = [
//   require('../../assets/images/dashboard/new/bluebg_new.png'),
//   require('../../assets/images/dashboard/new/orangebg_new.png'),
//   require('../../assets/images/dashboard/new/purplebg_new.png'),
//   require('../../assets/images/dashboard/new/greenbg_new.png'),
// ];
class LibraryComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subjectsData: null,
      spinner: true,
      analyticsData: {},
      token: '',
    };
  }
  onChapter(item) {
    //this.updateAnalytics()
    Actions.push('chapters', { data: item });
  }
  componentDidMount() {
    const isTablet = DeviceConstants.isTablet; // false
    //var height = 100, innerwidth = 32 , innerheight = 31, innersize = 10;
    if (isTablet) {
      headfont = 28;
      headsubtext = 25;
    }
    this.getData();
  }

  getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@user');
      //  alert(JSON.stringify(value))
      if (value !== null) {
        var data = JSON.parse(value);
        console.log('userrrrr', data);
        const token = await AsyncStorage.getItem('@access_token');
        if (token) {
          this.setState({
            token: JSON.parse(token),
          });
          this.getSubjects(data, JSON.parse(token));
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
  getSubjects(user, toekn) {
    var userId = user.userInfo.userId;

    //grade?offset=0&limit=10&order_by=name&sort_order=DESC&board=1a060a8b-2e02-4bdf-8b70-041070f3747c&branch=-1
    var url = baseUrl + `/analytics/users/${userId}/subjects`;
    var body = {
      universityId: user.userOrg.universityId,
      branchId: user.userOrg.branchId,
      semesterId: user.userOrg.semesterId,
      offset: 0,
      limit: 10000,
    };
    // baseUrl+'/boards/'+board_id+'/grades/'+grade_id+'/subjects'
    console.log('value', url);
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        jwt: toekn,
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((json) => {
        //alert("adfasdgsgsfa"+ JSON.stringify(json))
        // const data = json.data;
        if (json.code === 201) {
          if (json.data.items) {
            const data = json.data;
            this.setState({
              spinner: false,
              subjectsData: data.items,
            });
          } else {
            this.setState({
              spinner: false,
              subjectsData: [],
            });
          }
          //  AsyncStorage.setItem('@access-token', data.access_token)
          //  Actions.push('dashboard')
        } else if (json.error?.code === 400) {
          //alert("dknkdf")
          Alert.alert('My Professor', json.error.message, [
            { text: 'OK', onPress: () => this.logout() },
          ]);
        } else {
          // alert("hii")
          if (json.error.name === 'TokenExpiredError') {
            Alert.alert(
              'My Professor',
              'Your Session has expired please login again',
              [{ text: 'OK', onPress: () => this.logout() }]
            );
          }
          this.setState({
            spinner: false,
            subjectsData: [],
          });
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
  getanalytics(user, token) {
    var body = {
      user_id: user.reference_id,
      board_id: user.grade ? user.grade.board_id : null,
      grade_id: user.grade ? user.grade.reference_id : null,
      section_id: user.section ? user.section.reference_id : null,
      school_id: user.school ? user.school.reference_id : null,
      branch_id: user.grade ? user.grade.branch_id : null,
      page: 'MyCourse_Subjects',
      type: 'mobile',
      subject_id: null,
      chapter_id: null,
      topic_id: null,
      activity_id: null,
    };

    console.log('analyticsss', body);
    var url = baseUrl + '/analytics';
    console.log('value', url);
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token,
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.data) {
          const data = json.data;
          //   alert(JSON.stringify(json));
          this.setState({
            analyticsData: data,
          });
          //    Snackbar.show({
          // 	text: json.message,
          // 	duration: Snackbar.LENGTH_SHORT,
          //   });
        } else {
          console.log(JSON.stringify(json.message));
        }
      })
      .catch((error) => console.error(error));
  }
  renderItem({ item, index }) {
    if (item !== null) {
      console.log('subjectttttt', item);
      var percent;
      let color;
      if (item.progress) {
        //console.log("ffffcfdfdf", item.progress)
        percent = parseInt(item.progress);

        if (percent > 80) {
          color = 'green';
        } else if (percent < 50) {
          color = 'red';
        } else {
          color = 'orange';
        }
      }
      console.log('ffffcfdfdf', percent);
      var newarray = [
        '#6a5177',
        '#d88212',
        '#277292',
        '#a3ba6d',
        '#deb026',
        '#c44921',
      ];
      const isTablet = DeviceConstants.isTablet; // false
      var boxwidth = 200,
        textsize = 14,
        progwidth = 150,
        progheight = 5,
        progtext = 15,
        boxheight = 220;
      console.log('jnjj', isTablet);
      if (isTablet) {
        textsize = 20;
        progwidth = 170;
        boxwidth = 300;
        boxheight = 350;
        progtext = 20;
        progheight = 10;
        //boxwidth = 300
      }
      if (item.progress > 80) {
        color = 'green';
      } else if (percent < 50) {
        color = 'red';
      } else {
        color = 'orange';
      }
      return (
        <View
          style={{
            backgroundColor: 'white',
            marginHorizontal: 10,
            marginBottom: 10,
            height: boxheight,
            borderWidth: 1,
            borderColor: 'lightgrey',
            width: boxwidth,
            marginVertical: 10,
            shadowColor: '#171717',
            shadowOffset: { width: 2, height: 2 },
            shadowOpacity: 0.2,
            overflow: 'hidden',
            shadowRadius: 3,
            elevation: 2,
          }}
        >
          <TouchableOpacity
            onPress={this.onChapter.bind(this, item)}
            underlayColor="transparent"
            activeOpacity={0.9}
            style={{ flex: 1 }}
          >
            <View style={{ flex: 0.7, justifyContent: 'center' }}>
              {item.image === 'null' || item.image === '' ? (
                <Image
                  source={require('../../assets/images/logo_icon1.png')}
                  style={{ height: 100, width: 100, alignSelf: 'center' }}
                />
              ) : (
                <Image
                  source={{ uri: item.image }}
                  style={{ height: '100%', width: boxwidth }}
                />
              )}
            </View>
            <View
              style={{
                flex: 0.3,
                justifyContent: 'space-around',
                marginHorizontal: 5,
              }}
            >
              <Text
                numberOfLines={2}
                style={{ fontSize: textsize, marginLeft: 5 }}
              >
                {item.name}
              </Text>
              {percent && (
                <Progress.Bar
                  progress={percent / 100}
                  width={boxwidth / 1.1}
                  height={3}
                  color={color}
                  unfilledColor={'lightgrey'}
                  borderColor={'transparent'}
                />
              )}
            </View>
          </TouchableOpacity>
        </View>
      );
    } else {
      return null;
    }
  }
  onSeeaLL() {
    Actions.push('subjects');
  }
  render() {
    return (
      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text
            style={{
              marginLeft: 20,
              fontSize: headfont,
              color: colors.Themecolor,
              fontWeight: '600',
            }}
          >
            {StringsOfLanguages.mylibrary}
          </Text>
          <TouchableOpacity onPress={this.onSeeaLL.bind(this)}>
            <Text
              style={{
                marginRight: 15,
                fontSize: headsubtext,
                color: colors.Themecolor,
              }}
            >
              {StringsOfLanguages.seeall}
            </Text>
          </TouchableOpacity>
        </View>

        {this.state.spinner ? (
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <ActivityIndicator color={'black'} />
          </View>
        ) : this.state.subjectsData && this.state.subjectsData.length > 0 ? (
          <View
            style={{
              flex: 1,
              marginHorizontal: 10,
              justifyContent: 'center',
              marginTop: 10,
              alignnIt: 'center',
            }}
          >
            <FlatList
              data={this.state.subjectsData}
              renderItem={this.renderItem.bind(this)}
              //numColumnßs={2}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
        ) : (
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <Text>No Data</Text>
          </View>
        )}
      </View>
    );
  }
}
export default LibraryComponent;
