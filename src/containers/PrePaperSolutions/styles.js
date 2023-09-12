import { Dimensions, StyleSheet } from 'react-native';
const windowWidth = Dimensions.get('window').width;

import { colors } from '../../constants';
const styles = StyleSheet.create({
  mainview: {
    flex: 1,
  },
  topview: {
    flex: 0.1,
    justifyContent: 'center',
    //flexDirection:"row"
  },
  backimage: {
    width: 30,
    height: 30,
    marginLeft: 10,
    tintColor: colors.Themecolor,
  },
  toptext: {
    //textAlign:"left",
    fontSize: 15,
    color: colors.Themecolor,
    // marginTop: 20,
    // marginLeft:20
  },
  mainbottomview: {
    flex: 0.9,
  },
  mainshadowview: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 15,
    shadowColor: 'black',
    marginTop: 20,
    // shadowOffset: { width: 0, height: 5 },
    // shadowOpacity: 1,
    // shadowRadius: 5,
    //  elevation: 10,
    //  overflow:"hidden"
  },
  headerview: {
    flex: 0.1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerleftview: {
    flex: 0.7,
    justifyContent: 'center',
  },
  headtext: {
    fontSize: 20,
    marginLeft: 20,
    color: colors.Themecolor,
  },
  headrightview: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  timerview: {
    width: 90,
    height: 50,
    backgroundColor: colors.Themecolor,
    justifyContent: 'center',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  timertext: {
    textAlign: 'center',
    alignSelf: 'center',
    color: 'white',
    fontSize: 15,
  },
  listview: {
    flex: 1,
    marginVertical: 20,
  },
  circlesview: {
    flex: 0.1,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  questionsview: {
    flex: 0.9,
    padding: 10,
  },
  questioninnerview: {
    flexDirection: 'row',
  },
  questionnum: {
    fontSize: 18,
    textAlign: 'left',
  },
  questiontext: {
    fontSize: 18,
    textAlign: 'left',
    marginLeft: 20,
  },
  answermain: {
    marginTop: 20,
  },
  answersub: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  answernum: {
    fontSize: 15,
    textAlign: 'center',
  },
  answertextview: {
    marginLeft: 15,
    paddingLeft: 15,
    width: windowWidth / 1.3,
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 10,
  },
  answertext: {
    fontSize: 15,
  },
  circlefilled: {
    height: 40,
    width: 40,
    borderRadius: 20,
    borderColor: '#239816',
    backgroundColor: '#239816',
    borderWidth: 2,
    marginHorizontal: 10,
    justifyContent: 'center',
  },
  circletext: {
    textAlign: 'center',
    color: 'white',
    fontSize: 15,
  },
  borderfilled: {
    height: 40,
    width: 40,
    borderRadius: 20,
    borderColor: '#f14d65',
    backgroundColor: '#f14d65',
    borderWidth: 2,
    marginHorizontal: 10,
    justifyContent: 'center',
  },
  bordertext: {
    textAlign: 'center',
    color: 'white',
    fontSize: 15,
  },
  bottomview: {
    flex: 0.1,
    flexDirection: 'row',
  },
  bottomleftview: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: 20,
  },
  bottomrightview: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginRight: 20,
  },
});
export default styles;
