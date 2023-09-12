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
import Modal from 'react-native-modal';
import { Actions } from 'react-native-router-flux';

import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import MathJax from 'react-native-mathjax';
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

class PrePaperAssesment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItem: null,
      previousItem: null,
      isvisible: false,
      finalarray: [],
      answerobj: {},
      useDetails: null,
      questiosnarray: [],
      spinner: true,
      questionno: null,
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
      nodata: false,
      activityStartTime: null,
      activityStartTime: null,
      getsubjquestionsdata: [],
      nosubdata: false,
      subjectiveview: false,
    };
  }
  componentDidMount() {
    const activityStartTime = moment().format('YYYY-MM-DD HH:mm:ss');
    this.setState({
      activityStartTime,
    });
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      Alert.alert(
        'My Professor',
        'Are you sure you want to exit?',
        [
          { text: 'Cancel', onPress: () => {}, style: 'cancel' },
          {
            text: 'exit',
            onPress: () => {
              Actions.prequestionpapers({
                type: 'reset',
                item: this.props.newdata,
              });
            },
          },
        ],
        { cancelable: false }
      );
      return true;
    });

    this.getData();
    setTimeout(() => {
      //  this.setState({ modalshow: true })
    }, 500);
    // this.starttimer()
  }
  backAction = () => {
    Alert.alert('My Professor', 'Do you want to exit?');
  };
  componentWillUnmount() {
    this.backHandler.remove();
  }
  getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@user');
      // alert(JSON.stringify(value))
      if (value !== null) {
        var data = JSON.parse(value);
        this.setState({
          useDetails: data,
        });
        const token = await AsyncStorage.getItem('@access_token');
        if (token && data) {
          this.setState({ token: JSON.parse(token) });
          if (this.props.item.questionPaperTestType === 'subjective') {
            this.setState(
              {
                subjectiveview: true,
              },
              () => {
                this.getsubjectivequestions();
              }
            );
          } else {
            this.createtest();
          }
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
  getsubjectivequestions() {
    var questionPaperId = this.props.item.questionPaperId;
    var userId = this.state.useDetails.userInfo.userId;
    // console.log("xbcjanc",baseUrl  +`/users/${userId}/questionPapers/${questionPaperId}/user-tests`)
    var url =
      baseUrl + `/question-papers/${questionPaperId}/subjective-questions`;
    console.log('dfadfadfdfdfdafd', url);
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        jwt: this.state.token,
      },
    })
      .then((response) => response.json())
      .then(async (json) => {
        console.log('subjectivedaraaaaa dataaaa', json.data);
        if (json.code === 201) {
          if (json.data) {
            let questions = [];
            this.setState({
              getsubjquestionsdata: json.data,
              selectedItem: json.data[0],
              //newquestionid: 0,
              spinner: false,
              loading: false,
            });
          } else {
            this.setState({
              getsubjquestionsdata: [],
              nosubdata: true,
              spinner: false,
              loading: false,
            });
          }
        } else if (json.error?.code === 400) {
          //alert("dknkdf")
          Alert.alert('My Professor', json.error.message, [
            { text: 'OK', onPress: () => this.logout() },
          ]);
        } else {
          this.setState({
            getsubjquestionsdata: [],
            nosubdata: true,
            spinner: false,
            loading: false,
          });
        }
      });
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
  onnextsub() {
    this.setState(
      {
        loading: true,
        newquestionid: this.state.newquestionid + 1,
        secondstime: this.state.seconds,
      },
      () => {
        setTimeout(() => {
          this.setState({
            loading: false,
            selectedItem:
              this.state.getsubjquestionsdata[this.state.newquestionid - 1],
          });
        }, 1500);
      }
    );
  }
  onprevsub() {
    this.setState(
      {
        loading: true,
        newquestionid: this.state.newquestionid - 1,
      },
      () => {
        setTimeout(() => {
          this.setState({
            loading: false,
            selectedItem:
              this.state.getsubjquestionsdata[this.state.newquestionid - 1],
          });
        }, 1500);
      }
    );
  }
  createtest() {
    // console.log("xacnkxac",this.props.item)
    var questionPaperId = this.props.item.questionPaperId;
    var userId = this.state.useDetails.userInfo.userId;
    console.log(
      'xbcjanc',
      baseUrl + `/users/${userId}/questionPapers/${questionPaperId}/user-tests`
    );
    var url =
      baseUrl + `/users/${userId}/questionPapers/${questionPaperId}/user-tests`;
    console.log('xbcjanc', url);
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        jwt: this.state.token,
      },
    })
      .then((response) => response.json())
      .then(async (json) => {
        console.log('activity dataaaa', json.data);
        if (json.data) {
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
              this.starttimer();
              this.getQuestionById();
              // this.setState({
              //     modalshow: true,

              // })
            }
          );
        } else {
          this.setState({
            getquestionsdata: [],
            nodata: true,
          });
        }
      });
  }

  starttimer() {
    setInterval(() => {
      this.setState({ seconds: this.state.seconds - 1 });
    }, 1000);
  }
  renderItem({ item, index }) {
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
        <Text style={textstyle}>{index + 1}</Text>
      </TouchableOpacity>
    );
  }
  renderItemsub({ item, index }) {
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
        onPress={this.onItemsub.bind(this, item, index)}
        style={viewstyle}
      >
        <Text style={textstyle}>{index + 1}</Text>
      </TouchableOpacity>
    );
  }
  onItemsub(item, index) {
    console.log('adfkndkfnkldf', this.state.selectedItem);
    this.setState(
      {
        loading: true,
      },
      () => {
        setTimeout(() => {
          this.setState(
            {
              loading: false,
              selectedItem: this.state.getsubjquestionsdata[index],
              newquestionid: index + 1,
              answerobj: {},
            },
            () => {}
          );
        }, 1500);
      }
    );
  }
  onItem(item, index) {
    this.setState(
      {
        loading: true,
      },
      () => {
        setTimeout(() => {
          this.setState(
            {
              loading: false,
              newquestionid: index + 1,
              answerobj: {},
            },
            () => {
              //  this.getQuestionById()
            }
          );
        }, 1500);
      }
    );
  }
  onNext() {
    const activityStartTime = moment().format('YYYY-MM-DD HH:mm:ss');

    this.setState({ loading: true, activityStartTime });
    this.scrollToIndex(this.state.newquestionid - 1);
    if (Object.keys(this.state.answerobj).length === 0) {
      alert('please select option');
    } else {
      this.setState(
        {
          newquestionid: this.state.newquestionid + 1,
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
              console.log(
                'ffff',
                res.question,
                '  ',
                this.state.selectedItem.reference_id
              );
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
  ondonesub() {
    Actions.prequestionpapers({ type: 'reset', item: this.props.newdata });
  }
  onSubmit() {
    var questionPaperId = this.props.item.questionPaperId;
    var questionindex = this.state.newquestionid - 1;

    var userId = this.state.useDetails.userInfo.userId;

    var testId = this.state.getquestionsdata[questionindex].userTestId;
    var url =
      baseUrl +
      `/users/${userId}/questionPapers/${questionPaperId}/user-tests/${testId}/end`;

    this.setState(
      {
        isvisible: false,
      },
      () => {
        this.setState({ testloader: true });

        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            jwt: this.state.token,
          },
        })
          .then((response) => response.json())
          .then((json) => {
            if (json.code === 201) {
              const data = json.data;
              //console.log("sdsd", json)
              this.setState({ testloader: false });

              Actions.push('prepapersummary', {
                item: this.props.item,
                testid: testId,
                testdata: this.state.selectedItem,
                from: 'assesment',
                selectedata: this.props.item,
              });
            } else {
              this.setState({ testloader: false });
            }
          })
          .catch((error) => alert('gggg' + error));
      }
    );
  }
  onCancel() {
    this.setState({
      isvisible: false,
    });
  }
  // onsubmitmodal() {
  //     //alert(JSON.stringify(this.props.topicData))
  //     this.setState({
  //         isvisible: false
  //     }, () => {
  //         console.log("final", this.state.finalarray)
  //        // Actions.push('presummary', { testid: this.state.testid, topicData: this.props.topicData, subjectData: this.props.subjectData, index: this.props.index, smartres: this.props.smartres })
  //     })
  // }

  onSubmitText() {
    //alert(JSON.stringify(this.props.topicData))
    this.setState({
      isvisible: true,
    });
  }
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
  getQuestionById() {
    //`/users/${userId}/questionPapers/${previousQuestionPaperId}/user-tests/${userTestId}/questions/${index}?questionId=${questionId}`,
    //  console.log("djfhjldshfjlkd",this.props.data)
    this.setState({ loading: true });
    var questionPaperId = this.props.item.questionPaperId;

    var questionindex = this.state.newquestionid - 1;
    var userId = this.state.useDetails.userInfo.userId;

    var index = this.state.newquestionid;
    //  console.log("Sdksklafdsf", this.state.getquestionsdata[questionindex])
    var questionId = this.state.getquestionsdata[questionindex].questionId;
    var testId = this.state.getquestionsdata[questionindex].userTestId;

    var url =
      baseUrl +
      `/users/${userId}/questionPapers/${questionPaperId}/user-tests/${testId}/questions/${index}?questionId=${questionId}`;

    console.log('skldklskls', url);
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        jwt: this.state.token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        console.log('getquestiondetailsdkjfkdfjd', json);

        if (json) {
          console.log('json.code', json.code);
          if (json.code === 201 && json.data.length > 0) {
            console.log('json.sdsandjaSDJSHAJD', json);

            this.setState(
              {
                loading: false,
                spinner: false,
                nodata: false,
                selectedItem: json.data[0],
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
          } else {
            this.setState({
              loading: false,
              spinner: false,
              nodata: true,
              // selectedItem: json.data[0]
            });
          }
        }
      });
  }
  onStartcancel() {
    this.setState(
      {
        modalshow: false,
      },
      () => {
        Actions.prequestionpapers({ type: 'reset', item: this.props.newdata });
      }
    );
  }
  ongoback() {
    Actions.prequestionpapers({ type: 'reset', item: this.props.newdata });
  }
  // onExit(){
  //     alert('hi')
  //

  // }
  onAnswer(res) {
    var answerkey = res.key;
    var questionId = this.state.selectedItem.questionId;
    var timecount = this.state.seconds;
    // console.log("sdknaslkdadklcldakcklads",  this.state.secondstime, 'dcdccx', timecount)
    var timess = this.state.secondstime - timecount;
    let data = [...this.state.finalarray];

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
    // console.log("answerrr...", obj)
    // this.setState({

    //     secondstime: timecount
    // })
    this.setState(
      {
        answerobj: obj,
      },
      () => {
        //console.log("answerrr...", this.state.answerobj)
      }
    );
    this.scrollToIndex(this.state.newquestionid - 1);

    this.validateAnswer(obj);
  }
  validateAnswer(answerobj) {
    console.log(
      'm,cnjnc',
      this.state.getquestionsdata[this.state.newquestionid - 1]
    );
    var userId = this.state.useDetails.userInfo.userId;
    //var activityDimId = this.props.data.activityDimId
    var previousQuestionPaperId = this.props.item.questionPaperId;
    var questionId = this.state.selectedItem.questionId;
    var userTestId =
      this.state.getquestionsdata[this.state.newquestionid - 1].userTestId;
    var timeTaken = this.state.secondstime - this.state.seconds;
    var index = this.state.getquestionsdata[this.state.newquestionid - 1].index;
    var url =
      baseUrl +
      `/users/${userId}/questionPapers/${previousQuestionPaperId}/user-tests/${userTestId}/questions/${questionId}/${index}/validate`;
    var data = {
      attemptStartedAt: moment().format('YYYY-MM-DD HH:mm:ss'), //this.state.activityStartTime, // YYY-MM-DD HH:MM:SS
      attemptEndedAt: moment()
        .add(timeTaken, 'seconds')
        .format('YYYY-MM-DD HH:mm:ss'),
      questionId: answerobj.question,
      userAnswer: answerobj.user_answer,
      userTestId:
        this.state.getquestionsdata[this.state.newquestionid - 1].userTestId,
    };
    console.log('sdkasdkadjKASD', data, url);
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        jwt: this.state.token,
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log('sjkbjkbjk', json);
      })
      .catch((error) => console.error(error));
  }
  getItemLayout = (data, index) => ({ length: 50, offset: 50 * index, index });
  scrollToIndex = (index) => {
    let randomIndex = index;
    this.flatListRef.scrollToIndex({ animated: true, index: randomIndex });
  };
  rednerAnswerItem({ item, index }) {
    //console.log("Sknajlklnckc", this.state.answerobj, "DAfd", item)

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
        {this.state.subjectiveview === true ? (
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
                      {'Previous Paper Test'}
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
                ) : this.state.getsubjquestionsdata.length > 0 &&
                  !this.state.nosubdata ? (
                  <View style={{ flex: 1 }}>
                    <View style={styles.mainbottomview}>
                      <View style={styles.mainshadowview}>
                        <View style={styles.headerview}>
                          <View style={styles.headrightview}>
                            {/* <View style={[styles.timerview, { backgroundColor: colors.Themecolor }]}>
                                                            <Image source={require('../../assets/images/timer.png')} style={{ width: 25, height: 25, alignSelf: "center", marginRight: 10 }} />
                                                            <Text style={styles.timertext}>{parseInt(this.state.seconds / 60, 10)}:{parseInt(this.state.seconds % 60, 10)}</Text>

                                                        </View> */}
                          </View>
                        </View>

                        <View style={styles.listview}>
                          <View style={styles.circlesview}>
                            <FlatList
                              data={this.state.getsubjquestionsdata}
                              ref={(ref) => {
                                this.flatListRef = ref;
                              }}
                              initialScrollIndex={0}
                              getItemLayout={this.getItemLayout}
                              keyExtractor={(item, index) => String(index)}
                              renderItem={this.renderItemsub.bind(this)}
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
                            <ScrollView>
                              <View
                                style={{ paddingBottom: 30, paddingTop: 20 }}
                              >
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    marginTop: 10,
                                  }}
                                >
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
                                <View
                                  style={{ marginTop: 20, marginBottom: 20 }}
                                >
                                  <Text
                                    style={{
                                      fontSize: heafont,
                                      marginBottom: 10,
                                      marginLeft: 10,
                                      fontWeight: 'bold',
                                    }}
                                  >
                                    Explanation :
                                  </Text>
                                  <View
                                    style={{
                                      paddingVertical: 10,
                                      marginHorizontal: 10,
                                      borderWidth: 1,
                                      borderColor: 'lightgrey',
                                      marginTop: 10, //borderColor: this.state.answerobj.user_answer === item.key ? topicindata.color : "lightgrey",
                                    }}
                                  >
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
                                        width: '95%',
                                        // backgroundColor: "red",
                                        //  height: 150,
                                        // borderWidth: 1,
                                        // borderRadius:10,

                                        marginLeft: 10,
                                        // justifyContent: "center",
                                        // alignSelf: 'flex-start',
                                      }}
                                      html={this.state.selectedItem.explanation}
                                    />
                                  </View>
                                </View>
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
                    <Text style={{ fontSize: subfont }}>No data</Text>
                    <TouchableOpacity onPress={this.ongoback.bind(this)}>
                      <Text style={{ fontSize: subfont }}>GO BACK</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              {this.state.getsubjquestionsdata.length > 0 &&
              !this.state.nosubdata ? (
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
                          onPress={this.onprevsub.bind(this)}
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
                      this.state.getsubjquestionsdata.length ? (
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
                          onPress={this.ondonesub.bind(this)}
                        >
                          <Text
                            style={{
                              textAlign: 'center',
                              fontSize: bototmsize,
                              color: colors.Themecolor,
                            }}
                          >
                            Done
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
                          onPress={this.onnextsub.bind(this)}
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
        ) : (
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
                        {'Previous Paper Test'}
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
                      <Text style={{ fontSize: heafont }}>Loading...</Text>
                    </View>
                  ) : this.state.getquestionsdata.length > 0 &&
                    !this.state.nodata ? (
                    <View style={{ flex: 1 }}>
                      <View style={styles.mainbottomview}>
                        <View style={styles.mainshadowview}>
                          <View style={styles.headerview}>
                            <View style={styles.headrightview}>
                              <View
                                style={[
                                  styles.timerview,
                                  {
                                    backgroundColor: colors.Themecolor,
                                    width: itimerwidth,
                                    height: timerheight,
                                    r,
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
                                <Text style={{ fontSize: heafont }}>
                                  Loading....
                                </Text>
                              </View>
                            ) : (
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
                                  <View style={{}}>
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
                      <Text style={{ fontSize: subfont }}>No data</Text>
                      <TouchableOpacity onPress={this.ongoback.bind(this)}>
                        <Text style={{ fontSize: subfont }}>GO BACK</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
                {this.state.getquestionsdata.length > 0 &&
                !this.state.nodata ? (
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
                    style={{ fontSize: 20, textAlign: 'center', marginTop: 10 }}
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
                        <Text style={{ color: 'white' }}>CANCEL</Text>
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
                        <Text style={{ color: 'white' }}>SUBMIT</Text>
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
                    style={{ fontSize: 15, textAlign: 'center', marginTop: 10 }}
                  >
                    You are about to begin the assessment. Once you begin you
                    have 5mins to finish the test
                  </Text>
                  <Text
                    style={{
                      fontSize: 18,
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
                        <Text style={{ color: 'white' }}>CANCEL</Text>
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
                        <Text style={{ color: 'white' }}>OK</Text>
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
        )}
      </SafeAreaView>
    );
  }
}

export default PrePaperAssesment;
