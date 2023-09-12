import { StyleSheet } from 'react-native';
import { colors } from '../../constants';
const styles = StyleSheet.create({
  mainview: {
    margin: 15,
    borderRadius: 10,
  },
  headtext: {
    marginVertical: 10,
    textAlign: 'left',
    fontSize: 18,
    color: colors.Themecolor,
  },
  bottomview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  innerview: {
    flexDirection: 'row',
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  subjectview: {
    width: 20,
    height: 20,
  },
  subjecttext: {
    fontSize: 15,
    marginLeft: 10,
  },
});
export default styles;
