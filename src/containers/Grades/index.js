import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  FlatList,
  Image,
  ImageBackground,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import { baseUrl, imageUrl } from '../../constants';
import styles from './styles';

class Grades extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gradesData: null,
      spinner: true,
      token: '',
      loading: false,
      userData: null,
    };
  }
  async componentDidMount() {
    const value = await AsyncStorage.getItem('@user');
    //  alert(JSON.stringify(value))
    if (value !== null) {
      this.setState({
        userData: JSON.parse(value),
      });
    }
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction
    );

    this.getGrades(this.props.data);
  }

  backAction = () => {
    // this.props.navigation.goBack(null);
    // this.onBack()
    return true;
    // Actions.topicmainview({from:this.props.from,type:"reset",data:this.props.topicindata,topicsdata:this.props.topicData,screen:"summary",subjectData:this.props.subjectData})
  };
  componentWillUnmount() {
    this.backHandler.remove();
  }
  renderItem({ item }) {
    //alert(item.image)
    const url = imageUrl + item.image;
    return (
      <TouchableOpacity
        onPress={() => this.onItem(item)}
        style={styles.listsubview}
      >
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <View
            style={{
              flex: 0.6,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {item.image ? (
              <Image
                source={{ uri: item.image }}
                resizeMode={'cover'}
                style={{ width: 80, height: 80 }}
              />
            ) : (
              <Image
                source={require('./../../assets/images/logo_icon1.png')}
                resizeMode={'cover'}
                style={{ width: 80, height: 80 }}
              />
            )}
          </View>
          <View
            style={{
              flex: 0.4,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={styles.boardtext}>{item.name}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@user');
      //  alert(JSON.stringify(value))
      if (value !== null) {
        var data = JSON.parse(value);
        console.log('dataaa', data);
        this.setState({ userData: data });
      } else {
        //Actions.push('login')
      }
    } catch (e) {
      return null;
    }
  };
  onItem(item) {
    //Actions.push('dashboard')
    var branchdata = this.props.branchdata;
    var boarddata = this.props.boarddata;
    console.log('dfd', branchdata, boarddata);
    const body = {
      universityId: boarddata.id,
      branchId: branchdata.id,
      semesterId: item.id,
    };
    var userData = this.state.userData.id;

    console.log('sdsd', body);
    //console.log("userData.id",userData.id)
    this.setState({
      loading: true,
    });
    fetch(baseUrl + '/users/' + userData + '/account-setup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log('jsonjson', json);
        const data = json.data;
        if (json.data) {
          this.setState({
            loading: false,
          });
          console.log('updateeeee', data);
          AsyncStorage.removeItem('@user');
          AsyncStorage.removeItem('@access_token');
          Alert.alert('My Professor', 'Updated successfully', [
            {
              text: 'OK',
              onPress: () => {
                Actions.login({ type: 'reset' });
              },
            },
          ]);
        } else {
          this.setState({
            loading: false,
          });
          alert(JSON.stringify(json));
        }
      })
      .catch((error) => console.error(error));
  }

  getGrades(item) {
    var branchdata = this.props.branchdata;
    var boarddata = this.props.boarddata;
    var url =
      baseUrl +
      `/universities/${boarddata.id}/branches/${
        branchdata.id
      }/semesters?offset=${0}&limit=${10000}`;
    console.log('value', url);
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((json) => {
        const data = json.data;
        console.log('gradessss..........', data);
        if (data) {
          if (data.items) {
            console.log('boards', json.data.items);
            this.setState({
              spinner: false,
              gradesData: data.items,
            });
          } else {
            this.setState({
              spinner: false,
              gradesData: [],
            });
          }
        } else {
          alert(JSON.stringify(json));
          this.setState({
            spinner: false,
            gradesData: [],
          });
        }
      })
      .catch((error) => console.error(error));
    //Actions.push('boards')
  }
  render() {
    const { data } = this.props;
    return (
      <>
        <SafeAreaView style={{ flex: 1 }}>
          <ImageBackground
            style={styles.backimg}
            source={require('../../assets/images/backblue.png')}
          >
            <View style={styles.mainView}>
              <View style={styles.logoview}>
                <Image
                  source={require('../../assets/images/Grade_banner.png')}
                  resizeMode="cover"
                  style={styles.logo}
                />
              </View>
              <View style={styles.subview}>
                {this.state.spinner ? (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <ActivityIndicator color={'black'} />
                  </View>
                ) : this.state.gradesData &&
                  this.state.gradesData.length > 0 ? (
                  <FlatList
                    data={this.state.gradesData}
                    renderItem={this.renderItem.bind(this)}
                    numColumns={2}
                  />
                ) : (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text>No Data</Text>
                  </View>
                )}
              </View>
            </View>
          </ImageBackground>
          {this.state.loading ? (
            <View
              style={{
                position: 'absolute',
                backgroundColor: 'rgba(255,255,255,0.3)',
                justifyContent: 'center',
                height: '100%',
                width: '100%',
              }}
            >
              <ActivityIndicator color={'black'} />
            </View>
          ) : null}
        </SafeAreaView>
      </>
    );
  }
}
export default Grades;
