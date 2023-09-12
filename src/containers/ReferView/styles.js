import { StyleSheet } from 'react-native';
import { colors } from '../../constants';
const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  topView: {
    flex: 0.08,
    overflow: 'hidden',
    paddingBottom: 5,
  },
  topShadow: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
  },
  backIcon: {
    height: 16,
    width: 21,
    marginLeft: 20,
    tintColor: colors.Themecolor,
  },
  topHead: {
    marginLeft: 20,
    color: colors.Themecolor,
    fontSize: 18,
  },
  bottomView: {
    flex: 0.92,
  },
  referlogo: {
    width: 267 / 1.3,
    height: 258 / 1.3,
    alignSelf: 'center',
  },
  bottomHeadText: {
    color: colors.Themecolor,

    lineHeight: 28,
    textAlign: 'center',
  },
  bottomSubText: {
    marginTop: 20,
    paddingHorizontal: 20,
    color: '#515252',
    textAlign: 'center',
  },
  referalcode: {
    textAlign: 'center',
    color: '#9F9F9F',
    marginTop: 30,
  },
  codeBox: {
    height: 51,
    justifyContent: 'center',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  boxText: {
    fontSize: 24,
    textAlign: 'center',
    color: colors.Themecolor,
  },
  submitbutton: {
    width: '80%',
    borderRadius: 10,
    alignSelf: 'center',
    backgroundColor: colors.Themecolor,
    alignItems: 'center',
    marginTop: 50,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
});
export default styles;
