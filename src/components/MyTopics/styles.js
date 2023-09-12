import { Dimensions, StyleSheet } from 'react-native';
import { colors } from '../../constants';
const windowWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  headertext: {
    fontSize: 16,
    marginLeft: 10,
    marginTop: 0,
    color: colors.Themecolor,
  },
  itemview: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  seelalltext: {
    marginRight: 15,
    fontSize: 13,
    color: colors.Themecolor,
  },
  innerrect: {
    flex: 0.25,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inerImage: {
    width: 170 / 3,
    height: 170 / 3,
  },
  leftinnerview: {
    flex: 0.75,
    justifyContent: 'space-around',
  },
  subjectname: {
    color: '#4b4b4b',
    fontSize: 20,
    textAlign: 'left',
    marginLeft: 10,
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
    fontSize: 15,
  },
  mainsubview: {
    //marginTop:50,
    height: '100%',
    width: '100%',
    backgroundColor: '#f6f7fb',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  mainView: {
    flex: 1,
    //backgroundColor: '#F9C6B7'
  },
  backimage: {
    width: 30,
    height: 30,
    marginVertical: 30,
    tintColor: colors.Themecolor,
    marginLeft: 20,
  },
  mainsubview: {
    //marginTop:50,
    height: '100%',
    width: '100%',
    backgroundColor: '#f6f7fb',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  subjectinner: {
    width: 944 / 6,
    height: 912 / 6,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    top: 30,
    left: windowWidth / 3.2,
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
    flex: 1,
  },
  listview: {
    flex: 0.7,
  },
  middleview: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textmain: {
    color: colors.Themecolor,
    textAlign: 'center',
    marginTop: 60,
    fontSize: 20,
  },
  rectview: {
    width: windowWidth / 2.3,
    height: 1340 / 10,
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    margin: 10,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 10,
  },
  subview: {
    flex: 1,
  },
  topsubview: {
    flex: 0.3,
  },
  bottomsubview: {
    flex: 0.7,
    justifyContent: 'center',
  },
  subjectname: {
    color: '#4b4b4b',
    fontSize: 15,
    textAlign: 'center',
  },
  progressview: {
    marginHorizontal: 10,
    marginTop: 10,
  },
  progresstextview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progresstext: {
    color: '#4b4b4b',
    fontSize: 15,
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
  },
  icontext: {
    marginLeft: 5,
  },
  relativeview: {
    position: 'relative',
  },
});
export default styles;
