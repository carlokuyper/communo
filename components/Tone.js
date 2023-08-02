import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import colors from "../constants/colors";


const Tone = (props) => {

    return(
        <View style={{ flexDirection: 'row', width: '33.33%', padding:3}}>
            <Text style={{backgroundColor:props.color, color:colors.background, textAlign:"center", flexGrow: 0, flexShrink: 1, flexBasis: 200, borderRadius:10,  padding:3 }} >{props.text}</Text>
            {/* <Text style={{backgroundColor: toneColor[3]}}>ChatGPT</Text> */}
        </View>
    )
}


const styles = StyleSheet.create({
    width: 50,
    
})

export default Tone;