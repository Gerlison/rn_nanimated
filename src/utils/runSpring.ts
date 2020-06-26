import Animated from 'react-native-reanimated';

const {
  Value,
  startClock,
  stopClock,
  clockRunning,
  cond,
  set,
  spring,
  block,
} = Animated;

export default function runSring(
  clock: Animated.Clock,
  value: Animated.Value<number>,
  dest: Animated.Node<number>,
  springConfig?: Animated.SpringConfig,
) {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    velocity: new Value(0),
  };

  const config = springConfig || {
    damping: 800,
    mass: 1,
    stiffness: 300,
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
