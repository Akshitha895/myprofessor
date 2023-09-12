import React from 'react';
import { ImageBackground, Text, View } from 'react-native';
const AttemptAnalysis = (props) => {
  const { testResult } = props;
  return (
    <>
      {testResult && Object.keys(testResult).length ? (
        <>
          <View style={{ flex: 1, padding: 0 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                padding: 10,
              }}
            >
              <View>
                <ImageBackground
                  source={require('../../assets/images/correctimg.png')}
                  style={{
                    width: 88 / 1.5,
                    height: 100 / 1.5,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      color: 'white',
                      textAlign: 'center',
                      marginBottom: 10,
                      fontSize: 15,
                    }}
                  >
                    {testResult.correctAnsCount
                      ? testResult.correctAnsCount
                      : 0}
                  </Text>
                </ImageBackground>
              </View>
              <View>
                <ImageBackground
                  source={require('../../assets/images/wrongimg.png')}
                  style={{
                    width: 88 / 1.5,
                    height: 100 / 1.5,
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
                      fontSize: 15,
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
                  marginRight: 20,
                }}
              >
                <Text
                  style={{ marginTop: 10, textAlign: 'center', fontSize: 13 }}
                >
                  Lightning Fast:{' '}
                  {testResult.lighteningCount ? testResult.lighteningCount : 0}
                </Text>
                <Text
                  style={{ marginTop: 10, textAlign: 'center', fontSize: 13 }}
                >
                  What a Timing/Shot:{' '}
                  {testResult.shotCount ? testResult.shotCount : 0}
                </Text>
                <Text
                  style={{ marginTop: 10, textAlign: 'center', fontSize: 13 }}
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
                  marginLeft: -50,
                }}
              >
                <Text
                  style={{ marginTop: 10, textAlign: 'center', fontSize: 13 }}
                >
                  Lost: {testResult.lostCount ? testResult.lostCount : 0}
                </Text>
                <Text
                  style={{ marginTop: 10, textAlign: 'center', fontSize: 13 }}
                >
                  Extra Time:{' '}
                  {testResult.extraCount ? testResult.extraCount : 0}
                </Text>
                <Text
                  style={{ marginTop: 10, textAlign: 'center', fontSize: 13 }}
                >
                  Un Answered{' '}
                  {testResult.unAnsCount ? testResult.unAnsCount : 0}
                </Text>
              </View>
            </View>
            {/* <View style={{flexDirection:"row",justifyContent:"space-between",paddingHorizontal:50}}>
                  <Text>Lightning Fast: {testResult.lightening_count?testResult.lightening_count:0}</Text>
                  <Text>Lost: {testResult.lost_count?testResult.lost_count:0}</Text>
                </View>
                <View style={{flexDirection:"row",marginVertical:10}}>
                  <Text>What a Timing/Shot: {testResult.shot_count?testResult.shot_count:0}</Text>
                  <Text>Extra Time: {testResult.extra_time_count?testResult.extra_time_count:0}</Text>
                </View>
                <View style={{flexDirection:"row",}}>
                  <Text>Extra Innings: {testResult.extra_inning_count?testResult.extra_inning_count:0}</Text>
                  <Text style={{textAlign:"center"}}>Un Answered: {testResult.un_ans_count?testResult.un_ans_count:0}</Text>
                </View> */}
          </View>
        </>
      ) : null}
    </>
  );
};

export default AttemptAnalysis;
