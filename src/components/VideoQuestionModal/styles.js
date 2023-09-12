import { Dimensions, StyleSheet } from 'react-native';
import { colors } from '../../constants';
const windowHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  mainView: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 15,
    paddingHorizontal: 10,
    height: windowHeight / 1.6,
    // backgroundColor:"transparent"
  },
  mainView1: {
    backgroundColor: 'transparent',
  },
  mainTop: {
    //flex:0.7
  },
  bgshape: {
    width: 925 / 2.7,
    height: 1169 / 2.7,
    justifyContent: 'center',
  },
  greycircle: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorcirlce: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerimage: {
    width: 40,
    height: 40,
  },
  bottomview: {
    // justifyContent:"space-evenly"
  },
  bottomheadtext: {
    fontSize: 20,
    textAlign: 'center',
  },
  bottommiddletext: {
    textAlign: 'center',
    marginTop: 10,
  },
  bottombutton: {
    backgroundColor: 'red',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginTop: 10,
  },
  bottomcorrect: {
    backgroundColor: colors.Themecolor,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginVertical: 10,
  },
  buttontext: {
    color: 'white',
    textAlign: 'center',
    fontSize: 15,
  },
  rewatchview: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },

  questionview: {
    justifyContent: 'center',
    marginVertical: 15,
  },
  questionhint: {
    fontSize: 15,
    textAlign: 'left',
    marginTop: 10,
  },
  questiontext: {
    fontSize: 18,
    textAlign: 'left',
  },
  answersview: {
    justifyContent: 'center',
  },
  answersubview: {
    flex: 1,
    justifyContent: 'space-around',
    //height:windowHeight/2.5,
  },
  answeritem: {
    // justifyContent:"flex-start",
    marginVertical: 15,
  },
  answeritemsub: {
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  answeruncheck: {
    height: 25,
    width: 25,
    borderRadius: 25 / 2,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  answercheck: {
    width: 15,
    height: 15,
    tintColor: colors.Themecolor,
    alignSelf: 'center',
  },
  answergrey: {
    height: 25,
    width: 25,
    borderRadius: 25 / 2,
    backgroundColor: 'lightgrey',
  },
  answertext: {
    fontSize: 15,
    textAlign: 'center',
    marginLeft: 20,
  },
});
export default styles;
