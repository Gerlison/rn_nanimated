import React from 'react';
import { Dimensions, View, StyleSheet } from 'react-native';
import Animated, {
  block,
  lessOrEq,
  useCode,
  greaterThan,
} from 'react-native-reanimated';
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
  neq,
} = Animated;
const { width: windowWidth } = Dimensions.get('window');
const CARD_INITIAL_POSITION = windowWidth * 1.1;

function runSpring(
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
    mass: 0.5,
    stiffness: 200,
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

const useDragging = (
  state: Animated.Value<State>,
  offsetX: Animated.Value<number>,
  translationX: Animated.Value<number>,
  position: Animated.Value<number>,
) =>
  block([
    cond(eq(state, State.ACTIVE), add(offsetX, translationX), [
      set(position, add(offsetX, translationX)),
      cond(
        greaterThan(add(offsetX, translationX), CARD_INITIAL_POSITION / 2),
        set(offsetX, CARD_INITIAL_POSITION),
        set(offsetX, 0),
      ),
    ]),
  ]);

const SideCardAnimation = () => {
  const clock = new Clock();
  const state = new Value(State.UNDETERMINED);
  const translationX = new Value(0);
  const position = new Value(CARD_INITIAL_POSITION);
  const offsetX = new Value(CARD_INITIAL_POSITION);

  const handleEvent = event([
    {
      nativeEvent: {
        state,
        translationX,
      },
    },
  ]);

  let animX = block([
    runSpring(clock, position, offsetX),
    useDragging(state, offsetX, translationX, position),
  ]);

  const animScale = interpolate(animX, {
    inputRange: [0, CARD_INITIAL_POSITION],
    outputRange: [1, 0.7],
    extrapolate: Extrapolate.CLAMP,
  });

  return (
    <PanGestureHandler
      onGestureEvent={handleEvent}
      onHandlerStateChange={handleEvent}>
      <Animated.View style={styles.container}>
        <Card {...{ animX, animScale }} />
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SideCardAnimation;
