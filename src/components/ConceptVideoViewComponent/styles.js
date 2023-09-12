import { Platform, StyleSheet } from 'react-native';
const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  absview: {
    width: 10,
    height: 10,
    position: 'absolute',
    width: '100%',
    backgroundColor: 'transparent',

    elevation: 20,
  },
  subview: {
    flex: 1,
    flexDirection: 'row',
  },
  subleftview: {
    flex: Platform.OS === 'android' ? 0.15 : 0.2,
  },
  submiddleview: {
    flex: Platform.OS === 'android' ? 0.7 : 0.65,
  },
  subright: {
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    elevation: 10,
  },
  sublastright: {
    flex: 0.15,
  },
});
export default styles;
