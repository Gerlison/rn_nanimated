import React, { useState, useRef } from 'react';
import { Dimensions } from 'react-native';
import styled from 'styled-components/native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import useGetWheelSvg from '../hooks/useGetWheelSvg';

import runSpring from '../utils/runSpring';
import { SPINNING_WHEEL } from '../utils/constants';

const { width } = Dimensions.get('window');
const {
  oneTurn,
  angleBySegment,
  translationDeceleration,
  angleOffset,
} = SPINNING_WHEEL;

const {
  event,
  Value,
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
  const clock = useRef(new Clock()).current;
  const state = useRef(new Value(State.UNDETERMINED)).current;
  const translationY = useRef(new Value(0)).current;
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
    const newOffset = (Math.round(rotationNumber / angleBySegment) *
      angleBySegment) as Animated.Adaptable<0>;

    snapOffset.setValue(newOffset);
    canUpdateIndex.setValue(0);

    const currentRotatedAngle = Math.abs(
      rotationNumber < 0
        ? Math.round(rotationNumber % oneTurn)
        : Math.abs(Math.round(rotationNumber % oneTurn)) - oneTurn,
    );

    let index = Math.floor(
      (currentRotatedAngle + angleOffset) / angleBySegment,
    );

    // Condiders last offset as part of the first item
    if (currentRotatedAngle >= oneTurn - angleOffset) {
      index = 0;
    }

    setItem(getSelectedItem(index));
  };

  useCode(
    () =>
      set(
        rotate,
        cond(
          or(eq(state, State.BEGAN), eq(state, State.ACTIVE)),
          [
            stopClock(clock),
            set(canUpdateIndex, 1),
            add(
              rotationOffset,
              multiply(translationY, translationDeceleration),
            ),
          ],
          set(rotationOffset, runSpring(clock, rotate, snapOffset)),
        ),
      ),
    [],
  );

  useCode(
    () =>
      cond(
        and(eq(state, State.END), eq(canUpdateIndex, 1)),
        call([rotate], getIndex),
      ),
    [],
  );

  return (
    <>
      <StyledSafeArea />
      <StyledContainer>
        <PanGestureHandler
          onGestureEvent={handleEvent}
          onHandlerStateChange={handleEvent}>
          <StyledGestureContainer>
            <Animated.View
              style={{
                left: width / 2,
                transform: [
                  {
                    rotate: (concat(rotate, 'deg') as unknown) as string,
                  },
                ],
              }}>
              {renderWheel}
            </Animated.View>
          </StyledGestureContainer>
        </PanGestureHandler>
        {renderMarker}
        <StyledText>Value: {item.value}</StyledText>
      </StyledContainer>
    </>
  );
};

const StyledContainer = styled.View`
  flex: 1;
  background-color: #008b8b;
`;

const StyledSafeArea = styled.SafeAreaView`
  background-color: #008b8b;
`;

const StyledGestureContainer = styled(Animated.View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const StyledText = styled.Text`
  position: absolute;
  bottom: 50px;
  left: 50px;
  color: white;
  font-size: 22px;
`;

export default SpinningWheel;
