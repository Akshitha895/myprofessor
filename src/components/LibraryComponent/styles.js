import { Dimensions, StyleSheet } from 'react-native';
import { colors } from '../../constants';
const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  headertext: {
    fontSize: 20,
    color: '#5f5d5b',
    marginLeft: 20,
    marginBottom: 10,
  },
  itemview: {
    paddingTop: 10,
  },
  rectview: {
    width: windowWidth / 2.3,
    height: 1340 / 10,
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
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
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomsubview: {
    flex: 0.4,
    justifyContent: 'space-around',
  },
  subjectname: {
    fontSize: 13,
    color: 'white',
    marginTop: 5,
    textAlign: 'left',
    overflow: 'hidden',
  },
  progressview: {
    marginHorizontal: 20,
  },
  progresstextview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progresstext: {
    color: 'white',
    fontSize: 12,
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
    width: 15,
    height: 15,
    tintColor: 'white',
  },
  icontext: {
    marginLeft: 5,
    color: 'white',
  },
  relativeview: {
    position: 'relative',
  },
  headText: {
    marginLeft: 15,
    marginTop: 10,
    fontSize: 16,
    color: colors.Themecolor,
  },
  seelalltext: {
    marginRight: 15,
    marginTop: 10,
    fontSize: 13,
    color: colors.Themecolor,
  },
});
export default styles;
