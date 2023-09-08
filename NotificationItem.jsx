import {  Dimensions, Pressable} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Text } from '@app/hooks/theme/Themed';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { interpolate, runOnJS, useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming } from 'react-native-reanimated';



const NotificationItem = ({ notification, removeNotification}) => {
    const offsetX = useSharedValue(0);
    const startX = useSharedValue(0);
    const hasReachedThreshold = useSharedValue(false);
    const windowWidth = Dimensions.get('window').width;
    const threshold = windowWidth / 3;
    const animHeight = useSharedValue(65);
    const deleteAnimTextOpacity = useSharedValue(1);
  
    const animatedStyles = useAnimatedStyle(() => {
      return {
        flexDirection: 'row',
        alignItems: 'center',
        transform: [
          { translateX: offsetX.value },
        ],
        width: '100%',
        height: animHeight.value,
      };
    });
  
  
    const deleteAnimStyle = useAnimatedStyle(() => {
      const deleteOpacity = interpolate(offsetX.value, [-threshold, 0], [1, 0], 'clamp');
      return {
        position: 'absolute',
        right: -windowWidth,
        top: 0,
        bottom: 0,
        backgroundColor: 'red',
        width: windowWidth,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingHorizontal: 30,
        opacity: deleteOpacity
      };
    });
  
    const deleteAnimTextStyle = useAnimatedStyle(() => {
      return {
        flexDirection: 'row',
        alignItems: 'center',
        opacity: deleteAnimTextOpacity.value
      };
    });
  
  
    const panGesture = Gesture.Pan()
      .onUpdate((e) => {
        if (offsetX.value <= -threshold) {
          if (hasReachedThreshold.value === false) {
            runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
            hasReachedThreshold.value = true;
          }
        } else {
          hasReachedThreshold.value = false;
        }
        offsetX.value = e.translationX + startX.value;
      })
      .onEnd(() => {
        if (!hasReachedThreshold.value) {
          offsetX.value = withSpring(0, {
            damping: 20,
            stiffness: 150,
            mass: 0.5
          });
          startX.value = 0;
        } else {
          offsetX.value = withSpring(-windowWidth + 20, {
            damping: 30,
            stiffness: 120,
            mass: 0.2
          });
          runOnJS(removeNotification)(notification.id);
          animHeight.value = withDelay(300, withTiming(0, { duration: 100 }));
          deleteAnimTextOpacity.value = withDelay(300, withTiming(0, { duration: 100 }));
        }
      })
      .activeOffsetX([-20, 20]);

    return (
      <GestureDetector
        gesture={panGesture}>
        <Animated.View
          style={animatedStyles}>
          <Pressable
            onPress={()=>{}} //navigate to notification?
            style={{ width: '100%', height: 65, justifyContent: 'center',flexDirection:'row',alignItems:'center' }}
        >
                <Text>Placeholder title</Text>
                <Text>Placeholder body</Text>
          </Pressable>
          <Animated.View style={deleteAnimStyle}>
            <Animated.View style={deleteAnimTextStyle}>
              <Text>Delete</Text>
            </Animated.View>
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    );
  };
  export default NotificationItem
