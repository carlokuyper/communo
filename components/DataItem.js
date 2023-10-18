import React from 'react';
import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import colors from '../constants/colors';
import ProfileImage from './ProfileImage';
import { Ionicons, AntDesign } from '@expo/vector-icons';

const imageSize = 55;

const DataItem = props => {

    const { title, subTitle, image, type, isChecked, icon } = props;

    const hideImage = props.hideImage && props.hideImage === true;

    return (
        <TouchableWithoutFeedback onPress={props.onPress}>
            <View style={{...styles.container, ...props.style}}>

                {
                    !icon && !hideImage &&
                    <ProfileImage 
                        uri={image}
                        height={imageSize}
                        width={imageSize}
                    />
                }

                {
                    icon &&
                    <View style={styles.leftIconContainer}>
                        <AntDesign name={icon} size={20} color={colors.blue} />
                    </View>
                }


                <View style={styles.textContainer}>

                    <Text
                        numberOfLines={1}
                        style={{ ...styles.title, ...{ color: type === "button" ? colors.blue || color: type === "link" ? colors.white : colors.darkBlue } }}>
                        {title}
                    </Text>

                    {
                        subTitle &&
                        <Text
                            numberOfLines={1}
                            style={styles.subTitle}>
                            {subTitle}
                        </Text>
                    }

                </View>


                {
                    type === "checkbox" &&
                    <View style={{ ...styles.iconContainer, ...isChecked && styles.checkedStyle }}>
                        <Ionicons name="checkmark" size={18} color="white" />
                    </View>
                }

                {
                    type === "link" &&
                    <View>
                        <Ionicons name="chevron-forward-outline" size={18} color={colors.white} />
                    </View>
                }

            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingVertical: 7,
        marginTop: '5%',

        color:'white',
        backgroundColor:colors.white,
        alignItems: 'center',
        minHeight: 60,
        padding:10,
        borderRadius:10,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 2,
    },
    textContainer: {
        marginLeft: 14,
        flex: 1
    },
    title: {
        fontFamily: 'medium',
        fontSize: 18,
        letterSpacing: 0.3
    },
    subTitle: {
        fontFamily: 'regular',
        fontSize: 16,
        color: colors.darkBlue,
        letterSpacing: 0.3
    },
    iconContainer: {
        borderRadius: 50,
        backgroundColor: 'white'
    },
    checkedStyle: {
        backgroundColor: colors.primary,
        borderColor: 'transparent'
    },
    leftIconContainer: {
        backgroundColor: colors.extraLightGrey,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        width: imageSize,
        height: imageSize
    }
});

export default DataItem;