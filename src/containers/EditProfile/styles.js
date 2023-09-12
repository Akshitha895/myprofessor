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
    alignItems: 'center',
  },
  referlogo: {
    width: 267 / 1.2,
    height: 258 / 1.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoicon: {
    width: 120 / 1.2,
    height: 93 / 1.2,
  },
  headText: {
    fontSize: 24,
    lineHeight: 28,
    textAlign: 'center',
    marginTop: 20,
    color: '#847393',
  },
  subtext: {
    fontSize: 16,
    lineHeight: 28,
    textAlign: 'center',
    marginTop: 20,
    color: '#847393',
  },
  gradientstyles: {
    width: '80%',
    height: 42,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#FFFFFF',
  },

  topsubview: {
    flex: 1,
    flexDirection: 'row',
  },
  topleftview: {
    flex: 0.1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topmiddleview: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  toprightview: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
export default styles;
