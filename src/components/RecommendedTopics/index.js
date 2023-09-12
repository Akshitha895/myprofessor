import React, { Component } from 'react';
import {
  Alert,
  FlatList,
  // Dimensions,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DeviceConstants from 'react-native-device-constants';

import { Actions } from 'react-native-router-flux';
import StringsOfLanguages from '../../StringsOfLanguages';

import { baseUrl, colors } from '../../constants';

// const data = [
//   {
//     name: 'Rational Numbers',
//     //image: require('../../assets/images/dashboard/new/topic3.png'),
//     //description:"dncdncndkcdkcnksdnvkds djnclkdnckdnc d cdjabjadbfjdbkfbdskjbfjkdsbfkjdsbfjbdjkfbcdjskbvjksdbjkdsbvjdsbvjkbsvjksbvjkbsdjvbds kdncklsdcksdkcdsc djkncjkdcjkd  jkcjkdsnjdbjnc jkbcjksdbjdnc",
//     insideimg: require('../../assets/images/math.png'),
//     progress: 0.5,
//     test: 6,
//     read: 40,
//   },
//   {
//     name: 'Volume of Cuboid',
//     //image: require('../../assets/images/dashboard/new/topic4.png'),
//     insideimg: require('../../assets/images/math.png'),
//     progress: 0.3,
//     test: 6,
//     read: 40,
//   },
//   {
//     name: 'Volume of Cylinder',
//     //image:require('../../assets/images/dashboard/new/topic5.png'),
//     insideimg: require('../../assets/images/math.png'),
//     progress: 0.9,
//     test: 6,
//     read: 40,
//   },
// ];
var headfont = 16,
  headsubtext = 14;

class RecommendedTopics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      topicsData: [],
      spinner: true,
    };
  }
  componentDidMount() {
    //alert("dfkf")
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
  onMainTopic(item) {
    console.log('sabdkjasbDJKADJKDJDJKHDJKH', item);
    Actions.push('topicmainview', { from: 'dashboard', data: item });
  }
  getTopics(user) {
    //	localhost:3000/student/recommendedLearning
    var userId = user.userInfo.userId;

    var url = baseUrl + `/analytics/users/${userId}/recommended-learning`;
    console.log('valucljkvnlckznvkde', url);
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        jwt: this.state.token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        console.log('recomme.................', JSON.stringify(json));
        if (json.code === 201) {
          if (json.data) {
            this.setState({
              topicsData: json.data,
              spinner: false,
            });
          } else {
            //alert("ffff"+JSON.stringify(json.message))
            // Toast.show(json.message, Toast.LONG);
            this.setState({
              topicsData: [],
              spinner: false,
            });
          }
        } else if (json.error?.code === 400) {
          //alert("dknkdf")
          Alert.alert('My Professor', json.error.message, [
            { text: 'OK', onPress: () => this.logout() },
          ]);
        } else {
          //alert("ffff"+JSON.stringify(json.message))
          //Toast.show(json.message, Toast.LONG);
          this.setState({
            topicsData: [],
            spinner: false,
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
              {/* <Progress.Bar progress={item.progress ? item.progress / 100 : 0} width={boxwidth/1.1} height={3} color={color}
			   unfilledColor={"lightgrey"} borderColor={"transparent"}/> */}
            </View>
          </TouchableOpacity>
          {/* 	<TouchableOpacity onPress={this.onMainTopic.bind(this, item)} underlayColor="transparent" activeOpacity={0.9}
					// 	>
	
	
	
					// 		<View style={{ flex: 1 }}>
					// 			<View style={{ flex: 0.4, }}>
					// 				{item.image === 'null' ?
					// 					<Image source={require('../../assets/images/logo_icon1.png')}
					// 						style={{ height: 180, width: boxwidth, }} />
	
					// 					: <Image source={{ uri: imageUrl + item.image }}
					// 						style={{ height: 180, width: boxwidth, }} />
					// 				}
	
					// 			</View>
					// 			<View style={{ flex: 0.2, justifyContent: "center", paddingVertical: 10 }}>
					// 				<Text style={{ fontSize: textsize, marginLeft: 10 }}>{item.name}</Text>
	
					// 			</View>
	
	
					// 			<View style={{ flex: 0.15, flexDirection: "row", paddingVertical: 10 }}>
					// 				<View style={{ flex: 0.8, justifyContent: "center", alignItems: "center" }}>
					// 					<Progress.Bar progress={item.progress ? item.progress / 100 : 0} width={progwidth} height={progheight} />
					// 				</View>
					// 				<View style={{ flex: 0.2, alignItems: "center", justifyContent: "center" }}>
					// 					<Text style={{ fontSize: progtext - 3 }}>{item.progress}%</Text>
	
					// 				</View>
					// 			</View>
	
	
					// 		</View>
	
	
				// 	</TouchableOpacity>*/}
        </View>
      );
    } else {
      return null;
    }
  }
  onViewall() {
    Actions.push('recommendedtopics');
  }
  render() {
    return this.state.spinner ? null : this.state.topicsData.length > 0 ? (
      <View
        style={{
          marginHorizontal: 10,
          shadowColor: 'grey',
          // shadowOffset: { width: 0, height: 1 },
          // shadowOpacity: 1,
          // shadowRadius: 2,
          // elevation: 10
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 50,
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
            {StringsOfLanguages.recommendedtopics}
          </Text>
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
        </View>

        <FlatList
          data={this.state.topicsData}
          renderItem={this.renderItem.bind(this)}
          horizontal
          extraData
          showsHorizontalScrollIndicator={false}
        />
      </View>
    ) : null;
  }
}
export default RecommendedTopics;
