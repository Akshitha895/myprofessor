import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  FlatList,
  Image,
  ImageBackground,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DeviceConstants from 'react-native-device-constants';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import MathJax from 'react-native-mathjax';
import Modal from 'react-native-modal';
import { Actions } from 'react-native-router-flux';

import { baseUrl, colors } from '../../constants';
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
var newseconds = 0;
class PreAssesment extends Component {
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
    this.ongoback();
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
    console.log('dmncdn,', this.props.data);
    var userId = this.state.useDetails.userInfo.userId;
    var activityDimId = this.props.data.activityDimId;
    var assignedActivityId = this.props.data.assignedActivityId;
    var url =
      baseUrl +
      `/analytics/users/${userId}/activities/${activityDimId}/test-questions?assignedActivityId=${assignedActivityId}`;
    //  var url = baseUrl + "/user-test/assigned-activity/" + this.props.data.reference_id
    //  console.log('kncklnc',url)
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
          if (this.props.data.activityType === 'pre') {
            if (json.data[0].analysis) {
              // this.setState({
              //     spinner: false
              // })
              Alert.alert(
                'My Professor',
                'Sorry you have reached your maximum number of attempts in this assesment',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      this.ongoback();
                    },
                  },
                  {
                    text: 'Review Test Report',
                    onPress: () => {
                      Actions.push('presummary', {
                        index: this.props.index,
                        type: 'reset',
                        testtype: this.props.data.activityType,
                        topicData: this.props.topicData,
                        subjectData: this.props.subjectData,
                        activtydata: this.props.data,
                        testid: json.data[0].id,
                        topicindata: this.props.topicindata,
                        smartres: this.props.smartres,
                        from: this.props.from,
                      });
                    },
                  },
                ]
              );
            } else {
              let questions = [];
              json.data.map((data) => {
                let obj = {
                  question: data.questionId,
                  user_answer: null,
                  test_taken_time: 1,
                };
                questions.push(obj);
              });
              this.setState(
                {
                  getquestionsdata: json.data,
                  finalarray: questions,
                  testid: json.data[0].userTestId,
                  seconds: json.data.length * 60,
                  secondstime: json.data.length * 60,
                },
                () => {
                  this.setState({
                    modalshow: true,
                  });
                }
              );
            }
          } else if (this.props.data.activityType === 'post') {
            var newatemptnp = await AsyncStorage.getItem('@attemptno');
            //console.log("dk.n.dnf",newatemptnp)
            var attemptno = JSON.parse(newatemptnp);
            if (json.data[0].analysis && json.data.length === 1) {
              Alert.alert(
                'My Professor',
                'You have alredy attempted one time Do you want to start a new test or review previous test ? ',
                [
                  {
                    text: 'Cancel',
                    onPress: () => {
                      this.ongoback();
                    },
                  },
                  {
                    text: 'New Test',
                    onPress: () => {
                      let questions = [];
                      json.data.map((data) => {
                        let obj = {
                          question: data.questionId,
                          user_answer: null,
                          test_taken_time: 1,
                        };
                        questions.push(obj);
                      });
                      this.setState(
                        {
                          newquestionid: 1,
                          getquestionsdata: json.data,
                          finalarray: questions,
                          testid: json.data[0].userTestId,
                          seconds: json.data.length * 60,
                          secondstime: json.data.length * 60,
                          reattempt: true,
                        },
                        () => {
                          this.getQuestionByIdreattempt();
                        }
                      );
                    },
                  },
                  {
                    text: 'Review Previous Test',
                    onPress: () => {
                      Actions.push('reviewpostsummary', {
                        type: 'reset',
                        activtydata: this.props.data,
                        testtype: this.props.data.activityType,
                        activityid: this.props.data.activityDimId,
                        index: this.props.index,
                        smartres: this.props.smartres,
                        topicData: this.props.topicData,
                        topicindata: this.props.topicindata,
                        subjectData: this.props.subjectData,
                        from: this.props.from,
                      });
                    },
                  },
                ]
              );
            } else if (json.data[0].analysis && json.data.length === 2) {
              // this.setState({
              //     spinner: false
              // })
              Alert.alert(
                'My Professor',
                'Sorry you have reached your maximum number of attempts in this assesment',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      this.ongoback();
                    },
                  },
                  {
                    text: 'Review Tests',
                    onPress: () => {
                      Actions.push('reviewpostsummary', {
                        type: 'reset',
                        activtydata: this.props.data,
                        testtype: this.props.data.activityType,
                        activityid: this.props.data.activityDimId,
                        index: this.props.index,
                        smartres: this.props.smartres,
                        topicData: this.props.topicData,
                        topicindata: this.props.topicindata,
                        subjectData: this.props.subjectData,
                        from: this.props.from,
                      });
                    },
                  },
                ]
              );
            } else {
              let questions = [];
              json.data.map((data) => {
                let obj = {
                  question: data.questionId,
                  user_answer: null,
                  test_taken_time: 1,
                };
                questions.push(obj);
              });
              this.setState(
                {
                  newquestionid: 1,
                  getquestionsdata: json.data,
                  finalarray: questions,
                  testid: json.data[0].userTestId,
                  seconds: json.data.length * 60,
                  secondstime: json.data.length * 60,
                  // reattempt:true
                },
                () => {
                  this.setState({
                    modalshow: true,
                  });
                }
              );
            }
          } else {
            // this.starttimer()
            this.getQuestions();
          }
        } else {
          alert(JSON.stringify(json.message));
        }
      })
      .catch((error) => console.error(error));
  }
  getQuestionByIdreattempt() {
    //  console.log("djfhjldshfjlkd",this.props.data)
    this.setState({ loading: true });
    var questionindex = this.state.newquestionid - 1;
    var userId = this.state.useDetails.userInfo.userId;
    var activityDimId = this.props.data.activityDimId;
    var assignedActivityId = this.props.data.assignedActivityId;
    var index = this.state.newquestionid;
    //  console.log("Sdksklafdsf", this.state.getquestionsdata[questionindex])
    var questionId = this.state.getquestionsdata[questionindex].questionId;
    var testId = this.state.getquestionsdata[questionindex].userTestId;

    var url =
      baseUrl +
      `/analytics/users/${userId}/activities/${activityDimId}/test/re-attempt?assignedActivityId=${assignedActivityId}`;

    const activityStartTime = moment().format('YYYY-MM-DD HH:mm:ss');

    // console.log("skldklskls", url)
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        jwt: this.state.token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        // console.log("getquestiondetailsdkjfkdfjd", JSON.stringify(json))

        if (json) {
          if (json.code === 201) {
            let questions = [];
            json.data.map((data) => {
              let obj = {
                question: data.questionId,
                user_answer: null,
                test_taken_time: 1,
              };
              questions.push(obj);
            });
            this.setState(
              {
                getquestionsdata: json.data,
                finalarray: questions,
                testid: json.data[0].userTestId,
                seconds: json.data.length * 60,
                secondstime: json.data.length * 60,
                //activityStartTime:activityStartTime
              },
              () => {
                this.setState({
                  modalshow: true,
                });
              }
            );
          }
        }
      });
  }
  getQuestionById() {
    this.setState({ loading: true });
    var questionindex = this.state.newquestionid - 1;
    var userId = this.state.useDetails.userInfo.userId;
    var activityDimId = this.props.data.activityDimId;
    var assignedActivityId = this.props.data.assignedActivityId;
    var index = this.state.newquestionid;
    // console.log("Sdksklafdsf", this.state.getquestionsdata[questionindex])
    var questionId = this.state.getquestionsdata[questionindex].questionId;
    var testId = this.state.getquestionsdata[questionindex].userTestId;

    var url =
      baseUrl +
      `/analytics/users/${userId}/activities/${activityDimId}/test-questions/${index}?assignedActivityId=${assignedActivityId}&userTestId=${testId}&questionId=${questionId}`;
    //   console.log("skldklskls", url)
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        jwt: this.state.token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        //  console.log("getquestiondetails", JSON.stringify(json))

        if (json) {
          if (json.code === 201) {
            const activityStartTime = moment().format('YYYY-MM-DD HH:mm:ss');
            console.log('mvnm,', activityStartTime);

            this.setState(
              {
                loading: false,
                spinner: false,
                selectedItem: json.data,
              },
              () => {
                if (this.state.finalarray.length > 0) {
                  this.state.finalarray.map((res, i) => {
                    if (res.question === this.state.selectedItem.questionId) {
                      let obj = {
                        question: res.question,
                        user_answer: res.user_answer,
                        test_taken_time: res.test_taken_time,
                      };

                      this.setState({
                        answerobj: res,
                      });
                    } else {
                      // console.log("mcnkljncklnklcnds")
                      // this.setState({
                      //     answerobj: {}
                      // })
                    }
                  });
                }
              }
            );
          }
        }
      });
  }
  starttimer() {
    interval = setInterval(() => {
      //  console.log(this.state.seconds)
      if (this.state.seconds === 0) {
        clearInterval(interval);
        this.setState(
          {
            timeup: true,
          },
          () => {
            // this.setState({
            //     isvisible: true
            // })
          }
        );
      }
      newseconds = this.state.seconds - 1;
      this.setState({ seconds: this.state.seconds - 1 });
    }, 1000);
  }
  renderItem({ item, index }) {
    const { topicindata } = this.props;
    var isTablet = DeviceConstants.isTablet;

    var itemheight = 40,
      subfont = 15;
    if (isTablet) {
      (itemheight = 50), (subfont = 25);
    }
    let viewstyle;
    let textstyle;
    if (this.state.selectedItem.questionId === item.questionId) {
      viewstyle = [
        styles.circlefilled,
        {
          backgroundColor: colors.Themecolor,
          borderColor: colors.Themecolor,
          height: itemheight,
          width: itemheight,
          borderRadius: itemheight / 2,
        },
      ];
      textstyle = styles.circletext;
    } else {
      viewstyle = [
        styles.borderfilled,
        {
          borderColor: colors.Themecolor,
          height: itemheight,
          width: itemheight,
          borderRadius: itemheight / 2,
        },
      ];
      textstyle = styles.bordertext;
    }
    return (
      <TouchableOpacity
        onPress={this.onItem.bind(this, item, index)}
        style={viewstyle}
      >
        <Text style={textstyle}>{item.index}</Text>
      </TouchableOpacity>
    );
  }
  onItem(item, index) {
    if (index < this.state.newquestionid) {
      this.setState(
        {
          newquestionid: index + 1,
          answerobj: {},
        },
        () => {
          this.getQuestionById();
        }
      );
    } else {
      if (this.state.answerobj.user_answer === null) {
        alert('please select option');
      } else {
        this.setState({ loading: true });
        this.scrollToIndex(this.state.newquestionid - 1);
        this.setState(
          {
            newquestionid: this.state.newquestionid + 1,
            secondstime: this.state.seconds,
          },
          () => {
            this.getQuestionById();
          }
        );
      }
    }
  }
  onNext() {
    const activityStartTime = moment().format('YYYY-MM-DD HH:mm:ss');
    // console.log("sdmnsJncjZNCJKLZHCjxzcklz,",this.state.answerobj)
    if (this.state.answerobj.user_answer === null) {
      alert('please select option');
    } else {
      this.scrollToIndex(this.state.newquestionid - 1);

      this.setState({ loading: true });

      this.setState(
        {
          newquestionid: this.state.newquestionid + 1,

          secondstime: this.state.seconds,
        },
        () => {
          this.getQuestionById();
          // this.setState({
          //     selectedItem: nextItem,

          // }, () => this.state.finalarray.map((res, i) => {
          //     console.log("ffff",res ,  "  ", this.state.selectedItem.questionId)
          //     if (res.question === this.state.selectedItem.questionId) {

          //         // console.log("ffff",res.question ,  "  ", this.state.selectedItem.reference_id)
          //         this.setState({
          //             answerobj: res
          //         })
          //     } else {
          //         this.setState({
          //             answerobj: {}
          //         })
          //     }
          //     this.getQuestionById(nextItem)
          // }))
        }
      );
    }
  }
  onPrevious() {
    this.setState({ loading: true });
    this.scrollToIndex(this.state.newquestionid - 1);

    this.setState(
      {
        newquestionid: this.state.newquestionid - 1,
        secondstime: this.state.seconds,
      },
      () => {
        if (this.state.finalarray.length > 0) {
          this.state.finalarray.map((res, i) => {
            if (res.question === this.state.selectedItem.questionId) {
              //   console.log("ffff",res.question ,  "  ", this.state.selectedItem.reference_id)
              this.setState({
                answerobj: res,
              });
            } else {
              this.setState({
                answerobj: {},
              });
            }
          });
        }

        this.getQuestionById();
      }
    );
  }

  onSubmit() {
    console.log('sknckasnkaf', this.state.finalarray);
    clearInterval(interval);
    this.setState(
      {
        isvisible: false,
      },
      () => {
        var userId = this.state.useDetails.userInfo.userId;
        var activityDimId = this.props.data.activityDimId;
        var assignedActivityId = this.props.data.assignedActivityId;
        var testId = this.state.testid;
        var url =
          baseUrl +
          `/analytics/users/${userId}/activities/${activityDimId}/tests/${testId}/end?assignedActivityId=${assignedActivityId}`;

        console.log('finalarr', url);
        // var body = { questions: this.state.finalarray }
        this.setState({ testloader: true });

        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            jwt: this.state.token,
          },
        })
          .then((response) => response.json())
          .then(async (json) => {
            // console.log("jondacjhadkjhd",JSON.stringify(json))
            /// const data = json.data;

            if (json.code === 201) {
              const data = json.data;
              console.log('sdsd', json);
              this.setState({ testloader: false });

              Actions.push('presummary', {
                index: this.props.index,
                type: 'reset',
                testtype: this.props.data.activityType,
                topicData: this.props.topicData,
                subjectData: this.props.subjectData,
                activtydata: this.props.data,
                testid: this.state.testid,
                topicindata: this.props.topicindata,
                smartres: this.props.smartres,
                from: this.props.from,
              });
            } else {
              this.setState({ testloader: false });
            }
          })
          .catch((error) => alert('gggg' + error));

        // this.setState({
        //     isvisible: true
        // })
      }
    );
  }
  onCancel() {
    this.setState({
      isvisible: false,
    });
  }
  onSubmitText() {
    //alert(JSON.stringify(this.props.topicData))
    this.setState({
      isvisible: true,
    });
  }
  ongoback() {
    this.updateAnalytics();
    clearInterval(interval);
    Actions.topicmainview({
      from: this.props.from,
      type: 'reset',
      data: this.props.topicindata,
      topicsdata: this.props.topicData,
      screen: 'summary',
      subjectData: this.props.subjectData,
    });
  }
  onAnswer(res) {
    var answerkey = res.key;
    var questionId = this.state.selectedItem.questionId;
    var timecount = this.state.seconds;

    var timess = this.state.secondstime - timecount;
    let data = [...this.state.finalarray];

    console.log(
      'sdknaslkdadklcldakcklads',
      this.state.secondstime,
      'dcdccx',
      timecount,
      'dcknakldjkld',
      timess
    );
    let index = data.findIndex(
      (p) => p.question === this.state.selectedItem.questionId
    );
    //  console.log("index......", index)

    let obj = data[index];
    //  console.log("answerrr...", obj,"dddddd", JSON.stringify(data))
    if (obj) {
      obj.user_answer = answerkey;
      obj.test_taken_time = timess;
      data[index] = Object.assign({}, obj);
      this.setState({ finalarray: data });
    }
    //  console.log("answerrr...", obj)
    // this.setState({

    //     secondstime: timecount
    // })
    this.setState(
      {
        answerobj: obj,
      },
      () => {
        console.log('answerrr...', this.state.answerobj);
      }
    );
    this.scrollToIndex(this.state.newquestionid - 1);

    this.validateAnswer(obj);
  }
  validateAnswer(answerobj) {
    //  console.log("m,cnjnc", this.state.secondstime ,  this.state.seconds)
    var userId = this.state.useDetails.userInfo.userId;
    var activityDimId = this.props.data.activityDimId;
    var assignedActivityId = this.props.data.assignedActivityId;
    var index = this.state.getquestionsdata[this.state.newquestionid - 1].index;
    var timeTaken = this.state.secondstime - this.state.seconds;
    console.log(
      'this.state.seconds',
      this.state.seconds,
      'this.state.secondstime ',
      this.state.secondstime
    );
    var url =
      baseUrl +
      `/analytics/users/${userId}/activities/${activityDimId}/test-questions/${index}/validate?assignedActivityId=${assignedActivityId}`;
    var data = {
      attemptStartedAt: moment().format('YYYY-MM-DD HH:mm:ss'), //this.state.activityStartTime, // YYY-MM-DD HH:MM:SS
      attemptEndedAt: moment()
        .add(timeTaken, 'seconds')
        .format('YYYY-MM-DD HH:mm:ss'), // YYY-MM-DD HH:MM:SS
      questionId: answerobj.question,
      userAnswer: answerobj.user_answer,
      userTestId:
        this.state.getquestionsdata[this.state.newquestionid - 1].userTestId,
    };
    console.log('sdkasdkadjKASD', data);
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        jwt: this.state.token,
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((json) => {})
      .catch((error) => console.error(error));
  }
  rednerAnswerItem({ item, index }) {
    const { topicindata } = this.props;
    // console.log("Sknajlklnckc", topicindata, )

    return (
      <TouchableWithoutFeedback
        style={{
          flexDirection: 'row',
          paddingVertical: 10,
          marginHorizontal: 10,
          borderWidth: 1,
          marginTop: 10,
          borderColor:
            this.state.answerobj.user_answer === item.key
              ? 'green'
              : 'lightgrey',
        }}
        onPress={this.onAnswer.bind(this, item)}
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
      </TouchableWithoutFeedback>
    );
  }

  render() {
    const { topicindata } = this.props;
    const isTablet = DeviceConstants.isTablet; // false
    var backheight = 25,
      heafont = 18,
      bottomwidth = 100,
      bototmheight = 30,
      bototmsize = 12,
      radius = 20,
      leftno = 5,
      subfont = 13,
      headflex = 0.3,
      itimerwidth = 187 / 2,
      timerheight = 82 / 2;
    if (isTablet) {
      (backheight = 35),
        (heafont = 28),
        (bottomwidth = 200),
        (bototmheight = 40),
        (bototmsize = 18),
        (radius = 30),
        (leftno = 10),
        (subfont = 18),
        (headflex = 0.4),
        (itimerwidth = 187 / 1.2),
        (timerheight = 82 / 1.2);
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
                    <TouchableOpacity onPress={this.ongoback.bind(this)}>
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
                        fontSize: heafont,
                        marginLeft: 10,
                      }}
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
                        <View style={styles.headerview}>
                          <View
                            style={[styles.headrightview, { flex: headflex }]}
                          >
                            <View
                              style={[
                                styles.timerview,
                                {
                                  backgroundColor: colors.Themecolor,
                                  width: itimerwidth,
                                  height: timerheight,
                                },
                              ]}
                            >
                              <Image
                                source={require('../../assets/images/timer.png')}
                                style={{
                                  width: backheight,
                                  height: backheight,
                                  alignSelf: 'center',
                                  marginRight: 10,
                                }}
                              />
                              <Text
                                style={[
                                  styles.timertext,
                                  { fontSize: subfont },
                                ]}
                              >
                                {parseInt(this.state.seconds / 60, 10)}:
                                {parseInt(this.state.seconds % 60, 10)}
                              </Text>
                            </View>
                          </View>
                        </View>

                        <View style={{ flex: 1 }}>
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
                              <Text style={{ fontSize: heafont }}>
                                Loading....
                              </Text>
                            </View>
                          ) : (
                            <View style={{ flex: 1 }}>
                              <ScrollView>
                                <View
                                  style={{ paddingBottom: 30, paddingTop: 20 }}
                                >
                                  <View style={{ flexDirection: 'row' }}>
                                    <Text
                                      style={{
                                        fontSize: 13,
                                        marginTop: 10,
                                        marginLeft: leftno,
                                      }}
                                    >
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
                                  <View>
                                    <FlatList
                                      data={this.state.selectedItem.options}
                                      extraData={this.state}
                                      keyExtractor={(item, index) =>
                                        String(index)
                                      }
                                      renderItem={this.rednerAnswerItem.bind(
                                        this
                                      )}
                                      //horizontal={true}
                                      showsHorizontalScrollIndicator={false}
                                    />
                                  </View>
                                </View>
                              </ScrollView>
                            </View>
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
                            height: bototmheight,
                            width: bottomwidth,
                            borderRadius: radius,
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
                              fontSize: bototmsize,
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
                            height: bototmheight,
                            width: bottomwidth,
                            borderRadius: radius,
                            backgroundColor: 'white',
                            paddingHorizontal: 10,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                          onPress={this.onSubmitText.bind(this)}
                        >
                          <Text
                            style={{
                              textAlign: 'center',
                              fontSize: bototmsize,
                              color: colors.Themecolor,
                            }}
                          >
                            Submit
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={{
                            height: bototmheight,
                            width: bottomwidth,
                            borderRadius: radius,
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
                              fontSize: bototmsize,
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
                  padding: 10,
                  backgroundColor: 'white',
                  borderRadius: 15,
                  marginVertical: 15,
                }}
              >
                <Image
                  source={require('../../assets/images/finger.png')}
                  style={{
                    width: 96 / 1.5,
                    height: 96 / 1.5,
                    alignSelf: 'center',
                  }}
                />
                <Text
                  style={{
                    fontSize: subfont,
                    textAlign: 'center',
                    marginTop: 10,
                  }}
                >
                  {this.state.timeup
                    ? 'Time up! Please submit your assessment'
                    : 'Are you sure you want to submit assessment?'}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    marginTop: 20,
                  }}
                >
                  <TouchableOpacity onPress={this.onCancel.bind(this)}>
                    <LinearGradient
                      colors={['#f14d65', '#fc8798']}
                      style={{
                        paddingHorizontal: 30,
                        paddingVertical: 10,
                        borderRadius: 20,
                      }}
                    >
                      <Text style={{ color: 'white', fontSize: subfont }}>
                        CANCEL
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={this.onSubmit.bind(this)}>
                    <LinearGradient
                      colors={['#239816', '#32e625']}
                      style={{
                        paddingHorizontal: 30,
                        paddingVertical: 10,
                        borderRadius: 20,
                      }}
                    >
                      <Text style={{ color: 'white', fontSize: subfont }}>
                        SUBMIT
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          <Modal isVisible={this.state.modalshow}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  padding: 10,
                  backgroundColor: 'white',
                  borderRadius: 15,
                  marginVertical: 15,
                }}
              >
                <Text
                  style={{
                    fontSize: subfont,
                    textAlign: 'center',
                    marginTop: 10,
                  }}
                >
                  You are about to begin the assessment. Once you begin you have
                  5mins to finish the test
                </Text>
                <Text
                  style={{
                    fontSize: subfont,
                    textAlign: 'center',
                    marginTop: 10,
                    fontWeight: '600',
                  }}
                >
                  {' '}
                  Are you ready to begin?{' '}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    marginTop: 20,
                  }}
                >
                  <TouchableOpacity onPress={this.onStartcancel.bind(this)}>
                    <LinearGradient
                      colors={['#f14d65', '#fc8798']}
                      style={{
                        paddingHorizontal: 30,
                        paddingVertical: 10,
                        borderRadius: 20,
                      }}
                    >
                      <Text style={{ color: 'white', fontSize: subfont }}>
                        CANCEL
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={this.onok.bind(this)}>
                    <LinearGradient
                      colors={['#239816', '#32e625']}
                      style={{
                        paddingHorizontal: 30,
                        paddingVertical: 10,
                        borderRadius: 20,
                      }}
                    >
                      <Text style={{ color: 'white', fontSize: subfont }}>
                        OK
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

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

export default PreAssesment;
