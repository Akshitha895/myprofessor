import { Dimensions, StyleSheet } from 'react-native';
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //   marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#fdf6f6',
    padding: 20,
    marginBottom: 10,
    flexDirection: 'row',
    // justifyContent: 'space-between',
    // marginHorizontal: 16,
  },
  text: {
    fontSize: 14,
  },
  title: {
    fontSize: 16,
  },
  gradientstyles: {
    height: 40,
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    marginLeft: 10,
  },
  bgImg: { height: width / 2.05, width },
  content: {
    position: 'absolute',
    top: width / 3.16,
    bottom: 0,
    left: 0,
    right: 0,
  },
  balView: { flex: 1, backgroundColor: 'white', borderRadius: 40 },
  balContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: -width / (5.87 * 2),
    alignItems: 'center',
  },
  amntView: {
    width: width / 1.52,
    height: width / 5.87,
    borderRadius: 15,
    shadowColor: '#171717',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  amntText: { color: '#2183e2', fontWeight: 'bold' },
  availableText: {
    fontSize: 12,
    color: 'black',
    marginTop: 3,
    fontWeight: '600',
  },
  subContent: { flex: 1 },
  pricesView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cancelBtn: {
    height: 40,
    backgroundColor: '#dddddd',
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    marginRight: 10,
  },
  cancelText: { fontSize: 16, color: 'black' },
  payText: { color: 'white', fontSize: 16 },
  borderView: {
    borderBottomWidth: 0.5,
    borderColor: 'grey',
    marginVertical: 10,
  },
  promoCode: {
    fontSize: 16,
    borderColor: 'black',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 1,
    borderRadius: 4,
  },
  titleView: { flex: 0.39, justifyContent: 'center' },
  emptyView: { flex: 0.05 },
  radioBtn: { height: 20, width: 20, tintColor: 'grey' },
  radioBtnView: { flex: 0.2, alignItems: 'flex-end', justifyContent: 'center' },
});
export default styles;
// import {
//     Dimensions,StyleSheet,
//   } from 'react-native';

// const styles = StyleSheet.create({
//    mainview:{
//     flex:1
//    },
//    topview:{
//     flex:0.92,
//   },
//   footerview:{
//     flex:0.08,justifyContent:"flex-end",backgroundColor:"transparent"
//   },
//   footerinnerview:{
//       flexDirection: 'row',
//         justifyContent:"space-around",
//         alignItems:"center",
//         height:70,
//         width:windowWidth,
//         backgroundColor: 'white',
//         borderWidth: 1,
//         borderColor: 'lightgrey',
//         borderTopRightRadius: 30,
//         borderTopLeftRadius: 30
//   },
//   footericon:{
//     width:30,height:30
//   }
// })
// export default styles;
