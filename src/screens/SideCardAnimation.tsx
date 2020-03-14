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
const {
  Value,
  Clock,
  startClock,
  stopClock,
  clockRunning,
  event,
  cond,
  eq,
  set,
  add,
  interpolate,
  Extrapolate,
  spring,
  block,
  greaterThan,
  or,
} = Animated;

const { width: windowWidth } = Dimensions.get('window');
const CARD_INITIAL_POSITION = windowWidth + 30;

function runSring(
  clock: Animated.Clock,
  value: Animated.Value<number>,
  dest: Animated.Node<number>,
) {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    velocity: new Value(0),
  };

  const config = {
    damping: 800,
    mass: 1,
    stiffness: 500,
    overshootClamping: true,
    restSpeedThreshold: 0.01,
    restDisplacementThreshold: 0.01,
    toValue: new Value(0),
  };

  return block([
    cond(clockRunning(clock), set(config.toValue, dest), [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.position, value),
      set(config.toValue, dest),
      startClock(clock),
    ]),
    spring(clock, state, config),
    cond(state.finished, stopClock(clock)),
    state.position,
  ]);
}

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
      [set(position, runSring(clock, offset, snapPoint))],
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
