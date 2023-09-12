import { Dimensions, StyleSheet } from 'react-native';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { colors } from '../../constants';
const styles = StyleSheet.create({
  mainview: {
    flex: 1,
  },
  topview: {
    height: 50,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  toptext: {
    color: colors.Themecolor,
    fontSize: 20,
  },
  middleview: {
    flex: 0.92,
  },
  footerview: {
    flex: 0.08,
    justifyContent: 'flex-end',
  },
  footerinnerview: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 80,
    width: windowWidth,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  footericon: {
    width: 32,
    height: 32,
  },
  forwardarr: {
    width: 30,
    height: 30,
    alignSelf: 'flex-start',
    marginTop: 5,
    transform: [{ rotate: '180deg' }],
    tintColor: colors.Themecolor,
  },
  teacheforwardarr: {
    width: 30,
    height: 30,
    tintColor: colors.Themecolor,
    marginHorizontal: 5,
    marginTop: 5,
    alignSelf: 'flex-start',
    transform: [{ rotate: '180deg' }],
  },
  rectview: {
    width: 1724 / 10,
    height: 1340 / 7,
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    marginHorizontal: 10,
    overflow: 'hidden',
    shadowOffset: { width: 1, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 10,
  },
  subview: {
    flex: 1,
  },
  topsubview: {
    flex: 0.4,
  },
  bottomsubview: {
    flex: 0.6,
    justifyContent: 'space-around',
  },
  subjectname: {
    fontSize: 15,
    textAlign: 'left',
    marginTop: 10,
    marginLeft: 10,
  },
  progressview: {
    marginHorizontal: 20,
  },
  progresstextview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progresstext: {
    fontSize: 15,
  },
  countview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  innercountview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconview: {
    width: 17,
    height: 17,
    tintColor: 'white',
  },
  icontext: {
    marginLeft: 5,
  },
  relativeview: {
    position: 'relative',
  },
});
export default styles;
