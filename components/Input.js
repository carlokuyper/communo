import { StyleSheet, Text, TextInput, View } from "react-native"
import { FontAwesome } from '@expo/vector-icons';

import colors from "../constants/colors";
import { useState } from "react";

const Input = props => {

    const [value, setValue] = useState(props.initialValue)

    const onChangeText = text => {
        setValue(text);
        props.onInputChanged(props.id, text);
    }

    return <View style={styles.container}  
        marginTop={props.marTop} 
        marginBottom={props.marBottom}>
        <Text 
            marginVertical={props.marVertical} 
            style={[styles.label, !props.label && { color: 'transparent' }]}
        >
            {props.label}
        </Text>
        <View style={[styles.inputContainer, props.inputContainerStyle]}>
            {
                props.icon && <props.iconPack
                    name={props.icon}
                    size={props.iconSize || 15 }
                    style={styles.icon} />
            }
            <TextInput
                { ...props }
                style={styles.input}
                onChangeText={onChangeText}
                value={value}
            />
        </View>
        {
            props.errorText &&
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{props.errorText[0]}</Text>
            </View>
        }
    </View>
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    label: {
        marginVertical: 6,
        // marginBottom:'2%',
        fontFamily: 'semiBold',
        letterSpacing: 0.3,
        color: colors.backgroundColor,
    },
    inputContainer: {
        width: '100%',
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 15,
        backgroundColor: colors.nearlyWhite,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,

        elevation: 1,
    },
    icon: {
        marginRight: 10,
        color: colors.grey
    },
    input: {
        color: colors.textColor,
        flex: 1,
        fontFamily: 'regular',
        letterSpacing: 0.3,
        paddingTop: 0
    },
    errorContainer: {
        marginTop: 5,
        marginLeft:10
    },
    errorText: {
        color: 'red',
        fontSize: 13,
        fontFamily: 'light',
        letterSpacing: 0.3
    }
})

export default Input;