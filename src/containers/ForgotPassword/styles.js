import { Dimensions, StyleSheet } from 'react-native';
import { colors } from '../../constants';

const windowHeight = Dimensions.get('window').height;
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
  backbanner: {
    width: '100%',
    height: windowHeight / 3,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  computer: {
    width: 581 / 2.5,
    height: 519 / 2.5,
    alignSelf: 'center',
  },
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
    height: 40,
    margin: 10,
    marginHorizontal: 10,

    borderColor: '#2e2e2e',
  },
  forgoticon: {
    width: 96 / 1.5,
    height: 96 / 1.5,
    marginVertical: 10,
    alignSelf: 'center',
  },

  subview: {
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  bottomview: {
    margin: 10,
    justifyContent: 'center',
  },
  helptext: {
    fontSize: 15,
    marginBottom: 15,
    color: colors.Themecolor,
    textDecorationLine: 'underline',
    alignSelf: 'center',
  },
  logintext: {
    textAlign: 'center',
    color: 'white',
    fontSize: 15,
  },
  submiticon: {
    width: 367 / 2.5,
    height: 90 / 2.5,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    backgroundColor: colors.Themecolor,
  },
  forgottext: {
    color: colors.Themecolor,
    fontSize: 20,
    alignSelf: 'center',
    margin: 10,
  },
  pleasetext: {
    color: '#9B9C9C',
    fontSize: 15,
    alignSelf: 'center',
    margin: 10,
  },
});

export default styles;
