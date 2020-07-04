import React from 'react';
import {
  Dimensions,
  StyleSheet,
  StatusBar,
  Text,
  Image,
  View,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { State, PanGestureHandler } from 'react-native-gesture-handler';

import Card from '../components/Card';

import runSpring from '../utils/runSpring';

const {
  Value,
  Clock,
  stopClock,
  event,
  cond,
  eq,
  set,
  add,
  interpolate,
  Extrapolate,
  block,
  greaterThan,
  or,
} = Animated;

const { width: windowWidth } = Dimensions.get('window');
const CARD_INITIAL_POSITION = windowWidth + 30;

const SideCardAnimation = () => {
  const clock = new Clock();
  const state = new Value(State.UNDETERMINED);
  const translationX = new Value(0);
  const velocity = new Value(0);
  const position = new Value(CARD_INITIAL_POSITION);
  const offset = new Value(CARD_INITIAL_POSITION);

  const snapPoint = block([
    cond(
      greaterThan(offset, CARD_INITIAL_POSITION / 2),
      CARD_INITIAL_POSITION,
      0,
    ),
  ]);

  const currentX = block([
    cond(
      or(eq(state, State.BEGAN), eq(state, State.ACTIVE)),
      [stopClock(clock), set(offset, add(position, translationX))],
      [set(position, runSpring(clock, offset, snapPoint))],
    ),
  ]);

  const handleEvent = event([
    {
      nativeEvent: {
        state,
        translationX,
        velocityX: velocity,
      },
    },
  ]);

  const animX = interpolate(currentX, {
    inputRange: [-10, 0, CARD_INITIAL_POSITION],
    outputRange: [-5, 0, CARD_INITIAL_POSITION],
    extrapolate: Extrapolate.CLAMP,
  });

  const animScale = interpolate(currentX, {
    inputRange: [-100, 0, CARD_INITIAL_POSITION],
    outputRange: [0.98, 1, 0.8],
    extrapolate: Extrapolate.CLAMP,
  });

  return (
    <PanGestureHandler
      onGestureEvent={handleEvent}
      onHandlerStateChange={handleEvent}>
      <Animated.View style={styles.container}>
        <StatusBar backgroundColor="black" barStyle="light-content" />
        <Image style={styles.image} source={require('../assets/logo.png')} />
        <View>
          <Text style={styles.title}>Wellcome</Text>
          <Text style={styles.text}>
            React Native's Animated library reimplemented. Native Performance:
            Declare your animations in JS, but have them run on the native
            thread! 🧙‍♂️
          </Text>
        </View>
        <Card {...{ animX, animScale }} />
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
  },
  text: {
    fontSize: 18,
    marginTop: 32,
    color: '#393939',
  },
  image: {
    alignSelf: 'center',
    width: 300,
    height: 300,
  },
});

export default SideCardAnimation;
