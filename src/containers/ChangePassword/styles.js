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
    fontSize: 20,
  },
  bottomView: {
    flex: 0.92,
  },
  submitbutton: {
    width: '70%',
    borderRadius: 10,
    alignSelf: 'center',
    backgroundColor: colors.Themecolor,
    alignItems: 'center',
    marginTop: 50,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  changelogo: {
    width: 288 / 1.5,
    height: 287 / 1.5,
  },
  bottomtopvieW: {
    flex: 0.25,
  },
  gradientview: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomsubView: {
    flex: 0.75,
    alignItems: 'center',
  },
  textInput: {
    width: '80%',
    height: 44,
    paddingLeft: 8,
    backgroundColor: '#F6F5F7',
    borderRadius: 10,
    borderBottomWidth: 1,
    borderColor: colors.Themecolor,
    marginVertical: 20,
    color: colors.Themecolor,
  },
});
export default styles;
