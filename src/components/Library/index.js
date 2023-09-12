import React, { Component } from 'react';
import { Dimensions, Image, TouchableOpacity, View } from 'react-native';
import DeviceConstants from 'react-native-device-constants';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Actions } from 'react-native-router-flux';
import moment from 'moment';
import { Text } from 'react-native';
import { ScrollView } from 'react-native';
import LearningComponent from '../../components/LearningComponent';
import LibraryComponent from '../../components/LibraryComponent/index';
import MyTopics from '../../components/MyTopics';
// import ReferEarn from '../../components/ReferEarn';
import RecommendedTopics from '../../components/RecommendedTopics';
// import MyProgress from '../../components/MyProgress';
// import MyPerformance from '../../components/MyPerformance';
import { baseUrl } from '../../constants';
import styles from './styles';

const windowWidth = Dimensions.get('window').width;

// const data = [
//   {
//     name: 'Title1',
//     day: 'Sun',
//     date: '17',
//     time: '08:00am',
//   },
//   {
//     name: 'Title1',
//     day: 'Mon',
//     date: '17',
//     time: '10:00am',
//   },
// ];
// const data1 = [
//   {
//     name: 'Title1',
//     day: 'Sun',
//     date: '17',
//     time: '08:00am',
//   },
//   {
//     name: 'Title1',
//     day: 'Mon',
//     date: '17',
//     time: '10:00am',
//   },
// ];
class Library extends Component {
  constructor(props) {
    super(props);
    this.state = {
      announcementsData: [],
      liveclassesdata: [],
      spinner: true,
      token: '',
    };
  }

