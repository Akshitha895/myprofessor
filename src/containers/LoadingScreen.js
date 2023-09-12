import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import {
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { baseUrl, colors } from '../constants';
import StringsOfLanguages from './../StringsOfLanguages';

class LoadingScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deviceToken: '',
      viewlanguage: false,
    };
  }

  componentDidMount() {
    _this = this;
    setTimeout(() => {
      this.getData();
      // this.getversion()
    }, 7000);
    //
  }

  getData = async () => {
    // alert("hhj")
    try {
      const value = await AsyncStorage.getItem('@user');
      console.log('sdjaklsjlsajcf', value);
      if (value !== null) {
        var data = JSON.parse(value);
        console.log('data...', data);
        // const token = await AsyncStorage.getItem('@access_token')
        if (data.userInfo?.accountStatus === 'active') {
          StringsOfLanguages.setLanguage('en');
          Actions.push('dashboard');
        } else {
          if (data.accountStatus === 'registration_inprogress') {
            Actions.push('register', { showotpscreen: true });
          } else if (data.accountStatus === 'account_setup_inprogress') {
            Actions.push('boards');
          } else {
            Actions.push('boards');
          }
        }
      } else {
        // this.setState({
        //   viewlanguage: true
        // })
        Actions.push('login', { deviceToken: this.state.deviceToken });
      }
    } catch (e) {
      return null;
    }
  };
  getversion() {
    //  Actions.push('versionupdate')

    fetch(baseUrl + `/app-version/latest`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((json) => {
        //	alert(JSON.stringify(json))
        if (json.code === 201) {
          console.log('kdjkdjaf', json);
          if (json.data) {
            var appversion = json.data.version;
            var data = appversion.split('v');
            ///alert(data[1])
            if (5.0 < data[1]) {
              Actions.push('versionupdate');
            }
          }
        } else {
        }
      })
      .catch((error) => console.error(error));
  }
  onLanguage(value) {
    StringsOfLanguages.setLanguage(value);
    AsyncStorage.setItem('@localevalue', value);

    // navigation.navigate('ContentScreen', {selectedLanguage: value});
    Actions.push('login', {
      deviceToken: this.state.deviceToken,
      localevalue: value,
    });
  }
  render() {
    return this.state.viewlanguage ? (
      <>
        <ImageBackground
          source={require('./../assets/images/Mobile_bg_1.png')}
          style={{ width: '100%', height: '100%', opacity: 0.5 }}
        />
        <View style={{ width: '100%', height: '100%', position: 'absolute' }}>
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <Image
              source={require('../assets/images/logo_icon1.png')}
              style={{ width: 72, height: 72, alignSelf: 'center' }}
            />
            <TouchableOpacity
              onPress={this.onLanguage.bind(this, 'en')}
              style={{
                height: 50,
                paddingHorizontal: 10,
                backgroundColor: colors.Themecolor,
                width: 100,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 30,
              }}
            >
              <Text style={{ color: 'white' }}>English</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.onLanguage.bind(this, 'th')}
              style={{
                height: 50,
                paddingHorizontal: 10,
                backgroundColor: colors.Themecolor,
                width: 100,
                marginTop: 30,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: 'white' }}>Thai</Text>
            </TouchableOpacity>
          </View>
        </View>
      </>
    ) : (
      <>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#e03744',
          }}
        >
          <Image
            source={require('./../assets/images/newmypro.gif')}
            style={{ width: 300, height: 300, alignSelf: 'center' }}
          />
        </View>
      </>
    );
  }
}
export default LoadingScreen;
