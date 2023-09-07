import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


import PageContainer from '../components/PageContainer';
import SignInForm from '../components/SignInForm';
import SignUpForm from '../components/SignUpForm';
import colors from '../constants/colors';

import { ImageBackground } from 'react-native';

import backgroundImage from "../assets/images/authScreen.png";

import logo from '../assets/images/logo-no-white.png';
import OnboardingScreen from './OnboardingScreen';

const AuthScreen = props => {

    const [isSignUp, setIsSignUp] = useState(false);
    
    return <SafeAreaView style={{ flex: 1}}>
        <ImageBackground source={backgroundImage} style={styles.backgroundImage} 
        imageStyle={{resizeMode: "contain",  marginLeft: -120, marginTop: 100,width: Dimensions.get('screen').width,
        height: Dimensions.get('screen').height,}}>
            
            <ScrollView >
                {/* <OnboardingScreen/> */}
                <KeyboardAvoidingView 
                style={styles.keyboardAvoidingView}
                behavior={Platform.OS === "ios" ? "height" : undefined}
                keyboardVerticalOffset={100}>
                    <View style={styles.container}>
                        <View style={styles.imageContainer}>
                            <Image
                                style={styles.image}
                                source={logo}
                                resizeMode='contain' />
                        </View>
                        {
                            isSignUp ?
                            <SignUpForm /> :
                            <SignInForm />
                        }
                        <TouchableOpacity
                            onPress={() => setIsSignUp(prevState => !prevState)}
                            style={styles.linkContainer}>
                            <Text style={styles.link}>{ `Switch to ${isSignUp ? "sign in" : "sign up"}` }</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
        </ImageBackground>
    </SafeAreaView>
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        flex: 1,
    },
    linkContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 15,
        
    },
    link: {
        color: colors.darkBlue,
        fontFamily: 'medium',
        letterSpacing: 0.3
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: '65%',
        resizeMode:'contain',
        height:225,
        marginTop:50,
    },
    backgroundImage: {
        // position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    },
    keyboardAvoidingView:{
        zIndex:99999,
        flex: 1,
        justifyContent: 'center'
    }
})

export default AuthScreen;