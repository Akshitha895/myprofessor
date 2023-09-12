import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DeviceConstants from 'react-native-device-constants';
import * as Progress from 'react-native-progress';
import { Actions } from 'react-native-router-flux';
import { baseUrl, imageUrl } from '../../constants';
import StringsOfLanguages from './../../StringsOfLanguages';
import styles from './styles';

const windowWidth = Dimensions.get('window').width;

var headfont = 16,
  headsubtext = 14,
  boxheight = 155,
  innerbox = 145,
  progressbar = 5;
var imagesarray = [
  require('../../assets/images/dashboard/new/bluebg_new.png'),
  require('../../assets/images/dashboard/new/orangebg_new.png'),
  require('../../assets/images/dashboard/new/purplebg_new.png'),
  require('../../assets/images/dashboard/new/greenbg_new.png'),
];
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
    this.updateAnalytics();
    Actions.push('chapters', { data: item });
  }
  componentDidMount() {
    const isTablet = DeviceConstants.isTablet; // false
    //var height = 100, innerwidth = 32 , innerheight = 31, innersize = 10;
    if (isTablet) {
      headfont = 25;
      headsubtext = 20;
    }
    this.getData();
  }
  updateAnalytics() {
    //alert(this.state.analyticsData.reference_id)
    var url = baseUrl + '/analytics/' + this.state.analyticsData.reference_id;
    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        token: this.state.token,
      },
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
          // 	text: "Analytics Updated succesfully",
          // 	duration: Snackbar.LENGTH_SHORT,
          //   });
        } else {
          console.log(JSON.stringify(json.message));
        }
      })
      .catch((error) => console.error(error));
  }
  getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@user');
      //  alert(JSON.stringify(value))
      if (value !== null) {
        var data = JSON.parse(value);
        const token = await AsyncStorage.getItem('@access_token');
        if (token) {
          this.setState({
            token: JSON.parse(token),
          });
          this.getSubjects(data, JSON.parse(token));
          this.getanalytics(data, JSON.parse(token));
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
    //grade?offset=0&limit=10&order_by=name&sort_order=DESC&board=1a060a8b-2e02-4bdf-8b70-041070f3747c&branch=-1
    var url = baseUrl + '/student/subjects/' + user.reference_id;
    console.log('value', url);
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: toekn,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        console.log('ggggg', json);
        if (json.statusCode === '401') {
          Alert.alert('My Professor', json.error);
          this.setState({
            spinner: false,
            subjectsData: [],
          });
        } else {
          if (json.data) {
            const data = json.data;
            if (data.subjects) {
              this.setState({
                spinner: false,
                subjectsData: data.subjects,
              });
            } else {
              this.setState({
                spinner: false,
                subjectsData: [],
              });
            }
            //  AsyncStorage.setItem('@access-token', data.access_token)
            //  Actions.push('dashboard')
          } else {
            // alert("fffff"+JSON.stringify(json.message))
            this.setState({
              spinner: false,
              subjectsData: [],
            });
          }
        }
      })
      .catch((error) => console.error(error));
    //Actions.push('boards')
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
    const isTablet = DeviceConstants.isTablet; // false
    var innerimageview = 70,
      innerimage = 60,
      noimage = 80,
      innerradius = 35,
      innertextsize = 15,
      innerbottomtext = 10,
      innerbottomnum = 12,
      innericon = 15,
      boxwidth = windowWidth / 1.7;
    console.log('jnjj', isTablet);
    if (isTablet) {
      //headfont = 25;
      //headsubtext = 20;
      boxheight = 225;
      innerbox = 215;
      innerimageview = 100;
      innerimage = 90;
      noimage = 110;
      innerradius = 50;
      innertextsize = 25;
      innerbottomtext = 18;
      innerbottomnum = 18;
      innericon = 20;
      boxwidth = windowWidth / 2;
    }
    console.log('itemmmm.....m', item);
    var colorsarray = imagesarray; //["#6a5177","#d88212","#277292","#a3ba6d","#deb026","#c44921"];
    var randomItem =
      colorsarray[Math.floor(Math.random() * colorsarray.length)];
    var bgimage = randomItem;
    // var unique = true;
    // bgimage = colorsarray[Math.floor(Math.random()*colorsarray.length)];
    // var newitem = colorsarray.splice(bgimage,1);
    // colorsarray.push(newitem);
    const url = imageUrl + item.image;
    var progress = 0 + 0.4 * Math.random();
    var percent = item.percent;
    var color;
    var bgcolor;
    if (percent > 50) {
      color = 'green';
    } else if (color < 50) {
      color = 'red';
    } else {
      color = 'orange';
    }
    var newarray = [
      '#6a5177',
      '#d88212',
      '#277292',
      '#a3ba6d',
      '#deb026',
      '#c44921',
    ];
    var newitem = newarray[index]; //newarray[Math.floor(Math.random()*newarray.length)];
    if (item.color) {
      bgcolor = item.color;
    } else {
      item['color'] = newitem;
      bgcolor = newitem;
    }

    return (
      <TouchableOpacity
        onPress={this.onChapter.bind(this, item)}
        underlayColor="transparent"
        activeOpacity={0.9}
        style={{
          marginHorizontal: 10,
          height: boxheight,
          width: boxwidth,
          borderWidth: 0.1,
          borderColor: 'red',
          overflow: 'hidden',
          borderRadius: 10,
          alignSelf: 'center',
          marginTop: 10,
        }}
      >
        <ImageBackground
          source={require('../../assets/images/dashboard/new/chapters_bg.png')}
          style={{
            width: boxwidth,
            height: innerbox,
            alignSelf: 'center',
            backgroundColor: bgcolor,
          }}
          opacity={0.5}
        >
          <View style={{ flex: 1 }}>
            <View style={{ flex: 0.6 }}>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <View
                  style={{
                    flex: 0.4,
                    paddingLeft: 20,
                    justifyContent: 'center',
                  }}
                >
                  <View
                    style={{
                      width: innerimageview,
                      height: innerimageview,
                      borderRadius: innerimageview / 2,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    {item.image ? (
                      <Image
                        source={{ uri: url }}
                        style={{
                          width: innerimage,
                          height: innerimage,
                          resizeMode: 'cover',
                          borderRadius: innerimage / 2,
                        }}
                      />
                    ) : (
                      <Image
                        source={require('../../assets/images/noimage.png')}
                        style={{
                          width: noimage,
                          height: noimage,
                          resizeMode: 'contain',
                        }}
                      />
                    )}
                  </View>
                </View>
                <View
                  style={{
                    flex: 0.6,
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                  }}
                >
                  <Text
                    style={{
                      color: 'white',
                      fontSize: innertextsize,
                      fontWeight: 'bold',
                      paddingLeft: 20,
                    }}
                  >
                    {item.name}
                  </Text>
                </View>
              </View>
            </View>

            <View
              style={{
                flex: 0.4,
                flexDirection: 'row',
                justifyContent: 'space-around',
              }}
            >
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <View style={styles.innercountview}>
                  <Image
                    source={require('../../assets/images/1.png')}
                    style={{
                      width: innericon,
                      height: innericon,
                      tintColor: 'white',
                    }}
                  />
                  <Text style={[styles.icontext, { fontSize: innerbottomnum }]}>
                    {item.chaptersCount}
                  </Text>
                </View>
                <Text style={{ color: 'white', fontSize: innerbottomtext }}>
                  Chapters
                </Text>
              </View>
              {/* <View style={styles.innercountview}>
									  <Image source={require('../../assets/images/magnifier.png')} style={styles.iconview} />
								  </View> */}
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <View style={styles.innercountview}>
                  <Image
                    source={require('../../assets/images/2.png')}
                    style={{
                      width: innericon,
                      height: innericon,
                      tintColor: 'white',
                    }}
                  />
                  <Text style={[styles.icontext, { fontSize: innerbottomnum }]}>
                    {item.topicsCount}
                  </Text>
                </View>
                <Text style={{ color: 'white', fontSize: innerbottomtext }}>
                  Topics
                </Text>
              </View>
            </View>
          </View>
        </ImageBackground>
        <Progress.Bar
          progress={percent / 100}
          width={boxwidth}
          height={progressbar}
          color={color}
          unfilledColor={'lightgrey'}
          borderColor={'transparent'}
        />
      </TouchableOpacity>
    );
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
              marginLeft: 15,
              fontSize: headfont,
              color: '#656565',
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
                color: '#656565',
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
