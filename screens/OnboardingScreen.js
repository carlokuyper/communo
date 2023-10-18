import React from "react";

import { View, StyleSheet, StatusBar, Image, Text, TouchableOpacity } from "react-native";
import Onboarding from "react-native-onboarding-swiper";
import LottieView from "lottie-react-native";
import { useState } from "react";
import { useEffect } from "react";
import { getItem, setItem } from "../utils/async";
import { useDispatch } from "react-redux";
import { setFirstLaunch } from "../store/authSlice";

const OnboardingScreen = () => {

    const dispatch = useDispatch();
  
    const handleDone = () => {
        console.log("done");
        dispatch(setFirstLaunch());
        return;
    }
    
    const StartBtn = ({...props}) => (
    <TouchableOpacity {...props}>
    <Text style={{ width:200, paddingTop:10, paddingBottom:10, borderRadius:10, marginHorizontal:20, marginTop:100, marginRight:'50%', textAlign:'center', color:'white', backgroundColor:"#181A20", fontSize:16,}}>Finish</Text>
    </TouchableOpacity>
    )
    
    const nxtBtn = ({...props}) => (
    <TouchableOpacity {...props}>
    <Text style={{ width:100, paddingTop:10, paddingBottom:10, borderRadius:10, marginHorizontal:20, marginTop:100, marginRight:'10%', textAlign:'center', color:'white', backgroundColor:"#181A20", fontSize:16,}}>Next</Text>
    </TouchableOpacity>
    )
    const skipBtn = ({...props}) => (
    <TouchableOpacity {...props}>
    <Text style={{ width:100, paddingTop:10, paddingBottom:10, borderRadius:10, marginHorizontal:20, marginTop:100, marginLeft:'10%', textAlign:'center', color:'#181A20', fontSize:16,}}>Skip</Text>
    </TouchableOpacity>
    )

    const Dots = ({selected}) => {
    let backgroundColor;
    backgroundColor = selected ? '#181A20' : 'rgba(24,26,32,0.6)';
    
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
        }}/>
    )}
    
    return (
        <Onboarding
            DoneButtonComponent={StartBtn}
            NextButtonComponent={nxtBtn}
            SkipButtonComponent={skipBtn}
            DotComponent={Dots}

            bottomBarHighlight ={false}
            bottomBarHeight={height=200}
            
            skipToPage={2}
            
            onDone={handleDone}
        
            pages={[
                {
                backgroundColor: 'white',
                image:  <Image source={require('../assets/gif/Loader.gif')} style={{ height: 100, marginTop:-50,   resizeMode: 'contain', aspectRatio: 1, alignSelf: 'center', transform: [{ scale: 3}] }} />,
                title: 'Welcome To Comuno',
                subtitle: 'Comuno is more than just a messaging application; it facilitates seamless and effective communication. Whether youre communicating with friends, family, or coworkers, Comuno equips you with the means to convey yourself eloquently and connect in a meaningful way.'
                },
                {
                backgroundColor: 'white',
                image: <Image source={require('../assets/gif/MSGTyping.gif')} style={{ height: 100, marginTop:-50,   resizeMode: 'contain', aspectRatio: 1, alignSelf: 'center', transform: [{ scale: 3}] }} />,
                title: 'AI-Powered Clarity',
                subtitle: 'Comuno leverages the power of artificial intelligence to enhance your communication experience. Our advanced technology breaks down your messages, providing insights into how your words will be interpreted by the recipient. This feature ensures that your intentions are crystal plain, thereby reducing the likelihood of misunderstanding.',
                },
                {
                backgroundColor: 'white',
                image: <LottieView style={{height: 200, marginBottom:-100, marginTop:-50}} source={require('../assets/lottie/animation_llcdd350.json')} />,
                title: 'Enriched Conversations',
                subtitle: "Comuno generates an affective context for each message. Comuno adds substance to your interactions by identifying the underlying emotions in a conversation. By acknowledging and addressing the emotions behind the words, you will not only communicate effectively, but also cultivate deeper connections.",
                },
            ]}
        />
    );
  };
  
  
  
  export default OnboardingScreen;