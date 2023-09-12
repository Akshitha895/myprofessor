import { StyleSheet } from 'react-native';

import { colors } from '../../constants';
const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  topview: {
    flex: 0.08,
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
    flex: 0.8,
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
    flex: 1,
  },
  subview: {
    flex: 1,
    margin: 5,
    backgroundColor: 'white',
    borderRadius: 10,
    //  shadowOffset: { width: 0, height: 5 },shadowColor:"grey",
    //         shadowOpacity: 1,
    //         shadowRadius: 5,
    //         elevation: 10,
  },
  headtext: {
    marginLeft: 15,
    marginTop: 15,
    fontSize: 20,
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
    backgroundColor: 'white',
    shadowOffset: { width: 0, height: 5 },
    shadowColor: 'grey',
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 10,
    paddingVertical: 10,
  },
  progressview: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default styles;
