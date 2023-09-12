import React, { Component } from 'react';
import { SectionList, View, Text, Image, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import styles from './styles';

class AnnounceComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.newdata,
    };
  }
  componentDidMount() {
    // alert(JSON.stringify(this.state.data))
  }
  onView(item) {
    this.props.onItemPress(item);
  }
  Item = ({ item }) => (
    <TouchableOpacity
      onPress={this.onView.bind(this, item)}
      style={{
        width: '100%',
        paddingVertical: 10,
        backgroundColor: !item.is_read ? 'rgba(105, 80, 119, 0.2)' : 'white',
      }}
    >
      <View style={styles.itemsubview}>
        <View style={styles.itemleftview}>
          {!item.is_read ? (
            <Image
              source={require('../../assets/images/refer/notifyorange.png')}
              style={styles.bellorange}
            />
          ) : (
            <Image
              source={require('../../assets/images/refer/bellicon.png')}
              style={styles.bellgrey}
            />
          )}
        </View>
        <View style={styles.itemmiddleview}>
          <Text style={styles.middleheadtext}>{item.title}</Text>
          <Text style={styles.descriptiontext}>{item.description}</Text>
          <Text style={styles.timetext}>
            {moment(item.from_date).format('L')}
          </Text>
        </View>
        <View style={styles.itemrightview}>
          {!item.is_read ? (
            <Image
              source={require('../../assets/images/refer/orangecl.png')}
              style={styles.orangeeclipse}
            />
          ) : (
            <Image
              source={require('../../assets/images/refer/Vector.png')}
              style={styles.rigtarrow}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
  seperator() {
    return <View style={styles.seperator} />;
  }
  render() {
    return (
      <View style={styles.mainview}>
        <LinearGradient
          colors={[' rgba(105, 80, 119, 0.08)', 'rgba(132, 115, 147, 0.064)']}
          style={styles.gradientView}
        >
          <View style={styles.listview}>
            <SectionList
              sections={this.state.data}
              keyExtractor={(item, index) => item + index}
              renderItem={this.Item.bind(this)}
              ItemSeparatorComponent={this.seperator.bind(this)}
              renderSectionHeader={({ section: { key } }) => (
                <Text style={styles.sectiontext}>{key}</Text>
              )}
            />
          </View>
          {/* <View style={styles.bottomView}>
                    <LinearGradient colors={["#A473E2","#EF929C"]}  start={{ x: 0, y: 0.5 }} style={styles.buttonview}>
                            <Text style={styles.buttontext}>VIEW ALL</Text>
                        </LinearGradient>
                    </View> */}
        </LinearGradient>
      </View>
    );
  }
}
export default AnnounceComponent;
