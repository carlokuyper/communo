import React from "react";
import { NavigationContainer } from '@react-navigation/native';

import MainNavigator from "./MainNavigator";
import AuthScreen from "../screens/AuthScreen";
import { useSelector } from "react-redux";
import StartUpScreen from "../screens/StartUpScreen";
import { useState } from "react";
import { useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage'
import OnboardingScreen from "../screens/OnboardingScreen";
import Onboarding from "react-native-onboarding-swiper";
import { Image } from "react-native";
import LottieView from "lottie-react-native";

const AppNavigator = (props) => {

  const isAuth = useSelector(state => state.auth.token !== null && state.auth.token !== "");
  const didTryAutoLogin = useSelector(state => state.auth.didTryAutoLogin);

  const [isFirstLaunch, setIsFirstLaunch] = useState(false)

  const Simple = () => (

    <Onboarding
      onDone={() =>  setIsFirstLaunch(true) + console.log('done')}
  
      pages={[
        {
          backgroundColor: '#fff',
          image: <LottieView source={require('../assets/lottie/animation_llcdd350.json')} autoPlay loop />,
          title: 'Welcome To Comuno',
          subtitle: 'Comuno is a realtime chat app, designed to help you communicate more efficiently. Comuno utiluzes AI to breakdown a message to explain how a user will interperate it, as well as assiging an emotion to the message.',
        },
        {
          backgroundColor: '#fe6e58',
          image: <Image  source={require('../assets/images/logo.png')} />,
          title: 'The Title',
          subtitle: 'This is the subtitle that sumplements the title.',
        },
        {
          backgroundColor: '#999',
          image: <Image source={require('../assets/images/logo.png')} />,
          title: 'Triangle',
          subtitle: "Beautiful, isn't it?",
        },
      ]}
    />
  );

  return (
    <NavigationContainer>
      {!isFirstLaunch && <Simple/>}
      {isFirstLaunch && isAuth && <MainNavigator/>}
      {isFirstLaunch && !isAuth && didTryAutoLogin && <AuthScreen />}
      {isFirstLaunch && !isAuth && !didTryAutoLogin && <StartUpScreen />}
    </NavigationContainer>
  );
};

export default AppNavigator;