import { StyleSheet } from 'react-native';
import { colors } from '../../constants';

const styles = StyleSheet.create({
  body: {
    backgroundColor: 'white',
    height: '90%',
    margin: 20,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  containter: {
    width: '100%', //Dimensions.get("window").width, //for full screen
    height: '200%', // Dimensions.get("window").height, //for full screen
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
    height: '100%',
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
  },
  textinput: {
    borderBottomWidth: 1,
    borderColor: '#959595',
    marginHorizontal: 15,
    height: 40,
    borderColor: '#2e2e2e',
    marginVertical: 10,
  },
  subview: {
    marginVertical: 10,
    marginHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomview: {
    backgroundColor: 'transparent',
  },
  helptext: {
    fontSize: 13,
    alignSelf: 'center',
    color: '#9B9C9C',
    marginVertical: 15,
  },
  socialiconview: {
    marginTop: 10,
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  socialicon: {
    width: 48,
    height: 48,
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
    borderWidth: 1,
    borderColor: colors.Themecolor,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  submiticon: {
    width: 367 / 3,
    height: 90 / 3,
    marginVertical: 20,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: colors.Themecolor,
  },
  forgottext: {
    color: colors.Themecolor,
    fontSize: 15,
  },
});

export default styles;
