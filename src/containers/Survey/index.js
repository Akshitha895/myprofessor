import React, { Component } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import AsyncStorage from '@react-native-async-storage/async-storage';

import StarRating from 'react-native-star-rating';
import { baseUrl, colors } from '../../constants';

import styles from './styles';
var radio_props = [
  { label: 'Yes', value: 0 },
  { label: 'No', value: 1 },
];
class Survey extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      loading: true,
      surevyquestions: null,
      starCount: 0,
      finalarray: [],
      feedBack: [],
      selectedItem: '',
      answerobj: '',
      questionno: 0,
      spinner: false,
    };
  }
  componentDidMount() {
    this.getData();
    // this.getsurevyquestions()
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
            },
            () => this.getsurevyquestions()
          );
        } else {
        }
      } else {
        console.log('errorr');
      }
    } catch (e) {
      return null;
    }
  };
  getsurevyquestions() {
    const { data } = this.props;
    var id = data.reference_id; //"9932892b-d24f-4cf0-a0f1-7c9417a23236"
    var url = baseUrl + '/live-class/' + id + '/servery-question';
    console.log('urlll', url, this.state.token);
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: this.state.token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        console.log('dklnfkdsnfdf', json);
        if (json.statusCode === 200) {
          if (json.data.length > 0) {
            var liveClassSurveyTemplates = json.data;
            let lstQuestions = liveClassSurveyTemplates.map((lc) => {
              return {
                live_class_question_id: lc.reference_id,
                question: lc.question,
                answer_type: lc.answer_type,
                is_mandatory: lc.is_mandatory,
                count: 0,
                yesno: '',
              };
            });
            var updatedaqrray = [...lstQuestions];
            var newarray = [];
            liveClassSurveyTemplates.map((lc, i) => {
              if (lc.is_mandatory) {
                var obj = {
                  live_class_question_id: lc.reference_id,
                  question: lc.question,
                  answer_type: lc.answer_type,
                  is_mandatory: lc.is_mandatory,

                  count: 0,
                  yesno: '',
                };
                newarray.push(obj);
              }
            });
            console.log('newarraynewarray', newarray);

            console.log('dndnvdv', updatedaqrray);
            this.setState({
              loading: false,
              surevyquestions: updatedaqrray,
              selectedItem: updatedaqrray[0],
            });
          } else {
            this.setState({
              surevyquestions: [],
              loading: false,
            });
          }
        } else {
          this.setState({
            surevyquestions: [],
            loading: false,
          });
        }
      })
      .catch((error) => console.error(error));
  }
  onBack() {
    console.log('finalarrayfinalarray', this.state.finalarray);
    Actions.dashboard({ type: 'reset' });
  }
  addFeedback = (newRating, question) => {
    console.log('answerrr...', this.state.finalarray);
    var answerkey = res.key;
    let index = data.findIndex(
      (p) => p.question === this.state.selectedItem.reference_id
    );
    let obj = data[index];
    if (obj) {
      obj.user_answer = answerkey;
      data[index] = Object.assign({}, obj);
      this.setState({ finalarray: data });
    }

    this.setState({
      secondstime: timecount,
    });

    this.setState(
      {
        answerobj: obj,
      },
      () => {}
    );
  };
  onSubmit() {
    var finalarray = this.state.finalarray;
    console.log('smdl', this.state.surevyquestions);
  }
  onStarRatingPress(rating, item) {
    item['count'] = rating;
    item['feedback'] = rating;
    console.log('ratinggg', rating, item);
    var newarray = [...this.state.finalarray];
    var count = 0;
    newarray.map((res, i) => {
      if (res.question === this.state.selectedItem.question) {
        count = 1;
      } else {
      }
    });
    if (count === 0) {
      newarray.push(item);
    }

    this.setState({
      answerobj: item,
      finalarray: newarray,
      starCount: rating,
    });
  }
  onradionval(value, item) {
    item['yesno'] = value;
    item['feedback'] = value === 0 ? 'Yes' : 'No';
    console.log('valuevalue', item, value);
    if (value === 0) {
      newvalue = 'Yes';
    } else if (value === 1) {
      newvalue = 'No';
    }
    var newarray = [...this.state.finalarray];
    var count = 0;
    newarray.map((res, i) => {
      if (res.question === this.state.selectedItem.question) {
        count = 1;
      } else {
      }
    });
    if (count === 0) {
      newarray.push(item);
    }

    this.setState({
      answerobj: item,
      finalarray: newarray,
      starCount: value,
    });
  }

  renderTopitem({ item, index }) {
    return (
      <View
        style={{
          width: 30,
          height: 10,
          backgroundColor: item.feedback ? 'green' : 'grey',
          margin: 10,
        }}
      />
    );
  }
  onNext() {
    // if(Object.keys(this.state.answerobj).length === 0){
    //     alert("please select option")
    // }else{
    this.setState(
      {
        questionno: this.state.questionno + 1,
      },
      () => {
        var nextItem = this.state.surevyquestions[this.state.questionno];
        this.setState(
          {
            selectedItem: nextItem,
            // answerobj : {}
          },
          () =>
            this.state.finalarray.map((res, i) => {
              if (res.question === this.state.selectedItem.question) {
                // console.log("ffff",res.question ,  "  ", this.state.selectedItem.reference_id)
                this.setState({
                  answerobj: res,
                });
              } else {
                this.setState({
                  answerobj: {},
                });
              }
            })
        );
      }
    );
    //  }
  }
  onPrevious() {
    this.setState(
      {
        questionno: this.state.questionno - 1,
      },
      () => {
        var nextItem = this.state.surevyquestions[this.state.questionno];
        this.setState(
          {
            selectedItem: nextItem,
            // answerobj : {}
          },
          () =>
            this.state.finalarray.map((res, i) => {
              if (res.question === this.state.selectedItem.question) {
                // console.log("ffff",res.question ,  "  ", this.state.selectedItem.reference_id)
                this.setState({
                  answerobj: res,
                });
              } else {
                this.setState({
                  answerobj: {},
                });
              }
            })
        );
      }
    );
  }
  onSubmitText() {
    this.setState({ spinner: true });
    console.log('dkl;ksdv', this.state.finalarray);
    const { data } = this.props;
    var id = data.reference_id; //"9932892b-d24f-4cf0-a0f1-7c9417a23236"
    var url = baseUrl + '/live-class/' + id + '/feedback';
    console.log('urlll', url, this.state.token);
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: this.state.token,
      },
      body: JSON.stringify(this.state.finalarray),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log('submitreviewwww', json);
        this.setState({ spinner: false });
        Actions.dashboard({ type: 'reset' });
      })
      .catch((error) => console.error(error));
  }
  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.mainView}>
          <View style={styles.topView}>
            <View style={styles.topShadow}>
              {/* <TouchableOpacity onPress={this.onBack.bind(this)}>
                            <Image source={require('../../assets/images/refer/back.png')} style={styles.backIcon} />
                        </TouchableOpacity> */}
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text style={styles.topHead}>Survey</Text>
                {/* <TouchableOpacity onPress={this.onSubmit.bind(this)} style={{backgroundColor:"transparent",padding:10,width:100,marginRight:10,alignItems:"center"}}>
                            <Text style={{color:colors.Themecolor,textAlign:"center",fontSize:15}}>Submit</Text>
                        </TouchableOpacity> */}
              </View>
            </View>
          </View>

          <View style={styles.bottomView}>
            {this.state.loading ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <ActivityIndicator color="black" />
              </View>
            ) : this.state.surevyquestions.length > 0 ? (
              <>
                <View
                  style={{
                    paddingVertical: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <FlatList
                    data={this.state.surevyquestions}
                    renderItem={this.renderTopitem.bind(this)}
                    keyExtractor={(item) => item.reference_id}
                    extraData={this.state}
                    horizontal
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <View style={{ flex: 1 }}>
                    <View style={{ paddingVertical: 30, paddingLeft: 20 }}>
                      <Text>{'Question:' + (this.state.questionno + 1)}</Text>

                      <Text
                        style={{
                          fontSize: 20,
                          flexWrap: 'wrap',
                          marginTop: 20,
                        }}
                      >
                        {this.state.selectedItem.question}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          flex: 0.9,
                          flexWrap: 'wrap',
                          justifyContent: 'center',
                          marginTop: 60,
                        }}
                      >
                        {this.state.selectedItem.answer_type === '5Star' ? (
                          <StarRating
                            disabled={false}
                            maxStars={5}
                            rating={this.state.selectedItem.count}
                            starSize={45}
                            fullStarColor={colors.Themecolor}
                            starStyle={{ margin: 10 }}
                            selectedStar={(rating) =>
                              this.onStarRatingPress(
                                rating,
                                this.state.selectedItem
                              )
                            }
                          />
                        ) : this.state.selectedItem.answer_type === '10Star' ? (
                          <StarRating
                            disabled={false}
                            maxStars={10}
                            starSize={40}
                            fullStarColor={colors.Themecolor}
                            rating={this.state.selectedItem.count}
                            selectedStar={(rating) =>
                              this.onStarRatingPress(
                                rating,
                                this.state.selectedItem
                              )
                            }
                          />
                        ) : (
                          <RadioForm formHorizontal animation>
                            {/* To create radio buttons, loop through your array of options */}
                            {radio_props.map((obj, i) => (
                              <RadioButton labelHorizontal key={i}>
                                <RadioButtonInput
                                  obj={obj}
                                  index={i}
                                  isSelected={
                                    this.state.selectedItem['yesno'] === i
                                  }
                                  onPress={(value) => {
                                    this.onradionval(
                                      value,
                                      this.state.selectedItem
                                    );
                                  }}
                                  borderWidth={1}
                                  buttonInnerColor={colors.Themecolor}
                                  buttonOuterColor={colors.Themecolor}
                                  buttonSize={15}
                                  buttonOuterSize={30}
                                  buttonStyle={{}}
                                  buttonWrapStyle={{ marginLeft: 10 }}
                                />
                                <RadioButtonLabel
                                  obj={obj}
                                  index={i}
                                  labelHorizontal
                                  onPress={(value) => {
                                    this.setState((s) => ({
                                      ...s,
                                      selectedItem: {
                                        ...s.selectedItem,
                                        yesno: value,
                                      },
                                    }));
                                  }}
                                  labelStyle={{
                                    fontSize: 18,
                                    color: colors.Themecolor,
                                  }}
                                  labelWrapStyle={{}}
                                />
                              </RadioButton>
                            ))}
                          </RadioForm>
                        )}
                      </View>
                      <View style={{ flex: 0.1, padding: 20, bottom: 0 }}>
                        {this.state.surevyquestions.length > 0 ? (
                          <View
                            style={{
                              flex: 1,
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
                                {this.state.questionno + 1 ===
                                this.state.surevyquestions.length ? (
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
                                    onPress={this.onSubmitText.bind(this)}
                                  >
                                    <Text
                                      style={{
                                        textAlign: 'center',
                                        fontSize: 12,
                                        color: colors.Themecolor,
                                      }}
                                    >
                                      Submit
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
                                        fontSize: 18,
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
                    </View>
                  </View>
                </View>
              </>
            ) : (
              <>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text>No Questions</Text>
                  <TouchableOpacity
                    onPress={this.onBack.bind(this)}
                    style={{
                      padding: 10,
                      backgroundColor: colors.Themecolor,
                      marginTop: 20,
                    }}
                  >
                    <Text style={{ color: 'white' }}>Go to Dashboard</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
          {this.state.spinner ? (
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
        </View>
      </SafeAreaView>
    );
  }
}
export default Survey;
