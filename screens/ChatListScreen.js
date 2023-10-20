import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector } from 'react-redux';
import CustomHeaderButton from '../components/CustomHeaderButton';
import DataItem from '../components/DataItem';
import PageContainer from '../components/PageContainer';
import colors from '../constants/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

import backgroundImage from "../assets/images/chatScreen.png";
import { ImageBackground } from 'react-native';

const ChatListScreen = props => {

    const selectedUser = props.route?.params?.selectedUserId;
    const selectedUserList = props.route?.params?.selectedUsers;
    const chatName = props.route?.params?.chatName;

    const userData = useSelector(state => state.auth.userData);

    const storedUsers = useSelector(state => state.users.storedUsers);
    const userChats = useSelector(state => {
        const chatsData = state.chats.chatsData;
        return Object.values(chatsData)
            .filter(chat => chat.users.includes(userData.userId)) // Add this line
            .sort((a, b) => {
                return new Date(b.updatedAt) - new Date(a.updatedAt);
            });
    });

    // useEffect(() => {
    //     props.navigation.setOptions({
    //         headerRight: () => {
    //             return <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
    //                 <Item
    //                     title="New chat"
    //                     iconName="create-outline"
    //                     onPress={() => props.navigation.navigate("                                               `")}/>
    //             </HeaderButtons>
    //         }
    //     })
    // }, []);

    useEffect(() => {

        if (!selectedUser && !selectedUserList) {
            return;
        }

        let chatData;
        let navigationProps;

        if (selectedUser) {
            chatData = userChats.find(cd => !cd.isGroupChat && cd.users.includes(selectedUser))
        }

        if (chatData) {
            navigationProps = { chatId: chatData.key }
        }
        else {
            const chatUsers = selectedUserList || [selectedUser];
            if (!chatUsers.includes(userData.userId)){
                chatUsers.push(userData.userId);
            }

            navigationProps = {
                newChatData: {
                    users: chatUsers,
                    isGroupChat: selectedUserList !== undefined
                }
            }
        }
        
        props.navigation.navigate("ChatScreen", navigationProps);

    }, [props.route?.params])
    
    return  <ImageBackground
    source={backgroundImage} style={styles.backgroundImage} 
    imageStyle={{resizeMode: "contain",  marginLeft: -180, marginTop: -250, width:'150%', height:'150%',}}>
        
        {/* <View>
            <TouchableOpacity onPress={() => props.navigation.navigate("NewChat", { isGroupChat: true })}>
                <Text style={styles.newGroupText}>New Group</Text>
            </TouchableOpacity>
        </View> */}

        <FlatList 
            style={styles.space}
            data={userChats}
            renderItem={(itemData) => {
                const chatData = itemData.item;
                const chatId = chatData.key;
                const isGroupChat = chatData.isGroupChat;

                let title = "";
                const subTitle = chatData.latestMessageText || "New chat";
                let image = "";

                if (isGroupChat) {
                    title = chatData.chatName;  
                    image = chatData.chatImage;
                }
                else {
                    const otherUserId = chatData.users.find(uid => uid !== userData.userId);
                    const otherUser = storedUsers[otherUserId];

                    if (!otherUser) return;

                    title = `${otherUser.firstName} ${otherUser.lastName}`;
                    image = otherUser.profilePicture;
                }

                return <DataItem
                    title={title}
                    subTitle={subTitle}
                    image={image}
                    onPress={() => props.navigation.navigate("ChatScreen", { chatId })}
                    style={{marginTop:'2.5%', marginLeft: '5%', width:'90%'}} // Pass your style here
            />
            }}  
        />

        <TouchableOpacity
            onPress={() => props.navigation.navigate("NewChat")}
            style={styles.startMsg}
        >
            <MaterialCommunityIcons name="message-bulleted" size={24} color="white" />
            <Text style={{ color: 'white', textAlign: 'center', marginLeft: '10%' }}>Start Chat</Text>
        </TouchableOpacity>
    </ImageBackground>
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    newGroupText: {
        color: colors.blue,
        fontSize: 17,
        marginBottom: 5
    },
    backgroundImage: {
       flex: 1,
    },
    space:{
        marginTop:7.5
    },
    startMsg: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,

        elevation: 2,

        position: 'absolute', // Add this line
        bottom: '5%', // Adjust this as needed
        right: '5%', 
        backgroundColor: colors.darkBlue, 
        borderRadius: 15, 
        width:'35%', 
        padding: 15,
 
        alignSelf: 'flex-end', 
        flexDirection: 'row', 
    }
})

export default ChatListScreen;