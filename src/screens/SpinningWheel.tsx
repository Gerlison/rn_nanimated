import React, { useState, useRef } from 'react';
import { Dimensions, SafeAreaView, Text } from 'react-native';
import styled from 'styled-components/native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import useGetWheelSvg from '../hooks/useGetWheelSvg';

import runSpring from '../utils/runSpring';
import { SPINNING_WHEEL } from '../utils/constants';

const { width } = Dimensions.get('window');
const {
  wheelSize,
  numberOfSegments,
  fontSize,
  oneTurn,
  angleBySegment,
  angleOffset,
  translationDeceleration,
} = SPINNING_WHEEL;

const {
  event,
  Value,
  block,
  cond,
  eq,
  set,
  add,
  or,
  multiply,
  concat,
  useCode,
  Clock,
  call,
  stopClock,
  and,
} = Animated;

const SpinningWheel = () => {
  const clock = new Clock();
  const state = useRef(new Value(State.UNDETERMINED)).current;
  const translationY = useRef(new Value(0)).current;
  const rotation = useRef(new Value(0)).current;
  const rotationOffset = useRef(new Value(0)).current;
  const snapOffset = useRef(new Value(0)).current;
  const rotate = useRef(new Value(0)).current;
  const canUpdateIndex = useRef(new Value(0)).current;

  const [renderWheel, renderMarker, getSelectedItem] = useGetWheelSvg();

  const [item, setItem] = useState(getSelectedItem(0));

  const handleEvent = event([
    {
      nativeEvent: {
        state,
        translationY,
      },
    },
  ]);

  const getIndex = ([rotationNumber]) => {
    snapOffset.setValue(
      Math.round(rotationNumber / angleBySegment) * angleBySegment,
    );
    canUpdateIndex.setValue(0);

    const currentRotatedAngle = Math.abs(
      rotationNumber < 0
        ? Math.round(rotationNumber % oneTurn)
        : Math.abs(Math.round(rotationNumber % oneTurn)) - oneTurn,
    );

    let index = Math.floor(
      (currentRotatedAngle + angleBySegment / 2) / angleBySegment,
    );

    // Condiders last offset as part of the first item
    if (currentRotatedAngle >= oneTurn - angleBySegment / 2) {
      index = 0;
    }

    setItem(getSelectedItem(index));
  };

  useCode(
    () =>
      block([
        set(
          rotate,
          block([
            cond(
              or(eq(state, State.BEGAN), eq(state, State.ACTIVE)),
              [
                stopClock(clock),
                set(canUpdateIndex, 1),
                set(
                  rotation,
                  add(
                    rotationOffset,
                    multiply(translationY, translationDeceleration),
                  ),
                ),
              ],
              set(rotationOffset, runSpring(clock, rotate, snapOffset)),
            ),
          ]),
        ),
      ]),
    [rotate, state, rotationOffset, rotation],
  );

  useCode(
    () =>
      cond(
        and(eq(state, State.END), eq(canUpdateIndex, 1)),
        call([rotate], getIndex),
      ),
    [rotate, state],
  );

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
                    rotate: concat(rotate, 'deg'),
                  },
                ],
              }}>
              {renderWheel}
            </Animated.View>
          </Animated.View>
        </PanGestureHandler>
        {renderMarker}
        <Text
          style={{
            position: 'absolute',
            bottom: 50,
            left: 50,
            color: 'white',
            fontSize: 22,
          }}>
          Value: {item && item.value}
        </Text>
      </StyledContainer>
    </>
  );
};

const StyledContainer = styled.View`
  flex: 1;
  background-color: #008b8b;
`;

export default SpinningWheel;
