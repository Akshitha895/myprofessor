import React, { Component } from 'react';
import {
  Alert,
  FlatList,
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';

import { Actions } from 'react-native-router-flux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceConstants from 'react-native-device-constants';
import { baseUrl, colors } from '../../constants';
import styles from './styles';

const data = [
  {
    name: 'Profile',
    icon: require('../../assets/images/sidemenu/profile.png'),
  },
  // {
  // 	name: "Notifictions",
  // 	icon: require("../../assets/images/sidemenu/notification.png")
  //},
  {
    name: 'Refer & Earn',
    icon: require('../../assets/images/sidemenu/refer.png'),
  },
  {
    name: 'Change Password',
    icon: require('../../assets/images/sidemenu/changepass.png'),
  },
  {
    name: 'Contact Us',
    icon: require('../../assets/images/sidemenu/call.png'),
  },
  // {
  // 	name: "Knowledge Map",
  // 	icon: require("../../assets/images/sidemenu/heatmap.png")
  // },
  // {
  // 	name:"Buy Package",
  // 	icon:require("../../assets/images/box.png")

  // }

  // {
  // 	name: "Change Language",
  // 	icon:require("../../assets/images/sidemenu/profile.png")
  // }
];
var normladata = [
  {
    name: 'Profile',
    icon: require('../../assets/images/sidemenu/profile.png'),
  },
  // {
  // 	name: "Notifictions",
  // 	icon: require("../../assets/images/sidemenu/notification.png")
  // },
  {
    name: 'Refer & Earn',
    icon: require('../../assets/images/sidemenu/refer.png'),
  },
  {
    name: 'Change Password',
    icon: require('../../assets/images/sidemenu/changepass.png'),
  },
  {
    name: 'Contact Us',
    icon: require('../../assets/images/sidemenu/call.png'),
  },
  // {
  // 	name: "Knowledge Map",
  // 	icon: require("../../assets/images/sidemenu/heatmap.png")
  // },
];

class SideMenu extends Component {
  constructor(props) {
    super(props);
    this.getData = this.getData.bind(this);
    this.state = {
      loader: false,
      userName: 'null',
      profile_pic: 'null',
      gradeName: 'null',
      schoolname: 'null',
      username: '',
      usertype: '',
      token: '',
    };
  }
  componentDidMount() {
    this.getData();
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
            userID: data.userInfo.userId,
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
            this.setData(json.data);
          } else {
            this.setData(data);
          }
        }
      })
      .catch((error) => console.log(error));
  }
  setData(data) {
    console.log('setdataa', data.userInfo);
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
      userName: username,
      profile_pic: data.userInfo.profilePic ? data.userInfo.profilePic : 'null',
      gradeName: data.userOrg.semesterName ? data.userOrg.semesterName : 'null',
      usertype: data.role.roleName,
      schoolname: data.userOrg.schoolId ? data.userOrg.schoolId : 'null',
    });
  }
  onCLose() {
    this.props.closeControlPanel();
  }
  onRefer(item) {
    this.props.closeControlPanel();
    if (item.name === 'Refer & Earn') {
      Actions.push('referview');
    } else if (item.name === 'Change Password') {
      Actions.push('changepassword');
    } else if (item.name === 'Contact Us') {
      Actions.push('contactus');
    } else if (item.name === 'Notifictions') {
      Actions.push('notifications', { title: 'menu' });
    } else if (item.name === 'Profile') {
      Actions.push('profile');
    } else if (item.name === 'Change Language') {
      Actions.push('settings');
    } else if (item.name === 'Buy Package') {
      Actions.push('buypackages');
    } else if (item.name === 'Knowledge Map') {
      Actions.push('heatmap');
    }
  }
  renderItem = ({ item }) => {
    const isTablet = DeviceConstants.isTablet; // false
    var rowheight = 40,
      rowinnericonheight = 20,
      rowinnericonwidth = 18,
      headfont = 15,
      nexticon = 10;
    if (isTablet) {
      rowheight = 60;
      rowinnericonheight = 30;
      rowinnericonwidth = 28;
      headfont = 20;
      nexticon = 15;
    }
    return (
      <TouchableOpacity
        onPress={this.onRefer.bind(this, item)}
        style={[styles.rowView, { height: rowheight }]}
      >
        <View style={styles.rowLeft}>
          <Image
            source={item.icon}
            style={{
              width: rowinnericonwidth,
              height: rowinnericonheight,
              tintColor: 'white',
            }}
          />
        </View>
        <View style={styles.rowMiddle}>
          <Text style={[styles.rowText, { fontSize: headfont }]}>
            {item.name}
          </Text>
        </View>
        <View style={styles.rowLast}>
          <Image
            source={require('../../assets/images/next.png')}
            style={{ width: nexticon, height: nexticon, tintColor: 'white' }}
          />
        </View>
      </TouchableOpacity>
    );
  };
  onLogout() {
    Alert.alert('My Professor', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          this.logoutapi();
        },
      },
    ]);
  }
  logoutapi() {
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
  render() {
    const isTablet = DeviceConstants.isTablet; // false
    var profilepicheight = 55,
      profilesize = 15,
      gradesize = 13;
    if (isTablet) {
      profilepicheight = 95;
      profilesize = 25;
      gradesize = 20;
    }
    const url = this.state.profile_pic;
    //console.log("kdnckdjkcf", url, "knfbjdkabfjkdbfjbd    ", this.state.profile_pic)
    return (
      <View style={styles.mainview}>
        <ImageBackground
          source={require('../../assets/images/sidemenubg.png')}
          style={styles.bg}
        >
          <View style={styles.bgtop} />
          <View style={styles.bgmiddle}>
            <View style={styles.middleTop}>
              {this.state.profile_pic !== 'null' ? (
                <FastImage
                  source={{ uri: url }}
                  style={{
                    width: 55,
                    height: 55,
                    borderRadius: 55 / 2,
                    alignSelf: 'center',
                    backgroundColor: 'red',
                  }}
                />
              ) : (
                <Image
                  source={require('../../assets/images/dashboard/user.png')}
                  style={{
                    width: profilepicheight,
                    height: profilepicheight,
                    borderRadius: profilepicheight / 2,
                    alignSelf: 'center',
                    tintColor: 'white',
                  }}
                />
              )}
              <Text style={[styles.profilename, { fontSize: profilesize }]}>
                {this.state.userName}
              </Text>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: 'white',
                  paddingHorizontal: 10,
                  borderRadius: 30,
                  marginTop: 10,
                }}
              >
                <Text style={[styles.graderText, { fontSize: gradesize }]}>
                  {this.state.gradeName}
                </Text>
              </View>
            </View>
            <View style={styles.middleBottom}>
              <FlatList
                data={
                  this.state.usertype === 'General Student' ? data : normladata
                }
                renderItem={this.renderItem.bind(this)}
              />

              <Image
                source={require('../../assets/images/logo_icon1.png')}
                style={{ width: 102, height: 102, alignSelf: 'center' }}
              />
            </View>
          </View>
          <View style={styles.bgpower}>
            <Text style={{ color: 'white', fontSize: gradesize }}>
              Powered by
            </Text>
            <Text style={{ color: 'white', marginTop: 5, fontSize: gradesize }}>
              SmartGen Technologies Private Limited
            </Text>
          </View>
          <View style={styles.bglast}>
            <TouchableOpacity
              onPress={this.onLogout.bind(this)}
              style={styles.logoutview}
            >
              <Text style={{ fontSize: gradesize, color: colors.Themecolor }}>
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    );
  }
}
export default SideMenu;
