import { Dimensions, StyleSheet } from 'react-native';
import { colors } from '../../constants';
const windowWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  backimage: {
    width: 30,
    height: 30,
    tintColor: colors.Themecolor,
    marginLeft: 20,
  },
  mainsubview: {
    //marginTop:50,
    backgroundColor: 'red',
    //height:windowHeight,
    flex: 1,
  },
  subjectinner: {
    width: 944 / 7,
    height: 912 / 7,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    top: 20,
    alignSelf: 'center',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 5,
    // elevation: 10
  },
  subjectouter: {
    width: 944 / 6,
    height: 912 / 6,
    backgroundColor: 'white',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    top: 50,
    left: windowWidth / 3,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 10,
  },
  mainmiddleview: {
    flex: 0.9,
  },
  listview: {
    flex: 0.8,
    backgroundColor: 'transparent',
    backgroundColor: 'green',
  },
  middleview: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'yellow',
  },
  middlebotview: {
    flex: 0.02,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'yellow',
  },
  textmain: {
    color: '#695276',
    textAlign: 'center',
    fontSize: 20,
  },
  rectview: {
    width: windowWidth / 2.2,
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 5,
    overflow: 'hidden',
    // shadowOffset: { width: 0, height: 5 },
    // shadowOpacity: 1,
    // shadowRadius: 5,
    // elevation: 10,
  },
  subview: {
    flex: 1,
  },
  topsubview: {
    flex: 0.6,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  bottomsubview: {
    flex: 0.4,
    justifyContent: 'space-around',
  },
  subjectname: {
    color: '#4b4b4b',
    fontSize: 12,
    textAlign: 'center',
    color: 'white',
    flexWrap: 'wrap',
  },
  progressview: {
    marginHorizontal: 10,
  },
  progresstextview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progresstext: {
    color: '#4b4b4b',
    fontSize: 12,
    color: 'white',
  },
  countview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
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
    color: 'white',
  },
  relativeview: {
    position: 'relative',
  },
});
export default styles;
