import React from 'react';
import { View, Text, Image } from 'react-native';
import LottieView from 'lottie-react-native';
import loadingAnimation from '../assets/lottie/startUp.json';

import logo from "../assets/images/logo-no-white.png";
import { StyleSheet } from 'react-native-web';

const SplashScreen = () => {
  console.log('SplashScreen rendered');
  return (
    <ImageBackground source={backgroundImage} 
      style={styles.backgroundImage}
      imageStyle={{resizeMode: "contain",  marginLeft: -120, marginTop:-200, width:'120%',
      height:'120%'}}>
      <Image style={styles.image} source={logo} resizeMode='contain' />
      <View style={{width: 100, height: 100, backgroundColor:'blue', alignContent: 'center'}}>
        <LottieView source={loadingAnimation} autoPlay loop /> 
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '65%',
    resizeMode:'contain',
    height:225,
    marginTop:50,
  },
})

export default SplashScreen;