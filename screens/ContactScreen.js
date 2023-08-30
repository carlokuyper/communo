import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import DataItem from '../components/DataItem';
import PageContainer from '../components/PageContainer';
import PageTitle from '../components/PageTitle';
import ProfileImage from '../components/ProfileImage';
import SubmitButton from '../components/SubmitButton';
import colors from '../constants/colors';
import { removeUserFromChat } from '../utils/actions/chatActions';
import { getUserChats } from '../utils/actions/userActions';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ContactScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const storedUsers = useSelector(state => state.users.storedUsers);
    const userData = useSelector(state => state.auth.userData);
    const currentUser = storedUsers[props.route.params.uid];

    const storedChats = useSelector(state => state.chats.chatsData);
    const [commonChats, setCommonChats] = useState([]);

    const chatId = useSelector(state => state.auth.userData.userId)
    // const [chatId, setChatId] = useState(props.route?.params?.chatId);

    const chatData = chatId && storedChats[chatId];
    
    // const chatMessagesData = state.messages.messagesData[chatId];

    console.log('chatId');
    console.log(chatData);
    const chatKey = useSelector(state => {
        if (!chatId) return [];
    
        const testt = state.chats.chatsData;
        // console.log(testt);

        if (!testt) return [];
    
        const messageList = [];
        for (const key in testt) {

            const message = testt[key];
          
          messageList.push({
            key,
            ...message
          });
        }
        // console.log('message');
        
        return messageList;
    });


    //   console.log("chatKey");
    //   console.log(chatKey[0]);

      const msgData = chatKey[0].key
      
      const chatMessages = useSelector(state => {
        if (!chatId) return [];
        // console.log('chatId');
        // console.log(chatId);
    
        const newData = state.messages.messagesData[msgData];
        console.log('newData');
        console.log(newData);
        
        if (!newData) return [];
    
        const messageList = [];
        for (const key in newData) {
          // console.log(key);
          const message = msgData[key];
    
          messageList.push({
            key,
            ...message
          });
        }
    
        return messageList;
      });

      for (const key in chatMessages) {
        // console.log(key);
        const message = chatMessages[key].key;
  
        console.log(message);;
      }

    const removeFromChat = useCallback(async () => {
        try {
            setIsLoading(true);

            await removeUserFromChat(userData, currentUser, chatData);

            props.navigation.goBack();
        } catch (error) {
            console.log(error);
        }
        finally {
            setIsLoading(false);
        }
    }, [props.navigation, isLoading])

    return <PageContainer>
        <View style={styles.topContainer}>
            <ProfileImage
                uri={currentUser.profilePicture}
                size={80}
                style={{ marginBottom: 20 }}
            />

            <PageTitle text={`${currentUser.firstName} ${currentUser.lastName}`} />
            {
                currentUser.about &&
                <Text style={styles.about} numberOfLines={2}>{currentUser.about}</Text>
            }
        </View>

        {
            commonChats.length > 0 &&
            <>
                <Text style={styles.heading}>{commonChats.length} {commonChats.length === 1 ? "Group" : "Groups"} in Common</Text>
                {
                    commonChats.map(cid => {
                        const chatData = storedChats[cid];
                        return <DataItem
                               key={cid} 
                               title={chatData.chatName}
                               subTitle={chatData.latestMessageText}
                               type="link"
                               onPress={() => props.navigation.push("ChatScreen", { chatId: cid })}
                               image={chatData.chatImage}
                            />
                    })
                }
            </>
        }

        {
            chatData && chatData.isGroupChat &&
            (
                isLoading ?
                <ActivityIndicator size='small' color={colors.primary} /> :
                <SubmitButton
                    title="Remove from chat"
                    color={colors.red}
                    onPress={removeFromChat}
                />
            )
        }

    </PageContainer>
}

const styles = StyleSheet.create({
    topContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20
    },
    about: {
        fontFamily: 'medium',
        fontSize: 16,
        letterSpacing: 0.3,
        color: colors.grey
    },
    heading: {
        fontFamily: 'bold',
        letterSpacing: 0.3,
        color: colors.textColor,
        marginVertical: 8
    }
});

export default ContactScreen;