import React, { Component } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  Text,
  View,
} from 'react-native';
const windowWidth = Dimensions.get('window').width;

import { imageUrl } from '../../constants';

// const data = [
//   {
//     name: 'Name',
//     score: 'Score',
//     id: 1,
//   },
//   {
//     name: 'Name',
//     score: 'Score',
//     id: 2,
//   },
//   {
//     name: 'Name',
//     score: 'Score',
//     id: 3,
//   },
//   {
//     name: 'Name',
//     score: 'Score',
//     id: 4,
//   },
//   {
//     name: 'Name',
//     score: 'Score',
//     id: 5,
//   },
// ];
class LeaderComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
    };
  }
  componentDidMount() {
    console.log('this.props.leaderdata', this.props.leaderdata);
  }
  handleIndexChange = (index) => {
    this.setState({
      ...this.state,
      selectedIndex: index,
    });
  };
  renderToday({ item, index }) {
    return (
      <View
        style={{
          height: 70,
          backgroundColor: '#ECECEC',
          width: windowWidth / 1.05,
          marginVertical: 10,
          alignSelf: 'center',
        }}
      >
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View
            style={{
              flex: 0.15,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                width: 25,
                height: 25,
                backgroundColor: 'green',
                borderRadius: 25 / 2,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: 'white' }}>{index + 1}</Text>
            </View>
          </View>
          <View
            style={{ flex: 0.65, flexDirection: 'row', alignItems: 'center' }}
          >
            {item.profile_pic ? (
              <Image
                source={{ uri: imageUrl + item.profile_pic }}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  alignSelf: 'center',
                }}
              />
            ) : (
              <Image
                source={require('../../assets/images/avatar-9.jpg')}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  alignSelf: 'center',
                }}
              />
            )}
            <Text style={{ marginLeft: 10 }}>{item.name}</Text>
          </View>
          <View
            style={{
              flex: 0.2,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text>{item.points}</Text>
          </View>
        </View>
      </View>
    );
  }

  render() {
    return (
      <View style={{ height: Platform.OS === 'android' ? '80%' : '70%' }}>
        <FlatList
          data={this.props.leaderdata}
          renderItem={this.renderToday.bind(this)}
        />
      </View>
    );
  }
}
export default LeaderComponent;
