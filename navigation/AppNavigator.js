import React, { useEffect } from "react";
import { NavigationContainer } from '@react-navigation/native';

import MainNavigator from "./MainNavigator";
import AuthScreen from "../screens/AuthScreen";
import { useSelector } from "react-redux";
import StartUpScreen from "../screens/StartUpScreen";
import { useState } from "react";
import Onboarding from "react-native-onboarding-swiper";
import { Image, Text, TouchableOpacity, View } from "react-native";
import LottieView from "lottie-react-native";
import OnboardingScreen from "../screens/OnboardingScreen";
import { getItem, setItem } from "../utils/async";

const AppNavigator = (props) => {

  const isAuth = useSelector(state => state.auth.token !== null && state.auth.token !== "");
  const doneOnboarding = useSelector(state => state.auth.token !== null && state.auth.token !== "");
  const didTryAutoLogin = useSelector(state => state.auth.didTryAutoLogin);
  const firstLaunch = useSelector(state => state.auth.firstLaunch);

  return (
    <NavigationContainer>
      {!firstLaunch && <OnboardingScreen/>}
      {firstLaunch && isAuth && <MainNavigator/>}
      {firstLaunch && !isAuth && didTryAutoLogin && <AuthScreen />}
      {firstLaunch && !isAuth && !didTryAutoLogin && <StartUpScreen />}
    </NavigationContainer>
  );
};

export default AppNavigator;