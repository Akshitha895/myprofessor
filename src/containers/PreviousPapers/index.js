import React, { Component } from 'react';
import {
  Alert,
  BackHandler,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import DeviceConstants from 'react-native-device-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Drawer from 'react-native-drawer';
import { Actions } from 'react-native-router-flux';
import Footer from '../../components/Footer';
import SideMenu from '../../components/SideMenu';
import { baseUrl, colors } from '../../constants';
import styles from './styles';
const windowWidth = Dimensions.get('window').width;

// const data = [
//   {
//     image: require('../../assets/images/jeepap.png'),
//     name: 'JEE MAINS',
//     color: '#c20678',
//     papers: [
//       {
//         name: 'Mathematics JEE Main 2020',
//       },
//       {
//         name: 'Mathematics JEE Main 2019',
//       },
//       {
//         name: 'Chemistry JEE Main 2018',
//       },
//       {
//         name: 'Biology JEE Main 2017',
//       },
//     ],
//   },
//   {
//     image: require('../../assets/images/jeeadv.png'),
//     name: 'JEE Advanced',
//     color: '#ff491a',
//     papers: [
//       {
//         name: 'Mathematics JEE Main 2020',
//       },
//     ],
//   },
//   {
//     image: require('../../assets/images/neetpap.png'),
//     name: 'NEET',
//     color: '#1575ef',
//     papers: [
//       {
//         name: 'Mathematics JEE Main 2020',
//       },
//     ],
//   },
//   {
//     image: require('../../assets/images/boardpap.png'),
//     name: 'CBSC Board Exams',
//     color: '#6845dd',
//     papers: [
//       {
//         name: 'Mathematics JEE Main 2020',
//       },
//     ],
//   },
// ];
class PreviousPapers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userDetails: '',
      token: '',
      papers: [],
      loading: true,
    };
  }
  componentDidMount() {
    //alert("nadlndkljf")
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      Actions.dashboard({ type: 'reset' });
      return true;
    });
    this.getData();
  }
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
              userDetails: data,
            },
            () => this.getPapers(data)
          );

          //this.getanalytics(data,JSON.parse(token))
        } else {
        }
      } else {
        console.log('errorr');
      }
    } catch (e) {
      return null;
    }
  };
  getPapers(data) {
    //Request URL: https://api.smartstepup.com/question-paper-mapping/question-paper-types/student?grade_id=CBSE_GR_10
    var userId = this.state.userDetails.userInfo.userId;
    var url = baseUrl + `/users/${userId}/questionPaperTypes`;

    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        jwt: this.state.token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        console.log('pappersssss', json);
        if (json.code === 201) {
          if (json.data) {
            this.setState({
              loading: false,
              papers: json.data.items,
            });
          } else {
            this.setState({
              loading: false,
              papers: [],
            });
          }
        } else if (json.error?.code === 400) {
          //alert("dknkdf")
          Alert.alert('My Professor', json.error.message, [
            { text: 'OK', onPress: () => this.logout() },
          ]);
        } else {
          this.setState({
            loading: false,
            papers: [],
          });
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
  onItem(item) {
    Actions.push('prequestionpapers', { item });
  }
  renderItem({ item }) {
    const isTablet = DeviceConstants.isTablet;
    var itemwidth = windowWidth / 1.3,
      itemheight = 80,
      subfont = 18;
    if (isTablet) {
      (itemwidth = windowWidth / 1.2), (itemheight = 100), (subfont = 25);
    }
    return (
      <TouchableHighlight
        onPress={this.onItem.bind(this, item)}
        underlayColor="transparent"
        activeOpacity={0.9}
      >
        <View
          style={{
            width: itemwidth,
            height: itemheight,
            borderWidth: 1,
            borderColor: colors.Themecolor,
            flexDirection: 'row',
            marginVertical: 20,
            justifyContent: 'space-between',
            alignItems: 'center',
            alignSelf: 'center',
          }}
        >
          <View
            style={{
              flex: 0.25,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Image
              source={require('../../assets/images/object.png')}
              style={{ width: 746 / 15, height: 930 / 15 }}
            />
          </View>
          <View
            style={{
              flex: 0.75,
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}
          >
            <Text
              style={{
                color: colors.Themecolor,
                fontSize: subfont,
                fontWeight: '600',
              }}
            >
              {item.title}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
  closeControlPanel = () => {
    this._drawer.close();
  };
  openControlPanel = () => {
    this._drawer.open();
  };
  onBack() {
    Actions.dashboard();
  }
  render() {
    const isTablet = DeviceConstants.isTablet;
    var backheight = 30,
      headfont = 16,
      sideimgwidth = 339 / 2,
      sideimgheight = 242 / 2,
      drawerwidth = 100;
    if (isTablet) {
      (backheight = 45),
        (headfont = 25),
        (sideimgwidth = 339 / 1.5),
        (sideimgheight = 242 / 1.5),
        (drawerwidth = 700);
    }
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Drawer
          type="overlay"
          ref={(ref) => (this._drawer = ref)}
          tapToClose
          openDrawerOffset={drawerwidth}
          content={<SideMenu closeControlPanel={this.closeControlPanel} />}
        >
          <View style={styles.mainview}>
            <View style={styles.middleview}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <View style={{ marginTop: 20, marginLeft: 20 }}>
                  <TouchableOpacity onPress={this.onBack.bind(this)}>
                    <Image
                      source={require('../../assets/images/left-arrow.png')}
                      style={{
                        width: backheight,
                        height: backheight,
                        tintColor: colors.Themecolor,
                      }}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      marginTop: 20,
                      fontSize: headfont,
                      color: colors.Themecolor,
                    }}
                  >
                    Previous Question Papers
                  </Text>
                </View>
                <Image
                  source={require('../../assets/images/abst.png')}
                  style={{ width: sideimgwidth, height: sideimgheight }}
                />
              </View>
              <View style={{ flex: 1, marginTop: 10 }}>
                {this.state.loading ? (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ fontSize: headfont }}>Loading...</Text>
                  </View>
                ) : this.state.papers.length > 0 ? (
                  <FlatList
                    data={this.state.papers}
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
                    <Text style={{ fontSize: headfont }}>
                      Papers coming soon
                    </Text>
                  </View>
                )}
              </View>
            </View>
            <View style={styles.footerview}>
              <Footer openControlPanel={this.openControlPanel} />
            </View>
          </View>
        </Drawer>
      </SafeAreaView>
    );
  }
}
export default PreviousPapers;
