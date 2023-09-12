import React, { Component } from 'react';
import {
  ImageBackground,
  View,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';

import { WebView } from 'react-native-webview';
import { Actions } from 'react-native-router-flux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseUrl } from '../../constants';
class ViewLiveClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinner: true,
      liverecording: '',
      token: '',
    };
  }
  componentDidMount() {
    this.getData();
  }
  getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@user');
      if (value !== null) {
        var data = JSON.parse(value);

        const token = await AsyncStorage.getItem('@access_token');
        if (token && data) {
          this.setState({
            token: JSON.parse(token),
          });
          this.getrecording(JSON.parse(token));
        } else {
          console.log('hihii');
        }
      } else {
        alert('errorrr');
      }
    } catch (e) {
      return null;
    }
  };

  getrecording(token) {
    const { data } = this.props;
    const url = baseUrl + '/live-class/' + data.reference_id + '/recording';
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        const data = json.data;
        if (data) {
          console.log('ljdfkldfd', data);
          this.setState({
            liverecording: data,
            spinner: false,
          });
        } else {
          this.setState({
            liverecording: null,
            spinner: false,
          });
        }
      })
      .catch((error) => console.error(error));
  }
  onBack() {
    Actions.pop({ type: 'reset' });
  }

  render() {
    const { topicindata } = this.props;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <>
          <ImageBackground
            source={require('../../assets/images/dashboard/new/activitybg.jpg')}
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: topicindata.color,
            }}
            opacity={0.5}
          >
            <View style={{ flex: 1 }}>
              <View style={{ flex: 0.08, flexDirection: 'row' }}>
                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      flex: 1,
                      marginLeft: 20,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <TouchableOpacity onPress={this.onBack.bind(this)}>
                      <Image
                        source={require('../../assets/images/left-arrow.png')}
                        style={{ width: 25, height: 25, tintColor: 'white' }}
                      />
                    </TouchableOpacity>

                    <Text
                      style={{ color: 'white', fontSize: 18, marginLeft: 10 }}
                    >
                      {'Live Class Recording'}
                    </Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  flex: 0.9,
                  backgroundColor: 'white',
                  marginLeft: 10,
                  marginRight: 10,
                  borderRadius: 20,
                  overflow: 'hidden',
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
                    <Text>Loading..</Text>
                  </View>
                ) : this.state.liverecording ? (
                  <WebView
                    androidLayerType="hardware"
                    source={{
                      uri: this.state.liverecording,
                    }}
                    style={{ marginTop: 20, overfloe: 'hidden', minHeight: 1 }}
                  />
                ) : (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text>No Recording</Text>
                  </View>
                )}
              </View>
            </View>
          </ImageBackground>
        </>
      </SafeAreaView>
    );
  }
}

export default ViewLiveClass;
