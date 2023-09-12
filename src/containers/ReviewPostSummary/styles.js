import { StyleSheet } from 'react-native';
import { colors } from '../../constants';
const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  topview: {
    flex: 0.1,
    flexDirection: 'row',
  },
  topleftview: {
    flex: 0.1,
    justifyContent: 'center',
    marginLeft: 10,
  },
  backarrow: {
    width: 32,
    height: 32,
    tintColor: colors.Themecolor,
  },
  topmiddleview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topmiddletext: {
    fontSize: 20,
  },
  toprightview: {
    flex: 0.1,
  },
  middleview: {
    flex: 0.9,
  },
  subview: {
    flex: 1,
    marginTop: 10,
  },
  headtext: {
    marginLeft: 15,
    marginTop: 15,
    fontSize: 15,
    color: colors.Themecolor,
  },

  lineview: {
    width: '100%',
    height: 1,
    backgroundColor: 'grey',
    marginVertical: 10,
  },
  scoreview: {
    margin: 10,
    padding: 15,
    backgroundColor: 'white',
    shadowOffset: { width: 0, height: 5 },
    shadowColor: 'grey',
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 10,
  },
  progressview: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});

export default styles;
