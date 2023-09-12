import { StyleSheet } from 'react-native';
import { colors } from '../../constants';
const styles = StyleSheet.create({
  mainview: {
    flex: 1,
  },
  itemview: {
    flex: 1,
    padding: 10,
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderWidth: 0.5,
    borderRadius: 10,
    borderColor: 'grey',
    shadowOffset: { width: 0, height: 5 },
    marginVertical: 5,
    shadowOpacity: 1,
    shadowColor: 'black',
    shadowRadius: 5,
    elevation: 10,
  },
  itemsubview: {
    flex: 1,
  },
  itemsubtopview: {
    flex: 0.8,
  },
  itemsubbottomview: {
    flex: 0.2,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 5,
  },
  itemtopmainview: {
    flex: 1,
    flexDirection: 'row',
  },
  itemtopleftview: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemtoprightview: {
    flex: 0.7,
    justifyContent: 'center',
  },
  testname: {
    fontSize: 15,
    color: colors.Themecolor,
    marginHorizontal: 5,
  },
  descriptionview: {
    flexDirection: 'row',
    marginTop: 10,
    marginHorizontal: 5,
  },
  descriptionicon: {
    width: 15,
    height: 15,
    alignSelf: 'center',
  },
  descriptiontext: {
    fontSize: 12,
    paddingLeft: 10,
    color: '#686262',
  },
  itesmbottomsubview: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
  },
  iconview: {
    width: 18,
    height: 18,
    alignSelf: 'center',
  },
  icontext: {
    fontSize: 12,
    paddingLeft: 10,
    color: '#686262',
  },
});
export default styles;
