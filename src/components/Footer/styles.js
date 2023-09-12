import { Dimensions, StyleSheet } from 'react-native';
const windowWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  footerinnerview: {
    //alignItems:"center",
    height: '100%',
    overflow: 'hidden',
    width: windowWidth,
    backgroundColor: 'white',
    borderWidth: 0.5,
    borderColor: 'lightgrey',
    // borderTopRightRadius: 30,
    // borderTopLeftRadius: 30
  },
});
export default styles;
