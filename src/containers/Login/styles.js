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
    position: 'relative',
  },
  containter: {
    width: '100%', //Dimensions.get("window").width, //for full screen
    height: '100%', // Dimensions.get("window").height, //for full screen
    zIndex: -1,
    backgroundColor: 'white',
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
  logo: { width: 539 / 3, height: 158 / 3, alignSelf: 'center' },
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
    backgroundColor: 'green',
  },
  textinput: {
    borderBottomWidth: 1,
    borderColor: 'lightgrey',
    paddingLeft: 8,

    borderColor: '#2e2e2e',
  },
  subview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomview: {
    flex: 0.3,
    justifyContent: 'space-around',
  },
  helptext: {
    fontSize: 13,
    alignSelf: 'center',
    color: '#595858',
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
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.Themecolor,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  submiticon: {
    backgroundColor: colors.Themecolor,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    paddingHorizontal: 40,
    alignItems: 'center',
    height: 30,
  },
  forgottext: {
    color: colors.Themecolor,
    fontSize: 15,
  },
  remembertext: {
    color: '#959595',
    fontSize: 15,
    marginLeft: 5,
  },
  checkbox: {
    width: 17,
    height: 17,
    alignSelf: 'center',
    tintColor: 'lightgrey',
  },
  checkboxview: {
    flexDirection: 'row',
  },
});

export default styles;
