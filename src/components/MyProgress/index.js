import React from 'react';
import { Dimensions, Image, Text, View } from 'react-native';
import * as Progress from 'react-native-progress';
import styles from './styles';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const activityData = [
  {
    value: 0.8,
    title: 'Mathematics',
    color: '#695276',
    image: require('../../assets/images/dashboard/Math_Icon.png'),
  },
  {
    label: 'ACTIVITY',
    value: 0.7,
    color: '#B74D2D',
    title: 'Physics',
    backgroundColor: 'lightgrey',
    image: require('../../assets/images/dashboard/phyprogress.png'),
  },
  {
    label: 'RINGS',
    value: 0.6,
    title: 'Chemistry',
    color: '#267093', //"#4286a0",
    backgroundColor: 'lightgrey',
    image: require('../../assets/images/dashboard/chemprogress.png'),
  },
  {
    value: 0.5,
    title: 'Biology',
    color: '#98A86C', //"#dc9332",
    backgroundColor: 'lightgrey', // ring will use color from theme
    image: require('../../assets/images/dashboard/bioprogress.png'),
  },
];
const activityConfig = {
  width: windowWidth / 1,
  height: windowHeight / 3,
  radius: 32,
  ringSize: 10,
};
const MyProgress = () => {
  return (
    <View style={styles.mainview}>
      <Text style={styles.headtext}>My Progress</Text>
      <View
        style={{
          borderWidth: 0,
          borderColor: 'lightgrey',
          padding: 10,
          backgroundColor: 'white',
          shadowColor: 'black',
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 1,
          shadowRadius: 5,
          elevation: 10,
          borderRadius: 10,
        }}
      >
        {activityData.map((res, i) => (
          <View
            key={i}
            style={{
              paddingVertical: 10,
              flexDirection: 'row',
              flex: 1,
              alignItems: 'center',
            }}
          >
            <View
              style={{
                width: 50,
                height: 50,
                borderWidth: 5,
                borderColor: res.color,
                borderRadius: 25,
                justifyContent: 'center',
              }}
            >
              <Image
                source={res.image}
                style={{ width: '100%', height: '90%' }}
              />
            </View>
            <View
              style={{
                height: 25,
                width: windowWidth / 1.5,
                borderRadius: 3,
                overflow: 'hidden',
              }}
            >
              <Progress.Bar
                progress={res.value}
                width={windowWidth / 1.5}
                height={20}
                color={res.color}
              />
              <Text
                style={{
                  position: 'absolute',
                  alignSelf: 'flex-end',
                  right: 5,
                }}
              >
                {res.value * 100}%
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};
export default MyProgress;
