import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import styles from '@/app/res/styles/chatbotStyles'; 

const TypingIndicator = () => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateDot = (dot: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(dot, {
            toValue: -10,
            duration: 300,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animateDot(dot1, 0);
    animateDot(dot2, 150);
    animateDot(dot3, 300);
  }, [dot1, dot2, dot3]);

  return (
    <View style={styles.typingIndicatorContainer}>
      <Animated.View style={[styles.typingIndicatorDot, { transform: [{ translateY: dot1 }] }]} />
      <Animated.View style={[styles.typingIndicatorDot, { transform: [{ translateY: dot2 }] }]} />
      <Animated.View style={[styles.typingIndicatorDot, { transform: [{ translateY: dot3 }] }]} />
    </View>
  );
};

export default TypingIndicator;