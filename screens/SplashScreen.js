import React from 'react';
import { View, Text, Image, ImageBackground } from 'react-native';
import LottieView from 'lottie-react-native';
import loadingAnimation from '../assets/lottie/startUp.json';

import backgroundImage from "../assets/images/SplashScreen.png";
import logo from "../assets/images/logo-no-white.png";
import { StyleSheet } from 'react-native-web';

const SplashScreen = () => {
  console.log('SplashScreen rendered');
  return (
    <ImageBackground 
      source={backgroundImage} 
      style={{flex: 1, width:'100%', height:'100%'}}
      imageStyle={{resizeMode: "contain", height:'120%', width:'120%', marginLeft: '-10%',}}>

      <View style={styles.container} >
        <Image style={styles.image} source={logo} resizeMode='contain' />

        <View style={styles.loader}>
          <LottieView style={{width:'100%', height:'100%'}} source={loadingAnimation} autoPlay loop /> 
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '60%',
    marginTop:'50%',
    marginLeft: '20%'
  },
  image: {
    width: '100%',
    resizeMode:'contain',
    height:225,
  },
  loader: {
    width: '30%', 
    height: '30%', 
    marginLeft:'20%',
    marginTop:'20%'
  }
})

export default SplashScreen;