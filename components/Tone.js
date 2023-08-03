import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import colors from "../constants/colors";


const Tone = (props) => {

    return(
        <View style={{flexDirection: 'row', width: '33.33%', padding:3}}>
            <View style={{backgroundColor:props.color, textAlign:"center", flexGrow: 0, flexShrink: 1, flexBasis: 200, borderRadius:10}}>
                <View style={styles.main }>
                    <Text style={{color:colors.white, textAlign:"center", flexGrow: 0, flexShrink: 1}} >{props.text}</Text>

                </View>
            </View>
            {/* <Text style={{backgroundColor:props.color, color:colors.textColor, textAlign:"center", flexGrow: 0, flexShrink: 1, flexBasis: 200, borderRadius:10,  padding:3 }} >{props.text}</Text> */}

                        {/* <Text style={{backgroundColor: toneColor[3]}}>ChatGPT</Text> */}
        </View>
    )
}


const styles = StyleSheet.create({
    main: {
        backgroundColor:'rgba(0, 0, 0, 0.2)', 
        textAlign:"center", 
        flexGrow: 0, 
        flexShrink: 1, 
        borderRadius:10,  
        padding:3
      },
})

export default Tone;