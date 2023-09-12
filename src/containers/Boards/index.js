import React, { Component } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { baseUrl } from '../../constants';
import styles from './styles';

class Boards extends Component {
  constructor(props) {
    super(props);
    this.onItem = this.onItem.bind(this);
    this.state = {
      boardsData: null,
      spinner: true,
    };
  }
  async componentDidMount() {
    this.getBoards();
  }
  getBoards() {
    fetch(baseUrl + `/universities?offset=${0}&limit=${1000}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.data) {
          var data = json.data;
          if (data.items) {
            this.setState({
              spinner: false,
              boardsData: data.items,
            });
          } else {
            this.setState({
              spinner: false,
              boardsData: [],
            });
          }
        } else {
          this.setState({
            spinner: false,
            boardsData: [],
          });
          alert(JSON.stringify(json));
        }
      })
      .catch((error) => console.error(error));
  }

  renderItem({ item }) {
    return (
      <TouchableOpacity
        onPress={() => this.onItem(item)}
        style={styles.listsubview}
      >
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <View
            style={{
              flex: 0.6,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {item.image ? (
              <Image
                source={{ uri: item.image }}
                resizeMode={'cover'}
                style={{ width: 80, height: 80 }}
              />
            ) : (
              <Image
                source={require('./../../assets/images/logo_icon1.png')}
                resizeMode={'cover'}
                style={{ width: 80, height: 80 }}
              />
            )}
          </View>
          <View
            style={{
              flex: 0.4,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={styles.boardtext}>{item.name}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  onItem(item) {
    Actions.push('branches', { data: item });
  }

  render() {
    return (
      <>
        <SafeAreaView style={{ flex: 1 }}>
          <ImageBackground
            style={styles.backimg}
            source={require('../../assets/images/backblue.png')}
          >
            <View style={styles.mainView}>
              <View style={styles.logoview}>
                <Image
                  source={require('../../assets/images/logo_icon1.png')}
                  style={{ width: 72, height: 72 }}
                />
              </View>
              <View style={styles.subview}>
                {this.state.spinner ? (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <ActivityIndicator color={'black'} />
                  </View>
                ) : this.state.boardsData &&
                  this.state.boardsData.length > 0 ? (
                  <FlatList
                    data={this.state.boardsData}
                    renderItem={this.renderItem.bind(this)}
                    numColumns={2}
                  />
                ) : (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text>No Data</Text>
                  </View>
                )}
              </View>
            </View>
          </ImageBackground>
        </SafeAreaView>
      </>
    );
  }
}
export default Boards;
