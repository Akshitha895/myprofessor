import { Dimensions, StyleSheet } from 'react-native';
const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  mainview: {
    flex: 1,
  },
  topview: {
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
});
export default styles;
