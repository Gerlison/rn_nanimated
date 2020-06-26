import React, { useMemo, useRef } from 'react';
import { Dimensions, SafeAreaView } from 'react-native';
import styled from 'styled-components/native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import useGetWheelSvg from '../hooks/useGetWheelSvg';

const { width } = Dimensions.get('window');
const wheelSize = width * 1.96;
const numberOfSegments = 20;
const fontSize = 18;
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
  stopClock,
  set,
  add,
  or,
  interpolate,
  divide,
} = Animated;

const SpinningWheel = () => {
  const clock = new Clock();
  const state = new Value(State.UNDETERMINED);
  const translationY = new Value(0);
  const velocityY = new Value(0);
  const position = new Value(angleOffset);
  const offset = new Value(angleOffset);

  const [renderWheel, renderMarker] = useGetWheelSvg();

  // const handlePan = ({ nativeEvent }: PanGestureHandlerStateChangeEvent) => {
  //   const { velocityY, state, translationY } = nativeEvent;

  //   if (state === State.ACTIVE) {
  //     animAngle.setValue(translationY);
  //   }

  //   if (state === State.END) {
  //     Animated.decay(animAngle, {
  //       velocity: -velocityY / 10000,
  //       deceleration: 0.999,
  //       useNativeDriver: true,
  //     }).start();
  //   }
  // };

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
    cond(or(eq(state, State.BEGAN), eq(state, State.ACTIVE)), [
      stopClock(clock),
      set(offset, add(position, translationY)),
    ]),
  ]);

  return (
    <>
      <SafeAreaView style={{ backgroundColor: '#008b8b' }} />
      <StyledContainer>
        <PanGestureHandler onHandlerStateChange={handleEvent}>
          <Animated.View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              left: width / 2,
              transform: [
                {
                  translateY: interpolate(currentRotation, {
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
