import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DeviceConstants from 'react-native-device-constants';
import Drawer from 'react-native-drawer';
import LinearGradient from 'react-native-linear-gradient';
import RazorpayCheckout from 'react-native-razorpay';
import { Actions } from 'react-native-router-flux';
import SideMenu from '../../components/SideMenu';
import { REACT_APP_RAZORPAY_KEY, baseUrl, colors } from '../../constants';
import styles from './styles';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
// var db,
//   selectedItems = [],
// resourceBaseURL;
var gst = '0';

class BuyPackages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seconds: 120,
      timeup: false,
      token: '',
      userDetails: '',
      subjects: [],
      spinner: true,
      finalarray: [],
      total: 0,
      sgst: 0,
      cgst: 0,
      finaltotal: 0,
      promocode: '',
      promoCodeDetails: '',
      activationcode: '',
      grouppackage: [],
      discount_amount: 0,
      discount_coupon: '',
      orderID: '',
      error: '',
      promostatus: false,
      promostatusref: '',
      setMinutes: 0,
      setSeconds: 0,
      setPackage: {},
    };
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction
    );

    this.getData();
  }
  backAction = () => {
    // this.props.navigation.goBack(null);
    this.onBack();
    return true;
    // Actions.topicmainview({from:this.props.from,type:"reset",data:this.props.topicindata,topicsdata:this.props.topicData,screen:"summary",subjectData:this.props.subjectData})
  };
  componentWillUnmount() {
    this.backHandler.remove();
  }
  getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@user');
      if (value !== null) {
        var data = JSON.parse(value);
        const token = await AsyncStorage.getItem('@access_token');
        if (token) {
          this.setState({
            token: JSON.parse(token),
            userDetails: data,
          });
          this.getsubjects();
        } else {
        }
      } else {
      }
    } catch (e) {
      return null;
    }
  };

  getsubjects() {
    var branchId = this.state.userDetails.userOrg.branchId;
    var url = baseUrl + `/packages/${branchId}/list`;
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        jwt: this.state.token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        const data = json.data;
        if (data) {
          if (data) {
            var newpackge = data.subjectPackages
              ? data.subjectPackages.concat(data.groupPackage)
              : data.groupPackage
              ? data.groupPackage
              : null;
            this.setState({
              spinner: false,
              subjects: newpackge,
            });
          } else {
            this.setState({
              spinner: false,
              subjects: [],
            });
          }
        } else {
          this.setState({
            spinner: false,
            subjects: [],
          });
        }
      })
      .catch((error) => console.error(error));
  }

  onCheckBoxClick(item, index) {
    var totalval = parseInt(item.cost);
    var totalgst = 0;

    totalgst = (totalval * 9) / 100;

    this.setState(
      {
        setPackage: item,
        total: totalval,
        sgst: totalgst, //this.state.finalarray.length*45,
        cgst: totalgst, //this.state.finalarray.length*45,
        finaltotal: parseFloat(
          totalval - this.state.discount_amount + totalgst + totalgst
        ),
      },
      () =>
        console.log(
          'dnfkdf',
          this.state.discount_amount,
          'dfdfdfd',
          this.state.finaltotal
        )
    );
  }

  calculateGST() {
    let gstCharge = 0;
    if (gst === null) {
      gstCharge = (this.state.amount * 18) / 100;
      this.setState(
        {
          gstText: 'GST 18%: ' + gstCharge,
          amountWithGST: this.state.amount + gstCharge,
        },
        () => {
          this.setButtonText();
        }
      );
    } else if (gst === '0') {
      this.setState(
        {
          gstText: '',
          amountWithGST: this.state.amount + gstCharge,
        },
        () => {
          this.setButtonText();
        }
      );
    } else if (gst.length > 0) {
      gstCharge = (this.state.amount * Number(gst)) / 100;
      this.setState(
        {
          gstText: 'GST ' + gst + '%: ' + gstCharge,
          amountWithGST: this.state.amount + gstCharge,
        },
        () => {
          this.setButtonText();
        }
      );
    }
  }

  setButtonText() {
    if (this.state.isScratchCardApplied) {
      this.setState({
        proceedText: 'PROCEED',
      });
    } else {
      if (this.state.amountWithGST > 0) {
        this.setState({
          proceedText: 'PROCEED TO PAY ' + this.state.amountWithGST + ' INR',
        });
      } else {
        this.setState({
          proceedText: 'PROCEED',
        });
      }
    }
  }

  async orderIDAPI() {
    let body = {
      paymentType: 'razorpay',
      packageId: this.state.setPackage.id,
      activationCode: '',
      packageCost: parseFloat(this.state.total),
      cgst: parseFloat(this.state.cgst),
      sgst: parseFloat(this.state.sgst),
      promoCode: this.state.promoCodeDetails?.promoCode || '',
      promoCodeId: this.state.promoCodeDetails?.id || '',
      promoCodeAmount: this.state.discount_amount,
      totalPrice: parseFloat(
        parseFloat(
          parseFloat(this.state.total) -
            parseFloat(this.state.discount_amount) +
            parseFloat(this.state.cgst) +
            parseFloat(this.state.sgst)
        ).toFixed(2)
      ),
      userId: this.state.userDetails.userInfo?.userId,
    };

    this.setState({
      isProcessing: true,
    });
    var url = baseUrl + `/packages/${this.state.setPackage.id}/payments`;
    console.log('skdnkansfk', url, '  ', this.state.setPackage, '    ', body);
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        jwt: this.state.token,
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log('SAnajndkdf', result);
        this.setState({
          isProcessing: false,
        });
        if (result.error) {
          alert(result.error.message);
        } else {
          this.setState(
            {
              orderID: result.data.orderId,
            },
            () => {
              this.initiatePayment(result);
            }
          );
        }
      })
      .catch((error) => console.error(error));
  }

  async promoCodeAPI() {
    this.setState({
      isProcessing: true,
    });
    const data = {
      userId: this.state.userDetails.userInfo.userId,
    };

    var url = baseUrl + `/promo-codes/${this.state.promocode}/validate-usage`;
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        jwt: this.state.token,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        console.log('promocodeeedaa', result);
        if (result.code === 201) {
          if (result.data.promoCodeType === 'money') {
            this.setState(
              {
                discount_amount: parseFloat(result.data.discount),
                sgst: parseFloat(
                  ((this.state.total - result.data.discount) * 9) / 100
                ).toFixed(2),
                isProcessing: false,
                cgst: parseFloat(
                  ((this.state.total - result.data.discount) * 9) / 100
                ).toFixed(2),
                promoCodeDetails: result.data,
              },
              () => this.starttimer()
            );
          } else if (result.data.promoCodeType === 'percentage') {
            let percentage = (this.state.total * result.data.discount) / 100;
            this.setState(
              {
                promoCodeDetails: result.data,
                discount_amount: Math.round(percentage),
                sgst: parseFloat(
                  ((this.state.total - percentage) * 9) / 100
                ).toFixed(2),
                cgst: parseFloat(
                  ((this.state.total - percentage) * 9) / 100
                ).toFixed(2),
                isProcessing: false,
              },
              () => this.starttimer()
            );
          } else {
            this.setState({
              error: 'Invalid Coupon',
              promocode: '',
              promostatus: true,
              promostatusref: result.data.reference_id,
              discount_coupon: this.state.promocode,
              isProcessing: false,
            });
          }
        } else {
          this.setState({
            error: result.message,
            promostatus: false,
            promostatusref: '',
            isProcessing: false,
            discount_coupon: '',
          });
        }
      });
  }
  starttimer() {
    var interval = setInterval(() => {
      if (this.state.seconds === 0) {
        clearInterval(interval);
        this.setState(
          {
            timeup: true,
          },
          () => {
            this.setState({
              promostatus: false,
              promocode: '',
              seconds: 121,
              discount_amount: 0,
            });
          }
        );
      }
      this.setState({ seconds: this.state.seconds - 1 });
    }, 1000);
  }

  initiatePayment(data) {
    const { amount, orderId, currency } = data.data;

    //  var amount = 1
    var options = {
      description: 'My Professor',
      image: require('../../assets/images/logo_icon1.png'),
      currency,
      key: REACT_APP_RAZORPAY_KEY,
      amount: amount.toString(),
      name: 'My Professor',
      order_id: orderId, //Replace this with an order_id created using Orders API. Learn more at https://razorpay.com/docs/api/orders.
      prefill: {
        name:
          this.state.userDetails.userInfo.firstName +
          ' ' +
          this.state.userDetails.userInfo.lastName,
        email: this.state.userDetails.userInfo.email,
        contact: this.state.userDetails.userInfo.mobileNumber,
      },

      notes: {
        address: '',
      },
      theme: {
        color: '#61dafb',
      },
    };
    RazorpayCheckout.open(options).then((response) => {
      const newdata = {
        orderCreationId: data.id,
        razorpayPaymentId: response.razorpay_payment_id,
        razorpayOrderId: response.razorpay_order_id,
        razorpaySignature: response.razorpay_signature,
        reference_id: data.id,
      };
      var url =
        baseUrl +
        `/users/${this.state.userDetails.userInfo?.userId}/subscription-status`;
      return fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          jwt: this.state.token,
        },
      })
        .then((response) => response.json())
        .then((json) => {
          if (json) {
            if (json.data?.paymentStatus === 'payment_success') {
              Alert.alert('My Professor', 'Payment is done successfully.', [
                {
                  text: 'OK',
                  onPress: () => {
                    Actions.dashboard({ type: 'reset' });
                  },
                },
              ]);
            } else {
              Alert.alert(
                'My Professor',
                'Payment is not done please try agian.',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      Actions.dashboard({ type: 'reset' });
                    },
                  },
                ]
              );
            }
          } else {
            console.log(JSON.stringify(json.message));
          }
        })

        .catch((error) => console.error(error));
    });
  }

  buttonPressed = () => {
    this.props.navigation.goBack(null);
  };
  onBack() {
    if (this.props.from === 'heatmap') {
      Actions.pop({ type: 'reset' });
    } else {
      Actions.dashboard({ type: 'reset' });
    }
  }

  renderItem({ item, index }) {
    const isTablet = DeviceConstants.isTablet; // false
    var paddingver = 20,
      headfint = 16,
      rupeefont = 16,
      checkbox = 17;
    if (isTablet) {
      (paddingver = 30), (headfint = 22), (rupeefont = 22), (checkbox = 27);
    }
    return (
      <View
        style={{
          backgroundColor: '#fdf6f6',
          padding: paddingver,
          marginBottom: 10,
          flexDirection: 'row',
        }}
      >
        <View style={styles.titleView}>
          <Text style={{ fontSize: headfint }}>{item.name}</Text>
        </View>
        <View style={styles.emptyView} />
        <View style={{ flex: 0.4 }}>
          <Text style={[styles.text, { fontSize: rupeefont }]}>
            <Text style={{ fontSize: headfint }}>
              ₹ {item.cost}
              {'\n'}
            </Text>
            {'Validity: '}
            {item.toMonth}/{item.toYear}
          </Text>
        </View>
        <View style={styles.emptyView} />

        <View style={styles.radioBtnView}>
          {item === this.state.setPackage ? (
            <TouchableOpacity
              onPress={this.onCheckBoxClick.bind(this, item, false)}
            >
              <Image
                source={require('../../assets/images/check.png')}
                style={{
                  width: checkbox,
                  height: checkbox,
                  alignSelf: 'center',
                  tintColor: '#959595',
                }}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={this.onCheckBoxClick.bind(this, item, true)}
            >
              <Image
                source={require('../../assets/images/uncheck.png')}
                style={{
                  width: checkbox,
                  height: checkbox,
                  alignSelf: 'center',
                  tintColor: '#959595',
                }}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  onPay() {
    var total =
      this.state.total -
      this.state.discount_amount +
      this.state.cgst +
      this.state.sgst;
    if (total) {
      this.orderIDAPI();
    }
  }
  onactivationapply() {
    let data = {
      paymentType: 'activation_card',
      packageId: this.state.setPackage.id,
      activationCode: this.state.activationcode,
      packageCost: parseFloat(this.state.total),
      cgst: parseFloat(this.state.cgst),
      sgst: parseFloat(this.state.sgst),
      promoCode: '',
      promoCodeId: '',
      promoCodeAmount: 0,
      totalPrice: this.state.finaltotal,
      userId: this.state.userDetails.userInfo?.userId,
    };

    this.setState({
      isProcessing: true,
    });
    var url = baseUrl + `/packages/${this.state.setPackage.id}/payments`;
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        jwt: this.state.token,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        this.setState({
          isProcessing: false,
        });
        if (result.code === 201) {
          this.setState({
            activationcode: '',
          });
          Alert.alert('My Professor', 'Activation code applied successfully.', [
            {
              text: 'OK',
              onPress: () => {
                Actions.dashboard({ type: 'reset' });
              },
            },
          ]);
        } else {
          alert(result.error.message);
          this.setState({
            activationcode: '',
          });
        }
      });
  }
  render() {
    const isTablet = DeviceConstants.isTablet; // false
    var drawerwidth = 100,
      bgimage = windowWidth / 2.05,
      backheight = 18,
      backwidth = 23,
      topheight = windowWidth / 3.16,
      headfont = 18,
      textinputheight = 50,
      paywidth = windowWidth / 2.5;
    if (isTablet) {
      (drawerwidth = 700),
        (bgimage = windowWidth / 2),
        (backheight = 23),
        (backwidth = 33),
        (topheight = windowWidth / 5),
        (headfont = 25),
        (textinputheight = 60),
        (paywidth = windowWidth / 3.5);
    }
    var total = parseFloat(this.state.total);
    var discunt = parseFloat(this.state.discount_amount);
    var cgst = parseFloat(this.state.cgst);
    var sgst = parseFloat(this.state.sgst);
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Drawer
          type="overlay"
          ref={(ref) => (this._drawer = ref)}
          tapToClose
          openDrawerOffset={drawerwidth}
          content={<SideMenu closeControlPanel={this.closeControlPanel} />}
        >
          <View style={styles.container}>
            <ImageBackground
              source={require('../../assets/images/payment-bg.png')}
              style={{
                height: bgimage,
                width: windowWidth,
              }}
            >
              <TouchableOpacity onPress={this.onBack.bind(this)}>
                <Image
                  style={{
                    height: backheight,
                    width: backwidth,
                    marginLeft: 15,
                    marginTop: 20,
                    tintColor: colors.Themecolor,
                  }}
                  source={require('../../assets/images/refer/back.png')}
                />
              </TouchableOpacity>
            </ImageBackground>
            <View
              style={{
                position: 'absolute',
                top: topheight,
                bottom: 0,
                left: 0,
                right: 0,
              }}
            >
              <View style={styles.balView}>
                <View style={styles.subContent}>
                  <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={200}
                    style={{ flex: 1 }}
                  >
                    <ScrollView
                      contentInsetAdjustmentBehavior="automatic"
                      keyboardShouldPersistTaps={'handled'}
                      contentContainerStyle={{ flexGrow: 1 }}
                    >
                      {this.state.spinner ? (
                        <View style={{ flex: 1, alignItems: 'center' }}>
                          <Text style={{ fontSize: headfont }}>Loading...</Text>
                        </View>
                      ) : this.state.subjects.length > 0 ? (
                        <View
                          style={{
                            marginHorizontal: 20,
                            marginTop: 20,
                            justifyContent: 'center',
                            marginBottom: 20,
                          }}
                        >
                          {/* <Text style={{ fontSize: 20, color: colors.Themecolor, }} >Single Packages</Text> */}

                          <FlatList
                            data={this.state.subjects}
                            renderItem={this.renderItem.bind(this)}
                            keyExtractor={(item) => item.id}
                          />
                        </View>
                      ) : (
                        <View
                          style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <Text style={{ fontSize: headfont }}>No Data</Text>
                        </View>
                      )}

                      {this.state.total > 0 ? (
                        <>
                          <>
                            <View
                              style={{
                                margin: 10,
                                flexDirection: 'row',
                                justifyContent: 'space-evenly',
                              }}
                            >
                              <TextInput
                                style={{
                                  borderColor: 'lightgrey',
                                  borderBottomWidth: 1,
                                  borderWidth: 0.5,
                                  borderColor: 'lightgrey',
                                  height: textinputheight,
                                  paddingStart: 10,
                                  width: windowWidth / 1.2,
                                  fontSize: headfont,
                                  borderRadius: 10,
                                }}
                                placeholder="Having Promocode ?"
                                placeholderTextColor={'darkgrey'}
                                value={this.state.promocode}
                                onChangeText={(promocode) =>
                                  this.setState({ promocode, error: '' })
                                }
                              />
                              {this.state.promocode === '' ? null : (
                                <TouchableOpacity
                                  onPress={this.promoCodeAPI.bind(this)}
                                  style={{
                                    position: 'absolute',
                                    paddingHorizontal: 10,
                                    marginLeft: windowWidth / 1.5,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                  }}
                                >
                                  <Text style={{ fontSize: headfont }}>
                                    Apply
                                  </Text>
                                </TouchableOpacity>
                              )}
                            </View>
                            {this.state.promocode === '' ? null : this.state
                                .error !== '' ? (
                              <Text style={{ color: 'red', marginLeft: 20 }}>
                                Invalid Coupon
                              </Text>
                            ) : null}
                          </>
                          <View
                            style={{
                              margin: 10,
                              flexDirection: 'row',
                              justifyContent: 'space-evenly',
                            }}
                          >
                            <TextInput
                              style={{
                                borderColor: 'lightgrey',
                                borderBottomWidth: 1,
                                borderWidth: 0.5,
                                borderColor: 'lightgrey',
                                height: textinputheight,
                                paddingStart: 10,
                                width: windowWidth / 1.2,
                                fontSize: headfont,
                                borderRadius: 10,
                              }}
                              placeholder="Having Activationcode ?"
                              placeholderTextColor={'darkgrey'}
                              onChangeText={(activationcode) =>
                                this.setState({ activationcode })
                              }
                            />
                            {this.state.activationcode === '' ? null : (
                              <TouchableOpacity
                                onPress={this.onactivationapply.bind(this)}
                                style={{
                                  position: 'absolute',
                                  paddingHorizontal: 10,
                                  marginLeft: windowWidth / 1.5,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  alignSelf: 'center',
                                }}
                              >
                                <Text style={{ fontSize: headfont }}>
                                  Apply
                                </Text>
                              </TouchableOpacity>
                            )}
                          </View>
                          <View style={{ margin: 10 }}>
                            <View
                              style={{
                                flexDirection: 'row',
                                padding: 10,
                                justifyContent: 'space-between',
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: headfont,
                                  fontWeight: '400',
                                  color: 'grey',
                                }}
                              >
                                Price
                              </Text>
                              <Text
                                style={{
                                  fontSize: headfont,
                                  fontWeight: '400',
                                  color: 'grey',
                                }}
                              >
                                ₹ {this.state.total}
                              </Text>
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                                padding: 10,
                                justifyContent: 'space-between',
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: headfont,
                                  fontWeight: '400',
                                  color: 'grey',
                                }}
                              >
                                Discount (-)
                              </Text>
                              <Text
                                style={{
                                  fontSize: headfont,
                                  fontWeight: '400',
                                  color: 'grey',
                                }}
                              >
                                ₹ {this.state.discount_amount}
                              </Text>
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                                padding: 10,
                                justifyContent: 'space-between',
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: headfont,
                                  fontWeight: '400',
                                  color: 'grey',
                                }}
                              >
                                CGST (9%)
                              </Text>
                              <Text
                                style={{
                                  fontSize: headfont,
                                  fontWeight: '400',
                                  color: 'grey',
                                }}
                              >
                                ₹ {this.state.cgst}
                              </Text>
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                                padding: 10,
                                justifyContent: 'space-between',
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: headfont,
                                  fontWeight: '400',
                                  color: 'grey',
                                }}
                              >
                                SGST (9%)
                              </Text>
                              <Text
                                style={{
                                  fontSize: headfont,
                                  fontWeight: '400',
                                  color: 'grey',
                                }}
                              >
                                ₹ {this.state.sgst}
                              </Text>
                            </View>

                            <View
                              style={{
                                flexDirection: 'row',
                                paddingHorizontal: 10,
                                paddingVertical: 15,
                                justifyContent: 'space-between',
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: headfont,
                                  fontWeight: '400',
                                  color: 'grey',
                                }}
                              >
                                Total
                              </Text>
                              <Text
                                style={{
                                  fontSize: headfont,
                                  fontWeight: '400',
                                  color: 'grey',
                                }}
                              >
                                ₹{' '}
                                {parseFloat(
                                  total - discunt + cgst + sgst
                                ).toFixed(2)}
                              </Text>
                            </View>
                          </View>

                          <LinearGradient
                            colors={['#fab491', '#f79285', '#f2737a']}
                            style={{
                              flexDirection: 'row',
                              height: textinputheight,
                              borderRadius: 10,
                              marginVertical: 20,
                              width: paywidth,
                              alignSelf: 'center',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            <TouchableOpacity
                              onPress={this.onPay.bind(this)}
                              style={{
                                flexDirection: 'row',
                                height: textinputheight,
                                borderRadius: 10,
                                width: paywidth,
                                alignSelf: 'center',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                            >
                              <Text
                                style={[styles.payText, { fontSize: headfont }]}
                              >
                                Pay
                              </Text>
                              {this.state.seconds !== 120 &&
                              this.state.promocode !== '' ? (
                                <Text style={{ fontSize: 15, color: 'white' }}>
                                  ({parseInt(this.state.seconds / 60, 10)}:
                                  {parseInt(this.state.seconds % 60, 10)})
                                </Text>
                              ) : null}
                            </TouchableOpacity>
                          </LinearGradient>
                        </>
                      ) : null}
                    </ScrollView>
                  </KeyboardAvoidingView>
                </View>
              </View>
            </View>
            {this.state.isProcessing ? (
              <View
                style={{
                  height: windowHeight,
                  width: windowWidth,
                  position: 'absolute',
                  backgroundColor: 'transparent',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <ActivityIndicator />
              </View>
            ) : null}
          </View>
        </Drawer>
      </SafeAreaView>
    );
  }
}

export default BuyPackages;
