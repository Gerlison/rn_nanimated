import React, { useMemo } from 'react';
import { Dimensions } from 'react-native';

import * as d3Shape from 'd3-shape';
import Svg, { Path, G, Text, Circle, Polygon } from 'react-native-svg';

import { SPINNING_WHEEL } from '../utils/constants';

const { width } = Dimensions.get('window');
const {
  wheelSize,
  numberOfSegments,
  fontSize,
  oneTurn,
  angleBySegment,
  angleOffset,
} = SPINNING_WHEEL;

const makeWheel = () => {
  const data: number[] = new Array(numberOfSegments).fill(1);
  const arcs = d3Shape.pie()(data);

  return arcs.map((arc, _index) => {
    const instance = d3Shape
      .arc()
      .padAngle(0.001)
      .outerRadius(width)
      .innerRadius(width / 2);

    return {
      path: instance(arc),
      color: '#333',
      value: _index,
      centroid: instance.centroid(arc),
    };
  });
};

const useGetWheelSvg = () => {
  const wheelPaths = makeWheel();

  const renderMarker = useMemo(
    () => (
      <Svg
        style={{
          position: 'absolute',
          top: '50%',
          transform: [{ translateY: -width }],
        }}
        width={wheelSize}
        height={wheelSize}>
        <Circle fill="#eee" r={width / 2} cx={width} cy={width} />
        <Polygon
          points={`
            ${width / 2 - 25},${width}
            ${width / 2 + 25},${width - 50}
            ${width / 2 + 25},${width + 50}
          `}
          fill="#eee"
        />
      </Svg>
    ),
    [],
  );

  const renderWheel = useMemo(
    () => (
      <Svg
        width={wheelSize}
        height={wheelSize}
        viewBox={`0 0 ${width * 2} ${width * 2}`}
        style={{
          transform: [{ rotate: `${-(90 + angleOffset)}deg` }],
        }}>
        <G y={width} x={width}>
          {wheelPaths.map((arc, i) => {
            const [x, y] = arc.centroid;
            const number = arc.value.toString();

            return (
              <G key={`arc-${i}`}>
                <Path d={arc.path} fill={arc.color} />
                <G
                  rotation={(i * oneTurn) / numberOfSegments + angleOffset}
                  origin={`${x}, ${y}`}>
                  <G origin={`${x}, ${y - 70}`} rotation={90}>
                    <Text
                      x={x + 20}
                      y={y - 60}
                      fill="white"
                      textAnchor="middle"
                      fontSize={fontSize}>
                      GM-{number}
                    </Text>
                  </G>
                </G>
              </G>
            );
          })}
        </G>
      </Svg>
    ),
    [],
  );

  const getSelectedItem = (
    index: number,
  ): {
    path: any;
    color: string;
    value: number;
    centroid: [number, number];
  } => {
    return wheelPaths[index];
  };

  return [renderWheel, renderMarker, getSelectedItem];
};

export default useGetWheelSvg;
