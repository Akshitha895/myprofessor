import React, { Component } from 'react';
import {
  Image,
  ImageBackground,
  Linking,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { colors } from '../constants';

class VersionUpdate extends Component {
  constructor(props) {
    super(props);
  }
  onupdate() {
    if (Platform.OS === 'android') {
      const GOOGLE_PACKAGE_NAME = 'com.smartgen.myprofessor';

      const link = `market://details?id=${GOOGLE_PACKAGE_NAME}`;
      Linking.canOpenURL(link).then(
        (supported) => {
          supported &&
            Linking.openURL(`market://details?id=${GOOGLE_PACKAGE_NAME}`);
        },
        (err) => console.log(err)
      );
    } else {
      const developerid = '1532003727';
      const link = `itms-apps://itunes.apple.com/app/` + developerid;
      console.log('Dncljkdahfcklda', link);
      Linking.canOpenURL(link).then(
        (supported) => {
          supported && Linking.openURL(link);
        },
        (err) => console.log(err)
      );
    }
  }
  render() {
    return (
      <SafeAreaView>
        <>
          <ImageBackground
            source={require('./../assets/images/Mobile_bg_1.png')}
            style={{ width: '100%', height: '100%' }}
          >
            <View style={{ width: '100%', height: '100%' }}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}
              >
                <View style={{ flex: 0.3, justifyContent: 'space-evenly' }}>
                  <Text
                    style={{ fontSize: 20, fontWeight: 'bold', marginTop: 30 }}
                  >
                    My Professor
                  </Text>
                  <Image
                    source={require('../assets/images/logo_icon1.png')}
                    style={{
                      width: 102,
                      height: 102,
                      alignSelf: 'center',
                      borderRadius: 102 / 2,
                    }}
                  />
                </View>
                <View
                  style={{
                    flex: 0.6,
                    justifyContent: 'flex-start',
                    marginTop: 50,
                  }}
                >
                  <Text
                    style={{
                      marginHorizontal: 30,
                      fontSize: 16,
                      textAlign: 'center',
                    }}
                  >
                    Introducing all new version of App, at your service!
                  </Text>

                  <Text
                    style={{
                      marginHorizontal: 30,
                      fontSize: 16,
                      textAlign: 'center',
                      marginTop: 30,
                    }}
                  >
                    Current Version of App will no longer be supported now.
                    Please update to the latest version
                  </Text>
                </View>
                <View style={{ flex: 0.2 }}>
                  <TouchableOpacity
                    onPress={this.onupdate.bind(this)}
                    style={{
                      paddingHorizontal: 40,
                      paddingVertical: 15,
                      backgroundColor: colors.Themecolor,
                    }}
                  >
                    <Text style={{ fontSize: 16, color: 'white' }}>
                      Update Now
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ImageBackground>
        </>
      </SafeAreaView>
    );
  }
}
export default VersionUpdate;
