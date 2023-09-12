import React from 'react';
import { ImageBackground, Text, View } from 'react-native';
import DeviceConstants from 'react-native-device-constants';

const AttemptAnalysis = (props) => {
  const isTablet = DeviceConstants.isTablet;
  var cirwidth = 88 / 1.5,
    cirheight = 100 / 1.5,
    headfont = 15,
    marginright = 20,
    marginleft = -40;
  if (isTablet) {
    (cirwidth = 88 / 1),
      (cirheight = 100 / 1),
      (headfont = 22),
      (marginright = 1),
      (marginleft = -10);
  }
  const { testResult } = props;
  return (
    <>
      {testResult && Object.keys(testResult).length ? (
        <>
          <View style={{ flex: 1, marginTop: 20 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                padding: 10,
              }}
            >
              <View
                style={{
                  flex: 0.5,
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
                }}
              >
                <ImageBackground
                  source={require('../../assets/images/correctimg.png')}
                  style={{
                    width: cirwidth,
                    height: cirheight,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      color: 'white',
                      textAlign: 'center',
                      marginBottom: 10,
                      fontSize: headfont,
                    }}
                  >
                    {testResult.correctAnsCount
                      ? testResult.correctAnsCount
                      : 0}
                  </Text>
                </ImageBackground>
              </View>
              <View
                style={{
                  flex: 0.5,
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
                }}
              >
                <ImageBackground
                  source={require('../../assets/images/wrongimg.png')}
                  style={{
                    width: cirwidth,
                    height: cirheight,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: 40,
                  }}
                >
                  <Text
                    style={{
                      color: 'white',
                      textAlign: 'center',
                      marginBottom: 10,
                      fontSize: headfont,
                    }}
                  >
                    {testResult.wrongAnsCount ? testResult.wrongAnsCount : 0}
                  </Text>
                </ImageBackground>
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View
                style={{
                  flex: 0.5,
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    marginTop: 10,
                    textAlign: 'center',
                    fontSize: headfont,
                  }}
                >
                  Lightning Fast:{' '}
                  {testResult.lighteningCount ? testResult.lighteningCount : 0}
                </Text>
                <Text
                  style={{
                    marginTop: 10,
                    textAlign: 'center',
                    fontSize: headfont,
                  }}
                >
                  What a Timing/Shot:{' '}
                  {testResult.shotCount ? testResult.shotCount : 0}
                </Text>
                <Text
                  style={{
                    marginTop: 10,
                    textAlign: 'center',
                    fontSize: headfont,
                  }}
                >
                  Extra Inning:{' '}
                  {testResult.extraInningCount
                    ? testResult.extraInningCount
                    : 0}
                </Text>
              </View>
              <View
                style={{
                  flex: 0.5,
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    marginTop: 10,
                    textAlign: 'center',
                    fontSize: headfont,
                  }}
                >
                  Lost: {testResult.lostCount ? testResult.lostCount : 0}
                </Text>
                <Text
                  style={{
                    marginTop: 10,
                    textAlign: 'center',
                    fontSize: headfont,
                  }}
                >
                  Extra Time:{' '}
                  {testResult.extraCount ? testResult.extraCount : 0}
                </Text>
                <Text
                  style={{
                    marginTop: 10,
                    textAlign: 'center',
                    fontSize: headfont,
                  }}
                >
                  Un Answered{' '}
                  {testResult.unAnsCount ? testResult.unAnsCount : 0}
                </Text>
              </View>
            </View>
          </View>
        </>
      ) : null}
    </>
  );
};

export default AttemptAnalysis;
