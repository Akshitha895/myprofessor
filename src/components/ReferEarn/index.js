import React, { Component } from 'react';
import { ImageBackground, TouchableOpacity, View } from 'react-native';
import { Actions } from 'react-native-router-flux';
import styles from './styles';

class ReferEarn extends Component {
  constructor(props) {
    super(props);
  }
  onRefer() {
    Actions.push('referview');
  }
  render() {
    return (
      <View style={{ backgroundColor: 'transparent', marginVertical: 25 }}>
        <TouchableOpacity onPress={this.onRefer.bind(this)}>
          <ImageBackground
            source={require('../../assets/images/dashboard/new/referimg_new.png')}
            style={styles.imagestyles}
          />
        </TouchableOpacity>
      </View>
    );
  }
}
export default ReferEarn;
