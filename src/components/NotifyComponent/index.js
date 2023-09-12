import React, { Component } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import DeviceConstants from 'react-native-device-constants';
import { FlatList } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../constants';
import styles from './styles';

class NotifyComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
    };
  }
  componentDidMount() {
    // alert(JSON.stringify(this.state.data))
  }
  onView(item) {
    this.props.onItemPress(item);
  }
  Item({ item }) {
    const isTablet = DeviceConstants.isTablet;
    var headfont = 16,
      subtext = 13,
      iconheight = 6,
      notifywidth = 23 / 1.2,
      notifuheight = 24 / 1.2,
      notbell = 21 / 1.2;
    if (isTablet) {
      (headfont = 20),
        (subtext = 16),
        (iconheight = 10),
        (notifywidth = 33 / 1.2),
        (notifuheight = 34 / 1.2),
        (notbell = 31 / 1.2);
    }
    return (
      <TouchableOpacity
        onPress={this.onView.bind(this, item)}
        style={{
          width: '100%',
          paddingVertical: 20,
          backgroundColor:
            item.isRead === 0 ? 'rgba(105, 80, 119, 0.2)' : 'white',
        }}
      >
        <View style={styles.itemsubview}>
          <View style={styles.itemleftview}>
            {item.isRead === 0 ? (
              <Image
                source={require('../../assets/images/refer/notifyorange.png')}
                style={{
                  width: notifywidth,
                  height: notifuheight,
                  tintColor: colors.Themecolor,
                }}
              />
            ) : (
              <Image
                source={require('../../assets/images/refer/bellicon.png')}
                style={{
                  width: notbell,
                  height: notifuheight,
                  tintColor: colors.Themecolor,
                }}
              />
            )}
          </View>
          <View style={styles.itemmiddleview}>
            <Text
              style={{
                fontSize: headfont,
                //   lineHeight: 16,

                color: colors.Themecolor,
              }}
            >
              {item.title}
            </Text>
            <Text
              style={{
                fontSize: subtext,
                marginTop: 5,
                color: colors.Themecolor,
              }}
            >
              {item.body}
            </Text>
            {/* <Text style={styles.timetext}>{item.data}</Text> */}
          </View>
          <View style={styles.itemrightview}>
            {item.isRead === 0 ? (
              <Image
                source={require('../../assets/images/refer/orangecl.png')}
                style={{
                  width: iconheight,
                  height: iconheight,
                  tintColor: colors.Themecolor,
                }}
              />
            ) : (
              <Image
                source={require('../../assets/images/refer/Vector.png')}
                style={{
                  width: iconheight + 2,
                  height: iconheight + 8,
                  tintColor: colors.Themecolor,
                }}
              />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  seperator() {
    return <View style={styles.seperator} />;
  }
  render() {
    return (
      <View style={styles.mainview}>
        <LinearGradient
          colors={[' rgba(105, 80, 119, 0.08)', 'rgba(132, 115, 147, 0.064)']}
          style={styles.gradientView}
        >
          <View style={styles.listview}>
            <FlatList
              data={this.props.data}
              keyExtractor={(item, index) => item + index}
              renderItem={this.Item.bind(this)}
            />
          </View>
        </LinearGradient>
      </View>
    );
  }
}
export default NotifyComponent;
