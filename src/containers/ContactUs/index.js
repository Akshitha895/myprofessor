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

import Communications from 'react-native-communications';
import DeviceConstants from 'react-native-device-constants';
import LinearGradient from 'react-native-linear-gradient';
import { Actions } from 'react-native-router-flux';
import { colors } from '../../constants';
import styles from './styles';
var headfont = 18,
  widthback = 21,
  heightback = 16,
  imagewidth = 132 / 1.2,
  imageheight = 132 / 1.2,
  chnagelogowidth = 288 / 1.5,
  chnagelogoheight = 287 / 1.5,
  circlesize = 30,
  phwidth = 19 / 1.5,
  phheight = 26 / 1.5,
  linkwidth = 20 / 1.5,
  linkheight = 20 / 1.5,
  mailwidth = 20 / 1.5,
  mailheight = 15 / 1.5,
  smalltext = 15,
  lineheightbox = 50;
// var obj = {
//   questionId: '5ef04405-8402-46a4-abc1-222ac1f8db6f',
//   question:
//     '<p>The path that a robot is following on a x-y plane is found by interpolation four data points as&nbsp;</p>\n\n<table border="1" cellpadding="1" cellspacing="1">\n\t<tbody>\n\t\t<tr>\n\t\t\t<td>x</td>\n\t\t\t<td>2</td>\n\t\t\t<td>4.5</td>\n\t\t\t<td>5.5</td>\n\t\t\t<td>7</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td>y</td>\n\t\t\t<td>7.5</td>\n\t\t\t<td>7.5</td>\n\t\t\t<td>6</td>\n\t\t\t<td>5</td>\n\t\t</tr>\n\t</tbody>\n</table>\n\n<p><span class="math-tex">\\(y(x)=0.15238x^3\\)</span>&nbsp;<span class="math-tex">\\(-2.2571x^2+\\)</span>&nbsp;</p>\n\n<p><span style="color:#666666"><span style="font-size:16px"><span style="background-color:null">9.6048x-3.9000</span></span></span></p>\n\n<p><span style="color:#666666"><span style="font-size:16px"><span style="background-color:null">The length of the path from x=2 to x=7 is</span></span></span></p>\n',
//   solution: '3',
//   explanation:
//     '<p>The length S of the curve y(x) from a to b is given by</p>\n\n<p><span class="math-tex">\\(S=\\int_a^b\\sqrt{1+\\left(\\frac{dy}{dx}\\right)^2}dx\\)</span></p>\n\n<p><span style="color:#666666"><span style="font-size:16px"><span style="background-color:null">where&nbsp;</span></span></span></p>\n\n<p><span style="color:#666666"><span style="font-size:16px"><span style="background-color:null">a=2</span></span></span></p>\n\n<p><span style="color:#666666"><span style="font-size:16px"><span style="background-color:null">b=7</span></span></span></p>\n\n<p><span style="color:#666666"><span style="font-size:16px"><span style="background-color:null">giving</span></span></span></p>\n\n<p><span style="color:#666666"><span style="font-size:16px"><span style="background-color:null"><span class="math-tex">\\(S=\\int_2^7\\sqrt{1+\\left(\\frac{dy}{dx}\\right)^2}dx\\)</span></span></span></span></p>\n\n<p><span style="color:#666666"><span style="font-size:16px"><span style="background-color:null">y(x)=&nbsp;<span class="math-tex">\\(0.15238\\;x^3-\\)</span>&nbsp;<span class="math-tex">\\(2.2571\\;x^2+\\)</span>&nbsp;</span></span></span></p>\n\n<p><span style="color:#666666"><span style="font-size:16px"><span style="background-color:null">9.6048x - 3.9000</span></span></span></p>\n\n<p><span style="color:#666666"><span style="font-size:16px"><span style="background-color:null"><span class="math-tex">\\(\\frac{dy}{dx}=0.45714\\;x^2\\)</span>&nbsp;- 4.5142x+ 9.6048</span></span></span></p>\n\n<p><span style="color:#666666"><span style="font-size:16px"><span style="background-color:null">Thus</span></span></span></p>\n\n<p><span style="color:#666666"><span style="font-size:16px"><img alt="" src="https://smartgen-in.s3.ap-south-1.amazonaws.com/Images/myprofessorlive-images/20190816084129834.png" style="width: 50 % " /></span></span></p>\n',
//   userAnswer: '1',
//   options: [
//     {
//       key: '2',
//       value:
//         '<p><img alt="" src="https://smartgen-in.s3.ap-south-1.amazonaws.com/Images/myprofessorlive-images/20190816084040550.png" style="width: 100%; height: 100%;" /></p>\n',
//     },
//     {
//       key: '1',
//       value:
//         '<p><img alt="" src="https://smartgen-in.s3.ap-south-1.amazonaws.com/Images/myprofessorlive-images/20190816083906912.png" style="width: 100%; height: 100%;" /></p>\n',
//     },
//     {
//       key: '3',
//       value:
//         '<p><img alt="" src="https://smartgen-in.s3.ap-south-1.amazonaws.com/Images/myprofessorlive-images/20190816084129834.png" style="width: 100%; height: 100%;" /></p>\n',
//     },
//     {
//       key: '4',
//       value:
//         '<p><span class="math-tex">\\(\\int_2^7(0.15238\\;x^3\\)</span>&nbsp;<span class="math-tex">\\(-2.2571\\;x^2\\)</span>&nbsp;+9.6048x-3.9000)dx</p>\n',
//     },
//   ],
// };
class ContactUs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refercode: 'SMART123',
      currentpassword: '',
      newpass: '',
      cnfPass: '',
    };
  }
  async componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction
    );
  }
  backAction = () => {
    this.onBack();
    return true;
  };
  componentWillUnmount() {
    this.backHandler.remove();
  }
  onChangeText(text) {
    this.setState({
      currentpassword: text,
    });
  }
  onChangeTextConf(text) {
    this.setState({
      cnfPass: text,
    });
  }
  onChangeNew(text) {
    this.setState({
      newpass: text,
    });
  }
  onBack() {
    Actions.pop();
  }
  onsubmit() {}

  render() {
    // const scalesPageToFit = Platform.OS === 'android';

    const isTablet = DeviceConstants.isTablet; // false
    if (isTablet) {
      headfont = 26;
      (widthback = 21 * 1.5), (heightback = 16 * 1.5);
      (imagewidth = 132), (imageheight = 132);
      (chnagelogowidth = 288), (circlesize = 60), (chnagelogoheight = 287);
      (phwidth = 19), (phheight = 26);
      (linkwidth = 20), (linkheight = 20);
      (mailwidth = 20),
        (mailheight = 15),
        (smalltext = 22),
        (lineheightbox = 80);
    }

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.mainView}>
          <View style={styles.topView}>
            <View style={styles.topShadow}>
              <TouchableOpacity onPress={this.onBack.bind(this)}>
                <Image
                  source={require('../../assets/images/refer/back.png')}
                  style={[
                    styles.backIcon,
                    { height: heightback, width: widthback },
                  ]}
                />
              </TouchableOpacity>

              <Text style={[styles.topHead, { fontSize: headfont }]}>
                Contact Us
              </Text>
            </View>
          </View>

          <View style={styles.bottomView}>
            <View style={styles.bottomtopvieW}>
              <LinearGradient
                colors={[
                  ' rgba(105, 80, 119, 0.08)',
                  'rgba(132, 115, 147, 0.064)',
                ]}
                style={styles.gradientview}
              >
                <ImageBackground
                  source={require('../../assets/images/refer/contactlogo.png')}
                  style={[
                    styles.changelogo,
                    {
                      width: chnagelogowidth,
                      height: chnagelogoheight,
                      tintColor: colors.Themecolor,
                    },
                  ]}
                >
                  <Image
                    source={require('../../assets/images/refer/musiclogo.png')}
                    style={{ width: imagewidth, height: imageheight }}
                  />
                </ImageBackground>
              </LinearGradient>
            </View>
            <View style={styles.bottomsubView}>
              <View style={styles.bottomsubview}>
                <View
                  style={{
                    width: '80%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    height: lineheightbox,
                  }}
                >
                  <View
                    style={[
                      styles.circle,
                      {
                        width: circlesize,
                        height: circlesize,
                        backgroundColor: colors.Themecolor,
                        borderRadius: circlesize / 2,
                      },
                    ]}
                  >
                    <Image
                      source={require('../../assets/images/refer/link.png')}
                      style={{ width: linkwidth, height: linkheight }}
                    />
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      Communications.web('http://www.myprofessor.in/')
                    }
                  >
                    <Text style={[styles.subtext, { fontSize: smalltext }]}>
                      http://www.myprofessor.in/
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    width: '80%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    height: lineheightbox,
                  }}
                >
                  <View
                    style={[
                      styles.circle,
                      {
                        width: circlesize,
                        height: circlesize,
                        backgroundColor: colors.Themecolor,
                        borderRadius: circlesize / 2,
                      },
                    ]}
                  >
                    <Image
                      source={require('../../assets/images/refer/mail.png')}
                      style={{ width: mailwidth, height: mailheight }}
                    />
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      Communications.email(
                        ['support@myprofessor.in'],
                        null,
                        null,
                        '',
                        ''
                      )
                    }
                  >
                    <Text style={[styles.subtext, { fontSize: smalltext }]}>
                      support@myprofessor.in
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    width: '80%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    height: lineheightbox,
                  }}
                >
                  <View
                    style={[
                      styles.circle,
                      {
                        width: circlesize,
                        height: circlesize,
                        backgroundColor: colors.Themecolor,
                        borderRadius: circlesize / 2,
                      },
                    ]}
                  >
                    <Image
                      source={require('../../assets/images/refer/phone.png')}
                      style={{ width: phwidth, height: phheight }}
                    />
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      Communications.phonecall('+919494843456', true)
                    }
                  >
                    <Text style={[styles.subtext, { fontSize: smalltext }]}>
                      +919494843456
                    </Text>
                  </TouchableOpacity>
                </View>

                <Text
                  style={[
                    styles.subtext,
                    { fontSize: smalltext, marginTop: 10 },
                  ]}
                >
                  Available between 10:00AM to 06:00PM
                </Text>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
export default ContactUs;
