import React from 'react';
import { Image, View } from 'react-native';

const Loader = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
      }}
    >
      <Image
        source={require('../../assets/images/step-up2.gif')}
        style={{ width: 300, height: 280 }}
      />
    </View>
  );
};
export default Loader;
