import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Animated from 'react-native-reanimated';

const { width: windowWidth } = Dimensions.get('window');

interface Props {
  animX: Animated.Value<number>;
  animScale: Animated.Value<number>;
}

const Card = ({ animX, animScale }) => {
  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ scale: animScale }, { translateX: animX }] },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    borderRadius: 10,
    backgroundColor: '#ccc',
  },
});

export default Card;
