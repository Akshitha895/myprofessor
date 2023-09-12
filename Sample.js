import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ImageBackground,
  ScrollView,
  View,
  BackHandler,
  Text,
  Dimensions,
  Platform,
  Image,
  Keyboard,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import MathJax from 'react-native-mathjax';

import { Actions } from 'react-native-router-flux';
import DeviceConstants from 'react-native-device-constants';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import LinearGradient from 'react-native-linear-gradient';
import Communications from 'react-native-communications';
var headfont = 18,
  widthback = 21,
  heightback = 16,
  imagewidth = 132 / 1.2,
  imageheight = 132 / 1.2,
  chnagelogowidth = 288 / 1.5,
  chnagelogoheight = 287 / 1.5,
  circlesize = 30,
  phwidth = 19 / 1.5,
  phheight = 26 / 1.5;
(linkwidth = 20 / 1.5), (linkheight = 20 / 1.5);
(mailwidth = 20 / 1.5),
  (mailheight = 15 / 1.5),
  (smalltext = 15),
  (lineheightbox = 50);
var obj = {
  questionId: '5ef04405-8402-46a4-abc1-222ac1f8db6f',
  question:
    '<p>The path that a robot is following on a x-y plane is found by interpolation four data points as&nbsp;</p>\n\n<table border="1" cellpadding="1" cellspacing="1">\n\t<tbody>\n\t\t<tr>\n\t\t\t<td>x</td>\n\t\t\t<td>2</td>\n\t\t\t<td>4.5</td>\n\t\t\t<td>5.5</td>\n\t\t\t<td>7</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td>y</td>\n\t\t\t<td>7.5</td>\n\t\t\t<td>7.5</td>\n\t\t\t<td>6</td>\n\t\t\t<td>5</td>\n\t\t</tr>\n\t</tbody>\n</table>\n\n<p><span class="math-tex">\\(y(x)=0.15238x^3\\)</span>&nbsp;<span class="math-tex">\\(-2.2571x^2+\\)</span>&nbsp;</p>\n\n<p><span style="color:#666666"><span style="font-size:16px"><span style="background-color:null">9.6048x-3.9000</span></span></span></p>\n\n<p><span style="color:#666666"><span style="font-size:16px"><span style="background-color:null">The length of the path from x=2 to x=7 is</span></span></span></p>\n',
  solution: '3',
  explanation:
    '<p>The length S of the curve y(x) from a to b is given by</p>\n\n<p><span class="math-tex">\\(S=\\int_a^b\\sqrt{1+\\left(\\frac{dy}{dx}\\right)^2}dx\\)</span></p>\n\n<p><span style="color:#666666"><span style="font-size:16px"><span style="background-color:null">where&nbsp;</span></span></span></p>\n\n<p><span style="color:#666666"><span style="font-size:16px"><span style="background-color:null">a=2</span></span></span></p>\n\n<p><span style="color:#666666"><span style="font-size:16px"><span style="background-color:null">b=7</span></span></span></p>\n\n<p><span style="color:#666666"><span style="font-size:16px"><span style="background-color:null">giving</span></span></span></p>\n\n<p><span style="color:#666666"><span style="font-size:16px"><span style="background-color:null"><span class="math-tex">\\(S=\\int_2^7\\sqrt{1+\\left(\\frac{dy}{dx}\\right)^2}dx\\)</span></span></span></span></p>\n\n<p><span style="color:#666666"><span style="font-size:16px"><span style="background-color:null">y(x)=&nbsp;<span class="math-tex">\\(0.15238\\;x^3-\\)</span>&nbsp;<span class="math-tex">\\(2.2571\\;x^2+\\)</span>&nbsp;</span></span></span></p>\n\n<p><span style="color:#666666"><span style="font-size:16px"><span style="background-color:null">9.6048x - 3.9000</span></span></span></p>\n\n<p><span style="color:#666666"><span style="font-size:16px"><span style="background-color:null"><span class="math-tex">\\(\\frac{dy}{dx}=0.45714\\;x^2\\)</span>&nbsp;- 4.5142x+ 9.6048</span></span></span></p>\n\n<p><span style="color:#666666"><span style="font-size:16px"><span style="background-color:null">Thus</span></span></span></p>\n\n<p><span style="color:#666666"><span style="font-size:16px"><img alt="" src="https://smartgen-in.s3.ap-south-1.amazonaws.com/Images/myprofessorlive-images/20190816084129834.png" style="width: 50 % " /></span></span></p>\n',
  userAnswer: '1',
  options: [
    {
      key: '2',
      value:
        '<p><img alt="" src="https://smartgen-in.s3.ap-south-1.amazonaws.com/Images/myprofessorlive-images/20190816084040550.png" style="width: 100%; height: 100%;" /></p>\n',
    },
    {
      key: '1',
      value:
        '<p><img alt="" src="https://smartgen-in.s3.ap-south-1.amazonaws.com/Images/myprofessorlive-images/20190816083906912.png" style="width: 100%; height: 100%;" /></p>\n',
    },
    {
      key: '3',
      value:
        '<p><img alt="" src="https://smartgen-in.s3.ap-south-1.amazonaws.com/Images/myprofessorlive-images/20190816084129834.png" style="width: 100%; height: 100%;" /></p>\n',
    },
    {
      key: '4',
      value:
        '<p><span class="math-tex">\\(\\int_2^7(0.15238\\;x^3\\)</span>&nbsp;<span class="math-tex">\\(-2.2571\\;x^2\\)</span>&nbsp;+9.6048x-3.9000)dx</p>\n',
    },
  ],
};
class Sample extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const scalesPageToFit = Platform.OS === 'android';

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'red' }}>
        <View>
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
              marginTop: Platform.OS === 'android' ? 5 : 4,
              // borderWidth: 1,
              // borderRadius:10,
              // borderColor: this.state.answerobj.user_answer === item.key ? topicindata.color : "lightgrey",
              marginLeft: 10,
              // justifyContent: "center",
              // alignSelf: 'flex-start',
            }}
            html={obj.explanation}
          />
        </View>
      </SafeAreaView>
    );
  }
}
export default Sample;
