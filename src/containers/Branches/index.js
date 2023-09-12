import AsyncStorage from '@react-native-async-storage/async-storage';
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

class Branches extends Component {
  constructor(props) {
    super(props);
    this.onItem = this.onItem.bind(this);
    this.state = {
      branchesdata: null,
      spinner: true,
    };
  }
  async componentDidMount() {
    const value = await AsyncStorage.getItem('@access_token');
    if (value !== null) {
      console.log('val', value);
      this.getBoards(JSON.parse(value));
    }
    this.getBoards(JSON.parse(value));
  }
  getBoards(value) {
    fetch(
      baseUrl +
        `/universities/${
          this.props.data.id
        }/branches?offset=${0}&limit=${10000}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 'token': value
        },
      }
    )
      .then((response) => response.json())
      .then((json) => {
        const data = json.data;
        console.log('branchessss', json);
        if (data) {
          if (data.items) {
            console.log('boards', json);
            this.setState({
              spinner: false,
              branchesdata: data.items,
            });
          } else {
            this.setState({
              spinner: false,
              branchesdata: [],
            });
          }
        } else {
          this.setState({
            spinner: false,
            branchesdata: [],
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
        <Image
          source={{ uri: item.image }}
          resizeMode={'cover'}
          style={styles.boardimg}
        />
        <Text style={styles.boardtext}>{item.name}</Text>
      </TouchableOpacity>
    );
  }
  onItem(item) {
    Actions.push('grades', { branchdata: item, boarddata: this.props.data });
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
                  style={{ width: 80, height: 80 }}
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
                ) : this.state.branchesdata &&
                  this.state.branchesdata.length > 0 ? (
                  <FlatList
                    data={this.state.branchesdata}
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
export default Branches;
