import React, { useRef, useState, useEffect, PropsWithChildren } from 'react';
import { Animated, Image, StyleSheet, Text, TouchableWithoutFeedback, View, ViewStyle } from 'react-native';
import colors from '../constants/colors';
import { Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import uuid from 'react-native-uuid';
import * as Clipboard from 'expo-clipboard';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { starMessage } from '../utils/actions/chatActions';
import { useSelector } from 'react-redux';

// type FadeInViewProps = PropsWithChildren<{style: ViewStyle}>;

const FadeInView = props => {
    const startValue = useRef(new Animated.Value(0)).current;
    const endValue = 150;
    const duration = 1000;

  useEffect(() => {
    Animated.timing(startValue, {
        toValue: endValue,
        duration: duration,
        useNativeDriver: true,
      }).start();
    }, [startValue]);

  return (
    <Animated.View // Special animatable View
      style={{
        ...props.style,
        transform: [
            {
              translateX: startValue,
            },
          ], // Bind opacity to animated value
      }}>
      {/* {props.children} */}
      <Text>sadasdasd</Text>
    </Animated.View>
  );
};

const MSGInfo = props => {
    const userData = useSelector(state => state.auth.userData);
    // console.log(userData);
    console.log("adasdas " + props.data)

    return (
        <View style={{backgroundColor:'red', width:'100%', height:'100%',margin:'3%', position:'absolute', zIndex:99, alignSelf:'stretch'}}>
            <Text>asdasd </Text>
            {/* <Text>{props.data.text}</Text> */}
        </View>
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
    }
})

export default MSGInfo;