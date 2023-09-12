import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  Share,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dropdown } from 'react-native-element-dropdown';
import SegmentedControlTab from 'react-native-segmented-control-tab';

import moment from 'moment';
import DeviceConstants from 'react-native-device-constants';
import Modal from 'react-native-modal';
import { Actions } from 'react-native-router-flux';
import { baseUrl, colors } from '../../constants';
import { Validations } from '../../helpers';
import styles from './styles';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const options = [
  { value: 'bank_account', label: 'Bank Account' },
  { value: 'vpa', label: 'VPA' },
];

class ReferView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refercode: 'SMART123',
      token: '',
      spinner: true,
      code: '',
      userDetails: '',
      selectedIndex: 1,
      loaidng: true,
      registrationInvites: '',
      userReferralInfo: '',
      newmodal: false,
      modalloading: false,
      accountnmae: '',
      accountnumber: '',
      accountTypevalue: 'bank_account',
      accountpoints: '',
      ifsccode: '',
      vpaAddress: '',
      accountType: {
        value: 'bank_account',
        label: 'Bank Account',
      },
      paymemntload: true,
    };
  }

  async onRefer() {
    const options = {
      title: 'My Professor',
      subject: 'Referal Invite',
      message:
        'HI Your Referal code is  ' +
        this.state.code +
        '  please click on the below link to download the app https://myprofessorapp.page.link/29hQ',
    };
    try {
      const result = await Share.share({
        message:
          'HI Your Referal code is ' +
          this.state.code +
          ' please click on the below link to download the app https://myprofessorapp.page.link/29hQ',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Dlfjl>FJKLDFd/f');
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  }
  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction
    );

    this.getData();
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
          this.setState({
            token: JSON.parse(token),
            userDetails: data,
          });
          this.getcode(data, JSON.parse(token));
          this.getfundaccount(data, JSON.parse(token));
        } else {
        }
      } else {
        console.log('errorr');
      }
    } catch (e) {
      return null;
    }
  };
  getfundaccount() {
    var userId = this.state.userDetails.userInfo.userId;
    var url = baseUrl + `/fund-account?userId=${userId}`;
    console.log('hkfdhf', url);
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        jwt: this.state.token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        console.log('fundddd users', json);
        // const data = json.data;
        if (json.code === 201) {
          var userFundAccountInfo = json.data;
          if (
            userFundAccountInfo &&
            Object.keys(userFundAccountInfo).length > 0
          ) {
            this.setState({
              accountnmae: userFundAccountInfo.name,
              ifsccode: userFundAccountInfo.ifsc,
              accountnumber: userFundAccountInfo.accountNumber,
              vpaAddress: userFundAccountInfo.vpaAddress,
            });
            this.setState(
              {
                accountType: options.find(
                  (o) => o.value === userFundAccountInfo.accountType
                ),
              },
              console.log('dknkdankadncd', this.state.accountType)
            );
          } else {
            console.log('dnck.dk.dvjk.cjvc');
          }
        } else if (json.error?.code === 400) {
          //alert("dknkdf")
          Alert.alert('My Professor', json.error.message, [
            { text: 'OK', onPress: () => this.logout() },
          ]);
        } else {
          this.setState({
            registrationInvites: [],
            loaidng: false,
          });
        }
      })
      .catch((error) => console.error(error));
  }
  getcode(data, token) {
    var userId = this.state.userDetails.userInfo.userId;
    var url = baseUrl + `/registration-invites/metrics?userId=` + userId;
    console.log('hkfdhf', url);
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        jwt: this.state.token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        console.log('code...dfkjnfj', json);
        // const data = json.data;
        if (json.code === 201) {
          var inviteUrl = json.data.inviteUrl;
          var newdata = inviteUrl.split('/');
          console.log('d.kfndkf', newdata);
          var newcode = newdata[newdata.length - 1];
          console.log('necodee', newcode);
          var code = newcode.split('-');
          var referalcode = code[1];
          console.log('dkhfldfd', referalcode);
          this.setState({
            userReferralInfo: json.data,
            code: referalcode,
            spinner: false,
          });
        } else if (json.error?.code === 400) {
          //alert("dknkdf")
          Alert.alert('My Professor', json.error.message, [
            { text: 'OK', onPress: () => this.logout() },
          ]);
        } else {
          if (json.error) {
            alert(json.error.message);
          }
          this.setState({
            code: '',
            spinner: false,
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
  getregisteredusers(ata, token) {
    var userId = this.state.userDetails.userInfo.userId;
    var url = baseUrl + `/registration-invites/users/${userId}`;
    console.log('hkfdhf', url);
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        jwt: this.state.token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        console.log('registered users', json);
        // const data = json.data;
        if (json.code === 201) {
          this.setState({
            registrationInvites: json.data,
            loaidng: false,
          });
        } else if (json.error?.code === 400) {
          //alert("dknkdf")
          Alert.alert('My Professor', json.error.message, [
            { text: 'OK', onPress: () => this.logout() },
          ]);
        } else {
          this.setState({
            registrationInvites: [],
            loaidng: false,
          });
        }
      })
      .catch((error) => console.error(error));
  }
  onBack() {
    Actions.pop();
  }
  FlatList_Header = () => {
    const isTablet = DeviceConstants.isTablet;
    var itemwidth = 60,
      newfont = 15;
    if (isTablet) {
      (itemwidth = 150), (newfont = 20);
    }
    return (
      ////<ScrollView horizontal>
      <View
        style={{
          flex: 1,
          backgroundColor: colors.Themecolor,
          flexDirection: 'row',
          paddingVertical: 20,
        }}
      >
        <View
          style={{
            width: itemwidth,
            paddingHorizontal: 10,
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: 'white', fontSize: newfont }}>{'S.No'}</Text>
        </View>
        <View
          style={{
            width: itemwidth + 90,
            paddingHorizontal: 10,
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: 'white', fontSize: newfont }}>
            {'Invitee Email'}
          </Text>
        </View>
        <View
          style={{
            width: itemwidth + 40,
            paddingHorizontal: 10,
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: 'white', fontSize: newfont }}>
            {'Invitee FirstName'}
          </Text>
        </View>
        <View
          style={{
            width: itemwidth + itemwidth,
            paddingHorizontal: 10,
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: 'white', fontSize: newfont }}>
            {'Invitee Mobile'}
          </Text>
        </View>
        <View
          style={{
            width: itemwidth + 40,
            paddingHorizontal: 10,
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: 'white', fontSize: newfont }}>
            {'Account Status'}
          </Text>
        </View>
        <View
          style={{
            width: itemwidth + 40,
            paddingHorizontal: 10,
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: 'white', fontSize: newfont }}>
            {'Registration Status'}
          </Text>
        </View>
        <View
          style={{
            width: itemwidth + 40,
            paddingHorizontal: 10,
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: 'white', fontSize: newfont }}>
            {'Subscription Status'}
          </Text>
        </View>
      </View>
      //  </ScrollView>
    );
  };
  FlatList_Headerpayout = () => {
    const isTablet = DeviceConstants.isTablet;
    var itemwidth = 60,
      newfont = 15;
    if (isTablet) {
      (itemwidth = 150), (newfont = 20);
    }
    return (
      ////<ScrollView horizontal>
      <View
        style={{
          flex: 1,
          backgroundColor: colors.Themecolor,
          flexDirection: 'row',
          paddingVertical: 20,
        }}
      >
        <View
          style={{
            width: itemwidth,
            paddingHorizontal: 10,
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: 'white', fontSize: newfont }}>{'S.No'}</Text>
        </View>
        <View
          style={{
            width: itemwidth + 40,
            paddingHorizontal: 10,
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: 'white', fontSize: newfont }}>{'Amount'}</Text>
        </View>
        <View
          style={{
            width: itemwidth + 40,
            paddingHorizontal: 10,
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: 'white', fontSize: newfont }}>
            {'Payment Mode'}
          </Text>
        </View>
        <View
          style={{
            width: itemwidth + 60,
            paddingHorizontal: 10,
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: 'white', fontSize: newfont }}>
            {'Redeem Points'}
          </Text>
        </View>
        <View
          style={{
            width: itemwidth + 40,
            paddingHorizontal: 10,
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: 'white', fontSize: newfont }}>
            {'Payout Requested Date'}
          </Text>
        </View>
        <View
          style={{
            width: itemwidth + 40,
            paddingHorizontal: 10,
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: 'white', fontSize: newfont }}>
            {'Payment Status'}
          </Text>
        </View>
      </View>
      //  </ScrollView>
    );
  };
  renderpaymentinfo({ item, index }) {
    const isTablet = DeviceConstants.isTablet;
    var itemwidth = 60,
      newfont = 15;
    if (isTablet) {
      (itemwidth = 150), (newfont = 20);
    }
    return (
      // <ScrollView horizontal>
      <View
        style={{
          flex: 1,
          backgroundColor: 'lightgrey',
          flexDirection: 'row',
          marginTop: 10,
          paddingVertical: 20,
        }}
      >
        <View
          style={{
            width: itemwidth,
            paddingHorizontal: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: newfont }}>{index + 1}</Text>
        </View>
        <View
          style={{
            width: itemwidth + 40,
            paddingHorizontal: 10,
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: newfont }}>{item.amount}</Text>
        </View>
        <View
          style={{
            width: itemwidth + 40,
            paddingHorizontal: 10,
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: newfont }}>{item.mode}</Text>
        </View>
        <View
          style={{
            width: itemwidth + 60,
            paddingHorizontal: 10,
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: newfont }}>{item.points}</Text>
        </View>
        <View
          style={{
            width: itemwidth + 40,
            paddingHorizontal: 10,
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: newfont }}>
            {item.payoutRequestedAt
              ? moment(new Date(item.payoutRequestedAt * 1000)).format(
                  'MMMM Do YYYY'
                )
              : null}
          </Text>
        </View>
        <View
          style={{
            width: itemwidth + 40,
            paddingHorizontal: 10,
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: newfont }}>{item.payoutStatus}</Text>
        </View>
      </View>
      // </ScrollView>
    );
  }
  renderItem({ item, index }) {
    const isTablet = DeviceConstants.isTablet;
    var itemwidth = 60,
      newfont = 15;
    if (isTablet) {
      (itemwidth = 150), (newfont = 20);
    }
    return (
      // <ScrollView horizontal>
      <View
        style={{
          flex: 1,
          backgroundColor: 'lightgrey',
          flexDirection: 'row',
          marginTop: 10,
          paddingVertical: 20,
        }}
      >
        <View
          style={{
            width: itemwidth,
            paddingHorizontal: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: newfont }}>{index + 1}</Text>
        </View>
        <View
          style={{
            width: itemwidth + 90,
            paddingHorizontal: 10,
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: newfont }}>{item.inviteeEmail}</Text>
        </View>
        <View
          style={{
            width: itemwidth + 40,
            paddingHorizontal: 10,
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: newfont }}>{item.inviteeFirstName}</Text>
        </View>
        <View
          style={{
            width: itemwidth + itemwidth,
            paddingHorizontal: 10,
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: newfont }}>{item.inviteeMobile}</Text>
        </View>
        <View
          style={{
            width: itemwidth + 40,
            paddingHorizontal: 10,
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: newfont }}>{item.accountStatus}</Text>
        </View>
        <View
          style={{
            width: itemwidth + 40,
            paddingHorizontal: 10,
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: newfont }}>{item.registrationStatus}</Text>
        </View>
        <View
          style={{
            width: itemwidth + 40,
            paddingHorizontal: 10,
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: newfont }}>{item.subscriptionStatus}</Text>
        </View>
      </View>
      // </ScrollView>
    );
  }
  getpaymentinfo() {
    var userId = this.state.userDetails.userInfo.userId;
    var url = baseUrl + `/payouts/users/${userId}`;
    console.log('hkfdhf', url);
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        jwt: this.state.token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        console.log('paymemntload users', json);
        // const data = json.data;
        if (json.code === 201) {
          this.setState({
            paymentinfo: json.data,
            paymemntload: false,
          });
        } else if (json.error?.code === 400) {
          //alert("dknkdf")
          Alert.alert('My Professor', json.error.message, [
            { text: 'OK', onPress: () => this.logout() },
          ]);
        } else {
          this.setState({
            paymentinfo: [],
            paymemntload: false,
          });
        }
      })
      .catch((error) => console.error(error));
  }
  handleIndexChange = (index) => {
    //   alert(index)
    this.setState(
      {
        ...this.state,
        selectedIndex: index,
      },
      () => {
        if (index === 2) {
          this.getregisteredusers();
        } else if (index === 3) {
          this.getpaymentinfo();
        }
      }
    );
  };
  onreddem() {
    this.setState({
      newmodal: true,
    });
  }
  onsubmitreddem() {
    var {
      accountnmae,
      accountnumber,
      ifsccode,
      vpaAddress,
      accountpoints,
      accountTypevalue,
    } = this.state;
    if (accountnmae === '') {
      alert('Please enter Name');
    } else if (accountpoints === '') {
      alert('please enter Points');
    } else if (!Validations.accountpoints(accountpoints)) {
      alert('points should be numbers only');
    }
    // else if(accountTypevalue === 'bank_account'){
    else if (accountnumber === '') {
      alert('Please enter Account Number');
    } else if (ifsccode === '') {
      alert('Please enter IFSC Number');
    } else if (accountTypevalue === 'vpa' && vpaAddress === '') {
      alert('Please enter VPA Number');
    } else {
      this.setState({ modalloading: true });
      const data = {
        userId: this.state.userDetails.userInfo.userId,
        accountType: accountTypevalue,
        name: accountnmae,
        points: +accountpoints,
      };
      if ((accountTypevalue = 'bank_account')) {
        data.ifsc = ifsccode;
        data.accountNumber = accountnumber;
      } else {
        data.vpaAddress = vpaAddress;
      }
      console.log('xmnckncvk', data);
      fetch(baseUrl + `/payouts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          jwt: this.state.token,
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((json) => {
          console.log('payoutdtaaaaa', json);
          // const data = json.data;
          if (json.code === 201) {
            this.setState(
              {
                newmodal: false,
                loading: true,
                modalloading: false,
              },
              () => {
                this.getcode();
              }
            );
          } else if (json.error?.code === 400) {
            //alert("dknkdf")
            Alert.alert('My Professor', json.error.message, [
              { text: 'OK', onPress: () => this.logout() },
            ]);
          } else {
            alert(json.error.message);
            this.setState({
              newmodal: false,
              modalloading: false,
            });
          }
        })
        .catch((error) => console.error(error));
    }
  }
  renderNewIten = (item) => {
    return (
      <View
        style={{
          padding: 17,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            flex: 1,
            fontSize: 16,
          }}
        >
          {item.label}
        </Text>
      </View>
    );
  };
  render() {
    const isTablet = DeviceConstants.isTablet;
    var backheight = 16,
      backwidth = 21,
      hadfont = 18,
      topflex = 0.08,
      segmentheight = 50,
      subfont = 12,
      referwidth = 267 / 1.3,
      referheight = 258 / 1.3,
      codetext = 24,
      referheiht = 41,
      boxheight = 100,
      boxwidth = windowWidth / 2.4,
      innerimg = 30;
    if (isTablet) {
      (backheight = 26),
        (backwidth = 33),
        (hadfont = 28),
        (topflex = 0.1),
        (segmentheight = 50),
        (subfont = 25),
        (referwidth = 267 / 1.1),
        (referheight = 258 / 1.1),
        (codetext = 34),
        (referheiht = 61),
        (boxheight = 150),
        (boxwidth = windowWidth / 3.4),
        (innerimg = 45);
    }

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.mainView}>
          <View style={{ flex: topflex, overflow: 'hidden', paddingBottom: 5 }}>
            <View style={styles.topShadow}>
              <TouchableOpacity onPress={this.onBack.bind(this)}>
                <Image
                  source={require('../../assets/images/refer/back.png')}
                  style={{
                    height: backheight,
                    width: backwidth,
                    marginLeft: 20,
                    tintColor: colors.Themecolor,
                  }}
                />
              </TouchableOpacity>

              <Text
                style={{
                  marginLeft: 20,
                  color: colors.Themecolor,
                  fontSize: hadfont,
                }}
              >
                Refer & Earn
              </Text>
            </View>
          </View>

          <View style={styles.bottomView}>
            <ScrollView>
              <View style={{ flex: 1, paddingVertical: 20 }}>
                <SegmentedControlTab
                  values={[
                    'Instructions',
                    'Refer & Earn',
                    'Referred Users',
                    'Payouts',
                  ]}
                  tabsContainerStyle={{
                    margin: 5,
                    height: segmentheight,
                    textAlign: 'center',
                  }}
                  borderRadius={20}
                  tabStyle={{ borderColor: colors.Themecolor }}
                  firstTabStyle={{ borderRightWidth: 0 }}
                  activeTabStyle={{
                    backgroundColor: colors.Themecolor,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  activeTabTextStyle={{ color: 'white' }}
                  tabTextStyle={{
                    fontSize: subfont,
                    color: colors.Themecolor,
                    textAlign: 'center',
                  }}
                  selectedIndex={this.state.selectedIndex}
                  textNumberOfLines={2}
                  onTabPress={this.handleIndexChange}
                />
                {this.state.selectedIndex === 0 ? (
                  <>
                    <Text
                      style={{ fontSize: 25, fontWeight: 'bold', margin: 10 }}
                    >
                      Referral Point Instructions
                    </Text>
                    <Text style={{ fontSize: 17, margin: 10 }}>
                      1.For every successful referral user will get 100 points
                      Each point 1Rupee
                    </Text>
                    <Text style={{ fontSize: 17, margin: 10 }}>
                      2.To redeem user should have minimum 500 points
                    </Text>
                    <Text style={{ fontSize: 17, margin: 10 }}>
                      3.Keep sharing to earn more points!
                    </Text>
                    <Text style={{ fontSize: 17, margin: 10 }}>
                      Remember to tell your friends and family about the
                      benefits of the website and any special promotions that
                      are currently available. Good luck!
                    </Text>
                  </>
                ) : this.state.selectedIndex === 1 ? (
                  <View style={{ flex: 1 }}>
                    <Image
                      source={require('../../assets/images/refer/referheadnew.png')}
                      style={{
                        width: referwidth,
                        height: referheight,
                        alignSelf: 'center',
                        marginBottom: 20,
                      }}
                    />
                    <Text
                      style={[styles.bottomHeadText, { fontSize: hadfont }]}
                    >
                      Refer now & earn up to 50 Points.
                    </Text>
                    <Text style={[styles.bottomSubText, { fontSize: subfont }]}>
                      Share your code with your friends and get reward points.
                    </Text>
                    <Text style={[styles.referalcode, { fontSize: subfont }]}>
                      YOUR REFERAL CODE
                    </Text>
                    {this.state.spinner ? (
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Text style={{ fontSize: hadfont }}>Loading..</Text>
                      </View>
                    ) : (
                      <>
                        <ImageBackground
                          source={require('../../assets/images/refer/referrect.png')}
                          style={styles.codeBox}
                        >
                          <Text
                            style={[styles.boxText, { fontSize: codetext }]}
                          >
                            {this.state.code}
                          </Text>
                        </ImageBackground>
                        <TouchableOpacity
                          onPress={this.onRefer.bind(this)}
                          style={[styles.submitbutton, { height: referheiht }]}
                        >
                          <Text
                            style={[styles.buttonText, { fontSize: hadfont }]}
                          >
                            REFER NOW
                          </Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                ) : this.state.selectedIndex === 2 ? (
                  this.state.loaidng ? (
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{ fontSize: hadfont }}>Loading..</Text>
                    </View>
                  ) : this.state.registrationInvites ? (
                    <>
                      <View style={{ flex: 1, marginTop: 10 }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                          }}
                        >
                          <View
                            style={{
                              width: boxwidth,
                              height: boxheight,
                              backgroundColor: '#924ad4',
                              marginBottom: 20,
                              justifyContent: 'space-around',
                              marginHorizontal: 10,
                              borderRadius: 10,
                            }}
                          >
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                              }}
                            >
                              <Image
                                source={require('../../assets/images/group.png')}
                                style={{
                                  width: innerimg,
                                  height: innerimg,
                                  tintColor: 'white',
                                  marginLeft: 10,
                                }}
                              />
                              <Text
                                style={{
                                  marginRight: 10,
                                  color: 'white',
                                  fontWeight: 'bold',
                                  fontSize: subfont,
                                }}
                              >
                                {this.state.registrationInvites?.totalCount ||
                                  0}
                              </Text>
                            </View>
                            <Text
                              style={{
                                color: 'white',
                                fontSize: subfont,
                                marginRight: 10,
                                textAlign: 'right',
                              }}
                            >
                              {'Total Points'}
                            </Text>
                          </View>
                          <View
                            style={{
                              width: boxwidth,
                              height: boxheight,
                              backgroundColor: '#c54721',
                              marginBottom: 20,
                              justifyContent: 'space-around',
                              marginHorizontal: 10,
                              borderRadius: 10,
                            }}
                          >
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                              }}
                            >
                              <Image
                                source={require('../../assets/images/database.png')}
                                style={{
                                  width: innerimg,
                                  height: innerimg,
                                  tintColor: 'white',
                                  marginLeft: 10,
                                }}
                              />
                              <Text
                                style={{
                                  marginRight: 10,
                                  color: 'white',
                                  fontWeight: 'bold',
                                  fontSize: subfont,
                                }}
                              >
                                {
                                  this.state.userReferralInfo?.userWallet
                                    ?.rewardPoints
                                }
                              </Text>
                            </View>
                            <Text
                              style={{
                                color: 'white',
                                fontSize: subfont,
                                marginRight: 10,
                                textAlign: 'right',
                              }}
                            >
                              {'Total Available Points'}
                            </Text>
                          </View>
                          <View
                            style={{
                              width: boxwidth,
                              height: boxheight,
                              backgroundColor: '#ed3c7b',
                              marginBottom: 20,
                              justifyContent: 'space-around',
                              marginHorizontal: 10,
                              borderRadius: 10,
                            }}
                          >
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                              }}
                            >
                              <Image
                                source={require('../../assets/images/dollar-bill.png')}
                                style={{
                                  width: innerimg,
                                  height: innerimg,
                                  tintColor: 'white',
                                  marginLeft: 10,
                                }}
                              />
                              <Text
                                style={{
                                  marginRight: 10,
                                  color: 'white',
                                  fontWeight: 'bold',
                                  fontSize: subfont,
                                }}
                              >
                                {
                                  this.state.userReferralInfo?.userWallet
                                    ?.withdrawableCash
                                }
                              </Text>
                            </View>
                            <Text
                              style={{
                                color: 'white',
                                fontSize: subfont,
                                marginRight: 10,
                                textAlign: 'right',
                              }}
                            >
                              {'Withdrawable Amount'}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingVertical: 10,
                            alignItems: 'center',
                          }}
                        >
                          <Text
                            style={{
                              marginLeft: 10,
                              fontSize: hadfont,
                              textAlign: 'center',
                              fontWeight: '600',
                            }}
                          >
                            Referred Users
                          </Text>
                          <TouchableOpacity
                            onPress={this.onreddem.bind(this)}
                            style={{
                              backgroundColor: colors.Themecolor,
                              justifyContent: 'center',
                              paddingHorizontal: 10,
                              paddingVertical: 10,
                              borderRadius: 10,
                              marginRight: 10,
                            }}
                          >
                            <Text
                              style={{
                                color: 'white',
                                textAlign: 'center',
                                fontSize: subfont,
                              }}
                            >
                              Redeem
                            </Text>
                          </TouchableOpacity>
                        </View>
                        <View style={{ flex: 1 }}>
                          <ScrollView horizontal>
                            <FlatList
                              ListHeaderComponent={this.FlatList_Header}
                              data={this.state.registrationInvites.items}
                              renderItem={this.renderItem.bind(this)}
                            />
                          </ScrollView>
                        </View>
                      </View>
                    </>
                  ) : (
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{ fontSize: subfont }}>No Data</Text>
                    </View>
                  )
                ) : (
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: subfont,
                        marginTop: 10,
                        marginBottom: 10,
                        marginLeft: 10,
                        fontWeight: '600',
                      }}
                    >
                      Payment Information:
                    </Text>
                    {this.state.paymemntload ? (
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Text style={{ fontSize: subfont }}>Loading..</Text>
                      </View>
                    ) : this.state.paymentinfo.items.length > 0 ? (
                      <ScrollView horizontal>
                        <FlatList
                          ListHeaderComponent={this.FlatList_Headerpayout}
                          data={this.state.paymentinfo.items}
                          renderItem={this.renderpaymentinfo.bind(this)}
                        />
                      </ScrollView>
                    ) : (
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Text style={{ fontSize: subfont }}>No Data</Text>
                      </View>
                    )}
                  </View>
                )}
              </View>
            </ScrollView>
          </View>

          <Modal isVisible={this.state.newmodal}>
            <View
              style={{
                justifyContent: 'center',
                padding: 20,
                backgroundColor: 'white',
              }}
            >
              <>
                <Text>Account Type:</Text>
                <Dropdown
                  style={{
                    marginTop: 10,
                    height: 50,
                    backgroundColor: 'white',
                    borderRadius: 12,
                    padding: 12,
                    borderWidth: 1,
                    borderColor: 'lightgrey',
                  }}
                  placeholderStyle={{
                    fontSize: 16,
                  }}
                  selectedTextStyle={{
                    fontSize: 16,
                  }}
                  data={options}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Select item"
                  value={this.state.accountTypevalue}
                  onChange={(item) => {
                    this.setState({
                      bankvalue: item.value,
                      accountType: item,
                      accountTypevalue: item.value,
                    });
                  }}
                  renderItem={this.renderNewIten}
                />
              </>
              {this.state.accountTypevalue === 'bank_account' ? (
                <>
                  <>
                    <Text style={{ marginTop: 10 }}>Name:</Text>
                    <TextInput
                      style={{
                        marginTop: 10,
                        height: 50,
                        backgroundColor: 'white',
                        borderRadius: 12,
                        padding: 12,
                        borderWidth: 1,
                        borderColor: 'lightgrey',
                      }}
                      onChangeText={(text) =>
                        this.setState({ accountnmae: text })
                      }
                      value={this.state.accountnmae}
                    />
                  </>
                  <>
                    <Text style={{ marginTop: 10 }}>Account Number:</Text>
                    <TextInput
                      style={{
                        marginTop: 10,
                        height: 50,
                        backgroundColor: 'white',
                        borderRadius: 12,
                        padding: 12,
                        borderWidth: 1,
                        borderColor: 'lightgrey',
                      }}
                      onChangeText={(text) =>
                        this.setState({ accountnumber: text })
                      }
                      value={this.state.accountnumber}
                    />
                  </>
                  <>
                    <Text style={{ marginTop: 10 }}>IFSC Code:</Text>
                    <TextInput
                      style={{
                        marginTop: 10,
                        height: 50,
                        backgroundColor: 'white',
                        borderRadius: 12,
                        padding: 12,
                        borderWidth: 1,
                        borderColor: 'lightgrey',
                      }}
                      onChangeText={(text) => this.setState({ ifsccode: text })}
                      value={this.state.ifsccode}
                    />
                  </>
                  <>
                    <Text style={{ marginTop: 10 }}>Points:</Text>
                    <TextInput
                      style={{
                        marginTop: 10,
                        height: 50,
                        backgroundColor: 'white',
                        borderRadius: 12,
                        padding: 12,
                        borderWidth: 1,
                        borderColor: 'lightgrey',
                      }}
                      onChangeText={(text) =>
                        this.setState({ accountpoints: text })
                      }
                      value={this.state.accountpoints}
                    />
                  </>
                </>
              ) : (
                <>
                  <>
                    <Text style={{ marginTop: 10 }}>Name:</Text>
                    <TextInput
                      style={{
                        marginTop: 10,
                        height: 50,
                        borderWidth: 1,
                        borderColor: 'lightgrey',
                        backgroundColor: 'white',
                        borderRadius: 12,
                        padding: 12,
                      }}
                      onChangeText={(text) =>
                        this.setState({ accountnmae: text })
                      }
                      value={this.state.accountnmae}
                    />
                  </>
                  <>
                    <Text style={{ marginTop: 10 }}>VPA Address:</Text>
                    <TextInput
                      style={{
                        marginTop: 10,
                        height: 50,
                        backgroundColor: 'white',
                        borderRadius: 12,
                        padding: 12,
                        borderWidth: 1,
                        borderColor: 'lightgrey',
                      }}
                      onChangeText={(text) =>
                        this.setState({ vpaAddress: text })
                      }
                      value={this.state.vpaAddress}
                    />
                  </>
                  <>
                    <Text style={{ marginTop: 10 }}>Points:</Text>
                    <TextInput
                      style={{
                        marginTop: 10,
                        height: 50,
                        backgroundColor: 'white',
                        borderRadius: 12,
                        padding: 12,
                        borderWidth: 1,
                        borderColor: 'lightgrey',
                      }}
                      onChangeText={(text) =>
                        this.setState({ accountpoints: text })
                      }
                      value={this.state.accountpoints}
                    />
                  </>
                </>
              )}

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  marginTop: 20,
                }}
              >
                <TouchableOpacity
                  onPress={() => this.setState({ newmodal: false })}
                  style={{
                    height: 40,
                    backgroundColor: colors.Themecolor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 20,
                    borderRadius: 5,
                  }}
                >
                  <Text style={{ color: 'white', fontSize: 16 }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={this.onsubmitreddem.bind(this)}
                  style={{
                    height: 40,
                    backgroundColor: colors.Themecolor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 20,
                    borderRadius: 5,
                  }}
                >
                  <Text style={{ color: 'white', fontSize: 16 }}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
            {this.state.modalloading ? (
              <View
                style={{
                  position: 'absolute',
                  height: windowHeight / 1.5,
                  width: windowWidth / 1.2,
                  justifyContent: 'center',
                  marginLeft: 20,
                }}
              >
                <ActivityIndicator />
              </View>
            ) : null}
          </Modal>
        </View>
      </SafeAreaView>
    );
  }
}
export default ReferView;
