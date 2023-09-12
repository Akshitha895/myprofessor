import moment from 'moment';
import React, { Component } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  FlatList,
  ImageBackground,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Actions } from 'react-native-router-flux';

import AsyncStorage from '@react-native-async-storage/async-storage';
import MathJax from 'react-native-mathjax';

import { baseUrl } from '../../../constants';

import { colors } from '../../../constants';
import styles from './styles';
var alphabetarray = [
  'A',
  'B',
  'c',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
];
var interval;
class ProfPreAssesment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItem: null,
      previousItem: null,
      isvisible: false,
      finalarray: [],
      answerobj: {},
      selectedAnswerObj: {},
      useDetails: null,
      questiosnarray: [],
      timeup: false,
      spinner: true,
      questionno: 0,
      seconds: 0,
      secondstime: 0,
      testid: '',
      token: '',
      testloader: false,
      analyticsData: {},
      token: '',
      modalshow: false,
      getquestionsdata: [],
      newquestionid: 1,
      loading: true,
      reattempt: false,
      activityStartTime: null,
    };
  }
  componentDidMount() {
    const activityStartTime = moment().format('YYYY-MM-DD HH:mm:ss');
    if (this.props.data.progress === 0) {
      AsyncStorage.removeItem('@attemptno');
    }
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
    return true;
    // Actions.topicmainview({from:this.props.from,type:"reset",data:this.props.topicindata,topicsdata:this.props.topicData,screen:"summary",subjectData:this.props.subjectData})
  };

  getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@user');
      //alert(JSON.stringify(value))
      if (value !== null) {
        var data = JSON.parse(value);
        this.setState({
          useDetails: data,
        });
        const token = await AsyncStorage.getItem('@access_token');
        if (token && data) {
          this.setState({ token: JSON.parse(token) });

          //   this.getanalytics(this.state.useDetails,this.state.token)
          this.onAssesment();
        } else {
          // console.log("hihii")
        }
      } else {
        alert('errorrr');
      }
    } catch (e) {
      return null;
    }
  };
  onok() {
    this.setState(
      {
        modalshow: false,
      },
      () => {
        //
        this.starttimer();
        this.getQuestionById();
      }
    );
  }
  onDoneNext() {
    var newarray = this.props.smartres;
    var newobj = newarray[this.props.index + 1];
    var index = this.props.index;
    console.log('nextdkjnfkjdsanfd', newobj);
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
  onDonePrevious() {
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
  onDone() {
    Actions.topicmainview({
      from: this.props.from,
      type: 'reset',
      data: this.props.topicindata,
      topicsdata: this.props.topicData,
      screen: 'summary',
      subjectData: this.props.subjectData,
    });
  }
  onStartcancel() {
    this.setState(
      {
        modalshow: false,
      },
      () => {
        Actions.topicmainview({
          from: this.props.from,
          type: 'reset',
          data: this.props.topicindata,
          topicsdata: this.props.topicData,
          screen: 'summary',
          subjectData: this.props.subjectData,
        });
      }
    );
  }
  removeHtmlTags = (value) => {
    // let sourceHTML = value.getElementsByTagName("p");
    // sourceHTML = sourceHTML.replace(/<--!(?:.|\n)*?-->/gm, '');
    // console.log("ddddd",sourceHTML);

    //     const parser = new DOMParser.DOMParser();
    //     const parsed = parser.parseFromString(value, 'text/html');
    //     console.log(parsed.getElementsByAttribute('tagName', 'p'));

    //    console.log("dddddd",JSON.parse(parsed))
    return value;
  };
  getanalytics(user, token) {
    var type;
    if (this.props.data.type === 'PRE') {
      type = 'MyCourse_preassessment';
    } else if (this.props.data.type === 'POST') {
      type = 'MyCourse_postassessment';
    } else if (this.props.data.type === 'OBJ') {
      type = 'MyCourse_objassessment';
    } else {
      type = 'MyCourse_subjectiveAssessment';
    }
    var body = {
      user_id: user.reference_id,
      board_id: user.grade ? user.grade.board_id : null,
      grade_id: user.grade ? user.grade.reference_id : null,
      section_id: user.section ? user.section.reference_id : null,
      school_id: user.school ? user.school.reference_id : null,
      branch_id: user.grade ? user.grade.branch_id : null,
      page: type,
      type: 'mobile',
      subject_id: this.props.subjectData.reference_id,
      chapter_id: this.props.topicData.reference_id,
      topic_id: this.props.topicindata.reference_id,
      activity_id: this.props.data.reference_id,
    };

    //  console.log("analyticsss", body)
    var url = baseUrl + '/analytics';
    //console.log("value", url)
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
          //  Snackbar.show({
          // text: json.message,
          // duration: Snackbar.LENGTH_SHORT,
          // });
        } else {
          //console.log(JSON.stringify(json.message))
        }
      })
      .catch((error) => console.error(error));
  }
  getItemLayout = (data, index) => ({ length: 50, offset: 50 * index, index });
  scrollToIndex = (index) => {
    let randomIndex = index;
    this.flatListRef.scrollToIndex({ animated: true, index: randomIndex });
  };
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
  onAssesment() {
    const { data } = this.props;
    //  var userId  = user.userInfo.userId;
    console.log('dnkcklankdf', data);
    const url = baseUrl + `/activities/${data.id}/questions`;
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        jwt: this.state.token,
      },
    })
      .then((response) => response.json())
      .then(async (json) => {
        console.log('activity dataaaa', json.data);
        if (json.data) {
          const data = json.data;
          if (this.props.data.activityType === 'obj') {
            let questions = [];
            console.log('dknfkdaf', json.data);
            json.data.map((data) => {
              let obj = {
                question: data.id,
                user_answer: null,
                test_taken_time: 1,
              };
              questions.push(obj);
            });
            console.log('questionsquestions', questions);
            this.setState(
              {
                newquestionid: 1,
                getquestionsdata: json.data,
                finalarray: questions,
                testid: json.data[0].id,
                seconds: json.data.length * 60,
                secondstime: json.data.length * 60,
                selectedItem: json.data[0],
              },
              () => {
                this.setState({
                  loading: false,
                  spinner: false,
                });
              }
            );
          } else {
          }
        } else {
          alert(JSON.stringify(json.message));
        }
      })
      .catch((error) => console.error(error));
  }

  renderItem({ item, index }) {
    const { topicindata } = this.props;
    let viewstyle;
    let textstyle;
    if (this.state.selectedItem.id === item.id) {
      viewstyle = [
        styles.circlefilled,
        { backgroundColor: colors.Themecolor, borderColor: colors.Themecolor },
      ];
      textstyle = styles.circletext;
    } else {
      viewstyle = [styles.borderfilled, { borderColor: colors.Themecolor }];
      textstyle = styles.bordertext;
    }
    return (
      <TouchableOpacity
        onPress={this.onItem.bind(this, item, index)}
        style={viewstyle}
      >
        <Text style={textstyle}>{index + 1}</Text>
      </TouchableOpacity>
    );
  }
  onItem(item, index) {
    //  console.log("djkfbjdabfjkd",index)
    this.setState(
      {
        newquestionid: index + 1,
        answerobj: {},
      },
      () => {
        this.setState({
          selectedItem: this.state.getquestionsdata[index + 1],
        });
      }
    );
  }
  onNext() {
    const activityStartTime = moment().format('YYYY-MM-DD HH:mm:ss');

    this.setState({ loading: true, activityStartTime });
    this.scrollToIndex(this.state.newquestionid - 1);

    this.setState(
      {
        newquestionid: this.state.newquestionid + 1,
      },
      () => {
        this.setState({
          selectedItem:
            this.state.getquestionsdata[this.state.newquestionid + 1],
        });
      }
    );
  }
  onPrevious() {
    this.setState({ loading: true });
    this.scrollToIndex(this.state.newquestionid - 1);

    this.setState(
      {
        newquestionid: this.state.newquestionid - 1,
      },
      () => {
        this.setState({
          selectedItem:
            this.state.getquestionsdata[this.state.newquestionid - 1],
        });
      }
    );
  }

  ongoback() {
    this.updateAnalytics();
    Actions.topicmainview({
      from: this.props.from,
      type: 'reset',
      data: this.props.topicindata,
      topicsdata: this.props.topicData,
      screen: 'summary',
      subjectData: this.props.subjectData,
    });
  }

  rednerAnswerItem({ item, index }) {
    const { topicindata } = this.props;
    console.log('Sknajlklnckc', topicindata);

    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          paddingVertical: 10,
          marginHorizontal: 10,
          borderWidth: 1,
          marginTop: 10,
          borderColor:
            this.state.answerobj.user_answer === item.key
              ? colors.Themecolor
              : 'lightgrey',
        }}
      >
        <Text style={{ alignSelf: 'center', marginLeft: 10 }}>
          {alphabetarray[index]}.{' '}
        </Text>

        <MathJax
          mathJaxOptions={{
            messageStyle: 'none',
            extensions: [
              'mml2jax.js',
              'MathMenu.js',
              'MathZoom.js',
              'AssistiveMML.js',
              'a11y/accessibility- menu.js',
              'tex2jax.js',
            ],
            jax: ['input/MathML', 'input/TeX', 'output/HTML-CSS'],
            tex2jax: {
              inlineMath: [
                ['$', '$'],
                ['\\(', '\\)'],
              ],
              displayMath: [
                ['$$', '$$'],
                ['\\[', '\\]'],
              ],
              processEscapes: true,
            },
            TeX: {
              extensions: [
                'AMSmath.js',
                'AMSsymbols.js',
                'noErrors.js',
                'noUndefined.js',
              ],
            },
          }}
          style={{
            //backgroundColor: this.state.answerobj.user_answer === item.key ? topicindata.color : "transparent",
            width: '90%',
            marginTop: Platform.OS === 'android' ? 5 : 5,
            // borderWidth: 1,
            // borderRadius:10,
            // borderColor: this.state.answerobj.user_answer === item.key ? topicindata.color : "lightgrey",
            marginLeft: 10,
            // justifyContent: "center",
            // alignSelf: 'flex-start',
          }}
          html={item.value}
        />
      </TouchableOpacity>
    );
  }

  render() {
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
                    <Text
                      style={{ color: 'white', fontSize: 18, marginLeft: 10 }}
                    >
                      {this.props.data.name}
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
                    <Text>Loading...</Text>
                  </View>
                ) : this.state.getquestionsdata.length > 0 ? (
                  <View style={{ flex: 1 }}>
                    <View style={styles.mainbottomview}>
                      <View style={styles.mainshadowview}>
                        <View style={styles.listview}>
                          <View style={styles.circlesview}>
                            <FlatList
                              data={this.state.getquestionsdata}
                              ref={(ref) => {
                                this.flatListRef = ref;
                              }}
                              initialScrollIndex={0}
                              getItemLayout={this.getItemLayout}
                              keyExtractor={(item, index) => String(index)}
                              renderItem={this.renderItem.bind(this)}
                              horizontal
                              extraData={this.state}
                              showsHorizontalScrollIndicator={false}
                            />
                          </View>
                          {this.state.loading ? (
                            <View
                              style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                            >
                              <Text>Loading....</Text>
                            </View>
                          ) : (
                            <ScrollView>
                              <View
                                style={{ paddingBottom: 30, paddingTop: 20 }}
                              >
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    paddingVertical: 10,
                                    marginLeft: 10,
                                  }}
                                >
                                  <Text style={{ fontSize: 13, marginTop: 10 }}>
                                    {this.state.newquestionid}.
                                  </Text>

                                  <MathJax
                                    mathJaxOptions={{
                                      messageStyle: 'none',
                                      extensions: [
                                        'mml2jax.js',
                                        'MathMenu.js',
                                        'MathZoom.js',
                                        'AssistiveMML.js',
                                        'a11y/accessibility- menu.js',
                                        'tex2jax.js',
                                      ],
                                      jax: [
                                        'input/MathML',
                                        'input/TeX',
                                        'output/HTML-CSS',
                                      ],
                                      tex2jax: {
                                        inlineMath: [
                                          ['$', '$'],
                                          ['\\(', '\\)'],
                                        ],
                                        displayMath: [
                                          ['$$', '$$'],
                                          ['\\[', '\\]'],
                                        ],
                                        processEscapes: true,
                                      },
                                      TeX: {
                                        extensions: [
                                          'AMSmath.js',
                                          'AMSsymbols.js',
                                          'noErrors.js',
                                          'noUndefined.js',
                                        ],
                                      },
                                    }}
                                    style={{
                                      //backgroundColor: this.state.answerobj.user_answer === item.key ? topicindata.color : "transparent",
                                      width: '90%',
                                      marginTop:
                                        Platform.OS === 'android' ? 5 : 5,
                                      // borderWidth: 2,
                                      // borderRadius:10,
                                      // borderColor: this.state.answerobj.user_answer === item.key ? topicindata.color : "lightgrey",
                                      marginLeft: 10,
                                      // justifyContent: "center",
                                      // alignSelf: 'flex-start',
                                    }}
                                    html={this.state.selectedItem.question}
                                  />
                                </View>

                                <Text
                                  style={{
                                    fontSize: 16,
                                    marginTop: 20,
                                    marginLeft: 20,
                                  }}
                                >
                                  Explaination:
                                </Text>
                                <MathJax
                                  mathJaxOptions={{
                                    messageStyle: 'none',
                                    extensions: [
                                      'mml2jax.js',
                                      'MathMenu.js',
                                      'MathZoom.js',
                                      'AssistiveMML.js',
                                      'a11y/accessibility- menu.js',
                                      'tex2jax.js',
                                    ],
                                    jax: [
                                      'input/MathML',
                                      'input/TeX',
                                      'output/HTML-CSS',
                                    ],
                                    tex2jax: {
                                      inlineMath: [
                                        ['$', '$'],
                                        ['\\(', '\\)'],
                                      ],
                                      displayMath: [
                                        ['$$', '$$'],
                                        ['\\[', '\\]'],
                                      ],
                                      processEscapes: true,
                                    },
                                    TeX: {
                                      extensions: [
                                        'AMSmath.js',
                                        'AMSsymbols.js',
                                        'noErrors.js',
                                        'noUndefined.js',
                                      ],
                                    },
                                  }}
                                  style={{
                                    //backgroundColor: this.state.answerobj.user_answer === item.key ? topicindata.color : "transparent",
                                    width: '90%',
                                    // borderWidth: 1,
                                    // borderRadius:10,
                                    // borderColor: this.state.answerobj.user_answer === item.key ? topicindata.color : "lightgrey",
                                    marginLeft: 10,
                                    // justifyContent: "center",
                                    // alignSelf: 'flex-start',
                                  }}
                                  html={this.state.selectedItem.explanation}
                                />
                              </View>
                            </ScrollView>
                          )}
                        </View>
                      </View>
                    </View>
                  </View>
                ) : (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text>No data</Text>
                    <TouchableOpacity onPress={this.ongoback.bind(this)}>
                      <Text>GO BACK</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              {this.state.getquestionsdata.length > 0 ? (
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
                  <View style={{ flex: 1, flexDirection: 'row' }}>
                    {this.state.newquestionid - 1 === 0 ? (
                      <View style={{ flex: 0.5 }}>
                        <TouchableOpacity
                          style={{
                            height: 30,
                            width: 100,
                            borderRadius: 20,
                            backgroundColor: 'white',
                            paddingHorizontal: 10,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                          onPress={this.onDonePrevious.bind(this)}
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
                      </View>
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
                            width: 100,
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
                            Previous
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                    <View
                      style={{
                        flex: 0.5,
                        justifyContent: 'flex-start',
                        alignItems: 'flex-end',
                      }}
                    >
                      {this.state.newquestionid ===
                      this.state.getquestionsdata.length ? (
                        <TouchableOpacity
                          style={{
                            height: 30,
                            width: 100,
                            borderRadius: 20,
                            backgroundColor: 'white',
                            paddingHorizontal: 10,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                          onPress={this.onDoneNext.bind(this)}
                        >
                          <Text
                            style={{
                              textAlign: 'center',
                              fontSize: 12,
                              color: colors.Themecolor,
                            }}
                          >
                            Next Activity
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={{
                            height: 30,
                            width: 100,
                            borderRadius: 20,
                            backgroundColor: 'white',
                            paddingHorizontal: 10,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                          onPress={this.onNext.bind(this)}
                        >
                          <Text
                            style={{
                              textAlign: 'center',
                              fontSize: 12,
                              color: colors.Themecolor,
                            }}
                          >
                            Next
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              ) : null}
            </View>
          </ImageBackground>

          {/* <Modal isVisible={this.state.isvisible}>
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <View style={{ padding: 10, backgroundColor: 'white', borderRadius: 15, marginVertical: 15 }}>
                            <Image source={require("../../../assets/images/finger.png")} style={{ width: 96 / 1.5, height: 96 / 1.5, alignSelf: 'center' }} />
                            <Text style={{ fontSize: 20, textAlign: 'center', marginTop: 10 }}>{this.state.timeup ? "Time up! Please submit your assessment" : "Are you sure you want to submit assessment?"}</Text>
                            <View style={{ flexDirection: 'row', justifyContent: "space-around", marginTop: 20 }}>

                                <TouchableOpacity onPress={this.onCancel.bind(this)}>
                                    <LinearGradient colors={['#f14d65', '#fc8798']} style={{ paddingHorizontal: 30, paddingVertical: 10, borderRadius: 20 }}>
                                        <Text style={{ color: "white" }}>CANCEL</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={this.onSubmit.bind(this)} >
                                    <LinearGradient colors={['#239816', '#32e625']} style={{ paddingHorizontal: 30, paddingVertical: 10, borderRadius: 20 }}>
                                        <Text style={{ color: "white" }}>SUBMIT</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal> */}

          {/* <Modal isVisible={this.state.modalshow}>
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <View style={{ padding: 10, backgroundColor: 'white', borderRadius: 15, marginVertical: 15 }}>
                            <Text style={{ fontSize: 15, textAlign: 'center', marginTop: 10 }}>You are about to begin the assessment. Once you begin you have 5mins to finish the test</Text>
                            <Text style={{ fontSize: 18, textAlign: 'center', marginTop: 10, fontWeight: "600" }}> Are you ready to begin? </Text>
                            <View style={{ flexDirection: 'row', justifyContent: "space-around", marginTop: 20 }}>

                                <TouchableOpacity onPress={this.onStartcancel.bind(this)}>
                                    <LinearGradient colors={['#f14d65', '#fc8798']} style={{ paddingHorizontal: 30, paddingVertical: 10, borderRadius: 20 }}>
                                        <Text style={{ color: "white" }}>CANCEL</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={this.onok.bind(this)}>
                                    <LinearGradient colors={['#239816', '#32e625']} style={{ paddingHorizontal: 30, paddingVertical: 10, borderRadius: 20 }}>
                                        <Text style={{ color: "white" }}>OK</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal> */}

          {this.state.testloader ? (
            <View
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'transparent',
                position: 'absolute',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <ActivityIndicator color="black" />
            </View>
          ) : null}
        </>
      </SafeAreaView>
    );
  }
}

export default ProfPreAssesment;
