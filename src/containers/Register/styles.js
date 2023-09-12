import { StyleSheet } from 'react-native';
import { colors } from '../../constants';
const styles = StyleSheet.create({
  body: {
    backgroundColor: 'white',
    //height:"100%",
    margin: 20,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  containter: {
    width: '100%', //Dimensions.get("window").width, //for full screen
    height: '100%', // Dimensions.get("window").height, //for full screen
    zIndex: -1,
    backgroundColor: 'red',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  scrollview: {
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  logo: { margin: 10, width: 539 / 3, height: 158 / 3, alignSelf: 'center' },

  labelstyle: {
    color: '#2e2e2e',
    fontSize: 15,
  },
  input: {
    borderWidth: 0,
    color: '#606060',
    fontSize: 15,
  },
  textinput: {
    borderBottomWidth: 1,
    borderColor: '#959595',
    marginVertical: 10,
    marginHorizontal: 20,
    borderColor: '#2e2e2e',
  },
  subview: {
    marginHorizontal: 20,
    marginVertical: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  logintext: {
    textAlign: 'center',
    color: 'white',
    fontSize: 15,
  },
  createtext: {
    textAlign: 'center',
    color: colors.Themecolor,
    fontSize: 15,
  },
  createview: {
    width: 367 / 3,
    height: 90 / 3,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.Themecolor,
    justifyContent: 'center',
  },
  submiticon: {
    width: 367 / 3,
    height: 90 / 3,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    backgroundColor: colors.Themecolor,
  },
});

export default styles;
