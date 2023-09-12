import { StyleSheet } from 'react-native';
import { colors } from '../../constants';
const styles = StyleSheet.create({
  mainview: {
    flex: 1,
  },
  gradientView: {
    flex: 1,
  },
  listview: {
    flex: 1,
  },
  bottomView: {
    flex: 0.1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 10,
  },
  buttonview: {
    height: 33,
    width: 93,
    backgroundColor: '#847393',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttontext: {
    fontSize: 14,
    lineHeight: 16,
    color: 'white',
  },
  sectiontext: {
    fontSize: 14,
    paddingVertical: 5,
    paddingLeft: 10,
    color: '#4E3F56',
  },
  itemmainview: {
    width: '100%',
    // height:50,
    paddingVertical: 10,
  },
  itemsubview: {
    flex: 1,
    flexDirection: 'row',
  },
  itemleftview: {
    flex: 0.1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemmiddleview: {
    flex: 0.8,
    justifyContent: 'space-evenly',
    marginLeft: 20,
  },
  itemrightview: {
    flex: 0.1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bellorange: {
    width: 23 / 1.2,
    height: 24 / 1.2,
  },
  bellgrey: {
    width: 21 / 1.2,
    height: 24 / 1.2,
    tintColor: '#BC98DC',
  },
  middleheadtext: {
    fontSize: 14,
    lineHeight: 16,

    color: colors.Themecolor,
  },
  descriptiontext: {
    fontSize: 10,
    lineHeight: 12,
    marginTop: 5,
    color: colors.Themecolor,
  },
  timetext: {
    fontSize: 10,
    lineHeight: 12,
    marginTop: 5,
    color: '#4E3F56',
  },
  orangeeclipse: {
    width: 6,
    height: 6,
  },
  rigtarrow: {
    width: 8,
    height: 14,
  },
  seperator: {
    height: 1,
    width: '100%',
  },
});
export default styles;
