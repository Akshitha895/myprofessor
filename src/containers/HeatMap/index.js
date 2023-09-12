import React, { Component } from 'react';
import {
  BackHandler,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DeviceConstants from 'react-native-device-constants';

import Drawer from 'react-native-drawer';
import { Actions } from 'react-native-router-flux';
import Footer from '../../components/Footer';
import HeatMapComponent from '../../components/HeatMapComponent';
import SideMenu from '../../components/SideMenu';
import { colors } from '../../constants';
import styles from './styles';

class HeatMap extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction
    );
  }
  backAction = () => {
    // this.props.navigation.goBack(null);
    this.onBack();
    return true;
    // Actions.topicmainview({from:this.props.from,type:"reset",data:this.props.topicindata,topicsdata:this.props.topicData,screen:"summary",subjectData:this.props.subjectData})
  };
  componentWillUnmount() {
    this.backHandler.remove();
  }

  onBack() {
    Actions.dashboard();
  }
  closeControlPanel = () => {
    this._drawer.close();
  };
  openControlPanel = () => {
    this._drawer.open();
  };

  render() {
    const isTablet = DeviceConstants.isTablet;
    var headfont = 18,
      backheight = 16,
      backwidth = 21,
      drawerwidth = 100;
    if (isTablet) {
      (headfont = 30), (backheight = 20), (backwidth = 30), (drawerwidth = 700);
    }
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Drawer
          type="overlay"
          ref={(ref) => (this._drawer = ref)}
          tapToClose
          openDrawerOffset={drawerwidth}
          content={<SideMenu closeControlPanel={this.closeControlPanel} />}
        >
          <View style={styles.mainView}>
            <View style={styles.topView}>
              <View style={styles.topShadow}>
                <View style={styles.topsubview}>
                  <View style={styles.topleftview}>
                    <TouchableOpacity onPress={this.onBack.bind(this)}>
                      <Image
                        source={require('../../assets/images/refer/back.png')}
                        style={{
                          height: backheight,
                          width: backwidth,
                          marginLeft: 20,
                          tintColor: colors.Themecolor,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.topmiddleview}>
                    <Text
                      style={{
                        marginLeft: 20,
                        color: colors.Themecolor,
                        fontSize: headfont,
                      }}
                    >
                      Knowledge Map
                    </Text>
                  </View>
                  <View style={styles.toprightview} />
                </View>
              </View>
            </View>

            <View style={{ flex: 0.92 }}>
              <View style={{ flex: 1 }}>
                <View style={{ flex: 0.92 }}>
                  <HeatMapComponent
                    data={this.props.data}
                    fromscreen={this.props.fromscreen}
                  />
                </View>
                <View style={{ flex: 0.08 }}>
                  <Footer
                    openControlPanel={this.openControlPanel}
                    value="heatmap"
                  />
                </View>
              </View>
            </View>
          </View>
        </Drawer>
      </SafeAreaView>
    );
  }
}
export default HeatMap;
