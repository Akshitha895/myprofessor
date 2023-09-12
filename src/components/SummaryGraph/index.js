import React, { Component } from 'react';
import { Dimensions, Text, View } from 'react-native';
///import styles from "./styles"
import LinearGradient from 'react-native-linear-gradient';
const windowWidth = Dimensions.get('window').width;

// const data = [
//   {
//     questionno: '1',
//     question: 'dkfjkdfk;',
//     correctans: 'B',
//     answers: [],
//     percent: 40,
//     result: 'correct',
//   },
//   {
//     questionno: '2',
//     question: 'dkfjkdfk;',
//     correctans: 'B',
//     percent: 30,
//     answers: [],
//     result: 'wrong',
//   },

//   {
//     questionno: '3',
//     question: 'dkfjkdfk;',
//     correctans: 'B',
//     answers: [],
//     percent: 80,
//     result: 'correct',
//   },
//   {
//     questionno: '4',
//     question: 'dkfjkdfk;',
//     correctans: 'B',
//     percent: 100,
//     answers: [],
//     result: 'wrong',
//   },

//   {
//     questionno: '5',
//     question: 'dkfjkdfk;',
//     correctans: 'B',
//     percent: 40,
//     answers: [],
//     result: 'correct',
//   },
// ];
class SummaryGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questionsarray: null,
    };
  }
  componentDidMount() {
    if (this.props.questionsarray) {
      this.setState({
        questionsarray: this.props.questionsarray,
      });
    }
  }
  render() {
    return this.state.questionsarray ? (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View
          style={{ padding: 5, flexDirection: 'row', justifyContent: 'center' }}
        >
          <View
            style={{
              height: 320,
              width: 20,
              marginRight: 5,
              justifyContent: 'space-around',
            }}
          >
            <View style={{ width: 40, height: 20, justifyContent: 'center' }}>
              <Text>30</Text>
            </View>
            <View style={{ width: 40, height: 20, justifyContent: 'center' }}>
              <Text>40</Text>
            </View>
            <View style={{ width: 40, height: 20, justifyContent: 'center' }}>
              <Text>30</Text>
            </View>
            <View style={{ width: 40, height: 20, justifyContent: 'center' }}>
              <Text>25</Text>
            </View>
            <View style={{ width: 40, height: 20, justifyContent: 'center' }}>
              <Text>20</Text>
            </View>
            <View style={{ width: 40, height: 20, justifyContent: 'center' }}>
              <Text>10</Text>
            </View>
            <View style={{ width: 40, height: 20, justifyContent: 'center' }}>
              <Text>0</Text>
            </View>
          </View>
          <View
            style={{
              width: windowWidth / 1.4,
              height: 320,
              borderWidth: 1,
              borderColor: 'black',
              borderRadius: 10,
              backgroundColor: 'white',
              justifyContent: 'space-around',
              flexDirection: 'row',
              alignItems: 'flex-end',
            }}
          >
            {this.state.questionsarray.map((res, i) =>
              res.analysis !== 'poor' ? (
                <LinearGradient
                  colors={['#239816', '#32e625']}
                  style={{
                    width: 20,
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                    height: res.test_taken_time * 20,
                  }}
                />
              ) : (
                <LinearGradient
                  colors={['#f14d65', '#fc8798']}
                  style={{
                    width: 20,
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                    height: res.test_taken_time * 20,
                  }}
                />
              )
            )}
          </View>
        </View>
        <View
          style={{
            width: windowWidth / 1.5,
            height: 20,
            marginLeft: 30,
            justifyContent: 'space-around',
            flexDirection: 'row',
          }}
        >
          {this.state.questionsarray.map((res, i) => (
            <View
              key={i}
              style={{ width: 20, height: 20, justifyContent: 'center' }}
            >
              <Text style={{ textAlign: 'center' }}>{i + 1}</Text>
            </View>
          ))}
        </View>
      </View>
    ) : null;
  }
}
export default SummaryGraph;
