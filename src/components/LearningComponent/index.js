import React, { Component } from 'react';
import { FlatList, Image, Text, View } from 'react-native';
import { Actions } from 'react-native-router-flux';

import DeviceConstants from 'react-native-device-constants';

import { TouchableOpacity } from 'react-native-gesture-handler';
import StringsOfLanguages from '../../StringsOfLanguages';
import { colors } from '../../constants';

var headfont = 16,
  headsubtext = 14;
const data = [
  {
    name: StringsOfLanguages.mypractice,
    key: 'mypractice',
    image: require('../../assets/images/newpractice1.png'),

    color1: '#924ad4', //"#F6815B",
  },
  {
    name: StringsOfLanguages.learninganalysis,
    key: 'learninganalysis',
    image: require('../../assets/images/newanalysis1.png'),

    color1: '#c54721',
  },
  {
    name: StringsOfLanguages.previousquestionpapers,
    key: 'previouspapers',
    image: require('../../assets/images/previoustest.png'),

    color1: '#ed3c7b', //"#0D7B5A",
  },
  {
    name: StringsOfLanguages.leaderboard,
    key: 'leaderboard',
    image: require('../../assets/images/trophy.png'),

    color1: '#924ad4', //"#0D7B5A",
  },
  {
    name: StringsOfLanguages.knowledgemap,
    key: 'knowledgemap',
    image: require('../../assets/images/sidemenu/heatmap.png'),

    color1: '#c54721', //"#0D7B5A",
  },
  // {
  // 	name: StringsOfLanguages.mocktest,
  // 	key: "mocktest",
  // 	image: require("../../assets/images/dashboard/new/mock_new.png"),
  // 	width: 52,
  // 	color1: "#ed3c7b",
  // },
];
class LearningComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      langaugae: '',
      spinner: false,
      newdata: data,
    };
  }
  componentDidMount() {}
  onItem(item) {
    if (item.key === 'previouspapers') {
      Actions.push('previouspapers');
    } else if (item.key === 'mocktest') {
      Actions.push('mocktest');
    } else if (item.key === 'mypractice') {
      Actions.push('practice');
    } else if (item.key === 'learninganalysis') {
      Actions.push('analysis');
    } else if (item.key === 'leaderboard') {
      Actions.push('leaderboard');
    } else {
      Actions.push('heatmap');
    }
  }
  renderItem({ item, index }) {
    const isTablet = DeviceConstants.isTablet; // false
    var height = 100,
      textsize = 14,
      innersize = 30;
    boxwidth = 200;
    if (isTablet) {
      height = 160;
      textsize = 20;
      innersize = 40;
      boxwidth = 320;
    }
    return (
      <TouchableOpacity
        onPress={this.onItem.bind(this, item)}
        style={{
          width: boxwidth,
          height,
          backgroundColor: item.color1,
          marginBottom: 20,
          justifyContent: 'space-around',
          marginHorizontal: 10,
        }}
      >
        <Image
          source={item.image}
          style={{
            width: innersize,
            height: innersize,
            tintColor: 'white',
            marginLeft: 10,
          }}
        />
        <Text style={{ color: 'white', fontSize: textsize, marginLeft: 10 }}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  }

  render() {
    const isTablet = DeviceConstants.isTablet; // false
    //var height = 100, innerwidth = 32 , innerheight = 31, innersize = 10;
    if (isTablet) {
      headfont = 25;
      headsubtext = 20;
    }
    return this.state.spinner ? (
      <Text>Loading....</Text>
    ) : (
      <View>
        <Text
          style={{
            color: colors.Themecolor,
            marginLeft: 20,
            marginBottom: 15,
            fontSize: headfont,
            fontWeight: '600',
          }}
        >
          {StringsOfLanguages.mylearning}
        </Text>

        <View
          style={{
            flex: 1,
            marginHorizontal: 10,
            justifyContent: 'center',
            marginTop: 10,
            alignnIt: 'center',
          }}
        >
          <FlatList
            //columnWrapperStyle={{justifyContent: 'space-between',marginHorizontal:10}}
            data={data}
            renderItem={this.renderItem.bind(this)}
            horizontal
          />
        </View>
      </View>
    );
  }
}

export default LearningComponent;
