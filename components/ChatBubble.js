import React, { useRef, useState, useEffect, PropsWithChildren } from 'react';
import { Animated, Image, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View, ViewStyle } from 'react-native';
import colors from '../constants/colors';
import { Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import uuid from 'react-native-uuid';
import * as Clipboard from 'expo-clipboard';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { starMessage } from '../utils/actions/chatActions';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedMessage } from '../store/analysisSlice';

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

const MenuItem = props => {

    const Icon = props.iconPack ?? Feather;

    return <MenuOption onSelect={props.onSelect}>
        <View style={styles.menuItemContainer}>
            <Text style={styles.menuText}>{props.text}</Text>
            <Icon name={props.icon} size={18} />
        </View>
    </MenuOption>
}

// type FadeInViewProps = PropsWithChildren<{style: ViewStyle}>;

const FadeInView = props => {
    const startValue = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 5000,
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
      {props.children}
      
    </Animated.View>
  );
};

const ChatBubble = props => {

    const { text, type, messageId, chatId, userId, date, setReply, replyingTo, name,  imageUrl, toneColor1, toneColor2, toneColor3, activeTone1, activeTone2, activeTone3,  currentExplain, intendedExplain, isActiveMsg} = props;

    const starredMessages = useSelector(state => state.messages.starredMessages[chatId] ?? {});
    const storedUsers = useSelector(state => state.users.storedUsers);

    const bubbleStyle = { ...styles.container };
    const textStyle = { ...styles.text };
    const wrapperStyle = { ...styles.wrapperStyle }

    const menuRef = useRef(null);
    const id = useRef(uuid.v4());

    let Container = View;
    let isUserMessage = false;
    const dateString = date && formatAmPm(date);

    switch (type) {
        case "system":
            textStyle.color = '#65644A';
            bubbleStyle.backgroundColor = colors.beige;
            bubbleStyle.alignItems = 'center';
            bubbleStyle.marginTop = 10;
            break;
        case "error":
            bubbleStyle.backgroundColor = colors.red;
            textStyle.color = 'white';
            bubbleStyle.marginTop = 10;
            break;
        case "myMessage":
            wrapperStyle.justifyContent = 'flex-end';

            bubbleStyle.shadowColor= "#000",
            bubbleStyle.shadowOffset= { width: 0, height: 1, }
            bubbleStyle.shadowOpacity=0.22,
            
            bubbleStyle.shadowRadius=2.22,
            bubbleStyle.elevation= 3,
            bubbleStyle.backgroundColor = '#303030';
            bubbleStyle.borderRadius=15;
            bubbleStyle.minWidth = '60%';
            bubbleStyle.maxWidth = '90%';
            bubbleStyle.marginTop = 15;

            textStyle.color = 'white';
            textStyle.marginLeft = 5;

            Container = TouchableWithoutFeedback;
            isUserMessage = true;
            break;
        case "theirMessage":
            wrapperStyle.justifyContent = 'flex-start';
            
            bubbleStyle.shadowColor= "#000",
            bubbleStyle.shadowOffset= { width: 0, height: 1, }
            bubbleStyle.shadowOpacity=0.22,
            bubbleStyle.shadowRadius=2.2,
            bubbleStyle.elevation= 3,
            bubbleStyle.backgroundColor = '#E7E7E7';
            bubbleStyle.borderRadius=15;
            bubbleStyle.minWidth = '60%';
            bubbleStyle.maxWidth = '90%';
            bubbleStyle.marginTop = 15;

            textStyle.marginLeft = 5;

            Container = TouchableWithoutFeedback;
            isUserMessage = true;

            break;
        case "reply":
            bubbleStyle.backgroundColor = '#F2F2F2';
            break;
        case "info":
            bubbleStyle.backgroundColor = 'white';
            bubbleStyle.alignItems = 'center';
            textStyle.color = colors.textColor;
            break;
        default:
            break;
    }

    const copyToClipboard = async text => {
        try {
            await Clipboard.setStringAsync(text);
        } catch (error) {
            console.log(error);
        }
    }

    const isStarred = isUserMessage && starredMessages[messageId] !== undefined;
    const replyingToUser = replyingTo && storedUsers[replyingTo.sentBy];

    const lastPress = useRef(null);
    const dispatch = useDispatch();

    let selectedMessage = {type: type, toneColor1: toneColor1, toneColor2: toneColor2, toneColor3: toneColor3, activeTone1: activeTone1, activeTone2: activeTone2, activeTone3: activeTone3, currentExplain: currentExplain, text: text, userId: userId, date: date}
    // let selectedMessage = [ type, toneColor1, toneColor2, toneColor3, activeTone1, activeTone2,  activeTone3, currentExplain, text, ]
    
    const handleDoublePress = () => {
        const time = new Date().getTime();
        const delta = time - (lastPress.current || 0);

        if (delta < 200) {
            // Double press detected
            props.onDoublePress && props.onDoublePress();
            dispatch(setSelectedMessage(selectedMessage));
        }
        lastPress.current = time;
    };    const handleClick = (e) => {
        e.stopPropagation();
        setActiveMsg(true);
    }

    return (

        <View style={wrapperStyle} >
                <Container onPress={handleDoublePress} onLongPress={() => menuRef.current.props.ctx.menuActions.openMenu(id.current)} style={{ width: '100%' }}>
                    <View style={bubbleStyle}>
                            <View style={{width:'100%'}} >
                                <Text style={textStyle}>
                                    {text}
                                </Text>
                            </View>
                        {
                            imageUrl &&
                            <Image source={{ uri: imageUrl }} style={styles.image} />
                        }

                        {
                            dateString && type !== "info" && <View style={styles.timeContainer}>
                                { isStarred && <FontAwesome name='star' size={14} color={colors.textColor} style={{ marginRight: 5 }} /> }
                                <Text style={styles.time}>{dateString}</Text>
                            </View>
                        }

                        <Menu name={id.current} ref={menuRef}>
                            <MenuTrigger />

                            <MenuOptions>
                                <MenuItem text='Copy to clipboard' icon={'copy'} onSelect={() => copyToClipboard(text)} />
                                <MenuItem text={`${isStarred ? 'Unstar' : 'Star'} message`} icon={isStarred ? 'star-o' : 'star'} iconPack={FontAwesome} onSelect={() => starMessage(messageId, chatId, userId)} />
                                <MenuItem text='Reply' icon='arrow-left-circle' onSelect={setReply} />
                            </MenuOptions>
                        </Menu>
                    </View>
                </Container>
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
        marginLeft: 5,
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

export default ChatBubble;