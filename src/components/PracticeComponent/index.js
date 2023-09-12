import React, { Component } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import DeviceConstants from 'react-native-device-constants';
import { Actions } from 'react-native-router-flux';
import { imageUrl } from '../../constants';
import styles from './styles';

class PracticeComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subjectsData: this.props.subjectsData,
      spineer: true,
    };
  }
  onItem(item) {
    Actions.push('practicechapter', { data: item });
  }
  onBack() {
    this.props.onBack();
  }
  componentDidMount() {
    if (this.props.subjectsData) {
      console.log(JSON.stringify(this.props.subjectsData));
      this.setState({
        subjectsData: this.props.subjectsData,
        spineer: false,
      });
    }
  }
  renderItem({ item }) {
    const isTablet = DeviceConstants.isTablet;

    var colorsarray = [
      '#FF603D',
      '#0A7FD7',
      '#9863DF',
      '#5D9702',
      '#0D7B5A',
      '#D09A12',
    ];
    var randomItem =
      colorsarray[Math.floor(Math.random() * colorsarray.length)];
    var bgcolor;

    var percent = item.percent;

    console.log('item,item', item);
    const url = imageUrl + item.image;
    var progress = 0 + 0.4 * Math.random();
    // var percent = (item.percent) * 100;
    var color;
    if (percent > 80) {
      color = 'green';
    } else if (color < 50) {
      color = 'red';
    } else {
      color = 'orange';
    }
    if (item.color) {
      bgcolor = item.color;
    } else {
      item['color'] = randomItem;
      bgcolor = randomItem;
    }
    var imagehei = 128 / 2.5,
      headfont = 13,
      subfont = 8,
      viewheight = 1340 / 10;
    if (isTablet) {
      (imagehei = 178 / 2.5),
        (headfont = 25),
        (subfont = 15),
        (viewheight = 1740 / 10);
    }
    return (
      <TouchableHighlight
        onPress={() => this.onItem(item)}
        underlayColor="transparent"
        activeOpacity={0.9}
        style={{
          backgroundColor: 'transparent',
          borderWidth: 0.1,
          borderColor: 'transparent',
          margin: 5,
          flex: 1,
        }}
      >
        <ImageBackground
          source={require('../../assets/images/dashboard/pattern.png')}
          style={[
            styles.rectview,
            { backgroundColor: bgcolor, height: viewheight },
          ]}
          opacity={0.5}
        >
          <View style={styles.subview}>
            <View style={styles.topsubview}>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={{ flex: 0.4 }}>
                  {item.image ? (
                    <Image
                      source={{ uri: item.image }}
                      style={{
                        alignSelf: 'center',
                        width: imagehei,
                        height: imagehei,
                        marginTop: 8,
                        marginRight: 5,
                      }}
                    />
                  ) : (
                    <Image
                      source={require('../../assets/images/noimage.png')}
                      style={{
                        width: imagehei,
                        height: imagehei,
                        resizeMode: 'contain',
                      }}
                    />
                  )}
                </View>
                <View
                  style={{
                    flex: 0.6,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text style={[styles.subjectname, { fontSize: headfont }]}>
                    {item.name}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.bottomsubview}>
              <View style={styles.countview}>
                <View
                  style={{
                    paddingVertical: 10,
                    width: '100%',
                    borderRadius: 3,
                    justifyContent: 'center',
                  }}
                >
                  <View
                    style={{ alignItems: 'center', justifyContent: 'center' }}
                  >
                    <View style={styles.innercountview}>
                      <Image
                        source={require('../../assets/images/1.png')}
                        style={styles.iconview}
                      />
                      <Text style={[styles.icontext, { fontSize: subfont }]}>
                        {item.noOfChapters}
                      </Text>
                    </View>
                    <Text style={{ color: 'white', fontSize: subfont }}>
                      Chapters
                    </Text>
                  </View>
                  {/* <View style={styles.innercountview}>
									 <Image source={require('../../assets/images/magnifier.png')} style={styles.iconview} />
								 </View> */}
                  {/* <View style={{alignItems:"center",justifyContent:"center"}}>
								  <View style={styles.innercountview}>
									  <Image source={require('../../assets/images/2.png')} style={styles.iconview} />
									  <Text style={styles.icontext}>{item.topicsCount}</Text>
								  </View>
								  <Text style={{color:"white",fontSize:8}}>Topic</Text>
								  </View> */}
                </View>
              </View>
            </View>
          </View>
        </ImageBackground>
      </TouchableHighlight>
    );
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        {/* <View style={{ flex: 0.1, justifyContent: "center" }}>
                    <TouchableOpacity onPress={this.onBack.bind(this)}>
                        <Image source={require("../../assets/images/left-arrow.png")}
                            style={styles.backimage} />
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 0.2, justifyContent: "flex-start", alignItems: "center", }}>
                    <ImageBackground source={require('../../assets/images/Asset_2.png')}
                        style={{ width: 123 / 1.5, height: 127 / 1.5, justifyContent: "center", alignItems: "center", alignSelf: "center" }}>
                        <Image source={require('../../assets/images/math.png')} style={{ alignSelf: "center", width: 128 / 2.5, height: 128 / 2.5, borderRadius: 32, marginTop: 8, marginRight: 5 }} />
                    </ImageBackground>

                    <Text style={styles.textmain}>{"Practice"}</Text>

                </View> */}
        <View style={{ flex: 1 }}>
          {this.state.spineer ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <ActivityIndicator color={'black'} />
            </View>
          ) : (
            <View style={{ marginTop: 20 }}>
              <FlatList
                data={this.state.subjectsData}
                renderItem={this.renderItem.bind(this)}
                numColumns={2}
                // showVerticalScrollIndicator={false}
              />
            </View>
          )}
        </View>
      </View>
    );
  }
}
export default PracticeComponent;
