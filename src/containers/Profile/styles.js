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
    height: 41,
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
    fontSize: 16,
  },
  changelogo: {
    width: 288 / 1.5,
    height: 287 / 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomtopvieW: {
    flex: 0.3,
  },
  gradientview: {
    flex: 1,
  },
  bottomsubView: {
    flex: 0.7,
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
  counttext: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '800',
    color: '#847393',
  },
  inboxText: {
    fontSize: 15,
    textAlign: 'center',
    marginLeft: 5,
    color: colors.Themecolor,
  },
  deleteButton: {
    width: 20 / 1.5,
    height: 22 / 1.5,
    marginLeft: 10,
  },
});

export default styles;