  async componentDidMount() {
    const value = await AsyncStorage.getItem('@access_token');
    if (value !== null) {
      console.log('vv', value);
      this.setState({ token: JSON.parse(value) }, () => {
        this.getliveclasses();
        this.getAnnouncemnt();
      });
    }
    //	this.getAnnouncemnt()
  }
  getAnnouncemnt() {
    fetch(baseUrl + '/announcements/student/logs', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: this.state.token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        console.log('announcemnets....', json);

        if (json.data) {
          if (json.data.data.length > 0) {
            console.log('announcemnets', json.data);
            this.setState({
              announcementsData: json.data.data,
            });
          } else {
            this.setState({
              announcementsData: [],
              loading: false,
            });
          }
        } else {
          this.setState({
            announcementsData: [],
            loading: false,
          });
        }
      })
      .catch((error) => console.error(error));
  }
  getliveclasses() {
    fetch(baseUrl + '/live-class/student?chapter_id=&offset=0&limit=3', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: this.state.token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        console.log('live classes....', json);

        if (json.data) {
          if (json.data.data.length > 0) {
            console.log('liveeee...', json.data.data);
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

  renderItem({ item }) {
    // var date =  moment(new Date(item.from_date)).format('MM/DD')
    // var day  =moment(new Date(item.from_date)).format('ddd');
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
      <View
        style={{
          overflow: 'hidden',
          flexDirection: 'row',
          margin: 10,
          justifyContent: 'space-between',
          backgroundColor: 'transparent',
          paddingVertical: 5,
        }}
      >
        <View style={{ flex: 1, flexDirection: 'row' }}>
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
          <View style={{ flex: 0.7, justifyContent: 'flex-start' }}>
            <Text style={{ fontSize: 15 }}>{item.title}</Text>
            <Text style={{ fontSize: 10 }}>{item.description}</Text>
          </View>
          {/* <View style={{ flex: 0.25, justifyContent: "center" , flexDirection:"row",alignItems:"center"}}>
										<Image source={require('../../assets/images/dashboard/new/clockliveicon.png')} style={{width:10,height:10,alignSelf:"center"}}/>
										<Text style={{fontSize:10,marginLeft:5}}>{item.from_date}</Text>
									
									</View> */}
        </View>
      </View>
    );
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
            screen: 'dashboard',
          });
        } else {
        }
      })
      .catch((error) => console.error('errrrrrrorrr' + error));
  }

  renderItemLive({ item }) {
    const isTablet = DeviceConstants.isTablet; // false
    var colorboxwidth = 80,
      colorboxheight = 60,
      fontsize = 15,
      desfontsize = 13,
      timeimage = 10;
    if (isTablet) {
      colorboxwidth = 100;
      colorboxheight = 80;
      fontsize = 20;
      desfontsize = 18;
      timeimage = 15;
    }
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
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View
            style={{
              flex: 0.3,
              backgroundColor: 'transparent',
              justifyContent: 'center',
            }}
          >
            <View
              style={{
                width: colorboxwidth,
                height: colorboxheight,
                backgroundColor: randomItem,
                justifyContent: 'center',
                alignItems: 'center',
                opacity: 0.1,
              }}
            />
            <View
              style={{
                position: 'absolute',
                width: colorboxwidth,
                height: colorboxheight,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: randomItem, fontSize: fontsize }}>
                {day}
              </Text>
              <Text style={{ color: randomItem, fontSize: fontsize }}>
                {date}
              </Text>
            </View>
          </View>
          <View style={{ flex: 0.45, justifyContent: 'center' }}>
            <Text style={{ fontSize: fontsize }}>{item.name}</Text>
            <Text style={{ fontSize: desfontsize }}>{item.description}</Text>
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
              style={{
                width: timeimage,
                height: timeimage,
                alignSelf: 'center',
              }}
            />
            <Text style={{ fontSize: desfontsize, marginLeft: 5 }}>
              {item.form_time}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  onliveview() {
    Actions.push('liveclasslist');
  }
  onannounceview() {
    Actions.push('announcements', { title: 'tabs' });
  }

  render() {
    const isTablet = DeviceConstants.isTablet; // false
    var livemarginbox = 10,
      headfont = 16,
      headsubtext = 14,
      liveboxheight = 50;
    if (isTablet) {
      livemarginbox = 20;
      headfont = 25;
      liveboxheight = 70;
      headsubtext = 20;
    }
    return (
      <View style={styles.mainview}>
        <ScrollView>
          <View style={{ flex: 1, marginTop: 10 }}>
            <LibraryComponent />
            <View
              style={{
                height: 1,
                width: windowWidth / 1.1,
                backgroundColor: 'lightgrey',
                opacity: 0.8,
                marginVertical: 10,
                alignSelf: 'center',
              }}
            />
            <LearningComponent />

            <View
              style={{
                height: 1,
                width: windowWidth / 1.1,
                backgroundColor: 'lightgrey',
                opacity: 0.8,
                marginVertical: 10,
                alignSelf: 'center',
              }}
            />
            <MyTopics />

            <View
              style={{
                height: 1,
                width: windowWidth / 1.1,
                backgroundColor: 'lightgrey',
                opacity: 0.8,
                marginVertical: 10,
                alignSelf: 'center',
              }}
            />

            {/* <MyProgress /> */}

            {/* <MyPerformance /> */}

            {/* {this.state.announcementsData.length > 0 ? 
					<View style={{
						borderWidth: 0, borderColor: "lightgrey",
						 backgroundColor: 'white', marginHorizontal:10,marginBottom:20,
						 shadowColor: 'grey',
						 shadowOffset: { width: 0, height: 1 },
						 shadowOpacity: 1,
						 shadowRadius: 2,
						 elevation: 10,
					}}>
						<View style={{ flex: 1 }}>
						<LinearGradient colors={['#9863DF', '#9863DF']} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={{ flexDirection: "row", justifyContent: "space-between",backgroundColor:"red",height:50,alignItems:"center",paddingHorizontal:10 }}>
								<Text style={{color:"white",fontSize:16}}>{StringsOfLanguages.announcements}</Text>
								<TouchableOpacity onPress={this.onannounceview.bind(this)}>
								<Text style={{color:"white"}}>{StringsOfLanguages.seeall}</Text>
								</TouchableOpacity>
							</LinearGradient>
							

							<FlatList data={this.state.announcementsData} renderItem={this.renderItem.bind(this)}/>
						
						</View>
					</View> 	:null } */}
            {/* {this.state.liveclassesdata.length > 0 ? 
										<View style={{
						borderWidth: 0, borderColor: "lightgrey",
						 backgroundColor: 'white',marginBottom:20,marginHorizontal:livemarginbox,
						 shadowColor: 'grey',
						 shadowOffset: { width: 0, height: 1 },
						 shadowOpacity: 1,
						 shadowRadius: 2,
						 elevation: 10,
					}}>
						<View style={{ flex: 1 }}>
						<LinearGradient colors={['#deb026', '#deb026']} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={{ flexDirection: "row", justifyContent: "space-between",backgroundColor:"red",height:liveboxheight,alignItems:"center",paddingHorizontal:10 }}>
								<Text style={{color:"white",fontSize:headfont}}>{StringsOfLanguages.liveclasses}</Text>
								<TouchableOpacity onPress={this.onliveview.bind(this)}>
								<Text style={{color:"white",fontSize:  headsubtext}}>{StringsOfLanguages.seeall}</Text>
								</TouchableOpacity>
							</LinearGradient>
							
							<FlatList data={this.state.liveclassesdata} renderItem={this.renderItemLive.bind(this)}/>
							
						</View>
					</View>:
					null}		 */}
            <RecommendedTopics />
            {/* <LeaderBoardNew /> */}
            {/* <ReferEarn/> */}
            {/* <HeatMapdash/> */}
          </View>
        </ScrollView>
      </View>
    );
  }
}
export default Library;
