// import React, { Component } from 'react';
// import {
//     SafeAreaView,
//     StyleSheet,
//     ImageBackground,
//     ScrollView,
//     View,
//     Text,
//     Dimensions,
//     StatusBar,
//     Image,
//     Keyboard,
//     TouchableOpacity
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Actions } from 'react-native-router-flux';
// var _this;
// import PushNotificationIOS from "@react-native-community/push-notification-ios";
// import PushNotification from "react-native-push-notification";
// import StringsOfLanguages from './../StringsOfLanguages';
// import { colors } from "../constants"

// class Settings extends Component{
// 	constructor(props){
//      super(props)
//     this.state={

//     }
// 	}

// 	componentDidMount(){
//             this.getData()
//     }

//   getData = async () => {
//     try {

//           const localevalue = await AsyncStorage.getItem('@localevalue');
//          //alert("dddd"+localevalue)
//         if(localevalue){
//           StringsOfLanguages.setLanguage(localevalue);
//           //Actions.push('dashboard')
//         }else{
//           StringsOfLanguages.setLanguage('en');

//       }
//     } catch(e) {
//        return null;
//     }
//   }
//   onLanguage(value){
//     alert(value)
//     StringsOfLanguages.setLanguage(value);
//     AsyncStorage.setItem('@localevalue', JSON.stringify(value));
//   }
// 	render(){
// 		return(

//           <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
//             		<Image source={require('../assets/images/logo_icon.png')}
// 					style={{width:100,height:100,}}/>
//         <TouchableOpacity onPress={this.onLanguage.bind(this,'en')} style={{height:50,paddingHorizontal:10,backgroundColor:colors.Themecolor,width:100,justifyContent:"center",alignItems:"center",marginTop:30}}>
//           <Text style={{color:"white"}}>English</Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={this.onLanguage.bind(this,'th')} style={{height:50,paddingHorizontal:10,backgroundColor:colors.Themecolor,width:100,marginTop:30,justifyContent:"center",alignItems:"center"}}>
//           <Text style={{color:"white"}}>Thai</Text>
//         </TouchableOpacity>
//       </View>

// 			)
// 	}
// }
// export default Settings

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import StringsOfLanguages from '../../StringsOfLanguages';

import { colors } from '../../constants';

import styles from './styles';
class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      langaugae: '',
    };
  }
  componentDidMount() {
    this.getData();
  }
  onBack() {
    Actions.pop({ type: 'reset' });
  }
  onLanguage(value) {
    var language;
    if (value === 'th') {
      language = 'Thailand';
    } else {
      language = 'English';
    }
    Alert.alert('', 'Do you want to change the language to ' + language, [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          StringsOfLanguages.setLanguage(value);
          AsyncStorage.setItem('@localevalue', value);
          this.setState(
            {
              langaugae: value,
            },
            () => {
              Actions.dashboard({ type: 'reset' });
            }
          );
        },
      },
    ]);
  }
  getData = async () => {
    try {
      const localevalue = await AsyncStorage.getItem('@localevalue');

      if (localevalue) {
        this.setState({
          langaugae: localevalue,
        });
      } else {
        //StringsOfLanguages.setLanguage('en');
      }
    } catch (e) {
      return null;
    }
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.mainView}>
          <View style={styles.topView}>
            <View style={styles.topShadow}>
              <TouchableOpacity onPress={this.onBack.bind(this)}>
                <Image
                  source={require('../../assets/images/refer/back.png')}
                  style={styles.backIcon}
                />
              </TouchableOpacity>

              <Text style={styles.topHead}>Settings</Text>
            </View>
          </View>

          <View style={styles.bottomView}>
            <View style={{ flex: 1, marginTop: 20 }}>
              <View>
                <Text style={{ marginLeft: 20 }}>Change Langugae:</Text>
              </View>
              <View
                style={{ flexDirection: 'row', justifyContent: 'space-around' }}
              >
                <TouchableOpacity
                  onPress={this.onLanguage.bind(this, 'en')}
                  style={{
                    height: 50,
                    paddingHorizontal: 10,
                    backgroundColor:
                      this.state.langaugae === 'en'
                        ? colors.Themecolor
                        : 'white',
                    width: 100,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 30,
                    borderWidth: 1,
                    borderColor: colors.Themecolor,
                  }}
                >
                  <Text
                    style={{
                      color:
                        this.state.langaugae === 'en'
                          ? 'white'
                          : colors.Themecolor,
                    }}
                  >
                    English
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={this.onLanguage.bind(this, 'th')}
                  style={{
                    height: 50,
                    paddingHorizontal: 10,
                    backgroundColor:
                      this.state.langaugae === 'th'
                        ? colors.Themecolor
                        : 'white',
                    width: 100,
                    marginTop: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: colors.Themecolor,
                  }}
                >
                  <Text
                    style={{
                      color:
                        this.state.langaugae === 'th'
                          ? 'white'
                          : colors.Themecolor,
                    }}
                  >
                    Thai
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
export default Settings;
