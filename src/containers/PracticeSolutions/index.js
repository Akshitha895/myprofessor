import React, { Component } from 'react';
import {
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

import AsyncStorage from '@react-native-async-storage/async-storage';
import MathJax from 'react-native-mathjax';
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

class PracticeSolutions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItem: null,
      previousItem: null,
      isvisible: false,
      finalarray: [],
      spinner: true,
      questionno: 0,
      token: '',
      questionsarray: [],
      answerobj: {},
      loading: true,
    };
  }
  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backActionnew
    );
    this.getData();
  }
  backActionnew = () => {
    this.onBack();
    return true;
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
          //    alert("hiii")
          this.setState({ token: JSON.parse(token) });
          this.getDataquestions(data, JSON.parse(token));
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
  backAction = () => {
    Actions.pop();
  };
  componentWillUnmount() {
    this.backHandler.remove();
  }
  getDataquestions(user, token) {
    var userId = user.userInfo.userId;
    //var activityDimId = this.props.activtydata.activityDimId
    var userTestId = this.props.testid;
    var url =
      baseUrl +
      `/analytics/users/${userId}/assessments/${userTestId}/review-questions?activityDimId=${''}`;

    console.log('solutionssssss', url);
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        jwt: token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        console.log('dmncjkacnjancj', JSON.stringify(json));
        /// const data = json.data;
        if (json.code === 201) {
          if (json.data) {
            const data = json.data;
            console.log('summary', data[0]);
            this.setState({
              // analysis: json.data.analysis,
              // marks:json.data.marks,
              loading: false,
              questionsarray: json.data,
              testid: this.props.testid,
              selectedItem: data[0],
              questionno: 0,
              spinner: false,
            });
          } else if (json.error) {
            Alert.alert('My Professor', json.error.message, [
              { text: 'OK', onPress: () => Actions.pop() },
            ]);
            this.setState({
              questionsarray: [],
              selectedItem: null,
              questionno: 0,
              spinner: false,
            });
          } else {
            this.setState({
              questionsarray: [],
              selectedItem: null,
              questionno: 0,
              spinner: false,
            });
          }
        } else if (json.error?.code === 400) {
          //alert("dknkdf")
          Alert.alert('My Professor', json.error.message, [
            { text: 'OK', onPress: () => this.logout() },
          ]);
        } else {
          this.setState({
            questionsarray: [],
            selectedItem: null,
            questionno: 0,
            spinner: false,
          });
        }
      })
      .catch((error) => alert('stepup ' + error));
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
  renderItem({ item, index }) {
    var isTablet = DeviceConstants.isTablet;

    var itemheight = 40,
      subfont = 15;
    if (isTablet) {
      (itemheight = 50), (subfont = 25);
    }
    let viewstyle;
    let textstyle;
    if (item.solution === item.userAnswer) {
      viewstyle = [
        styles.circlefilled,
        { height: itemheight, width: itemheight, borderRadius: itemheight / 2 },
      ];
      textstyle = [styles.circletext, { fontSize: subfont }];
    } else {
      viewstyle = [
        styles.borderfilled,
        { height: itemheight, width: itemheight, borderRadius: itemheight / 2 },
      ];
      textstyle = [styles.bordertext, { fontSize: subfont }];
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
    this.setState(
      {
        loading: true,
        questionno: index,
      },
      () => {
        setTimeout(() => {
          var nextItem = this.state.questionsarray[index];
          this.setState({
            loading: false,
            selectedItem: nextItem,
          });
          console.log('mdsnvkds', nextItem);
        }, 1500);
      }
    );
    //  }
  }
  onNext() {
    this.scrollToIndex(this.state.questionno);
    if (this.state.questionno + 1 === this.state.questionsarray.length) {
      Alert.alert('My Professor', 'Are you sure you want to quit?', [
        {
          text: 'Cancel',
          onPress: () => {
            //this.ongoback()
          },
        },
        {
          text: 'Ok',
          onPress: () => {
            Actions.pop();
          },
        },
      ]);
    } else {
      this.setState(
        {
          loading: true,
          questionno: this.state.questionno + 1,
        },
        () => {
          setTimeout(() => {
            var nextItem = this.state.questionsarray[this.state.questionno];
            this.setState({
              loading: false,
              selectedItem: nextItem,
            });
          }, 1500);
        }
      );
    }
  }

  onPrevious() {
    this.scrollToIndex(this.state.questionno);
    if (this.state.questionno - 1 === this.state.questionsarray.length) {
      alert('dfd');
      // this.setState({
      //     isvisible: true
      // })
      //this.onSubmit()
    } else {
      this.setState(
        {
          loading: true,
          questionno: this.state.questionno - 1,
        },
        () => {
          setTimeout(() => {
            var nextItem = this.state.questionsarray[this.state.questionno];
            this.setState({
              loading: false,
              selectedItem: nextItem,
            });
          }, 1500);
        }
      );
    }
  }

  onSubmit() {
    Actions.pop();
  }
  onCancel() {
    this.setState({
      isvisible: false,
    });
  }
  onsubmitmodal() {
    // this.setState({
    //     isvisible:false
    // },()=>{
    //    // console.log("final",this.state.finalarray)
    //     Actions.push('presummary')})
  }
  onBack() {
    Actions.pop();
  }
  onAnswer(res) {
    // var question = this.state.selectedItem;
    // var answer = res;
    // var answerid = res.answerid
    // var questionno = this.state.selectedItem.questionno;
    // var question = this.state.selectedItem.question;
    // var correctanswer = this.state.selectedItem.correctanswer;
    // var result;
    // if(answerid === correctanswer){
    //     result = true;
    // }else{
    //     result = false
    // }
    // var obj = {
    //     questionno,
    //     question,
    //     answerid,
    //     correctanswer,
    //     result
    // }
    // this.setState({
    //     answerobj : obj
    // },()=>console.log("dddd",this.state.answerobj))
    // //finalarray.push(obj);
  }
  returnBoxColor = (option) => {
    const selectedItem = this.state.selectedItem;
    let correct_answer = this.state.selectedItem?.solution.split(',');
    console.log('correct_answer...', correct_answer, option.key);
    if (
      (selectedItem.is_correct && selectedItem.userAnswer === option.key) ||
      (!selectedItem.is_correct && correct_answer.includes(option.key))
    ) {
      return 'green';
    } else if (
      !selectedItem.is_correct &&
      selectedItem.userAnswer &&
      selectedItem.userAnswer !== option.key
    ) {
      return 'lightgrey';
    } else if (
      !selectedItem.is_correct &&
      selectedItem.userAnswer === option.key
    ) {
      return '#f14d65';
    } else {
      return 'lightgrey';
    }
  };

  rednerAnswerItem({ item, index }) {
    return (
      <View
        style={{
          flexDirection: 'row',
          paddingVertical: 10,
          marginHorizontal: 10,
          borderWidth: 1,
          borderColor: this.returnBoxColor(item),
          marginTop: 10, //borderColor: this.state.answerobj.user_answer === item.key ? topicindata.color : "lightgrey",
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

            marginLeft: 10,
            // justifyContent: "center",
            // alignSelf: 'flex-start',
          }}
          html={item.value}
        />
      </View>
    );
  }
  getItemLayout = (data, index) => ({ length: 50, offset: 50 * index, index });
  scrollToIndex = (index) => {
    let randomIndex = index;
    this.flatListRef.scrollToIndex({ animated: true, index: randomIndex });
  };

  render() {
    const { data } = this.props;
    const topicindata = data;
    const isTablet = DeviceConstants.isTablet; // false
    var backheight = 25,
      heafont = 18,
      bottomwidth = 100,
      bototmheight = 30,
      bototmsize = 12,
      radius = 20,
      leftno = 5,
      subfont = 13;
    if (isTablet) {
      (backheight = 35),
        (heafont = 28),
        (bottomwidth = 200),
        (bototmheight = 40),
        (bototmsize = 18),
        (radius = 30),
        (leftno = 10),
        (subfont = 18);
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
                        fontSize: heafont,
                        marginLeft: 10,
                      }}
                    >
                      {'Review Solutions'}
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
                {this.state.questionsarray.length > 0 ? (
                  <View style={styles.listview}>
                    <View style={styles.circlesview}>
                      <FlatList
                        data={this.state.questionsarray}
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
                        <Text style={{ fontSize: heafont }}>Loading....</Text>
                      </View>
                    ) : (
                      <View style={styles.questionsview}>
                        <ScrollView>
                          <View style={{ paddingBottom: 30, paddingTop: 20 }}>
                            <View style={{ flexDirection: 'row' }}>
                              <Text
                                style={{
                                  fontSize: subfont,
                                  marginTop: 10,
                                  marginLeft: leftno,
                                }}
                              >
                                {this.state.questionno + 1}.
                              </Text>
                              <MathJax
                                html={this.state.selectedItem.question}
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
                                  marginTop: Platform.OS === 'android' ? 5 : 4,
                                  //height: 150,
                                  // borderWidth: 2,
                                  // borderRadius:10,
                                  // borderColor: this.state.answerobj.user_answer === item.key ? topicindata.color : "lightgrey",
                                  marginLeft: 5,
                                  // justifyContent: "center",
                                  // alignSelf: 'flex-start',
                                }}
                              />
                            </View>
                            <FlatList
                              data={this.state.selectedItem.options}
                              keyExtractor={(item, index) => String(index)}
                              renderItem={this.rednerAnswerItem.bind(this)}
                              //horizontal={true}
                              showsHorizontalScrollIndicator={false}
                            />

                            {this.state.selectedItem.explanation ? (
                              <View style={{ marginTop: 20, marginLeft: 10 }}>
                                <Text
                                  style={{ fontSize: 15, marginBottom: 10 }}
                                >
                                  Explanation :
                                </Text>
                                <View
                                  style={{
                                    flexDirection: 'row',
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
                                      width: '90%', // height: 150,
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
                            ) : null}
                          </View>
                        </ScrollView>
                      </View>
                    )}
                  </View>
                ) : (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text>Loading......</Text>
                  </View>
                )}
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
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  {this.state.questionno === 0 ? (
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
                    {this.state.questionno + 1 ===
                    this.state.questionsarray.length ? (
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
                        onPress={this.onSubmit.bind(this)}
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
            </View>
          </ImageBackground>
        </>
      </SafeAreaView>
    );
  }
}

export default PracticeSolutions;
