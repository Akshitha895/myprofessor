import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import {
  Alert,
  BackHandler,
  Image,
  ImageBackground,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
//import PDFView from 'react-native-view-pdf';
import moment from 'moment';
import DeviceConstants from 'react-native-device-constants';
import Pdf from 'react-native-pdf';
import { Actions } from 'react-native-router-flux';
import { WebView } from 'react-native-webview';
import { baseUrl, colors } from '../../constants';

// const resources = {
//   file:
//     Platform.OS === 'ios'
//       ? 'downloadedDocument.pdf'
//       : '/sdcard/Download/downloadedDocument.pdf',
//   url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
//   base64: 'JVBERi0xLjMKJcfs...',
// };
// var cachePath;
class PdfViewNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinner: true,
      pdfdata: '',
      padfpages: null,
      pdfpagesarray: [],
      page: null,
      inital: 0,
      analyticsData: {},
      token: '',
      isvisible: false,
      selectedPage: 0,
      visibleItem: {},
      error: false,
      notesdata: '',
      ispdf: false,
      ishtml: false,
      typedata: '',
      activityStartTime: null,
      userDetails: null,
      scale: 1,
      nodataurl: false,
    };
  }
  componentDidMount() {
    const activityStartTime = moment().format('YYYY-MM-DD HH:mm:ss');
    this.setState({
      activityStartTime,
    });
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
  getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@user');
      //  alert(JSON.stringify(value))
      if (value !== null) {
        var data = JSON.parse(value);

        const token = await AsyncStorage.getItem('@access_token');
        if (token && data) {
          this.setState({
            token: JSON.parse(token),
            userDetails: data,
          });
          // this.getanalytics(data, JSON.parse(token))
          this.getActivityInfo(data, JSON.parse(token));
        } else {
          console.log('hihii');
        }
      } else {
        alert('errorrr');
      }
    } catch (e) {
      return null;
    }
  };

  getActivityInfo(user, token) {
    // var url;
    const { data } = this.props;
    var userId = user.userInfo.userId;
    var activityDimId = data.activityDimId;
    const url =
      baseUrl + `/analytics/users/${userId}/activities/${activityDimId}`;
    console.log('asdnfJKashdkjahdklajhD', url);
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        jwt: token,
      },
    })
      .then((response) => response.json())
      .then(async (json) => {
        console.log('newdadttataa.....a', json);
        if (json.code === 201) {
          if (json.data) {
            const data = json.data;

            if (json.data.activityType === 'pdf') {
              var string = data.validPdfPages;
              if (json.data.url) {
                var newarr = string.split(',');
                console.log('.,ac', newarr);
                var newindex;
                var ibendex = newarr.findIndex(
                  (x) => x === data.pdfPagePausedAt.toString()
                );
                if (ibendex === -1) {
                  console.log('xcknkzjck');
                  newindex = 0;
                } else {
                  console.log('weqwewewqe');

                  newindex = ibendex;
                }
                console.log('skkasmdk', data, ibendex, newindex);
                this.setState(
                  {
                    pdfdata: data.url,
                    ispdf: true,
                    pdfpagesarray: newarr,
                    spinner: false,
                    page:
                      data.pdfPagePausedAt === -1 ? 1 : data.pdfPagePausedAt,
                    index:
                      data.pdfPagePausedAt === -1 ? 0 : data.pdfPagePausedAt,
                  },
                  () => {
                    console.log('newrrrr', newarr);
                  }
                );
              } else {
                this.setState({
                  nodataurl: true,
                  //  ishtml: true,
                  spinner: false,
                  // ty
                });
              }
            } else if (json.data.activityType === 'html5') {
              console.log('dkmfk.admk.a', data.url);
              this.setState({
                notesdata: data.url,
                ishtml: true,
                spinner: false,
                // typedata: newdata[newdata.length-1],
              });
            } else {
              this.setState({
                spinner: false,
              });
            }
          } else {
            console.log('errorororrrdata', json.message);
            // alert(JSON.stringify(json.message))
          }
        } else if (json.error?.code === 400) {
          //alert("dknkdf")
          Alert.alert('My Professor', json.error.message, [
            { text: 'OK', onPress: () => this.logout() },
          ]);
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
  onPageChanged() {}
  updateAnalytics(newdata, duration) {
    var activityPdfPage;
    if (this.state.pdfpagesarray[this.state.index] === undefined) {
      activityPdfPage = '1';
    } else {
      activityPdfPage = this.state.pdfpagesarray[this.state.index];
    }
    const { data, topicindata, topicData } = this.props;
    console.log('dmvnmzdv', activityPdfPage);

    if (this.props.data.activityType)
      var body = {
        activityDimId: data.activityDimId,
        universityId: this.state.userDetails.userOrg.universityId,
        branchId: this.state.userDetails.userOrg.branchId,
        semesterId: this.state.userDetails.userOrg.semesterId,

        subjectId: topicData?.subjectId
          ? topicData.subjectId
          : topicindata?.subjectId
          ? topicindata.subjectId
          : null,
        chapterId: topicData?.chapterId
          ? topicData.chapterId
          : topicindata?.chapterId
          ? topicindata.chapterId
          : null,
        topicId: topicData?.topicId
          ? topicData.topicId
          : topicindata?.topicId
          ? topicindata.topicId
          : null,
        activityStartedAt: this.state.activityStartTime,
        activityEndedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        activityPdfPage,
        pdfPagePausedAt: this.state.pdfpagesarray[this.state.index],
      };
    console.log('newboddyyy', body);
    var userId = this.state.userDetails.userInfo.userId;
    var url = baseUrl + `/users/${userId}/analytics/capture-activity`;
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
        console.log('kanckanCKACKD', JSON.stringify(json));
        if (json.data) {
          const data = json.data;

          this.setState({
            analyticsData: data,
          });
          //    Snackbar.show({
          // 	text: "Analytics Updated succesfully",
          // 	duration: Snackbar.LENGTH_SHORT,
          //   });
        } else {
          console.log('ncmxcmnxc', JSON.stringify(json));
        }
      })
      .catch((error) => console.error(error));
  }
  onNext() {
    this.updateAnalytics();
    var newarray = this.props.smartres;
    var newobj = newarray[this.props.index + 1];
    var index = this.props.index;
    console.log('next', this.props.index, ' ', newobj);
    if (newobj) {
      if (newobj.activityType === 'youtube') {
        Actions.push('videoview', {
          index: index + 1,
          smartres: this.props.smartres,
          data: newobj,
          topicData: this.props.topicData,
          subjectData: this.props.subjectData,
          topicindata: this.props.topicindata,
          from: this.props.from,
        });
      } else if (newobj.activityType === 'video') {
        Actions.push('normalvideoview', {
          index: index + 1,
          smartres: this.props.smartres,
          data: newobj,
          topicData: this.props.topicData,
          subjectData: this.props.subjectData,
          topicindata: this.props.topicindata,
          from: this.props.from,
        });
      } else if (
        newobj.activityType === 'obj' ||
        newobj.activityType === 'post' ||
        newobj.activityType === 'sub'
      ) {
        Actions.push('preassesment', {
          index: index + 1,
          smartres: this.props.smartres,
          data: newobj,
          topicData: this.props.topicData,
          subjectData: this.props.subjectData,
          topicindata: this.props.topicindata,
          from: this.props.from,
        });
      } else if (
        newobj.activityType === 'pdf' ||
        newobj.activityType === 'html5'
      ) {
        Actions.push('pdfview', {
          index: index + 1,
          smartres: this.props.smartres,
          data: newobj,
          topicData: this.props.topicData,
          subjectData: this.props.subjectData,
          topicindata: this.props.topicindata,
          from: this.props.from,
        });
      } else if (
        newobj.activityType === 'web' ||
        newobj.activityType === 'exploratory_learning'
      ) {
        Actions.push('weblinkview', {
          index: index + 1,
          smartres: this.props.smartres,
          data: newobj,
          topicData: this.props.topicData,
          subjectData: this.props.subjectData,
          topicindata: this.props.topicindata,
          from: this.props.from,
        });
      } else if (newobj.activityType === 'pre') {
        Actions.topicmainview({
          data: this.props.topicindata,
          topicsdata: this.props.topicData,
          screen: 'summary',
          subjectData: this.props.subjectData,
          from: this.props.from,
        });
      } else if (newobj.activityType === 'games') {
        Actions.push('games', {
          index: index + 1,
          smartres: this.props.smartres,
          data: newobj,
          topicData: this.props.topicData,
          subjectData: this.props.subjectData,
          topicindata: this.props.topicindata,
          from: this.props.from,
        });
      } else if (newobj.activityType === 'conceptual_video') {
        Actions.push('conceptvideo', {
          index: index + 1,
          smartres: this.props.smartres,
          data: newobj,
          topicData: this.props.topicData,
          subjectData: this.props.subjectData,
          topicindata: this.props.topicindata,
          from: this.props.from,
        });
      }
    } else {
      Actions.topicmainview({
        data: this.props.topicindata,
        topicsdata: this.props.topicData,
        screen: 'summary',
        subjectData: this.props.subjectData,
        from: this.props.from,
      });
    }
  }
  onPrevious() {
    this.updateAnalytics();
    var newarray = this.props.smartres;
    var newobj = newarray[this.props.index - 1];
    var index = this.props.index;
    console.log('onprevious', this.props.index, ' ', newobj);
    if (newobj) {
      if (newobj.activityType === 'youtube') {
        Actions.push('videoview', {
          index: index - 1,
          smartres: this.props.smartres,
          data: newobj,
          topicData: this.props.topicData,
          subjectData: this.props.subjectData,
          topicindata: this.props.topicindata,
          from: this.props.from,
        });
      } else if (newobj.activityType === 'video') {
        Actions.push('normalvideoview', {
          index: index - 1,
          smartres: this.props.smartres,
          data: newobj,
          topicData: this.props.topicData,
          subjectData: this.props.subjectData,
          topicindata: this.props.topicindata,
          from: this.props.from,
        });
      } else if (
        newobj.activityType === 'obj' ||
        newobj.activityType === 'post' ||
        newobj.activityType === 'sub'
      ) {
        Actions.push('preassesment', {
          index: index - 1,
          smartres: this.props.smartres,
          data: newobj,
          topicData: this.props.topicData,
          subjectData: this.props.subjectData,
          topicindata: this.props.topicindata,
          from: this.props.from,
        });
      } else if (
        newobj.activityType === 'pdf' ||
        newobj.activityType === 'html5'
      ) {
        Actions.push('pdfview', {
          index: index - 1,
          smartres: this.props.smartres,
          data: newobj,
          topicData: this.props.topicData,
          subjectData: this.props.subjectData,
          topicindata: this.props.topicindata,
          from: this.props.from,
        });
      } else if (
        newobj.activityType === 'web' ||
        newobj.activityType === 'exploratory_learning'
      ) {
        Actions.push('weblinkview', {
          index: index - 1,
          smartres: this.props.smartres,
          data: newobj,
          topicData: this.props.topicData,
          subjectData: this.props.subjectData,
          topicindata: this.props.topicindata,
          from: this.props.from,
        });
      } else if (newobj.activityType === 'pre') {
        Actions.topicmainview({
          data: this.props.topicindata,
          topicsdata: this.props.topicData,
          screen: 'summary',
          subjectData: this.props.subjectData,
          from: this.props.from,
        });
      } else if (newobj.activityType === 'games') {
        Actions.push('games', {
          index: index - 1,
          smartres: this.props.smartres,
          data: newobj,
          topicData: this.props.topicData,
          subjectData: this.props.subjectData,
          topicindata: this.props.topicindata,
          from: this.props.from,
        });
      } else if (newobj.activityType === 'conceptual_video') {
        Actions.push('conceptvideo', {
          index: index - 1,
          smartres: this.props.smartres,
          data: newobj,
          topicData: this.props.topicData,
          subjectData: this.props.subjectData,
          topicindata: this.props.topicindata,
          from: this.props.from,
        });
      }
    } else {
      Actions.topicmainview({
        data: this.props.topicindata,
        topicsdata: this.props.topicData,
        screen: 'summary',
        subjectData: this.props.subjectData,
        from: this.props.from,
      });
    }
  }

  onBack() {
    this.updateAnalytics();
    Actions.topicmainview({
      type: 'reset',
      data: this.props.topicindata,
      topicsdata: this.props.topicData,
      screen: 'summary',
      subjectData: this.props.subjectData,
      from: this.props.from,
    });
  }
  onPDFVIew(item) {
    this.setState(
      {
        selectedPage: item,
      },
      () => {
        this.setState({
          isvisible: true,
        });
      }
    );
  }

  onViewableItemsChanged = ({ viewableItems, changed }) => {
    this.setState({
      visibleItem: viewableItems[0],
    });
    console.log('Visible items are', viewableItems);
    console.log('Changed in this iteration', changed);
  };
  onPrevIndex() {
    console.log('s,nmcklasc', this.state.pdfpagesarray, this.state.page);
    this.setState({ spinner: true }, () => {
      var newindex = this.state.index - 1;
      this.setState(
        {
          index: newindex,
          page: this.state.page - 1,
          spinner: false,
        },
        () =>
          console.log('sdasdasDsad', this.state.pdfpagesarray, this.state.page)
      );
    });
  }
  onNextIndex() {
    this.setState({ spinner: true }, () => {
      var newindex = this.state.index + 1;
      this.setState(
        {
          index: newindex,
          page: this.state.page + 1,
          spinner: false,
        },
        () =>
          console.log('sdasdasDsad', this.state.pdfpagesarray, this.state.page)
      );
    });
  }
  onzoomin() {
    let scale = this.state.scale * 1.2;
    scale = scale > 3 ? 3 : scale;
    this.setState({ scale });
    console.log(`zoomIn scale: ${scale}`);
  }
  onzoomout() {
    let scale = this.state.scale > 1 ? this.state.scale / 1.2 : 1;
    this.setState({ scale });
    console.log(`zoomOut scale: ${scale}`);
  }
  render() {
    //  console.log("vv", imageUrl + this.state.pdfdata)
    const { topicindata } = this.props;
    const isTablet = DeviceConstants.isTablet; // false
    var headfont = 18,
      backheight = 25,
      subfont = 12,
      paddingver = 40,
      paddinghori = 10,
      radius = 20;
    if (isTablet) {
      (headfont = 30),
        (backheight = 40),
        (subfont = 20),
        (paddingver = 50),
        (paddinghori = 20),
        (radius = 30);
    }
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <>
          <ImageBackground
            source={require('../../assets/images/dashboard/new/activitybg.jpg')}
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: colors.Themecolor,
            }}
            opacity={0.5}
          >
            <View style={{ flex: 1 }}>
              <View style={{ flex: 0.08, flexDirection: 'row' }}>
                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      flex: 1,
                      marginLeft: 20,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <TouchableOpacity onPress={this.onBack.bind(this)}>
                      <Image
                        source={require('../../assets/images/left-arrow.png')}
                        style={{
                          width: backheight,
                          height: backheight,
                          tintColor: 'white',
                        }}
                      />
                    </TouchableOpacity>

                    <Text
                      style={{
                        color: 'white',
                        fontSize: headfont,
                        marginLeft: 10,
                      }}
                    >
                      {'Notes'}
                    </Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  flex: 0.84,
                  backgroundColor: 'white',
                  marginLeft: 10,
                  marginRight: 10,
                  borderRadius: 20,
                  overflow: 'hidden',
                }}
              >
                {this.state.spinner ? (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ fontSize: headfont }}>Loading.....</Text>
                  </View>
                ) : this.state.ispdf ? (
                  this.state.nodataurl ? (
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{ fontSize: headfont }}>No Data.....</Text>
                    </View>
                  ) : (
                    <View style={{ flex: 1 }}>
                      <View style={{ flex: 0.95 }}>
                        <Pdf
                          ref={(pdf) => {
                            this.pdf = pdf;
                          }}
                          page={this.state.page}
                          scale={this.state.scale}
                          source={{ uri: this.state.pdfdata }}
                          //resourceType={resourceType}
                          singlePage={Platform.OS === 'android' ? true : true}
                          // horizontal={true}
                          maxScale={3.0}
                          onLoadComplete={(numberOfPages, filePath) => {
                            console.log(
                              `number of pages: ${numberOfPages}, {}`
                            );
                          }}
                          onPageChanged={this.onPageChanged.bind(this)}
                          onError={(error) => {
                            console.log('ffffe', error);
                            this.setState({
                              error: true,
                            });
                          }}
                          onPressLink={(uri) => {
                            console.log(`Link presse: ${uri}`);
                          }}
                          //spacing={5}
                          style={{
                            height: '100%',
                            width: '100%',
                          }}
                        />
                      </View>
                      <View
                        style={{
                          position: 'absolute',
                          top: 30,
                          flexDirection: 'row',
                          right: 30,
                          borderRadius: 20,
                          borderWidth: 1,
                        }}
                      >
                        <TouchableOpacity
                          onPress={this.onzoomin.bind(this)}
                          style={{
                            width: 35,
                            height: 35,
                            alignItems: 'center',
                          }}
                        >
                          <Text style={{ fontSize: 25 }}>+</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={this.onzoomout.bind(this)}
                          style={{
                            width: 35,
                            height: 35,
                            alignItems: 'center',
                            borderLeftWidth: 1,
                          }}
                        >
                          <Text style={{ fontSize: 25 }}>-</Text>
                        </TouchableOpacity>
                      </View>
                      <View
                        style={{
                          flex: 0.05,
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginLeft: 10,
                          marginRight: 10,
                          alignItems: 'center',
                        }}
                      >
                        {this.state.index === 0 ? (
                          <View style={{ flex: 0.5 }} />
                        ) : (
                          <View
                            style={{
                              flex: 0.5,
                              justifyContent: 'flex-start',
                              alignItems: 'flex-end',
                            }}
                          >
                            <TouchableOpacity
                              style={{
                                height: paddingver,
                                borderRadius: 20,
                                backgroundColor: 'white',
                                paddingHorizontal: paddinghori,
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                              onPress={this.onPrevIndex.bind(this)}
                            >
                              <Text
                                style={{
                                  textAlign: 'center',
                                  fontSize: subfont,
                                  color: colors.Themecolor,
                                }}
                              >
                                {'< Previous'}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        )}
                        <Text
                          style={{
                            color: colors.Themecolor,
                            fontSize: subfont + 2,
                          }}
                        >
                          Page {this.state.page} of{' '}
                          {this.state.pdfpagesarray.length}
                        </Text>
                        {this.state.index + 1 ===
                        this.state.pdfpagesarray.length ? (
                          <View style={{ flex: 0.5 }} />
                        ) : (
                          <View
                            style={{
                              flex: 0.5,
                              justifyContent: 'flex-start',
                              alignItems: 'flex-start',
                            }}
                          >
                            <TouchableOpacity
                              style={{
                                height: paddingver,
                                borderRadius: 20,
                                backgroundColor: 'white',
                                paddingHorizontal: paddinghori,
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                              onPress={this.onNextIndex.bind(this)}
                            >
                              <Text
                                style={{
                                  textAlign: 'center',
                                  fontSize: subfont,
                                  color: colors.Themecolor,
                                }}
                              >
                                {'Next >'}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    </View>
                  )
                ) : this.state.ishtml ? (
                  <WebView
                    androidLayerType="hardware"
                    style={{ minHeight: 1 }}
                    source={{ uri: this.state.notesdata }}
                    mixedContentMode="always"
                    allowsInlineMediaPlayback="true"
                    userAgent="Mozilla/5.0 (Linux; Android 9; Redmi Note 8 Build/PKQ1.190616.001) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Mobile Safari/537.36"
                  />
                ) : null}
              </View>
              <View
                style={{
                  flex: 0.08,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginLeft: 10,
                  marginRight: 10,
                  alignItems: 'center',
                }}
              >
                <TouchableOpacity
                  style={{
                    height: paddingver,
                    borderRadius: radius,
                    backgroundColor: 'white',
                    paddingHorizontal: paddinghori,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={this.onPrevious.bind(this)}
                >
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: subfont,
                      color: colors.Themecolor,
                    }}
                  >
                    Previous Activity
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    height: paddingver,
                    borderRadius: radius,
                    backgroundColor: 'white',
                    paddingHorizontal: paddinghori,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={this.onNext.bind(this)}
                >
                  {this.props.smartres[this.props.index + 1] ? (
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: subfont,
                        color: colors.Themecolor,
                      }}
                    >
                      Next Activity
                    </Text>
                  ) : (
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: subfont,
                        color: colors.Themecolor,
                      }}
                    >
                      Done
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </>
      </SafeAreaView>
    );
  }
}

export default PdfViewNew;
