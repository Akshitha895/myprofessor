import React, { Component } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DeviceConstants from 'react-native-device-constants';
import * as Progress from 'react-native-progress';
import { Actions } from 'react-native-router-flux';
import Toast from 'react-native-simple-toast';

import AsyncStorage from '@react-native-async-storage/async-storage';
import StringsOfLanguages from '../../StringsOfLanguages';
import { baseUrl, colors } from '../../constants';
var headfont = 16,
  headsubtext = 14,
  boxheight = 250,
  innerbox = 145,
  progressbar = 5;

class MyTopics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinner: true,
      token: '',
      topicsData: [],
      subjectData: {},
      chapterData: {},
      topicItem: {},
    };
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
        const token = await AsyncStorage.getItem('@access_token');
        if (token) {
          this.setState(
            {
              token: JSON.parse(token),
            },
            () => this.getTopics(data)
          );
        } else {
        }
      } else {
        console.log('errorr');
      }
    } catch (e) {
      return null;
    }
  };
  getTopics(user) {
    var userId = user.userInfo.userId;

    var url = baseUrl + `/analytics/users/${userId}/inProgress-topics`;
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
        console.log('topicdattaaa.................', JSON.stringify(json));
        if (json) {
          if (json.code === 201) {
            this.setState({
              topicsData: json.data ? json.data : [],
              spinner: false,
            });
          } else if (json.error?.code === 400) {
            //alert("dknkdf")
            Alert.alert('My Professor', json.error.message, [
              { text: 'OK', onPress: () => this.logout() },
            ]);
          } else {
            this.setState({
              topicsData: [],
              spinner: false,
            });
          }
        } else {
          console.log('topicdelseeeeeeee', JSON.stringify(json));
          //alert("ffff"+JSON.stringify(json.message))
          Toast.show(json.message, Toast.LONG);
          this.setState({
            topicsData: [],
            spinner: false,
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

  onMainTopic(item) {
    console.log('dfdfdsfdsfdsfdsfdsf', item);
    Actions.push('topicmainview', { from: 'dashboard', data: item });
  }
  renderItem({ item, index }) {
    if (item !== null) {
      console.log('vvvvvv', item);
      var percent;
      let color;
      if (item.progress) {
        console.log('fffff', item.progress);
        percent = item.progress;

        if (percent > 80) {
          color = 'green';
        } else if (percent < 50) {
          color = 'red';
        } else {
          color = 'orange';
        }
      }
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
            onPress={this.onMainTopic.bind(this, item)}
            underlayColor="transparent"
            activeOpacity={0.9}
            style={{ flex: 1 }}
          >
            <View style={{ flex: 0.7 }}>
              {item.image === 'null' ? (
                <Image
                  source={require('../../assets/images/logo_icon1.png')}
                  style={{ height: '100%', width: boxwidth }}
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
                {item.topicName}
              </Text>
              <Progress.Bar
                progress={item.progress ? item.progress / 100 : 0}
                width={boxwidth / 1.1}
                height={3}
                color={color}
                unfilledColor={'lightgrey'}
                borderColor={'transparent'}
              />
            </View>
          </TouchableOpacity>
        </View>
      );
    } else {
      return null;
    }
  }
  onViewall() {
    Actions.push('progresstopics');
  }
  onstart() {
    Actions.push('subjects');
  }
  render() {
    const isTablet = DeviceConstants.isTablet; // false
    var nodataimageheight = 379 / 3,
      nodataimagewidth = 395 / 3,
      noimagefont = 18;
    if (isTablet) {
      nodataimagewidth = 395 / 2;
      nodataimageheight = 379 / 2;
      noimagefont = 22;
    }
    return this.state.spinner ? null : (
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 5,
          }}
        >
          <Text
            style={{
              marginLeft: 20,
              fontSize: headfont,
              color: colors.Themecolor,
              fontWeight: '600',
            }}
          >
            {StringsOfLanguages.mytopicsinprogress}
          </Text>
          {this.state.topicsData.length > 0 ? (
            <TouchableOpacity onPress={this.onViewall.bind(this)}>
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
          ) : null}
        </View>
        {this.state.topicsData.length > 0 ? (
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
              data={this.state.topicsData}
              renderItem={this.renderItem.bind(this)}
              keyExtractor={(item, index) => item + index}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
        ) : (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              paddingBottom: 20,
              paddingTop: 30,
            }}
          >
            <Image
              source={require('../../assets/images/notopics.png')}
              style={{ width: nodataimagewidth, height: nodataimageheight }}
            />
            <View style={{ flexDirection: 'row' }}>
              <Text
                style={{
                  fontSize: noimagefont,
                  fontWeight: '400',
                  textAlign: 'center',
                  color: 'grey',
                  marginTop: 10,
                }}
              >
                {`It's time to`}
              </Text>
              <TouchableOpacity onPress={this.onstart.bind(this)}>
                <Text
                  style={{
                    fontSize: noimagefont,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    color: 'grey',
                    marginTop: 10,
                  }}
                >
                  {' '}
                  start
                </Text>
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: noimagefont,
                  fontWeight: '400',
                  textAlign: 'center',
                  color: 'grey',
                  marginTop: 10,
                }}
              >
                {' '}
                your journey
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  }
}
export default MyTopics;
