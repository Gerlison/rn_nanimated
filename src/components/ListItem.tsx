import React, { useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, { Easing } from 'react-native-reanimated';
import { TapGestureHandler, State } from 'react-native-gesture-handler';

const {
  Value,
  event,
  cond,
  eq,
  set,
  block,
  and,
  neq,
  startClock,
  timing,
  interpolate,
  stopClock,
  Extrapolate,
  Clock,
} = Animated;

const runTiming = (clock, gestureState) => {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0),
  };

  const config = {
    duration: 300,
    toValue: new Value(0),
    easing: Easing.inOut(Easing.ease),
  };

  return block([
    cond(and(eq(gestureState, State.BEGAN), neq(config.toValue, 1)), [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.frameTime, 0),
      set(config.toValue, 1),
      startClock(clock),
    ]),
    cond(and(eq(gestureState, State.END), neq(config.toValue, 0)), [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.frameTime, 0),
      set(config.toValue, 0),
      startClock(clock),
    ]),
    timing(clock, state, config),
    cond(state.finished, stopClock(clock)),
    interpolate(state.position, {
      inputRange: [0, 0.5, 1],
      outputRange: [1, 0.96, 0.95],
      extrapolate: Extrapolate.CLAMP,
    }),
  ]);
};

const ListItem = () => {
  const state = new Value(State.UNDETERMINED);
  const clock = new Clock();

  const onGestureEvent = event([
    {
      nativeEvent: {
        state,
      },
    },
  ]);

  const buttonScale = runTiming(clock, state);

  return (
    <TapGestureHandler onHandlerStateChange={onGestureEvent}>
      <Animated.View
        style={[
          styles.container,
          { transform: [{ scale: (buttonScale as unknown) as number }] },
        ]}>
        <Text>teste</Text>
      </Animated.View>
    </TapGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    justifyContent: 'center',
    padding: 16,
    margin: 16,
    borderRadius: 10,

    elevation: 3,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,

    backgroundColor: '#fff',
  },
});

export default ListItem;
