import React, { Component } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Progress from 'react-native-progress';
import styles from './styles';
const windowWidth = Dimensions.get('window').width;

const data = [
  {
    name: 'Rational Numbers',
    image: require('../../assets/images/algebra.png'),
    insideimg: require('../../assets/images/math.png'),
    progress: 0.5,
    test: 6,
    read: 40,
  },
  {
    name: 'Volume of Cuboid',
    image: require('../../assets/images/algebra.png'),
    insideimg: require('../../assets/images/math.png'),
    progress: 0.3,
    test: 6,
    read: 40,
  },
  {
    name: 'Volume of Cylinder',
    image: require('../../assets/images/algebra.png'),
    insideimg: require('../../assets/images/math.png'),
    progress: 0.9,
    test: 6,
    read: 40,
  },
  // }, {
  // 	name: "Irrational Numbers",
  // 	image: require('../../assets/images/yellowround.png'),
  // 	insideimg: require('../../assets/images/math.png'),
  // 	progress: 0.7, test: 6, read: 40
  // }
];
class RecommendedTopics extends Component {
  constructor(props) {
    super(props);
  }
  renderItem({ item }) {
    var percent = item.progress * 100;
    let color;
    if (percent > 80) {
      color = 'green';
    } else if (percent < 50) {
      color = 'red';
    } else {
      color = 'orange';
    }
    return (
      <View style={{ marginTop: 30, marginBottom: 50 }}>
        <TouchableOpacity style={styles.rectview}>
          <View style={styles.subview}>
            <View style={styles.topsubview} />
            <View style={styles.bottomsubview}>
              <Text style={styles.subjectname}>{item.name}</Text>
              <View style={styles.progressview}>
                <View style={styles.progresstextview}>
                  <Text style={styles.progresstext}>Progress</Text>
                  <Text style={styles.progresstext}>{percent}%</Text>
                </View>
                <View style={{ marginTop: 5 }}>
                  <Progress.Bar
                    progress={item.progress}
                    width={windowWidth / 2.7}
                    height={10}
                    color={'lightgreen'}
                  />
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.relativeview}>
          <ImageBackground
            source={item.image}
            style={{
              width: 944 / 12,
              height: 912 / 12,
              position: 'absolute',
              justifyContent: 'center',
              alignSelf: 'center',
              top: -180,
              // left: -140,
              elevation: 12,
            }}
          >
            <Image
              source={item.insideimg}
              style={{
                width: 944 / 13,
                height: 912 / 13,
                alignSelf: 'center',
                position: 'absolute',
                justifyContent: 'center',
                alignSelf: 'center',
                top: -210,
                // left: -140,
                elevation: 12,
              }}
            />
          </ImageBackground>
        </View>
      </View>
    );
  }
  render() {
    return (
      <View style={styles.mainview}>
        <Text style={styles.headertext}>Recommended Topics</Text>
        <FlatList
          data={data}
          renderItem={this.renderItem.bind(this)}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  }
}
export default RecommendedTopics;
