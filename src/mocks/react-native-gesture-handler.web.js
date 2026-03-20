import React from 'react';
import {
  FlatList,
  ScrollView,
  Switch,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

const createPassthrough = (Component = View) =>
  React.forwardRef(({ children, ...props }, ref) =>
    React.createElement(Component, { ...props, ref }, children),
  );

const GestureHandlerRootView = createPassthrough(View);
const PanGestureHandler = createPassthrough(View);
const TapGestureHandler = createPassthrough(View);
const LongPressGestureHandler = createPassthrough(View);
const FlingGestureHandler = createPassthrough(View);
const ForceTouchGestureHandler = createPassthrough(View);
const PinchGestureHandler = createPassthrough(View);
const RotationGestureHandler = createPassthrough(View);
const NativeViewGestureHandler = createPassthrough(View);
const DrawerLayout = createPassthrough(View);

const gestureHandlerRootHOC = (Component) => Component;
const createNativeWrapper = (Component) => Component;

const State = {
  UNDETERMINED: 0,
  FAILED: 1,
  BEGAN: 2,
  CANCELLED: 3,
  ACTIVE: 4,
  END: 5,
};

const Directions = {
  RIGHT: 1,
  LEFT: 2,
  UP: 4,
  DOWN: 8,
};

const gestureHandlerWeb = {};

export {
  Directions,
  DrawerLayout,
  FlatList,
  FlingGestureHandler,
  ForceTouchGestureHandler,
  GestureHandlerRootView,
  LongPressGestureHandler,
  NativeViewGestureHandler,
  PanGestureHandler,
  PinchGestureHandler,
  RotationGestureHandler,
  ScrollView,
  State,
  Switch,
  TapGestureHandler,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  createNativeWrapper,
  gestureHandlerRootHOC,
};

export default gestureHandlerWeb;
