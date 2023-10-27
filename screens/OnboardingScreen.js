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
            
            skipToPage={3}
            
            onDone={handleDone}
            
            // Make text Width smaller
            
            pages={[
                {
                    backgroundColor: 'white',
                    // Make the msg in the gif bigger
                    image:  <Image source={require('../assets/gif/Intro.gif')} autoPlay loop style={{ height: 100, marginTop:-50, marginBottom:20, resizeMode: 'contain', aspectRatio: 1, alignSelf: 'center', transform: [{ scale: 3}] }} />,
                    title: 'Welcome To Comuno',
                    subtitle: `Communo is more than a messaging app—it streamlines communication. Comuno helps you communicate clearly and meaningfully with friends, family, and coworkers.`,
                    subTitleStyles: { paddingLeft:15, paddingRight:15 },
                },
                {
                    backgroundColor: 'white',
                    image: <Image source={require('../assets/gif/MSGTyping.gif')} autoPlay loop style={{ height: 100, marginTop:-50,   resizeMode: 'contain', aspectRatio: 1, alignSelf: 'center', transform: [{ scale: 3}] }} />,
                    title: 'AI-Powered Clarity',
                    // add Double Click 
                    subtitle: 'Communo leverages the power of artificial intelligence to enhance your communication experience. Our cutting-edge technology deconstructs your messages and offers information on how the recipient will interpret your words. This feature ensures that your intentions are crystal clear, thereby reducing the likelihood of misunderstanding.',
                    subTitleStyles: { paddingLeft:15, paddingRight:15 },
                },
                {
                    backgroundColor: 'white', 
                    image: <Image source={require('../assets/gif/DoubleClick.gif')} autoPlay loop style={{ height: 100, paddingTop:20, marginTop:-50, marginBottom:50,  resizeMode: 'contain', aspectRatio: 1, alignSelf: 'center', transform: [{ scale: 3}]}} />,
                    title: 'Enriched Conversations', 
                    subtitle: "Communo generates an affective context for each message. Comuno adds substance to your interactions by identifying the underlying emotions in a conversation. By acknowledging and addressing the emotions behind the words, you will not only communicate effectively but also cultivate deeper connections.",
                    subTitleStyles: { paddingLeft:15, paddingRight:15 },
                },
                {
                    backgroundColor: 'white', 
                    image: <Image source={require('../assets/gif/contactScreen.gif')} autoPlay loop style={{ height: 100, paddingTop:20, marginTop:-50, marginBottom:50,  resizeMode: 'contain', aspectRatio: 1, alignSelf: 'center', transform: [{ scale: 3}]}} />,
                    title: 'Chat Overview', 
                    subtitle: "Comuno offers an additional feature that allows you to view a summary of the conversation.",
                    subTitleStyles: { paddingLeft:15, paddingRight:15 },
                },
            ]}
        />
    );
  };
  
  
  
  export default OnboardingScreen;