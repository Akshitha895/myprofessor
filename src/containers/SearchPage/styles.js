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
  },
  bottomView: {
    flex: 0.92,
  },
  referlogo: {
    width: 267 / 1.5,
    height: 258 / 1.5,
  },
  bottomHeadText: {
    color: colors.Themecolor,
    fontSize: 20,
    lineHeight: 28,
    textAlign: 'center',
  },
  bottomSubText: {
    fontSize: 15,
    marginTop: 20,
    paddingHorizontal: 20,
    color: '#515252',
    textAlign: 'center',
  },
  referalcode: {
    fontSize: 14,
    textAlign: 'center',
    color: '#9F9F9F',
    marginTop: 30,
  },
  codeBox: {
    width: 171,
    height: 51,
    justifyContent: 'center',
    marginTop: 20,
  },
  boxText: {
    fontSize: 24,
    textAlign: 'center',
    color: '#515252',
  },
  submitbutton: {
    height: 54,
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
