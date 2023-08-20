import React from "react";

import { View, StyleSheet, StatusBar, Image, Text, TouchableOpacity } from "react-native";
import Onboarding from "react-native-onboarding-swiper";
import LottieView from "lottie-react-native";
import { useState } from "react";
import { useEffect } from "react";
import { getItem, setItem } from "../utils/async";



const OnboardingScreen = () => {
  
    const handleDone = () => {
        // navigation.navigate
        setItem('onboarded', '1');
        console.log("done ");
    }

    
    const StartBtn = ({...props}) => (
        <TouchableOpacity {...props}>
        <Text style={{ width:200, paddingTop:10, paddingBottom:10, borderRadius:20, marginHorizontal:20, marginTop:100, marginRight:'50%', textAlign:'center', color:'#001454', backgroundColor:"white", fontSize:16,}}>Finish</Text>
        </TouchableOpacity>
    )

    const Dots = ({selected}) => {
        let backgroundColor;
        backgroundColor = selected ? '#EFEFEF' : 'rgba(217,217,217,0.5)';
        
        let width;
        width = selected ? 20 : 10;

        return (
        <View
        style={{
            width,
            height: 10,
            marginHorizontal:2,
            backgroundColor,
            borderRadius:5,
        }}
        />
        )
    }

    return (
        <Onboarding

              DoneButtonComponent={StartBtn}
              DotComponent={Dots}

              bottomBarHighlight ={false}
              bottomBarHeight={height=200}
            
            // onDone={() => handleDone}
            onSkip={() => setItem('onboard', false.toString()) + console.log('skiped')}
    
            onDone={() => setItem('onboard', false.toString()) + console.log('done')}
        
            pages={[
                {
                backgroundColor: '#181A20',
                image: <LottieView source={require('../assets/lottie/animation_llcdd350')} autoPlay loop />,
                title: 'Welcome To Comuno',
                subtitle: 'Comuno is a realtime chat app, designed to help you communicate more efficiently. Comuno utiluzes AI to breakdown a message to explain how a user will interperate it, as well as assiging an emotion to the message.',
                },
                {
                backgroundColor: '#181A20',
                image: <Image  source={require('../assets/images/logo.png')} />,
                title: 'The Title',
                subtitle: 'This is the subtitle that sumplements the title.',
                },
                {
                backgroundColor: '#181A20',
                image: <Image source={require('../assets/images/logo.png')} />,
                title: 'Triangle',
                subtitle: "Beautiful, isn't it?",
                },
            ]}
        />
    );
  };
  
  
  
  export default OnboardingScreen;