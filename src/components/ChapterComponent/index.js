import React, { Component } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DeviceConstants from 'react-native-device-constants';

import * as Progress from 'react-native-progress';
import { Actions } from 'react-native-router-flux';
const windowWidth = Dimensions.get('window').width;

var imagesarray = [
  require('../../assets/images/dashboard/new/mathbg.png'),
  require('../../assets/images/dashboard/new/physicsbg.png'),
  require('../../assets/images/dashboard/new/chemistrybg.png'),
  require('../../assets/images/dashboard/new/biologybg.png'),
];
// const data = [
//   {
//     name: 'Number Systems',
//     reads: 30,
//     progress: 0.5,
//     image: require('../../assets/images/yellowround.png'),
//     insideimg: require('../../assets/images/math.png'),
//     bg: require('../../assets/images/dashboard/math_bg.png'),
//   },
//   {
//     name: 'Algebra',
//     reads: 30,
//     progress: 0.1,
//     image: require('../../assets/images/yellowround.png'),
//     insideimg: require('../../assets/images/math.png'),
//     bg: require('../../assets/images/dashboard/physics_bg.png'),
//   },
//   {
//     name: 'Number Systems',
//     reads: 30,
//     progress: 0.6,
//     image: require('../../assets/images/yellowround.png'),
//     insideimg: require('../../assets/images/math.png'),
//     bg: require('../../assets/images/dashboard/chemistry_bg.png'),
//   },
//   {
//     name: 'Algebra',
//     reads: 30,
//     progress: 0.2,
//     image: require('../../assets/images/yellowround.png'),
//     insideimg: require('../../assets/images/math.png'),
//     bg: require('../../assets/images/dashboard/math_bg.png'),
//   },
//   {
//     name: 'Number Systems',
//     reads: 30,
//     progress: 0.5,
//     image: require('../../assets/images/yellowround.png'),
//     insideimg: require('../../assets/images/math.png'),
//     bg: require('../../assets/images/dashboard/Biology.png'),
//   },
// ];
class ChapterComponent extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    console.log('kdidmountgjkfg', this.props.validpackages);
  }
  onItem(item) {
    this.props.onFront();
    Actions.push('topics', {
      data: item,
      subjectData: this.props.userData,
      screen: 'chapters',
    });
  }
  onBack() {
    this.props.onBack();
  }
  renderItem({ item, index }) {
    //console.log("dassadass",  this.props.userData,this.props.userData.color)
    // CBSE_GR_10_BIO
    // CBSE_GR_10_BIO
    var colorsarray = imagesarray; // ["#FFB13D","#5AC3FB","#E488FB","#88C400"];
    var randomItem =
      colorsarray[Math.floor(Math.random() * colorsarray.length)];
    var bgimage = randomItem;
    // var bgimage = colorsarray[Math.floor(Math.random()*colorsarray.length)];
    // var newitem = colorsarray.splice(bgimage,1);
    // colorsarray.push(newitem);
    var percent = parseInt(item.progress);
    console.log('Ff', percent);
    var color;
    if (percent > 80) {
      color = 'green';
    } else if (percent < 50) {
      color = 'red';
    } else {
      color = 'orange';
    }
    item['color'] = this.props.userData.color;
    const isTablet = DeviceConstants.isTablet; // false
    var itemheight = 80,
      headfont = 15,
      lockwidth = 30,
      lockheight = 30;
    if (isTablet) {
      (itemheight = 140), (headfont = 22), (lockwidth = 50), (lockheight = 50);
    }
    return index === 0 ? (
      <TouchableOpacity
        onPress={this.onItem.bind(this, item)}
        style={{
          borderWidth: 0,
          borderColor: 'lightgrey',
          height: itemheight,
          width: windowWidth / 1.15,
          alignSelf: 'center',
          backgroundColor: 'white',
          borderWidth: 1,
          borderRadius: 5,
          borderColor: '#ddd',
          borderBottomWidth: 0,
          shadowColor: '#000000',
          marginVertical: 10,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.9,
          shadowRadius: 3,
          elevation: 3,
        }}
      >
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View
            style={{
              flex: 0.25,
              backgroundColor: this.props.userData.color,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {item.image === 'null' || item.image === '' ? (
              <Image
                source={require('../../assets/images/noimage.png')}
                style={{ width: '100%', height: '100%', alignSelf: 'center' }}
              />
            ) : (
              <Image
                source={{ uri: item.image }}
                style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
              />
            )}
          </View>
          <View
            style={{ flex: 0.75, justifyContent: 'center', paddingLeft: 20 }}
          >
            {/* <Text style={{color:"#2E2E2E",fontSize:10}}>CHAPTER {index+1}</Text> */}
            <Text
              style={{
                color: '#2E2E2E',
                fontWeight: '600',
                fontSize: headfont,
              }}
            >
              {item.chapterName}
            </Text>
          </View>
        </View>
        {item.progress && (
          <Progress.Bar
            progress={parseInt(item.progress) / 100}
            width={windowWidth / 1.15}
            height={5}
            color={color}
            unfilledColor={'lightgrey'}
            borderColor={'transparent'}
          />
        )}
      </TouchableOpacity>
    ) : this.props.validpackages &&
      this.props.validpackages.subscriptionStatus === 'active' ? (
      <TouchableOpacity
        onPress={this.onItem.bind(this, item)}
        style={{
          borderWidth: 0,
          borderColor: 'lightgrey',
          height: itemheight,
          width: windowWidth / 1.15,
          alignSelf: 'center',
          backgroundColor: 'white',
          borderWidth: 1,
          borderRadius: 5,
          borderColor: '#ddd',
          borderBottomWidth: 0,
          shadowColor: '#000000',
          marginVertical: 10,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.9,
          shadowRadius: 3,
          elevation: 3,
        }}
      >
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View
            style={{
              flex: 0.25,
              backgroundColor: this.props.userData.color,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {item.image === 'null' || item.image === '' ? (
              <Image
                source={require('../../assets/images/noimage.png')}
                style={{
                  width: 60,
                  height: 60,
                  resizeMode: 'cover',
                  alignSelf: 'center',
                }}
              />
            ) : (
              <Image
                source={{ uri: item.image }}
                style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
              />
            )}
          </View>
          <View
            style={{ flex: 0.75, justifyContent: 'center', paddingLeft: 20 }}
          >
            {/* <Text style={{color:"#2E2E2E",fontSize:10}}>CHAPTER {index+1}</Text> */}
            <Text
              style={{
                color: '#2E2E2E',
                fontWeight: '600',
                fontSize: headfont,
              }}
            >
              {item.chapterName}
            </Text>
          </View>
        </View>
        {item.progress && (
          <Progress.Bar
            progress={parseInt(item.progress) / 100}
            width={windowWidth / 1.15}
            height={5}
            color={color}
            unfilledColor={'lightgrey'}
            borderColor={'transparent'}
          />
        )}
      </TouchableOpacity>
    ) : (
      <>
        <View
          style={{
            borderWidth: 0,
            borderColor: 'lightgrey',
            height: itemheight,
            width: windowWidth / 1.15,
            alignSelf: 'center',
            backgroundColor: 'white',
            borderWidth: 1,
            borderRadius: 5,
            borderColor: '#ddd',
            borderBottomWidth: 0,
            shadowColor: '#000000',
            marginVertical: 10,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.9,
            shadowRadius: 3,
            elevation: 3,
          }}
        >
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View
              style={{
                flex: 0.25,
                backgroundColor: this.props.userData.color,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {item.image === 'null' || item.image === '' ? (
                <Image
                  source={require('../../assets/images/noimage.png')}
                  style={{
                    width: 60,
                    height: 60,
                    resizeMode: 'cover',
                    alignSelf: 'center',
                  }}
                />
              ) : (
                <Image
                  source={{ uri: item.image }}
                  style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
                />
              )}
            </View>
            <View
              style={{ flex: 0.75, justifyContent: 'center', paddingLeft: 20 }}
            >
              {/* <Text style={{color:"#2E2E2E",fontSize:10}}>CHAPTER {index+1}</Text> */}
              <Text
                style={{
                  color: '#2E2E2E',
                  fontWeight: '600',
                  fontSize: headfont,
                }}
              >
                {item.chapterName}
              </Text>
            </View>
          </View>
          {item.progress && (
            <Progress.Bar
              progress={parseInt(item.progress) / 100}
              width={windowWidth / 1.15}
              height={5}
              color={color}
              unfilledColor={'lightgrey'}
              borderColor={'transparent'}
            />
          )}
        </View>
        <TouchableOpacity
          onPress={this.onlock.bind(this)}
          style={{
            borderWidth: 0,
            borderColor: 'lightgrey',
            position: 'absolute',
            height: itemheight,
            width: windowWidth / 1.15,
            alignSelf: 'center',
            backgroundColor: 'rgba(1, 1, 1, 0.2)',
            borderWidth: 1,
            borderRadius: 5,
            borderColor: '#ddd',
            borderBottomWidth: 0,
            shadowColor: '#000000',
            marginVertical: 10,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.9,
            shadowRadius: 3,
            justifyContent: 'center',
            elevation: 3,
          }}
        >
          <Image
            source={require('../../assets/images/padlock.png')}
            style={{
              width: lockwidth,
              height: lockheight,
              alignSelf: 'center',
              tintColor: 'grey',
            }}
          />
        </TouchableOpacity>
      </>
    );
  }
  onlock() {
    this.props.onlockmodal(true);
  }
  renderItemnormal({ item, index }) {
    console.log('newinormalitemmssssstemmmmm', item);
    // CBSE_GR_10_BIO
    // CBSE_GR_10_BIO
    var colorsarray = imagesarray; // ["#FFB13D","#5AC3FB","#E488FB","#88C400"];
    var randomItem =
      colorsarray[Math.floor(Math.random() * colorsarray.length)];
    var bgimage = randomItem;
    // var bgimage = colorsarray[Math.floor(Math.random()*colorsarray.length)];
    // var newitem = colorsarray.splice(bgimage,1);
    // colorsarray.push(newitem);
    var percent = parseInt(item.progress);
    console.log('Ff', percent);
    var color;
    if (percent > 80) {
      color = 'green';
    } else if (percent < 50) {
      color = 'red';
    } else {
      color = 'orange';
    }
    item['color'] = this.props.userData.color;
    const isTablet = DeviceConstants.isTablet; // false
    var itemheight = 80,
      headfont = 15,
      lockwidth = 30,
      lockheight = 30,
      progressheight = 5;
    if (isTablet) {
      (itemheight = 140),
        (headfont = 22),
        (lockwidth = 50),
        (lockheight = 50),
        (progressheight = 7);
    }
    return index === 0 ? (
      <TouchableOpacity
        onPress={this.onItem.bind(this, item)}
        style={{
          borderWidth: 0,
          borderColor: 'lightgrey',
          height: itemheight,
          width: windowWidth / 1.15,
          alignSelf: 'center',
          backgroundColor: 'white',
          borderWidth: 1,
          borderRadius: 5,
          borderColor: '#ddd',
          borderBottomWidth: 0,
          shadowColor: '#000000',
          marginVertical: 10,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.9,
          shadowRadius: 3,
          elevation: 3,
        }}
      >
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View
            style={{
              flex: 0.2,
              backgroundColor: this.props.userData.color,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {item.image === 'null' || item.image === '' ? (
              <Image
                source={require('../../assets/images/noimage.png')}
                style={{ width: 60, height: 60, alignSelf: 'center' }}
              />
            ) : (
              <Image
                source={{ uri: item.image }}
                style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
              />
            )}
          </View>
          <View
            style={{ flex: 0.8, justifyContent: 'center', paddingLeft: 20 }}
          >
            {/* <Text style={{color:"#2E2E2E",fontSize:10}}>CHAPTER {index+1}</Text> */}
            <Text
              style={{
                color: '#2E2E2E',
                fontWeight: '600',
                fontSize: headfont,
              }}
            >
              {item.chapterName}
            </Text>
          </View>
        </View>
        {item.progress && (
          <Progress.Bar
            progress={parseInt(item.progress) / 100}
            width={windowWidth / 1.15}
            height={progressheight}
            color={color}
            unfilledColor={'lightgrey'}
            borderColor={'transparent'}
          />
        )}
      </TouchableOpacity>
    ) : this.props.validpackages &&
      this.props.validpackages.subscriptionStatus === 'active' ? (
      <TouchableOpacity
        onPress={this.onItem.bind(this, item)}
        style={{
          borderWidth: 0,
          borderColor: 'lightgrey',
          height: itemheight,
          width: windowWidth / 1.15,
          alignSelf: 'center',
          backgroundColor: 'white',
          borderWidth: 1,
          borderRadius: 5,
          borderColor: '#ddd',
          borderBottomWidth: 0,
          shadowColor: '#000000',
          marginVertical: 10,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.9,
          shadowRadius: 3,
          elevation: 3,
        }}
      >
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View
            style={{
              flex: 0.2,
              backgroundColor: this.props.userData.color,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {item.image === 'null' || item.image === '' ? (
              <Image
                source={require('../../assets/images/noimage.png')}
                style={{
                  width: 60,
                  height: 60,
                  resizeMode: 'cover',
                  alignSelf: 'center',
                }}
              />
            ) : (
              <Image
                source={{ uri: item.image }}
                style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
              />
            )}
          </View>
          <View
            style={{ flex: 0.8, justifyContent: 'center', paddingLeft: 20 }}
          >
            {/* <Text style={{color:"#2E2E2E",fontSize:10}}>CHAPTER {index+1}</Text> */}
            <Text
              style={{
                color: '#2E2E2E',
                fontWeight: '600',
                fontSize: headfont,
              }}
            >
              {item.chapterName}
            </Text>
          </View>
        </View>
        {item.progress && (
          <Progress.Bar
            progress={parseInt(item.progress) / 100}
            width={windowWidth / 1.15}
            height={progressheight}
            color={color}
            unfilledColor={'lightgrey'}
            borderColor={'transparent'}
          />
        )}
      </TouchableOpacity>
    ) : (
      <>
        <TouchableOpacity
          onPress={this.onItem.bind(this, item)}
          style={{
            borderWidth: 0,
            borderColor: 'lightgrey',
            height: itemheight,
            width: windowWidth / 1.15,
            alignSelf: 'center',
            backgroundColor: 'white',
            borderWidth: 1,
            borderRadius: 5,
            borderColor: '#ddd',
            borderBottomWidth: 0,
            shadowColor: '#000000',
            marginVertical: 10,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.9,
            shadowRadius: 3,
            elevation: 3,
          }}
        >
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View
              style={{
                flex: 0.2,
                backgroundColor: this.props.userData.color,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {item.image === 'null' || item.image === '' ? (
                <Image
                  source={require('../../assets/images/noimage.png')}
                  style={{
                    width: 60,
                    height: 60,
                    resizeMode: 'cover',
                    alignSelf: 'center',
                  }}
                />
              ) : (
                <Image
                  source={{ uri: item.image }}
                  style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
                />
              )}
            </View>
            <View
              style={{ flex: 0.8, justifyContent: 'center', paddingLeft: 20 }}
            >
              {/* <Text style={{color:"#2E2E2E",fontSize:10}}>CHAPTER {index+1}</Text> */}
              <Text
                style={{
                  color: '#2E2E2E',
                  fontWeight: '600',
                  fontSize: headfont,
                }}
              >
                {item.chapterName}
              </Text>
            </View>
          </View>
          {item.progress && (
            <Progress.Bar
              progress={parseInt(item.progress) / 100}
              width={windowWidth / 1.15}
              height={progressheight}
              color={color}
              unfilledColor={'lightgrey'}
              borderColor={'transparent'}
            />
          )}
        </TouchableOpacity>
      </>
    );
  }
  render() {
    const { userData, chapters, userDetails } = this.props;
    const url = userData.image;
    return chapters.length > 0 ? (
      <View style={{ flex: 1, padding: 20 }}>
        {userDetails.userOrg.roleName === 'General Student' ? (
          <FlatList
            data={chapters}
            renderItem={this.renderItem.bind(this)}
            keyExtractor={(item) => item.reference_id}
          />
        ) : (
          <FlatList
            data={chapters}
            renderItem={this.renderItemnormal.bind(this)}
            keyExtractor={(item) => item.reference_id}
            //numColumns={2}
            // showVerticalScrollIndicator={false}
          />
        )}
      </View>
    ) : (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No Chapters</Text>
      </View>
    );
  }
}
export default ChapterComponent;
