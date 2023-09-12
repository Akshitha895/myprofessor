import React, { Component } from 'react';
import {
  Alert,
  BackHandler,
  Image,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
// import COLORS from '../styles/color';
// import { STRING, url } from '../values/string';
// import GLOBALSTYLE from '../values/style';
// import AsyncStorage from '@react-native-community/async-storage';
// import MathJax from 'react-native-mathjax';
import WebView from 'react-native-webview';
// import MESSAGE from '../values/message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PERMISSIONS, requestMultiple } from 'react-native-permissions';
import { Actions } from 'react-native-router-flux';
import { baseUrl } from '../../constants';
var i = 0;

class LiveSessionActivity extends Component {
  constructor(props) {
    super(props);
    i = 0;

    this.state = {
      isLoading: false,
      // isFromDetailActivity: this.props.navigation.getParam("isFromDetailActivity", true),
      // isForReview: this.props.navigation.getParam("isForReview", true),
      languageId: '',
      topicId: '',
      topicName: '',
      videoURL: '',
      noteData: '',
      htmlURL: this.props.meetingUrl,
      // htmlURL: 'http://newcleusit.com/b/dhr-rj3-tzu',
      isHTMLAvailable: false,
      isNoteAvailable: false,
      showend: false,
      token: '',
    };
  }

  componentDidMount() {
    this.getData();
    requestMultiple([
      PERMISSIONS.ANDROID.CAMERA,
      PERMISSIONS.ANDROID.RECORD_AUDIO,
    ]).then((statuses) => {
      console.log('Camera', statuses[PERMISSIONS.ANDROID.CAMERA]);
      console.log('Audio', statuses[PERMISSIONS.ANDROID.RECORD_AUDIO]);
    });
    this.getScriptHTMLAPI();
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction
    );
  }
  getData = async () => {
    try {
      const token = await AsyncStorage.getItem('@access_token');
      if (token) {
        this.setState({
          token: JSON.parse(token),
        });
      } else {
      }
    } catch (e) {
      return null;
    }
  };

  // componentDidMount() {
  //     if (!this.state.isForReview) {
  //         this.backHandler = BackHandler.addEventListener(
  //             "hardwareBackPress",
  //             this.backAction
  //         );
  //     }
  // }

  componentWillUnmount() {
    if (!this.state.isForReview) {
      this.backHandler.remove();
    }
  }

  backAction = () => {
    Alert.alert(
      '',
      'Are you sure want to leave the current session?',
      [
        {
          text: 'NO',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'YES',
          onPress: () => {
            this.goNavBack();
          },
        },
      ],
      { cancelable: false }
    );
    return true;
  };

  goNavBack() {
    console.log('Clicked');
    this.endmeeting();
    Actions.push('survey', { data: this.props.data });
  }

  getScriptHTMLAPI() {
    this.setState({
      isLoading: false,
      isNoteAvailable: false,
      isHTMLAvailable: true,
    });
  }

  _onNavigationStateChange(webViewState) {
    console.log('ggggggggg', webViewState);
    if (!webViewState.loading) {
      this.setState({ showend: true });
    }

    if (
      (webViewState.url.indexOf('/survey') > -1 ||
        webViewState.title.indexOf('BigBlueButton - ') > -1) &&
      i === 0
    ) {
      console.log('hhhhhhhh', webViewState.url);
      i++;
      this.endmeeting();
      Actions.pop({ type: 'reset' });
      //this.props.navigation.goBack(null);
    }
  }

  handleMessage(message) {
    console.log(message);
  }

  onEndMeeting() {
    Alert.alert(
      '',
      'Are you sure want to leave the current session?',
      [
        {
          text: 'NO',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'YES',
          onPress: () => {
            this.goNavBack();
          },
        },
      ],
      { cancelable: false }
    );
  }

  endmeeting() {
    const { data } = this.props;
    console.log('ddddddddd', data);
    const url = baseUrl + '/live-class/' + data.reference_id + '/end';
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: this.state.token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        const data = json.data;
        // alert(JSON.stringify(data))
        console.log('endmeeting......', json);
      })
      .catch((error) => console.error(error));
  }

  render() {
    //  console.log("ttt",this.props.data.meetingUrl)
    return (
      <View style={{ backgroundColor: 'green', height: '100%', width: '100%' }}>
        <StatusBar hidden />
        {/* <PermissionWebview
                    style={{ height: '100%', width: '100%', backgroundColor: COLORS.white }}
                    source={{ uri: this.state.htmlURL }}
                    sourceUri={this.state.htmlURL}
                /> */}
        <WebView
          androidLayerType="hardware"
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: 'white',
            minHeight: 1,
          }}
          javaScriptEnabled
          domStorageEnabled
          allowsFullscreenVideo
          source={{ uri: this.state.htmlURL }}
          onMessage={this.handleMessage.bind(this)}
          onNavigationStateChange={this._onNavigationStateChange.bind(this)}
          userAgent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36"
        />

        {this.state.showend ? (
          <TouchableOpacity
            onPress={this.onEndMeeting.bind(this)}
            style={{
              position: 'absolute',
              backgroundColor: 'transparent',
              bottom: 0,
              padding: 20,
              right: 0,
            }}
          >
            <Image
              source={require('../../assets/images/endcall.png')}
              style={{ width: 30, height: 30 }}
            />
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }
}

export default LiveSessionActivity;
