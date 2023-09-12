import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const Sample = (props) => {
  let animation = useRef(new Animated.Value(0));
  console.log('propsssss', props);
  const { duration, currentTime } = props;
  const [progress, setProgress] = useState(currentTime);
  useInterval(() => {
    if (progress < duration) {
      setProgress(currentTime);
    }
  }, 1000);

  useEffect(() => {
    Animated.timing(animation.current, {
      toValue: currentTime,
      duration,
    }).start();
  }, [progress]);

  const width = animation.current.interpolate({
    inputRange: [0, duration],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });
  return (
    <View style={styles.container}>
      <Text>Loading…..</Text>
      <View style={styles.progressBar}>
        <Animated.View
          style={
            ([StyleSheet.absoluteFill], { backgroundColor: '#8BED4F', width })
          }
        />
      </View>
      <Text>{`${progress}%`}</Text>
    </View>
  );
};

export default Sample;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  progressBar: {
    flexDirection: 'row',
    height: 20,
    width: '100%',
    backgroundColor: 'white',
    borderColor: '#000',
    borderWidth: 2,
    borderRadius: 5,
  },
});
