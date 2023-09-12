import React, { Component } from 'react';
import {
  BackHandler,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DeviceConstants from 'react-native-device-constants';
import { Actions } from 'react-native-router-flux';
import Toast from 'react-native-simple-toast';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Drawer from 'react-native-drawer';
import Footer from '../../components/Footer';
import SideMenu from '../../components/SideMenu';
import { colors } from '../../constants';

import { baseUrl } from '../../constants';
import styles from './styles';
const windowWidth = Dimensions.get('window').width;

class RecommededTopicsMain extends Component {
  constructor(props) {
    super(props);
    this.getData = this.getData.bind(this);
    this.state = {
      spinner: true,
      topicsData: [],
      token: '',
    };
  }
  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction
    );

    this.getData();
    //}, 2000)
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
    console.log('smdnsjknkjsndklsndkl', item);
    Actions.push('topicmainview', { from: 'recommended', data: item });
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
        if (json.data) {
          this.setState({
            topicsData: json.data,
            spinner: false,
          });
        } else {
          //alert("ffff"+JSON.stringify(json.message))
          Toast.show(json.message, Toast.LONG);
          this.setState({
            topicsData: [],
            spinner: false,
          });
        }
      })
      .catch((error) => console.error(error));
  }
  closeControlPanel = () => {
    this._drawer.close();
  };
  openControlPanel = () => {
    this._drawer.open();
  };
  onBack() {
    Actions.dashboard({ type: 'reset' });
  }
  onChapter(item) {
    //this.updateAnalytics()
    Actions.push('chapters', { data: item });
  }

  renderItem({ item }) {
    console.log('dfkjdkldf', item);
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
      const isTablet = DeviceConstants.isTablet; // false
      var itemheight = 80,
        hedfont = 15;
      if (isTablet) {
        (itemheight = 150), (hedfont = 25);
      }

      return (
        <TouchableOpacity
          onPress={this.onMainTopic.bind(this, item)}
          style={{
            backgroundColor: 'white',
            width: windowWidth / 1.1,
            margin: 10,
            alignSelf: 'center',
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 1,
            shadowRadius: 5,
            elevation: 10,
            borderRadius: 10,
            height: itemheight,
          }}
        >
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ flex: 0.2 }}>
              {item.image ? (
                <Image
                  source={{ uri: item.image }}
                  style={{ width: '100%', height: '100%' }}
                />
              ) : (
                <Image
                  source={require('../../assets/images/noimage.png')}
                  style={{
                    width: '100%',
                    height: '100%',
                    resizeMode: 'contain',
                  }}
                />
              )}
            </View>
            <View
              style={{
                flex: 0.8,
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingLeft: 10,
              }}
            >
              <View style={{ flex: 1, justifyContent: 'space-evenly' }}>
                <Text style={{ fontSize: hedfont }}>{item.topicName}</Text>

                {/* <Text style={{ fontSize: 10, color: 'grey' }}>In Progress</Text> */}

                {/* <View style={{ flexDirection: "row", justifyContent: "space-between", paddingTop: 5, paddingBottom: 5 }}>
                                    <Text>Progress</Text>
                                    <Text>{(item.progress)}%</Text>
                                </View> */}
                {/* <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",}}>
                                <Progress.Bar progress={item.progress / 100} width={windowWidth / 1.8} height={2} color={color} />
                                <Text style={{marginRight:10,fontSize:12}}>{Math.round(item.progress)}%</Text>
                                </View> */}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    } else {
      return null;
    }
  }

  render() {
    const isTablet = DeviceConstants.isTablet; // false
    var headfont = 20,
      backarrowheight = 15,
      backarrowwidth = 21,
      progresswidth = 100;
    if (isTablet) {
      headfont = 30;
      backarrowheight = 20;
      (backarrowwidth = 26), (progresswidth = 700);
    }
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <>
          {/* <ImageBackground source={require('../../assets/images/Mobile_bg_2.png')}
			style={{width:"100%",height:"100%",opacity:0.4}}/>
			<View style={{width:"100%",height:"100%",position:"absolute"}}> */}
          <View style={styles.mainview}>
            <Drawer
              type="overlay"
              ref={(ref) => (this._drawer = ref)}
              tapToClose
              openDrawerOffset={progresswidth}
              content={<SideMenu closeControlPanel={this.closeControlPanel} />}
            >
              <View style={{ width: '100%', height: '100%' }}>
                <View style={{ flex: 1 }}>
                  <View style={{ flex: 1 }}>
                    <View
                      style={{
                        flex: 0.15,
                        justifyContent: 'center',
                        flexDirection: 'row',
                      }}
                    >
                      <View
                        style={{
                          flex: 0.7,
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginLeft: 20,
                        }}
                      >
                        <TouchableOpacity onPress={this.onBack.bind(this)}>
                          <Image
                            source={require('../../assets/images/refer/back.png')}
                            style={{
                              width: backarrowwidth,
                              height: backarrowheight,
                              tintColor: colors.Themecolor,
                            }}
                          />
                        </TouchableOpacity>
                        <Text
                          style={{
                            marginLeft: 20,
                            color: colors.Themecolor,
                            fontSize: headfont,
                          }}
                        >
                          Recommended Topics
                        </Text>
                      </View>
                      <View style={{ flex: 0.3 }}>
                        <Image
                          source={require('../../assets/images/dashboard/new/subjabs.png')}
                          style={{
                            width: '100%',
                            height: '120%',
                            resizeMode: 'cover',
                          }}
                        />
                      </View>
                    </View>
                    {/* <View style={{flex:0.2,alignItems:"flex-end",justifyContent:"flex-start",}}>
					<Image source={require('../../assets/images/practiceabs.png')}
					style={{width:339/2,height:242/2}}/>
					<View style={{position: 'absolute' ,flex:1,height:"100%",width:"100%" ,justifyContent: 'space-evenly',}}>
					{/* <Image source={require('../../assets/images/logo_icon.png')}
					style={{width:70,height:70,marginLeft: 20}}/> */}
                    {/* <View style={{marginLeft:20}}>
                    <TouchableOpacity onPress={this.onBack.bind(this)}>
                                    <Image source={require('../../assets/images/refer/back.png')} style={styles.backIcon} />
                     </TouchableOpacity>
                     
                    </View>
                    <Text style={{marginLeft:20,color:colors.Themecolor,fontSize:20}}>My Topics In Progress</Text>
					</View> 
				</View> */}
                    <View style={{ flex: 0.85, marginHorizontal: 0 }}>
                      {this.state.spinner ? (
                        <View
                          style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <Text style={{ fontSize: headfont }}>
                            Loading.....
                          </Text>
                        </View>
                      ) : this.state.topicsData.length > 0 ? (
                        <FlatList
                          data={this.state.topicsData}
                          renderItem={this.renderItem.bind(this)}
                        />
                      ) : (
                        <View
                          style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <Text>No Topics</Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <View style={styles.footerview}>
                    <Footer openControlPanel={this.openControlPanel} />
                  </View>
                </View>
              </View>
            </Drawer>
          </View>
          {/* </View> */}
        </>
      </SafeAreaView>
    );
  }
}
export default RecommededTopicsMain;
