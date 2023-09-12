import { Dimensions, StyleSheet } from 'react-native';
const windowWidth = Dimensions.get('window').width;

import { colors } from '../../constants';
const styles = StyleSheet.create({
  mainview: {
    flex: 1,
  },
  topview: {
    flex: 0.05,
    justifyContent: 'center',
  },
  toptext: {
    textAlign: 'center',
    fontSize: 15,
  },
  mainbottomview: {
    flex: 1,
  },
  timerview: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
  },
  mainshadowview: {
    flex: 1,
    backgroundColor: 'white',
    shadowColor: 'black',
    // shadowOffset: { width: 0, height: 5 },
    // shadowOpacity: 1,
    // shadowRadius: 5,
    //  elevation: 10
  },
  headerview: {
    flex: 0.15,
    flexDirection: 'row',
    justifyContent: 'flex-end',
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
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  timertext: {
    textAlign: 'center',
    alignSelf: 'center',
    color: 'white',
    fontSize: 15,
  },
  listview: {
    flex: 1,
  },
  circlesview: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
  },
  questionsview: {
    flex: 0.85,
    margin: 20,
  },
  questioninnerview: {
    flexDirection: 'row',
  },
  questionnum: {
    fontSize: 15,
    textAlign: 'left',
  },
  questiontext: {
    fontSize: 15,
    textAlign: 'left',
    marginLeft: 15,
    paddingRight: 10,
    width: '70%',
  },
  answermain: {
    marginTop: 10,
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
    justifyContent: 'center',
  },
  answertext: {
    fontSize: 15,
    marginTop: 10,
  },
  circlefilled: {
    height: 40,
    width: 40,
    borderRadius: 20,
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
    borderWidth: 2,
    marginHorizontal: 10,
    justifyContent: 'center',
  },
  bordertext: {
    textAlign: 'center',
    color: colors.Themecolor,
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
