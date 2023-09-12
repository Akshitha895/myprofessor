import React, { Component } from 'react';
import {
  BackHandler,
  Image,
  ImageBackground,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
//import PDFView from 'react-native-view-pdf';
import Pdf from 'react-native-pdf';
import { Actions } from 'react-native-router-flux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { WebView } from 'react-native-webview';
import { baseUrl, colors, imageUrl } from '../../../constants';

// const resources = {
//   file:
//     Platform.OS === 'ios'
//       ? 'downloadedDocument.pdf'
//       : '/sdcard/Download/downloadedDocument.pdf',
//   url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
//   base64: 'JVBERi0xLjMKJcfs...',
// };
// var cachePath;
class ProfPdfViewNew extends Component {
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
    console.log('dnkcklankdf', data);
    const url =
      baseUrl + `/activities/${data.id}/activity-info/${data.activityInfoId}`;
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
        if (json.data) {
          const data = json.data;
          console.log('sndjksndjksnd', this.props.data);
          if (this.props.data.activityType === 'pdf') {
            var string = data.validPdfPages;
            if (json.data.url) {
              var newarr = string.split(',');

              this.setState(
                {
                  pdfdata: data.url,
                  ispdf: true,
                  pdfpagesarray: newarr,
                  spinner: false,
                  page: data.pdfPagePausedAt,
                  //typedata: newdata[newdata.length-1],
                  index: 0,
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
          } else if (this.props.data.activityType === 'html') {
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
          // var string = data.pdfpages
          // var newarr = string.split(',');

          // this.setState({
          //   pdfdata: data.url,

          //   pdfpagesarray: newarr,
          //   spinner: false,
          //   page: 3,
          //   index: 0
          // },()=>{
          //       console.log("newrrrr",newarr)
          // })
        } else {
          console.log('errorororrrdata', json.message);
          // alert(JSON.stringify(json.message))
        }
      })
      .catch((error) => console.error(error));
  }
  onPageChanged() {}
  updateAnalytics(newdata, duration) {
    var activityPdfPage;
    if (this.state.pdfpagesarray[this.state.index - 1] === undefined) {
      activityPdfPage = '-1';
    } else {
      activityPdfPage = this.state.pdfpagesarray[this.state.index - 1];
    }
    const { data, topicindata, topicData } = this.props;
    console.log('dmvnmzdv', topicindata, topicData);

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
        Actions.push('ProVideoView', {
          index: index + 1,
          smartres: this.props.smartres,
          data: newobj,
          topicData: this.props.topicData,
          subjectData: this.props.subjectData,
          topicindata: this.props.topicindata,
          from: this.props.from,
        });
      } else if (newobj.activityType === 'video') {
        Actions.push('ProfNormalVideo', {
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
        Actions.push('ProfPreAssesment', {
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
        newobj.activityType === 'HTML5'
      ) {
        Actions.push('ProfPdfViewNew', {
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
        Actions.push('ProWebLinkView', {
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
        Actions.push('ProfConceptVideo', {
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
        Actions.push('ProVideoView', {
          index: index - 1,
          smartres: this.props.smartres,
          data: newobj,
          topicData: this.props.topicData,
          subjectData: this.props.subjectData,
          topicindata: this.props.topicindata,
          from: this.props.from,
        });
      } else if (newobj.activityType === 'video') {
        Actions.push('ProfNormalVideo', {
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
        Actions.push('ProfPreAssesment', {
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
        newobj.activityType === 'HTML5'
      ) {
        Actions.push('ProfPdfViewNew', {
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
        Actions.push('ProWebLinkView', {
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
        Actions.push('ProfConceptVideo', {
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
    var newindex = this.state.index - 1;
    this.setState(
      {
        index: newindex,
      },
      () => console.log('preee', this.state.index)
    );
  }
  onNextIndex() {
    var newindex = this.state.index + 1;
    this.setState(
      {
        index: newindex,
      },
      () => console.log('nexttt', this.state.index)
    );
  }
  render() {
    //   console.log("vv", imageUrl + this.state.pdfdata)
    const { topicindata } = this.props;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <>
          <ImageBackground
            source={require('../../../assets/images/dashboard/new/activitybg.jpg')}
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
                        source={require('../../../assets/images/left-arrow.png')}
                        style={{ width: 25, height: 25, tintColor: 'white' }}
                      />
                    </TouchableOpacity>

                    <Text
                      style={{ color: 'white', fontSize: 18, marginLeft: 10 }}
                    >
                      {'Notes'}
                    </Text>
                  </View>
                </View>
                {/* <View style={{flex:0.3,justifyContent:"center"}}>
              { topicindata.image !== "null" ?
              <Image source={{ uri: imageUrl + topicindata.image }} style={{ width: 100, height: 100, resizeMode: "contain", marginRight: 10, }} />

              : <Image source={require('../../assets/images/noimage.png')}
              style={{ width: 80, height: 80, resizeMode: "contain", marginRight: 10, }} />}
              </View> */}
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
                    <Text>Loading.....</Text>
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
                      <Text>No Data.....</Text>
                    </View>
                  ) : (
                    <View style={{ flex: 1 }}>
                      <View style={{ flex: 0.95 }}>
                        <Pdf
                          ref={(pdf) => {
                            this.pdf = pdf;
                          }}
                          page={this.state.page}
                          source={{ uri: this.state.pdfdata }}
                          //resourceType={resourceType}
                          singlePage
                          // horizontal={true}
                          //scale={2}
                          // maxScale={30}
                          onLoadComplete={(numberOfPages, filePath) => {
                            console.log(`number of pages: ${numberOfPages}`);
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
                            flex: 1,
                            width: '100%',
                            height: '100%',
                          }}
                        />
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
                              alignItems: 'flex-start',
                            }}
                          >
                            <TouchableOpacity
                              style={{
                                height: 30,
                                borderRadius: 20,
                                backgroundColor: 'white',
                                paddingHorizontal: 10,
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                              onPress={this.onPrevIndex.bind(this)}
                            >
                              <Text
                                style={{
                                  textAlign: 'center',
                                  fontSize: 13,
                                  color: colors.Themecolor,
                                }}
                              >
                                Previous
                              </Text>
                            </TouchableOpacity>
                          </View>
                        )}
                        <Text
                          style={{ color: colors.Themecolor, fontSize: 15 }}
                        >
                          Page {this.state.index + 1} of{' '}
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
                              alignItems: 'flex-end',
                            }}
                          >
                            <TouchableOpacity
                              style={{
                                height: 30,
                                borderRadius: 20,
                                backgroundColor: 'white',
                                paddingHorizontal: 10,
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                              onPress={this.onNextIndex.bind(this)}
                            >
                              <Text
                                style={{
                                  textAlign: 'center',
                                  fontSize: 13,
                                  color: colors.Themecolor,
                                }}
                              >
                                Next
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
                    source={{ uri: imageUrl + this.state.notesdata }}
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
                    height: 30,
                    borderRadius: 20,
                    backgroundColor: 'white',
                    paddingHorizontal: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={this.onPrevious.bind(this)}
                >
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 12,
                      color: colors.Themecolor,
                    }}
                  >
                    Previous Activity
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    height: 30,
                    borderRadius: 20,
                    backgroundColor: 'white',
                    paddingHorizontal: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={this.onNext.bind(this)}
                >
                  {this.props.smartres[this.props.index + 1] ? (
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: 12,
                        color: colors.Themecolor,
                      }}
                    >
                      Next Activity
                    </Text>
                  ) : (
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: 12,
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

export default ProfPdfViewNew;
