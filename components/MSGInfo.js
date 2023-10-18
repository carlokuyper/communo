import React, { useRef, useState, useEffect, PropsWithChildren } from 'react';
import { Animated, Image, StyleSheet, Text, TouchableWithoutFeedback, View, ViewStyle } from 'react-native';
import colors from '../constants/colors';
import { useSelector } from 'react-redux';
import { AntDesign } from '@expo/vector-icons'; 
import { ImageBackground } from 'react-native';
import backgroundImage from "../assets/images/MaskGroup.png";
import Tone from './Tone';


function formatAmPm(dateString) {
  const date = new Date(dateString);
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  return hours + ':' + minutes + ' ' + ampm;
}


const MSGInfo = props => {
  const selectedMessage = useSelector(state => state.analysis.selectedMessage);
  console.log(selectedMessage);

  const {type} = props;
  const dateString = selectedMessage.date && formatAmPm(selectedMessage.date);

  let messageType = null
  if (selectedMessage.type == 'myMessage') {
    messageType = true
  } if (selectedMessage.type == 'theirMessage') {
    messageType = false
  }

  const handleSinglePress = () => {
    props.onPress && props.onPress();
  };
 
  const translateXAnim = useRef(new Animated.Value(100)).current;
  useEffect(() => {
    Animated.spring(
      translateXAnim,
      {
        toValue: 0, // Slide in to the original position
        friction: 10, // Adjust the friction value to reduce bounciness
        tension: 40,
        useNativeDriver: true,
      }
    ).start();
  }, [translateXAnim]);

  return (
    <TouchableWithoutFeedback  onPress={handleSinglePress} style={{backgroundColor:'blue'}}>
      <View style={{...props.style}} >
        
          <Animated.View 
          style={{
            transform: [{ translateX: translateXAnim }],  // Bind opacity to animated value
          }}> 
          
            <View style={{backgroundColor:'white', width:'85%', height:'100%', marginLeft:'15%'}}>
              <ImageBackground 
                source={backgroundImage}
                style={{flex: 1,  width:'100%', height:'100%'}}
                imageStyle={{resizeMode: "contain", marginLeft:-39, marginTop:0, width:'150%',
                height:'120%'}}>
                  
                  <View style={{ flexDirection: 'row', alignItems: 'center', margin:'10%', marginLeft:'5%'}}>
    <AntDesign name="close" size={24} color="black" onPress={handleSinglePress} style={{marginRight:'5%'}}/>
    <Text style={{ fontFamily: 'bold', fontSize: 20 }} onPress={handleSinglePress}>Message Breakdown</Text>
  </View>

                {/* ChatBubble */}
                <Text style={{ fontFamily: 'bold', fontSize: 18,marginBottom:10, marginLeft:'5%',}} onPress={handleSinglePress}> {messageType ? 'Your Message' : 'Their Message'}</Text>

                <View style={{marginBottom:10, marginLeft:'5%', }}>    
                    
                    <View style={messageType ? styles.myBubbleStyle : styles.thereBubbleStyle}>
                      <View style={{width:'90%', marginLeft:'2.5%', padding:5,}} >
                          <Text style={messageType ? {color:'white'} : {color:'black'}}>{selectedMessage.text}</Text>
                      </View>

                      {
                        dateString && type !== "info" && 
                        <View style={styles.timeContainer}>
                          <Text style={[styles.time, messageType ? {color: colors.lightGrey} : {color: colors.grey}]}>{dateString}</Text>
                        </View>
                      }
                    </View>
                </View>

                {/* Tones  */}
                <Text style={{ fontFamily: 'bold', fontSize: 18, marginBottom:10, marginTop:15, marginLeft:'5%'}} onPress={handleSinglePress}> The Tone of the Message is:</Text>
                <View style={{flexDirection: 'row', marginLeft:'5%', width:'85%'}}>
                  <Tone text={selectedMessage.activeTone1} color={selectedMessage.toneColor1} />
                  <Tone text={selectedMessage.activeTone2} color={selectedMessage.toneColor2} />
                  <Tone text={selectedMessage.activeTone3} color={selectedMessage.toneColor3} />
                </View>

                {/* Explain */}
                <View style={{width:'85%', marginBottom:15, marginTop:15, marginLeft:'6%',}}>
                  <Text>{selectedMessage.currentExplain}</Text>
                </View>

              </ImageBackground>
            </View>
            
          </Animated.View>  
        
      </View>
      </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
    wrapperStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    container: {
        backgroundColor: 'white',
        borderRadius: 6,
        padding: 5,
        marginBottom: 10,
        borderColor: '#E2DACC',
        borderWidth: 1,
    },
    text: {
        fontFamily: 'regular',
        letterSpacing: 0.3,
        
    },
    menuItemContainer: {
        flexDirection: 'row',
        padding: 5,
    },
    menuText: {
        flex: 1,
        fontFamily: 'regular',
        letterSpacing: 0.3,
        fontSize: 16
    },
    time: {
        fontFamily: 'regular',
        letterSpacing: 0.3,
        color: colors.grey,
        fontSize: 12,
    },
    name: {
        fontFamily: 'medium',
        letterSpacing: 0.3,
    },
    image: {
        width: 300,
        height: 300,
        marginTop: 1,
        marginBottom: 1,
        borderRadius:25,
        width:'99.5%',
    },
    myBubbleStyle:{
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,

      elevation: 3,

      backgroundColor: '#303030',
      borderRadius: 15,
      borderBottomRightRadius: 1,
      minWidth: '60%',
      maxWidth: '90%',
      marginTop: 15,
    },
    thereBubbleStyle:{
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,

      elevation: 3,

      backgroundColor: '#E7E7E7',
      borderRadius: 15,
      borderBottomLeftRadius: 1,
      minWidth: '60%',
      maxWidth: '90%',
      marginTop: 15,
    }, time: {
      fontFamily: 'regular',
      letterSpacing: 0.3,
      color: colors.lightGrey,
      fontSize: 12,
      marginLeft:'5%', 
      paddingBottom:5
    }
})

export default MSGInfo;