import React, { useRef, useState } from 'react';
import { Image, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import colors from '../constants/colors';
import { Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import uuid from 'react-native-uuid';
import * as Clipboard from 'expo-clipboard';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { starMessage } from '../utils/actions/chatActions';
import { useSelector } from 'react-redux';
import MaskedView from '@react-native-masked-view/masked-view';

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



const Bubble = props => {

    const { text, type, messageId, chatId, userId, date, setReply, replyingTo, name, toneColor, imageUrl, } = props;

    // console.log(type);

    const starredMessages = useSelector(state => state.messages.starredMessages[chatId] ?? {});
    const storedUsers = useSelector(state => state.users.storedUsers);

    const bubbleStyle = { ...styles.container };
    const textStyle = { ...styles.text };
    const toneView = { ...styles.container };
    const timeContainer = { ...styles.container };
    const maskStyle = { ...styles.container };
    const circleTop = { ...styles.container };
    const bigCircle = { ...styles.container };
    const circleRight = { ...styles.container };
    const circleLeft = { ...styles.container };
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

            // Main bubble style
            bubbleStyle.backgroundColor = 'white';
            bubbleStyle.borderWidth= 2;
            bubbleStyle.borderColor= toneColor;
            bubbleStyle.borderRadius=30;
            bubbleStyle.width = '75%';
            bubbleStyle.marginTop = 20;
            bubbleStyle.shadowColor= "#000",
            bubbleStyle.shadowOffset= { width: 0, height: 4, }
            bubbleStyle.shadowOpacity=0.30,
            bubbleStyle.shadowRadius=4.65,
            bubbleStyle.elevation= 8,

            // Tone indecenter on message bubble
            toneView.shadowColor= "#000",
            toneView.shadowOffset= { width: 0, height: 4, }
            toneView.shadowOpacity=0.30,
            toneView.shadowRadius=4.65,
            toneView.elevation= 8,
            toneView.alignSelf='center',
            toneView.backgroundColor=toneColor,
            toneView.right=0,
            toneView.borderRadius=15,
            toneView.marginRight=-120,
            toneView.marginTop=-22,
            toneView.padding=-5,

            textStyle.marginLeft = 10;
            textStyle.maxWidth = '80%';

            // Time
            timeContainer.flexDirection= 'row'
            timeContainer.justifyContent= 'flex-start'
            timeContainer.backgroundColor='red'
            timeContainer.marginTop=5
            timeContainer. marginBottom=5
            // timeContainer.marginLeft= -10

            // Extra bubbles styles start here 
            maskStyle.height = "100%"
            maskStyle.width = "100%"
            maskStyle.backgroundColor = 'white'
            maskStyle.borderRadius = 25,

            {/* Circle Top */}
            circleTop.width=15 
            circleTop.height=15
            circleTop.borderRadius=50
            circleTop.backgroundColor=toneColor
            circleTop.position='absolute'
            circleTop.bottom=0
            circleTop.right=0
            circleTop.marginBottom=30
            circleTop.marginRight=22.5
            {/* Small  Circle Right */}
            circleRight.width=0.5
            circleRight.height=0.5
            circleRight.borderRadius=10
            circleRight.backgroundColor=toneColor
            circleRight.position='absolute'
            circleRight.bottom=0
            circleRight.right=0
            circleRight.marginBottom=10
            circleRight.marginRight=37
            {/* Small  Circle Left */}
            circleLeft.width=0.5
            circleLeft.height=0.5
            circleLeft.borderRadius=10
            circleLeft.backgroundColor=toneColor
            circleLeft.position='absolute'
            circleLeft.bottom=0
            circleLeft.right=0
            circleLeft.marginBottom=25
            circleLeft.marginRight=2.5
            {/* Big Circle */}
            bigCircle.width=35 
            bigCircle.height=35 
            bigCircle.borderRadius=100
            bigCircle.backgroundColor=toneColor
            bigCircle.position='absolute'
            bigCircle.bottom=0
            bigCircle.right=0
            bigCircle.marginBottom=-10
            // bigCircle.marginLeft=0
                                

            Container = TouchableWithoutFeedback;
            isUserMessage = true;
            break;
        case "theirMessage":
            wrapperStyle.justifyContent = 'flex-start';

            // Main bubble style
            bubbleStyle.backgroundColor = 'white';
            bubbleStyle.borderWidth= 2;
            bubbleStyle.borderColor= toneColor;
            bubbleStyle.borderRadius=30;
            bubbleStyle.width = '75%';
            bubbleStyle.marginTop = 20;
            bubbleStyle.shadowColor= "#000",
            bubbleStyle.shadowOffset= { width: 0, height: 4, }
            bubbleStyle.shadowOpacity=0.30,
            bubbleStyle.shadowRadius=4.65,
            bubbleStyle.elevation= 8,

            // Tone indecenter on message bubble
            toneView.shadowColor= "#000",
            toneView.shadowOffset= { width: 0, height: 4, }
            toneView.shadowOpacity=0.30,
            toneView.shadowRadius=4.65,
            toneView.elevation= 8,
            toneView.alignSelf='center',
            toneView.backgroundColor=toneColor,
            toneView.left=0,
            toneView.borderRadius=15,
            toneView.marginLeft=-120,
            toneView.marginTop=-22,
            toneView.padding=-5,

            textStyle.marginLeft = 55;
            textStyle.maxWidth = '80%';

            // Time
            timeContainer.flexDirection= 'row'
            timeContainer.justifyContent= 'flex-start'
            timeContainer.marginTop=5
            timeContainer. marginBottom=5
            timeContainer.marginLeft= 10
            
            // Extra bubbles styles start here 
            maskStyle.height = "100%"
            maskStyle.width = "100%"
            maskStyle.backgroundColor = 'white'
            maskStyle.borderRadius = 25,

            {/* Circle Top */}
            circleTop.width=15 
            circleTop.height=15
            circleTop.borderRadius=50
            circleTop.backgroundColor=toneColor
            circleTop.position='absolute'
            circleTop.bottom=0
            circleTop.marginBottom=30
            circleTop.marginLeft=22.5
            {/* Small  Circle Right */}
            circleRight.width=0.5
            circleRight.height=0.5
            circleRight.borderRadius=10
            circleRight.backgroundColor=toneColor
            circleRight.position='absolute'
            circleRight.bottom=0
            circleRight.marginBottom=10
            circleRight.marginLeft=37
            {/* Small  Circle Left */}
            circleLeft.width=0.5
            circleLeft.height=0.5
            circleLeft.borderRadius=10
            circleLeft.backgroundColor=toneColor
            circleLeft.position='absolute'
            circleLeft.bottom=0
            circleLeft.marginBottom=25
            circleLeft.marginLeft=2.5
            {/* Big Circle */}
            bigCircle.width=35 
            bigCircle.height=35 
            bigCircle.borderRadius=100
            bigCircle.backgroundColor=toneColor
            bigCircle.position='absolute'
            bigCircle.bottom=0
            bigCircle.marginBottom=-10
            // bigCircle.marginLeft=01111

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

    return (
        <View style={wrapperStyle}>
            <Container onLongPress={() => menuRef.current.props.ctx.menuActions.openMenu(id.current)} style={{ width: '100%' }}>
                <View style={bubbleStyle}>
                    {
                        name && type !== "info" &&
                        <Text style={styles.name}>{name}</Text>
                    }

                    {
                        replyingToUser &&
                        <Bubble
                            type='reply'
                            text={replyingTo.text}
                            name={`${replyingToUser.firstName} ${replyingToUser.lastName}`}
                        />
                    }
{/* paddingLeft:1,   */}
                    {
                        !imageUrl && (type=='myMessage') && <>
                           
                            <View style={toneView} >
                                <Text style={{backgroundColor:'rgba(52, 52, 52, 0.2)', color:'white', alignSelf:'center', padding:5, paddingRight:15, paddingLeft:15, borderRadius:15}}>Your text here</Text>
                            </View>
                            
                            <MaskedView
                                style={{ width:'102%', minHeight:50, bottom:0,  marginLeft:0, marginBottom:-5 }}
                                maskElement={
                                    <View style={maskStyle}></View>
                                }>
                                {/* Shows behind the mask, you can put anything here, such as an image */}
                                <View style={{flex: 1, width: '100%', height:'100%'}}>
                                    <Text style={textStyle}>
                                        {text}
                                    </Text> 
                                    {
                                        dateString && type !== "info" && 
                                        // <View style={timeContainer} >
                                        <View style={{flexDirection: 'row', justifyContent: 'flex-end',  marginTop:5, marginBottom:5, marginRight: 55,}} >
                                            { isStarred && <FontAwesome name='star' size={14} color={colors.textColor} style={{ marginRight: 5 }} /> }
                                            <Text style={styles.time}>{dateString}</Text>
                                        </View>
                                    }
                                        {/* Circle Top */}
                                        <View style={circleTop}></View>
                                        {/* Small  Circle Right */}
                                        <View style={circleRight}></View>
                                        {/* Small  Circle Left */}
                                        <View style={circleLeft}></View>
                                        {/* Big Circle */}
                                        <View style={bigCircle}></View>
                                </View> 
                            </MaskedView>
                        </>
                        || (type=='theirMessage') && <>
                           
                        <View style={toneView} >
                            <Text style={{backgroundColor:'rgba(52, 52, 52, 0.2)', color:'white', alignSelf:'center', padding:5, paddingRight:15, paddingLeft:15, borderRadius:15}}>Your text here</Text>
                        </View>
                        
                        <MaskedView
                            style={{ width:'102%', minHeight:50, bottom:0, left:0, marginLeft:-5, marginBottom:-5, }}
                            maskElement={
                                <View style={maskStyle}></View>
                            }>
                            {/* Shows behind the mask, you can put anything here, such as an image */}
                            <View style={{flex: 1, width: '100%', height:'100%'}}>
                                <Text style={textStyle}>
                                    {text}
                                </Text> 
                                {
                                    dateString && type !== "info" && 
                                    // <View style={timeContainer} >
                                    <View style={{flexDirection: 'row', justifyContent: 'flex-start', marginTop:5, marginBottom:5, marginLeft: 55,}} >
                                        { isStarred && <FontAwesome name='star' size={14} color={colors.textColor} style={{ marginRight: 5 }} /> }
                                        <Text style={styles.time}>{dateString}</Text>
                                    </View>
                                }
                                    {/* Circle Top */}
                                    <View style={circleTop}></View>
                                    {/* Small  Circle Right */}
                                    <View style={circleRight}></View>
                                    {/* Small  Circle Left */}
                                    <View style={circleLeft}></View>
                                    {/* Big Circle */}
                                    <View style={bigCircle}></View>
                            </View> 
                        </MaskedView>
                    </>
                       
                    || imageUrl && 
                        <>
                            <Image source={{ uri: imageUrl }} style={styles.image} />
                            {
                                dateString && type !== "info" && <View style={{margin:5}}>
                                    { isStarred && <FontAwesome name='star' size={14} color={colors.textColor} style={{ marginRight: 5 }} /> }
                                    <Text style={styles.time}>{dateString}</Text>
                                </View>
                            }
                        </> 
                    || <Text style={textStyle}>
                            {text}
                        </Text> 

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

export default Bubble;