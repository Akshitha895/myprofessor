import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import DeviceConstants from 'react-native-device-constants';
import { Actions } from 'react-native-router-flux';
import { baseUrl, colors } from '../../constants';
import styles from './styles';

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: 'dashboard',
      notification_count: null,
      token: '',
      userDetails: '',
      validpackages: {},
    };
  }
  onMenu() {
    this.props.openControlPanel();
  }
  componentDidMount() {
    this.getData();
    if (this.props.value) {
      this.setState({
        selected: this.props.value,
      });
    }
    if (this.props.notification_count) {
      //  alert(this.props.unreadnotificationcount)
      if (this.props.unreadnotificationcount > 0) {
        this.setState({
          notification_count: this.props.unreadnotificationcount,
        });
      }
    }
  }
  getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@user');
      //  alert(JSON.stringify(value))
      if (value !== null) {
        var data = JSON.parse(value);
        console.log('chapterssssujjj', data);
        const token = await AsyncStorage.getItem('@access_token');
        if (token) {
          this.setState({
            token: JSON.parse(token),
            userDetails: data,
          });
          if (data.userOrg.roleName === 'General Student') {
            this.validatepackages(data);
          }
        } else {
        }
      } else {
        console.log('errorrr');
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
        } else {
          console.log(JSON.stringify(json.message));
        }
      })
      .catch((error) => console.error(error));
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    // alert(nextProps.value)
  }
  onPressIcon(value) {
    this.setState({ selected: value }, () => {
      //   alert(value)
      if (value === 'notifications') {
        Actions.push('notifications', { title: 'tabs' });
      } else if (value === 'dashboard') {
        Actions.push('dashboard');
      } else if (value === 'bell') {
        Actions.push('announcements', { title: 'tabs' });
      } else if (value === 'calendar') {
        Actions.push('calendar', { title: 'tabs' });
      } else if (value === 'search') {
        Actions.push('searchpage', { title: 'tabs' });
      }
    });
  }

  render() {
    const isTablet = DeviceConstants.isTablet; // false
    var iconheight = 25,
      rightview = 30;
    if (isTablet) {
      (iconheight = 33), (rightview = 100);
    }
    var { title } = this.props;
    return (
      <>
        <View style={styles.footerinnerview}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}
          >
            <View
              style={{
                flex: 0.25,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TouchableOpacity onPress={this.onMenu.bind(this)}>
                <Image
                  source={require('../../assets/images/newmenu.png')}
                  style={{
                    width: iconheight,
                    height: iconheight,
                    tintColor:
                      this.state.selected === 'menu'
                        ? colors.Themecolor
                        : 'grey',
                  }}
                />
              </TouchableOpacity>
            </View>

            <View
              style={{
                flex: 0.25,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TouchableOpacity
                onPress={this.onPressIcon.bind(this, 'dashboard')}
              >
                <Image
                  source={require('../../assets/images/newhome.png')}
                  style={{
                    width: iconheight,
                    height: iconheight,
                    tintColor:
                      this.state.selected === 'dashboard'
                        ? colors.Themecolor
                        : 'grey',
                  }}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flex: 0.25,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TouchableOpacity onPress={this.onPressIcon.bind(this, 'search')}>
                <Image
                  source={require('../../assets/images/newsearch.png')}
                  style={{
                    width: iconheight,
                    height: iconheight,
                    tintColor:
                      this.state.selected === 'search'
                        ? colors.Themecolor
                        : 'grey',
                  }}
                />
              </TouchableOpacity>
            </View>
            {/* <View style={{flex:0.25,alignItems:"center",justifyContent:"center"}}>
                    <TouchableOpacity onPress={this.onPressIcon.bind(this,'bell')}>
                    <Image  source={require("../../assets/images/newbell.png")} style={[styles.footericon,{tintColor:this.state.selected === 'bell'?colors.Themecolor:"#BABABA",}]}/>
                    </TouchableOpacity>
                    </View> */}
            <View
              style={{
                flex: 0.25,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TouchableOpacity
                onPress={this.onPressIcon.bind(this, 'notifications')}
              >
                <Image
                  source={require('../../assets/images/newnoti.png')}
                  style={{
                    width: iconheight,
                    height: iconheight,
                    tintColor:
                      this.state.selected === 'notifications'
                        ? colors.Themecolor
                        : 'grey',
                  }}
                />
              </TouchableOpacity>
              {this.state.notification_count ? (
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: colors.Themecolor,
                    position: 'absolute',
                    alignSelf: 'flex-end',
                    top: 10,
                    right: rightview,
                  }}
                />
              ) : null}
            </View>
            <View
              style={{
                flex: 0.25,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TouchableOpacity
                onPress={this.onPressIcon.bind(this, 'calendar')}
              >
                <Image
                  source={require('../../assets/images/newcal.png')}
                  style={{
                    width: iconheight,
                    height: iconheight,
                    tintColor:
                      this.state.selected === 'calendar'
                        ? colors.Themecolor
                        : 'grey',
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </>
    );
  }
}
export default Footer;
