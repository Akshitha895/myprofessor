import React, { Component } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { _ } from 'lodash';
import DeviceConstants from 'react-native-device-constants';
import RNPickerSelect from 'react-native-picker-select';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Actions } from 'react-native-router-flux';
import { baseUrl, colors } from '../../constants';
import ProgressItem from '../ProgressItem';

const windowWidth = Dimensions.get('window').width;

var performacelist = [
  { value: 'performance', label: 'Performance' },
  { value: 'progress', label: 'Progress' },
];
class HeatMapComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subjectvalue: '',
      token: '',
      loading: true,
      Studentknowledgemapdata: [],
      ppkey: performacelist[0].value,
      subjectsflist: [],
      selectedsubid: '',
      performanceType: performacelist[0],
      studentHeatMapData: [],
      spinner: false,
      userdata: {},
      knowledgedata: [],
      chaptersData: [],
      validpackages: {},
    };
  }
  componentDidMount() {
    this.getData();
    console.log('ncjsjkc', this.props.data, this.props.fromscreen);
  }
  getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@user');
      //  alert(JSON.stringify(value))
      if (value !== null) {
        var data = JSON.parse(value);
        // console.log("subjectass", data)
        const token = await AsyncStorage.getItem('@access_token');
        if (token) {
          this.setState({
            token: JSON.parse(token),
            userdata: data,
          });
          this.getSubjectsList();
          this.validatepackages(data);
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
    console.log('userIduserIduserIduserIduserId', this.state.token);
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
        console.log('chaptervalidate', json);
        if (json.data) {
          console.log('validpackages', json.data);
          this.setState({ validpackages: json.data });
        } else {
          console.log(JSON.stringify(json.message));
        }
      })
      .catch((error) => console.error(error));
  }
  getSubjectsList() {
    var userId = this.state.userdata.userInfo.userId;

    //grade?offset=0&limit=10&order_by=name&sort_order=DESC&board=1a060a8b-2e02-4bdf-8b70-041070f3747c&branch=-1
    var url = baseUrl + `/analytics/users/${userId}/assessment/subjects`;
    var body = {
      universityId: this.state.userdata.userOrg.universityId,
      branchId: this.state.userdata.userOrg.branchId,
      semesterId: this.state.userdata.userOrg.semesterId,
    };
    // baseUrl+'/boards/'+board_id+'/grades/'+grade_id+'/subjects'
    console.log('zxcZCZXcvxzczxczx', url, this.state.userdata);
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        jwt: this.state.token,
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log('smakdnkjndkjnk', json);
        if (json) {
          if (json.code === 201) {
            if (json.data?.items.length > 0) {
              let subjects = json.data?.items;
              let subjectsList = subjects?.map((sub) => {
                return { label: sub.name, value: sub.name, id: sub.subjectId };
              });
              console.log('dmfnkdf', this.props.fromscreen);
              if (this.props.fromscreen === 'topics') {
                if (this.props.data) {
                  console.log('zdknfkldnfjkld', this.props.data);
                  this.setState(
                    {
                      subjectslist: subjectsList,
                      loading: false,
                      subjectvalue: this.props.data.subjectName,
                      selectedsubid: this.props.data.subjectId,
                    },
                    () => {
                      this.getchapters();
                      this.getheatmapdata();
                      //   this.getStudentsheatmap()
                    }
                  );
                } else {
                  this.setState(
                    {
                      subjectslist: subjectsList,
                      loading: false,
                      subjectvalue: subjectsList[0].label,
                      selectedsubid: subjectsList[0].id,
                    },
                    () => {
                      this.getchapters();
                      this.getheatmapdata();
                      //   this.getStudentsheatmap()
                    }
                  );
                }
              } else {
                this.setState(
                  {
                    subjectslist: subjectsList,
                    loading: false,
                    subjectvalue: subjectsList[0].label,
                    selectedsubid: subjectsList[0].id,
                  },
                  () => {
                    this.getchapters();
                    this.getheatmapdata();
                    //   this.getStudentsheatmap()
                  }
                );
              }
            }
          } else if (json.error?.code === 400) {
            //alert("dknkdf")
            Alert.alert('My Professor', json.error.message, [
              { text: 'OK', onPress: () => this.logout() },
            ]);
          }
        } else {
          console.log('dadaada', JSON.stringify(json.message));
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
  getchapters() {
    var user = this.state.userdata;
    var toekn = this.state.token;
    var board_id = user.userOrg.boardId;
    var grade_id = user.userOrg.gradeId;
    var subject_id = this.state.selectedsubid;
    var userId = user.userInfo.userId;

    var url = baseUrl + `/analytics/users/${userId}/chapters`;

    console.log(
      'sacmklsncklncklxnckncvkl',
      board_id,
      '   ',
      grade_id,
      'subject_id',
      subject_id
    );
    const body = {
      universityId: user.userOrg.universityId,
      branchId: user.userOrg.branchId,
      semesterId: user.userOrg.semesterId,
      subjectId: subject_id,
      offset: 0,
      limit: 10000,
    };

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        jwt: toekn,
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log('knckvk', json);
        if (json.code === 201) {
          if (json.data.items) {
            console.log('chaptersssss', json);
            this.setState({
              spinner: false,
              chaptersData: json.data.items,
            });
          } else {
            this.setState({
              spinner: false,
              chaptersData: [],
            });
          }
          //  AsyncStorage.setItem('@access-token', data.access_token)
          //  Actions.push('dashboard')
        } else {
          alert(JSON.stringify(json.error.message));
          this.setState({
            spinner: false,
            chaptersData: [],
          });
        }
      })
      .catch((error) => console.error(error));
    //Actions.push('boards')
  }
  getheatmapdata() {
    var userId = this.state.userdata.userInfo.userId;

    var subjectId = this.state.selectedsubid;
    var url = baseUrl + `/subjects/${subjectId}/knowledge-map?userId=${userId}`;

    console.log('dsvlkds', url);
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        jwt: this.state.token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        console.log('djfjkdhfkjdhfjkhdfgjk', JSON.stringify(json));

        if (json) {
          console.log('knowledge', JSON.stringify(json));

          if (json.data) {
            this.setState(
              {
                knowledgedata: json.data,
              },
              () => this.getStudentsheatmap()
            );
          } else {
            this.setState({
              knowledgedata: [],
            });
          }
        } else {
          console.log('dadaada', JSON.stringify(json.message));
        }
      })
      .catch((error) => console.error(error));
  }
  getStudentsheatmap() {
    this.setState({ spinner: true });

    var subjectId = this.state.selectedsubid;
    var url = baseUrl + `/subjects/${subjectId}/topics`;
    console.log('dsvlkds', url);
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        jwt: this.state.token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        if (json) {
          console.log('json.sstata', JSON.stringify(json.data));

          if (json.data) {
            if (json.data.length > 0) {
              // console.log("dnckdcjkdsa",this.state.knowledgedata)
              var mappingKnowledgeMapData = json.data.map((st) => {
                // console.log("dmckamck",st.topicId,this.state.knowledgedata)
                var progressTopicInfo = this.state.knowledgedata?.find(
                  (topic) => topic.topicId === st.topicId
                );
                console.log('progressTopicInfo', progressTopicInfo);
                console.log(
                  ' progressTopicInfo?.score ',
                  progressTopicInfo?.score
                );

                var testScore =
                  progressTopicInfo?.score === 0
                    ? 0
                    : !progressTopicInfo?.score
                    ? -1
                    : progressTopicInfo?.score;
                return { ...st, score: testScore };
              });
              //  console.log("dlkanfkdnf", mappingKnowledgeMapData)
              var sortOrderKnowledgeMapData = _.orderBy(
                mappingKnowledgeMapData,
                ['score'],
                ['desc']
              );
              //  console.log("dlmckladscklds", sortOrderKnowledgeMapData)
              this.setState({
                Studentknowledgemapdata: sortOrderKnowledgeMapData,
                studentHeatMapData: json.data,
                spinner: false,
              });
            } else {
              this.setState({
                studentHeatMapData: [],
                spinner: false,
              });
            }
          } else {
            console.log('dadaada', JSON.stringify(json.message));
          }
        }
      })
      .catch((error) => console.error(error));
  }
  onsubjectclick(value, index) {
    console.log('dafdafdafdaFDFDFD', value, this.state.subjectslist[index - 1]);
    if (this.state.subjectslist[index - 1]) {
      this.setState(
        {
          subjectvalue: value,
          selectedsubid: this.state.subjectslist[index - 1].id,
        },
        () => {
          this.getchapters();
          this.getStudentsheatmap();
          this.getheatmapdata();
        }
      );
    }
  }
  onperformacykey(value, index) {
    console.log('val', value, this.state.subjectslist[index - 1]);
    this.setState(
      {
        ppkey: value,
        performanceType: performacelist[index - 1],
      },
      () => {
        this.getStudentsheatmap();
        this.getheatmapdata();
      }
    );
  }
  ontopic(item) {
    console.log('dfdfdsfdsfdsfdsfdsf', item);
    var user = this.state.userdata;
    var validpackages = this.state.validpackages;
    console.log('d,fmdmf', user?.role?.roleName);
    const isSubscribed =
      user?.role?.roleName === 'General Student' &&
      validpackages &&
      validpackages.subscriptionStatus === 'active'
        ? true
        : false;

    console.log('thiisSubscribed', isSubscribed);
    if (item.chapterId === this.state.chaptersData?.[0]?.chapterId) {
      this.navigatetopage(item);
    } else if (isSubscribed || user?.role?.roleName === 'Student') {
      this.navigatetopage(item);
    } else {
      Alert.alert(
        'My Professor',
        'You are not subscribed to view this chapter, Do you want to subscribe?',
        [
          {
            text: 'No',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: () => {
              Actions.push('buypackages', { from: 'heatmap' });
            },
          },
        ]
      );
    }
  }
  navigatetopage(item) {
    var userdata = this.state.userdata;
    var subjectId = item.subjectId;
    var chapterId = item.chapterId;
    var topicId = item.topicId;

    var url =
      baseUrl +
      `/universities/${userdata.userOrg.universityId}/branches/${userdata.userOrg.branchId}/semesters/${userdata.userOrg.semesterId}/subjects/${subjectId}/chapters/${chapterId}/topics/${topicId}`;
    console.log('dckkd', url);
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        jwt: this.state.token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        if (json) {
          console.log('dafdfadfadfdsf;sd', json);
          if (json.data) {
            item['image'] = json.data.image;
          }
        }
      })
      .catch((error) => console.error(error));
    Actions.push('topicmainview', { from: 'heatmap', data: item });
  }

  render() {
    const isTablet = DeviceConstants.isTablet;
    var pickerheigjt = 50,
      arrowwidth = 20;
    if (isTablet) {
      (pickerheigjt = 70), (arrowwidth = 30);
    }
    return (
      <View style={{ flex: 1 }}>
        {this.state.loading ? null : (
          <View
            style={{
              height: pickerheigjt,
              width: windowWidth / 1.1,
              marginTop: 10,
              borderColor: colors.Themecolor,
              flexDirection: 'row',
              paddingLeft: 8,
              backgroundColor: colors.Themecolor,
              borderWidth: 1,
              marginLeft: 20,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <RNPickerSelect
              placeholder={{
                label: 'Select an Item',
                value: 'Select an Item',
                id: 'select',
              }}
              value={this.state.subjectvalue}
              style={pickerSelectStyles}
              useNativeAndroidPickerStyle={false}
              onValueChange={this.onsubjectclick.bind(this)}
              items={this.state.subjectslist}
            />
            <Image
              source={require('../../assets/images/downarrow.png')}
              style={{
                position: 'absolute',
                width: arrowwidth,
                height: arrowwidth,
                tintColor: 'white',
                right: 10,
              }}
            />
          </View>
        )}

        <ScrollView>
          <View
            style={{
              flex: 1,
              marginTop: 10,
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}
          >
            {this.state.Studentknowledgemapdata &&
              this.state.Studentknowledgemapdata.map((item) => {
                return (
                  <>
                    <TouchableOpacity onPress={this.ontopic.bind(this, item)}>
                      <ProgressItem
                        name={item.topicName ? item.topicName : 'Test User'}
                        score={item?.score ? item?.score : 0}
                        performedTests={item.score > -1 ? 1 : 0}
                      />
                    </TouchableOpacity>
                  </>
                );
              })}
          </View>
          {this.state.studentHeatMapData.length > 0 ? (
            <View
              style={{
                flex: 1,
                marginTop: 10,
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              <View
                style={{
                  padding: 5,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <View
                  style={{ height: 10, width: 10, backgroundColor: 'grey' }}
                />
                <Text style={{ color: 'black', marginLeft: 5 }}>
                  Not Started
                </Text>
              </View>
              <View
                style={{
                  padding: 5,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <View
                  style={{ height: 10, width: 10, backgroundColor: '#c44921' }}
                />
                <Text style={{ color: 'black', marginLeft: 5 }}>
                  Score 0%-40%
                </Text>
              </View>
              <View
                style={{
                  padding: 5,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <View
                  style={{ height: 10, width: 10, backgroundColor: '#d88414' }}
                />
                <Text style={{ color: 'black', marginLeft: 5 }}>
                  Score 40%-60%
                </Text>
              </View>
              <View
                style={{
                  padding: 5,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <View
                  style={{ height: 10, width: 10, backgroundColor: '#a3ba6d' }}
                />
                <Text style={{ color: 'black', marginLeft: 5 }}>
                  Score 60%-80%
                </Text>
              </View>
              <View
                style={{
                  padding: 5,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <View
                  style={{ height: 10, width: 10, backgroundColor: '#016313' }}
                />
                <Text style={{ color: 'black', marginLeft: 5 }}>
                  Score above 80%
                </Text>
              </View>
            </View>
          ) : null}
        </ScrollView>
      </View>
    );
  }
}
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: DeviceConstants.isTablet ? 30 : 20,
    borderWidth: 1,
    width: windowWidth / 1.1,
    borderColor: 'transparent',
    borderRadius: 8,
    color: 'white',
    marginTop: 10,
    // marginBottom:10,
    paddingRight: 10, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: DeviceConstants.isTablet ? 26 : 16,
    borderWidth: 1,
    borderWidth: 0.5,
    width: windowWidth / 1.1,

    borderColor: 'transparent',
    borderRadius: 8,
    marginTop: 10,
    color: 'white',
    // marginBottom:10,
    paddingRight: 10, // to ensure the text is never behind the icon
  },
});
export default HeatMapComponent;
