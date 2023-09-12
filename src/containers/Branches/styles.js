import { Dimensions, StyleSheet } from 'react-native';
const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  backimg: {
    width: '100%',
    height: '100%',
  },
  mainView: {
    flex: 1,
    backgroundColor: 'white',
    margin: 15,
    borderRadius: 15,
  },
  logoview: {
    flex: 0.15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    margin: 10,
    width: 539 / 3,
    height: 158 / 3,
    alignSelf: 'center',
  },
  subview: {
    flex: 0.85,
  },
  listsubview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: 'white',
    borderColor: 'white',
    margin: 15,
    borderWidth: 1,
    borderRadius: 10,

    shadowColor: '#fde7da',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 10,
  },
  boardimg: {
    width: windowWidth / 3.2,
    //height:"100%",
    resizeMode: 'contain',
    height: windowWidth / 3,
  },
  boardtext: {
    marginTop: 10,
    color: '#2e2e2e',
    fontSize: 18,
    textAlign: 'center',
  },
});
export default styles;
