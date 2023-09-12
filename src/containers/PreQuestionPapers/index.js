import React, { Component } from 'react';
import {
  Alert,
  BackHandler,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Actions } from 'react-native-router-flux';

import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceConstants from 'react-native-device-constants';
import Drawer from 'react-native-drawer';
import Modal from 'react-native-modal';
import Footer from '../../components/Footer';
import SideMenu from '../../components/SideMenu';
import { baseUrl, colors } from '../../constants';
import styles from './styles';

const windowWidth = Dimensions.get('window').width;

class PreQuestionPapers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isvisible: false,
      loading: true,
      newmodal: false,
      spinner: true,
      papers: [],
      userDetails: '',
      token: '',
      SelectedItem: '',
      previoustestdata: [],
      preloading: true,
    };
  }
  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      Actions.previouspapers({ type: 'reset' });
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
    const { item } = this.props;
    var userId = this.state.userDetails.userInfo.userId;
    //var userId = this.state.userDetails.userInfo.userId
    var url = baseUrl + `/users/${userId}/questionPapers`;
    //var url = baseUrl + `/question-papers?questionPaperTypeId=${item.questionPaperTypeId}`
    console.log('urlurl', url);
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        jwt: this.state.token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        console.log('papperquestionssssssss', json);
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
    this.setState(
      {
        SelectedItem: item,
      },
      () => {
        if (item.questionPaperTestType === 'subjective') {
          Actions.push('prepaperassesment', {
            item: this.state.SelectedItem,
            newdata: this.props.item,
            previoustestdata: this.state.previoustestdata,
          });
        } else {
          this.checkprevioustests(item);
        }
      }
    );
  }
  checkprevioustests(item) {
    var userId = this.state.userDetails.userInfo.userId;
    var url =
      baseUrl +
      `/users/${userId}/questionPapers/${item.questionPaperId}/user-tests/list`;
    console.log('urlurl', url);
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        jwt: this.state.token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        console.log('testdataaaa', json);
        if (json.data?.length > 0) {
          this.setState(
            {
              preloading: false,
              previoustestdata: json.data,
            },
            () => this.setState({ newmodal: true })
          );
        } else {
          this.setState({
            preloading: false,
            previoustestdata: [],
          });
          Actions.push('prepaperassesment', {
            item: this.state.SelectedItem,
            newdata: this.props.item,
            previoustestdata: this.state.previoustestdata,
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
  renderItem({ item }) {
    const isTablet = DeviceConstants.isTablet;
    var subfont = 18,
      downarrow = 25,
      itemheight = 60;
    if (isTablet) {
      (subfont = 25), (downarrow = 35), (itemheight = 90);
    }
    return (
      <TouchableOpacity
        onPress={this.onItem.bind(this, item)}
        style={{
          padding: 15,
          marginHorizontal: 20,
          marginVertical: 10,
          height: itemheight,
          backgroundColor: 'white',
          flexDirection: 'row',
          width: windowWidth / 1.2,
          justifyContent: 'space-between',
          shadowOffset: { width: 0, height: 5 }, //marginBottom:20,
          shadowOpacity: 1,
          borderRadius: 10,
          shadowRadius: 5,
          alignItems: 'center',
          elevation: 10,
          shadowColor: 'grey',
        }}
      >
        <Text style={{ color: colors.Themecolor, fontSize: subfont }}>
          {item.questionPaperTitle}
        </Text>
        {/*<View style={{width:24,height:24,borderRadius: 12,backgroundColor: colors.Themecolor,justifyContent:"center",alignItems:"center"}}>
							<Image source={require('../../assets/images/left-arrow.png')}
							 style={{width:18,height:18,tintColor: 'white',transform:[{rotate:"180deg"}]}}/>
						</View>*/}
        <Image
          source={require('../../assets/images/paperarrow.png')}
          style={{ width: downarrow, height: downarrow }}
        />
      </TouchableOpacity>
    );
  }
  onBack() {
    Actions.previouspapers({ type: 'reset' });
  }
  onClose() {
    this.setState({
      isvisible: false,
    });
  }
  onStarttext() {
    console.log('this.state.SelectedItem', this.state.SelectedItem);
    this.setState(
      {
        isvisible: false,
        newmodal: false,
      },
      () =>
        Actions.push('prepaperassesment', {
          item: this.state.SelectedItem,
          newdata: this.props.item,
          previoustestdata: this.state.previoustestdata,
        })
    );
  }
  onReview() {
    console.log('dndndnkfdsf', this.props.item);
    this.setState(
      {
        isvisible: false,
        newmodal: false,
      },
      () =>
        Actions.push('prepaperreview', {
          data: this.state.SelectedItem,
          item: this.props.item,
          previoustestdata: this.state.previoustestdata,
        })
    );
  }
  onBackdrop() {
    this.setState({
      newmodal: false,
    });
  }
  render() {
    const isTablet = DeviceConstants.isTablet;
    var backheighjt = 30,
      headfont = 16,
      drawerwidth = 100;
    if (isTablet) {
      (backheighjt = 45), (headfont = 25), (drawerwidth = 700);
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
                        width: backheighjt,
                        height: backheighjt,
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
                  style={{ width: 339 / 2, height: 242 / 2 }}
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
                    style={{ marginTop: 20 }}
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
                    <Text style={{ fontSize: headfont }}>No Papers</Text>
                  </View>
                )}
              </View>
            </View>
            <View style={styles.footerview}>
              <Footer openControlPanel={this.openControlPanel} />
            </View>
            <Modal isVisible={this.state.isvisible}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    backgroundColor: 'white',
                    borderRadius: 15,
                    margin: 25,
                    overflow: 'hidden',
                  }}
                >
                  <ImageBackground
                    source={require('../../assets/images/modalimage.png')}
                    style={{
                      width: windowWidth / 1.1,
                      height: 306 / 3,
                      tintColor: '#000000',
                    }}
                  >
                    <View style={{ flex: 0.2 }}>
                      <Text
                        style={{
                          textAlign: 'center',
                          color: 'white',
                          marginTop: 5,
                        }}
                      >
                        Mathematics JEE Mains 2020
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 0.8,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                      }}
                    >
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginLeft: 20,
                        }}
                      >
                        <Image
                          source={require('../../assets/images/modalques.png')}
                          style={{ width: 30, height: 30 }}
                        />
                        <Text style={{ marginLeft: 10 }}>30 Questions</Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginRight: 20,
                        }}
                      >
                        <Image
                          source={require('../../assets/images/modaltimer.png')}
                          style={{ width: 30, height: 30 }}
                        />
                        <Text style={{ marginLeft: 10 }}>60 Minutes</Text>
                      </View>
                    </View>
                  </ImageBackground>
                  <View
                    style={{
                      height: 1,
                      backgroundColor: colors.Themecolor,
                      opacity: 0.5,
                      shadowOffset: { width: 0, height: 5 },
                      marginTop: 10,
                      shadowOpacity: 1,
                      shadowRadius: 5,
                      elevation: 15,
                      shadowColor: 'orange',
                    }}
                  />
                  <View>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: 20,
                        marginTop: 5,
                      }}
                    >
                      Instructions
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginLeft: 15,
                        marginTop: 15,
                      }}
                    >
                      <Image
                        source={require('../../assets/images/modalhelp.png')}
                        style={{
                          width: 77 / 3,
                          height: 72 / 3,
                          tintColor: colors.Themecolor,
                        }}
                      />
                      <Text style={{ marginLeft: 10, paddingRight: 50 }}>
                        1.0 marks are awarded for correct attempts and 0.0 marks
                        for wrong attempts.
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginLeft: 15,
                        marginTop: 15,
                      }}
                    >
                      <Image
                        source={require('../../assets/images/modalhelp.png')}
                        style={{
                          width: 77 / 3,
                          height: 72 / 3,
                          tintColor: colors.Themecolor,
                        }}
                      />
                      <Text style={{ marginLeft: 10, marginRight: 10 }}>
                        Tap on options to select the correct answer.
                      </Text>
                    </View>
                    <View
                      style={{ justifyContent: 'center', alignItems: 'center' }}
                    >
                      <TouchableOpacity onPress={this.onStarttext.bind(this)}>
                        <View
                          style={{
                            width: 256 / 2,
                            height: 97 / 2,
                            marginVertical: 10,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: colors.Themecolor,
                            borderRadius: 20,
                          }}
                        >
                          <Text style={{ color: 'white', fontSize: 15 }}>
                            Start Test
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={this.onClose.bind(this)}
                  style={{
                    position: 'absolute',
                    top: 170,
                    left: windowWidth / 1.2,
                  }}
                >
                  <Image
                    source={require('../../assets/images/modalclose.png')}
                    style={{ width: 144 / 4, height: 144 / 4 }}
                  />
                </TouchableOpacity>
              </View>
            </Modal>
            <Modal
              isVisible={this.state.newmodal}
              onBackdropPress={this.onBackdrop.bind(this)}
              style={{ justifyContent: 'center', margin: 0 }}
            >
              <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                <View
                  style={{
                    padding: 20,
                    backgroundColor: 'white',
                    borderTopLeftRadius: 15,
                    borderTopRightRadius: 15,
                  }}
                >
                  <Text style={{ marginLeft: 10, fontSize: 20 }}>
                    Go With..
                  </Text>
                  <TouchableOpacity
                    onPress={this.onReview.bind(this)}
                    style={{
                      flexDirection: 'row',
                      marginLeft: 20,
                      marginTop: 10,
                    }}
                  >
                    <Image
                      source={require('../../assets/images/icon_1.png')}
                      style={{ width: 28, height: 28 }}
                    />
                    <Text style={{ marginLeft: 15, fontSize: 20 }}>
                      Review Previous Test
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={this.onStarttext.bind(this)}
                    style={{
                      flexDirection: 'row',
                      marginLeft: 20,
                      marginTop: 10,
                    }}
                  >
                    <Image
                      source={require('../../assets/images/icon_2.png')}
                      style={{ width: 28, height: 28 }}
                    />
                    <Text style={{ marginLeft: 15, fontSize: 20 }}>
                      Start New Test
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        </Drawer>
      </SafeAreaView>
    );
  }
}
export default PreQuestionPapers;
