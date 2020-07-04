import React from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import Animated from 'react-native-reanimated';
const { interpolate } = Animated;

interface Props {
  animX: Animated.Node<number>;
  animScale: Animated.Node<number>;
}

const Card = ({ animX, animScale }: Props) => {
  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { scale: (animScale as unknown) as number },
            { translateX: (animX as unknown) as number },
          ],
        },
      ]}>
      <Animated.View
        style={{
          flex: 1,
          opacity: (interpolate(animScale, {
            inputRange: [0.8, 1],
            outputRange: [0, 1],
          }) as unknown) as number,
          transform: [
            {
              translateY: (interpolate(animX, {
                inputRange: [0, 500],
                outputRange: [0, 50],
              }) as unknown) as number,
            },
          ],
        }}>
        <Text style={styles.title}>Hello World</Text>
        <FlatList
          keyExtractor={(_, index) => index.toString()}
          data={new Array(6).fill({})}
          renderItem={({ index }) => (
            <View
              style={[
                styles.smallCard,
                index % 2 !== 0 && { backgroundColor: '#dddeee' },
              ]}
            />
          )}
        />
        <View style={styles.footer}>
          <Text style={styles.signature}>By Gerlison</Text>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...(StyleSheet.absoluteFill as object),
    backgroundColor: 'black',
  },
  title: {
    fontSize: 24,
    margin: 24,
    color: '#fff',
  },
  smallCard: {
    flex: 1,
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 5,
    elevation: 3,
    margin: 16,
  },
  footer: {
    padding: 24,
  },
  signature: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Card;
