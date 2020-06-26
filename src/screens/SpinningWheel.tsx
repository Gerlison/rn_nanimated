import React from 'react';
import { Dimensions, SafeAreaView } from 'react-native';
import styled from 'styled-components/native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import useGetWheelSvg from '../hooks/useGetWheelSvg';

import runSpring from '../utils/runSpring';

const { width } = Dimensions.get('window');
const numberOfSegments = 20;
const oneTurn = 360;
const angleBySegment = oneTurn / numberOfSegments;
const angleOffset = angleBySegment / 2;

const {
  event,
  Value,
  Clock,
  block,
  cond,
  eq,
  set,
  add,
  or,
  interpolate,
  divide,
  stopClock,
} = Animated;

const SpinningWheel = () => {
  const clock = new Clock();
  const state = new Value(State.UNDETERMINED);
  const translationY = new Value(0);
  const velocityY = new Value(0);
  const position = new Value(0);
  const offset = new Value(0);

  const [renderWheel, renderMarker] = useGetWheelSvg();

  const handleEvent = event([
    {
      nativeEvent: {
        state,
        translationY,
        velocityY,
      },
    },
  ]);

  const currentRotation = block([
    cond(
      or(eq(state, State.BEGAN), eq(state, State.ACTIVE)),
      [
        stopClock(clock),
        set(offset, add(position, divide(translationY, -oneTurn))),
      ],
      set(position, runSpring(clock, position, offset)),
    ),
  ]);

  return (
    <>
      <SafeAreaView style={{ backgroundColor: '#008b8b' }} />
      <StyledContainer>
        <PanGestureHandler
          onGestureEvent={handleEvent}
          onHandlerStateChange={handleEvent}>
          <Animated.View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              left: width / 2,
              transform: [
                {
                  rotate: interpolate(currentRotation, {
                    inputRange: [-oneTurn, 0, oneTurn],
                    outputRange: [-oneTurn, 0, oneTurn],
                  }),
                },
              ],
            }}>
            {renderWheel}
          </Animated.View>
        </PanGestureHandler>
        {renderMarker}
      </StyledContainer>
    </>
  );
};

const StyledContainer = styled.View`
  flex: 1;
  background-color: #008b8b;
`;

export default SpinningWheel;
