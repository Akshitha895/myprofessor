import { Dimensions, StyleSheet } from 'react-native';
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  backbanner: {
    width: '100%',
    height: windowHeight / 3.5,
    overflow: 'hidden',
    justifyContent: 'center',
    tintColor: '#000000',
  },
  computer: {
    width: 581 / 3,
    height: 519 / 3,
    alignSelf: 'center',
  },
  back: {
    width: 32,
    height: 32,
    tintColor: 'white',
    marginLeft: 10,
    marginTop: 10,
  },
});
export default styles;
