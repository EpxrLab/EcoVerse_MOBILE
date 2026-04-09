import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";

/**
 * A reusable component to replace MotiView for simple entry animations.
 * Supports: fade-in, scale-in, and slide-in (Y axis).
 */
export const FadeInView = ({
  children,
  style,
  from = { opacity: 0, translateY: 10, scale: 1 },
  animate = { opacity: 1, translateY: 0, scale: 1 },
  transition = { type: "timing", duration: 300, delay: 0 },
  ...props
}) => {
  const opacityAnim = useRef(new Animated.Value(from.opacity ?? 0)).current;
  const translateYAnim = useRef(new Animated.Value(from.translateY ?? 0)).current;
  const translateXAnim = useRef(new Animated.Value(from.translateX ?? 0)).current;
  const scaleAnim = useRef(new Animated.Value(from.scale ?? 1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current; // For rotate, we interpolate

  useEffect(() => {
    // Determine rotate values
    const fromRotate = from.rotate ? parseFloat(from.rotate) : 0;
    const toRotate = animate.rotate ? parseFloat(animate.rotate) : 0;
    rotateAnim.setValue(fromRotate);

    const animations = [
      Animated.timing(opacityAnim, {
        toValue: animate.opacity ?? 1,
        duration: transition.duration ?? 300,
        delay: transition.delay ?? 0,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: animate.translateY ?? 0,
        duration: transition.duration ?? 300,
        delay: transition.delay ?? 0,
        useNativeDriver: true,
      }),
      Animated.timing(translateXAnim, {
        toValue: animate.translateX ?? 0,
        duration: transition.duration ?? 300,
        delay: transition.delay ?? 0,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: animate.scale ?? 1,
        duration: transition.duration ?? 300,
        delay: transition.delay ?? 0,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: toRotate,
        duration: transition.duration ?? 300,
        delay: transition.delay ?? 0,
        useNativeDriver: true,
      }),
    ];

    Animated.parallel(animations).start();
  }, [
    animate.opacity,
    animate.translateY,
    animate.translateX,
    animate.scale,
    animate.rotate,
    transition.duration,
    transition.delay,
  ]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: opacityAnim,
          transform: [
            { translateY: translateYAnim },
            { translateX: translateXAnim },
            { scale: scaleAnim },
            {
              rotate: rotateAnim.interpolate({
                inputRange: [-360, 360],
                outputRange: ["-360deg", "360deg"],
              }),
            },
          ],
        },
      ]}
      {...props}
    >
      {children}
    </Animated.View>
  );
};
