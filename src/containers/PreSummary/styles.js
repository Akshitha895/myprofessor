import { StyleSheet } from 'react-native';
import { colors } from '../../constants';
const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    //backgroundColor: '#F9C6B7'
  },
  backimage: {
    width: 30,
    height: 30,
    marginVertical: 15,
    tintColor: colors.Themecolor,
    marginLeft: 20,
  },
  mainsubview: {
    height: '100%',
    width: '100%',
    backgroundColor: 'white',
    //   / paddingBottom:60,
    borderRadius: 20,
    // shadowColor:'black',
    // shadowOffset: { width: 0, height: 5 },
    // shadowOpacity: 1,
    // shadowRadius: 5,
    // elevation: 10,
  },

  subjectouter: {
    width: 150,
    height: 40,
    backgroundColor: colors.Themecolor,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 35,
    top: 40,
    alignSelf: 'center',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 10,
  },
  mainmiddleview: {
    flex: 1,
    backgroundColor: 'red',
  },

  middleview: {
    flex: 0.2,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  textmain: {
    color: colors.Themecolor,
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 20,
  },

  relativeview: {
    position: 'relative',
  },
  nextactivityview: {
    height: '20%',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    marginRight: 20,
  },
  nextinner: {
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.Themecolor,
    paddingHorizontal: 10,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activitytext: {
    textAlign: 'center',
    fontSize: 15,
    color: 'white',
  },
});
export default styles;
