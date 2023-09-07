import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import colors from '../constants/colors';

const SubmitButton = props => {

    const enabledBgColor = props.color || colors.white;
    const disabledBgColor = colors.lightGrey;
    const bgColor = props.disabled ? disabledBgColor : enabledBgColor;

    return <TouchableOpacity
            onPress={props.disabled ? () => {} : props.onPress}
            style={{
                ...styles.button,
                ...props.style,
                ...{ backgroundColor: bgColor }}}>
        <Text style={{ color: props.disabled ? colors.grey : 'white' }}>
            { props.title }
        </Text>
    </TouchableOpacity>
};

const styles = StyleSheet.create({
    button: {
        paddingHorizontal: 30,
        paddingVertical: 12.5,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3,
    }
});

export default SubmitButton;