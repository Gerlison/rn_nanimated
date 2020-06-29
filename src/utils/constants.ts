import { Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

export const SPINNING_WHEEL = {
  wheelSize: width * 1.96,
  numberOfSegments: 40,
  fontSize: 18,
  oneTurn: 360,
  translationDeceleration: -0.375,

  get angleBySegment() {
    return this.oneTurn / this.numberOfSegments;
  },
  get angleOffset() {
    return this.angleBySegment / 2;
  },
};
