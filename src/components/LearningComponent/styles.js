import { StyleSheet } from 'react-native';
import { colors } from '../../constants';
const styles = StyleSheet.create({
  maintext: {
    fontSize: 20,
    color: '#5f5d5b',
    marginLeft: 20,
  },
  itemview: {
    width: 1724 / 11,
    height: 1340 / 11,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 10,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 10,
  },
  image: {
    width: 95,
    height: 95,
    alignSelf: 'center',
  },
  subtext: {
    fontSize: 12,
    color: '#555656',
    marginTop: 5,
    paddingHorizontal: 5,
    textAlign: 'center',
  },
  headText: {
    marginLeft: 15,
    marginTop: 10,
    fontSize: 16,
    color: colors.Themecolor,
  },
  seelalltext: {
    marginRight: 15,
    marginTop: 10,
    fontSize: 15,
    color: colors.Themecolor,
  },
});
export default styles;
