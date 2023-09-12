import React from 'react';
import { Dimensions, Text, View } from 'react-native';
import DeviceConstants from 'react-native-device-constants';

const windowWidth = Dimensions.get('window').width;
export default function ProgressItem({ name, score, performedTests }) {
  // console.log("score...",score);
  let statusText =
    score >= 80
      ? '#016313'
      : score >= 60 && score < 80
      ? '#a3ba6d'
      : score >= 40 && score <= 60
      ? '#d88414'
      : '#c44921';
  // console.log("statusText...",statusText);
  const prgStatusStyle = {
    width: windowWidth / 2.3,
    height: 80,
    flexWrap: 'wrap',
    color: `${
      statusText === '#F94D48'
        ? '#fff'
        : statusText === '#D88212'
        ? '#000'
        : '#fff'
    }`,
    backgroundColor: performedTests > 0 ? statusText : 'grey',
    margin: 5,
  };
  const isTablet = DeviceConstants.isTablet;
  var itemheight = 80,
    itemwidth = windowWidth / 2.15,
    headfont = 15;
  if (isTablet) {
    (itemheight = 100), (itemwidth = windowWidth / 2.08), (headfont = 22);
  }

  return (
    <>
      <View
        style={{
          width: itemwidth,
          height: itemheight,
          color: `${
            statusText === '#F94D48'
              ? '#fff'
              : statusText === '#D88212'
              ? '#000'
              : '#fff'
          }`,
          backgroundColor: performedTests > 0 ? statusText : 'grey',
          alignItems: 'center',
          margin: 5,
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            color: prgStatusStyle.color,
            textAlign: 'center',
            fontSize: headfont,
          }}
        >
          {name}
        </Text>
      </View>
    </>
  );
}
