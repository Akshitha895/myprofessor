import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  TouchableOpacity,
  View,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import styles from './styles';
const windowHeight = Dimensions.get('window').height;

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onBack() {
    Actions.pop();
  }

  render() {
    var { title } = this.props;
    return (
      <>
        <ImageBackground
          source={require('../../assets/images/Banner_back.png')}
          style={styles.backbanner}
        >
          <Image
            source={require('../../assets/images/auth-bg.jpg')}
            style={{
              width: '100%',
              height: windowHeight / 3.5,
              resizeMode: 'cover',
            }}
          />

          <View
            style={{
              position: 'absolute',
              backgroundColor: 'transparent',
              top: 0,
            }}
          >
            {title === 'forgot' || title === 'otp' || title === 'register' ? (
              <TouchableOpacity onPress={this.onBack}>
                <Image
                  source={require('../../assets/images/left-arrow.png')}
                  style={styles.back}
                />
              </TouchableOpacity>
            ) : null}
          </View>
        </ImageBackground>
      </>
    );
  }
}
export default Header;
