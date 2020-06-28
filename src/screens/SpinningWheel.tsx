import React from 'react';
import { Dimensions, SafeAreaView } from 'react-native';
import styled from 'styled-components/native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import useGetWheelSvg from '../hooks/useGetWheelSvg';

// import runSpring from '../utils/runSpring';

const { width } = Dimensions.get('window');
const numberOfSegments = 20;
const oneTurn = 360;
const angleBySegment = oneTurn / numberOfSegments;
const angleOffset = angleBySegment / 2;

const { event, Value, block, cond, eq, set, add, or, divide } = Animated;

const SpinningWheel = () => {
  const state = new Value(State.UNDETERMINED);
  const translationY = new Value(0);
  const rotation = new Value(0);
  const rotationOffset = new Value(0);

  const [renderWheel, renderMarker] = useGetWheelSvg();

  const handleEvent = event([
    {
      nativeEvent: {
        state,
        translationY,
      },
    },
  ]);

  const rotate = block([
    cond(
      or(eq(state, State.BEGAN), eq(state, State.ACTIVE)),
      set(rotation, add(rotationOffset, divide(translationY, -oneTurn))),
      set(rotationOffset, rotation),
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
            }}>
            <Animated.View
              style={{
                left: width / 2,
                transform: [
                  {
                    rotate,
                  },
                ],
              }}>
              {renderWheel}
            </Animated.View>
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
