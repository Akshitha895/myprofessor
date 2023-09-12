import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import React, { Component } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Drawer from 'react-native-drawer';
import { Actions } from 'react-native-router-flux';
import Footer from '../../components/Footer';
import SideMenu from '../../components/SideMenu';
import { colors } from '../../constants';

import { baseUrl } from '../../constants';
import styles from './styles';
class LiveClassList extends Component {
  constructor(props) {
    super(props);
    this.getData = this.getData.bind(this);
    this.state = {
      spinner: true,
      liveclassesdata: [],
      token: '',
    };
  }
  componentDidMount() {
    // setTimeout(() => {
    // 	this.setState({loader: false});
    this.getData();
    //}, 2000)
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
            () => this.getTopics()
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
  getTopics() {
    fetch(baseUrl + '/live-class/student?chapter_id=', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: this.state.token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.data) {
          if (json.data.data.length > 0) {
            console.log('liveeee...dddddddd', json.data.data);
            this.setState({
              liveclassesdata: json.data.data,
              spinner: false,
            });
          } else {
            this.setState({
              liveclassesdata: [],
              loading: false,
              spinner: false,
            });
          }
        } else {
          this.setState({
            liveclassesdata: [],
            loading: false,
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
  onLiveItem(item) {
    //	alert("dataa"+JSON.stringify(item.chapter_id))
    var newarray = [
      '#6a5177',
      '#d88212',
      '#277292',
      '#a3ba6d',
      '#deb026',
      '#c44921',
    ];
    var newitem = newarray[Math.floor(Math.random() * newarray.length)];
    var url = baseUrl + '/chapter/' + item.chapter_id;

    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: this.state.token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        console.log('chapter....', JSON.stringify(json));
        if (json.data) {
          // alert("chapter...."+JSON.stringify(json.data))
          console.log('livesession', json.data);
          json.data.chapter['color'] = newitem;

          Actions.push('topics', {
            data: json.data.chapter,
            subjectData: json.data.chapter.subject,
            screen: 'classlist',
          });
        } else {
        }
      })
      .catch((error) => console.error('errrrrrrorrr' + error));
  }

  renderItem({ item }) {
    console.log('reneritem', item);
    var date = moment(new Date(item.date)).format('MM/DD');
    var day = moment(new Date(item.date)).format('ddd');
    var colorsarray = [
      '#6a5177',
      '#d88212',
      '#277292',
      '#a3ba6d',
      '#deb026',
      '#c44921',
    ];
    var randomItem =
      colorsarray[Math.floor(Math.random() * colorsarray.length)];
    var bgimage = randomItem;
    return (
      <TouchableOpacity
        onPress={this.onLiveItem.bind(this, item)}
        style={{
          overflow: 'hidden',
          flexDirection: 'row',
          margin: 10,
          justifyContent: 'space-between',
          backgroundColor: 'transparent',
          paddingVertical: 5,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            borderColor: 'lightgrey',
            borderWidth: 1,
          }}
        >
          <View
            style={{
              flex: 0.3,
              backgroundColor: 'transparent',
              justifyContent: 'center',
            }}
          >
            <View
              style={{
                width: 80,
                height: 60,
                backgroundColor: randomItem,
                justifyContent: 'center',
                alignItems: 'center',
                opacity: 0.1,
              }}
            />
            <View
              style={{
                position: 'absolute',
                width: 80,
                height: 60,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: randomItem }}>{day}</Text>
              <Text style={{ color: randomItem }}>{date}</Text>
            </View>
          </View>
          <View style={{ flex: 0.45, justifyContent: 'center' }}>
            <Text style={{ fontSize: 15 }}>{item.name}</Text>
            <Text style={{ fontSize: 10 }}>{item.description}</Text>
          </View>
          <View
            style={{
              flex: 0.25,
              justifyContent: 'center',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Image
              source={require('../../assets/images/dashboard/new/clockliveicon.png')}
              style={{ width: 10, height: 10, alignSelf: 'center' }}
            />
            <Text style={{ fontSize: 10, marginLeft: 5 }}>
              {item.form_time}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.mainview}>
            <Drawer
              type="overlay"
              ref={(ref) => (this._drawer = ref)}
              tapToClose
              openDrawerOffset={100}
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
                              width: 21,
                              height: 15,
                              color: colors.Themecolor,
                            }}
                          />
                        </TouchableOpacity>
                        <Text
                          style={{
                            marginLeft: 20,
                            color: colors.Themecolor,
                            fontSize: 20,
                          }}
                        >
                          Live Classes
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
                          <Text>Loading.....</Text>
                        </View>
                      ) : this.state.liveclassesdata.length > 0 ? (
                        <FlatList
                          data={this.state.liveclassesdata}
                          renderItem={this.renderItem.bind(this)}
                        />
                      ) : null}
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
        </SafeAreaView>
      </>
    );
  }
}
export default LiveClassList;
