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
import axios from 'axios';

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

    // console.log('chatId');
    // console.log(chatData);
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
      
      let messageTonesArray1 = []
    const chatMessages = useSelector(state => {
        if (!chatId) return [];
        // console.log('chatId');
        // console.log(chatId);
    
        const chatMessages = state.messages.messagesData[msgData];
        // console.log('newData');
        // console.log(newData);
        
        if (!chatMessages) return [];
    
        const messageList = [];
        for (const key in chatMessages) {
            // console.log(key);
            const message = chatMessages[key];
        
            // console.log('message'); 
            // console.log(message.activeTone1);

            let messageTonesArray1 = message.text
            // let messageTonesArray1 = message.activeTone1
            // let messageTonesArray2 = message.activeTone2
            // let messageTonesArray3 = message.activeTone3

            messageList.push({
                messageTonesArray1,
                // messageTonesArray2,
                // messageTonesArray3
            });
        }
        // console.log('messageList');
        // console.log(messageList);

        return messageList;
        
    });
    console.log('chatMessages');
    console.log(chatMessages);

    let toneArray = JSON.stringify(chatMessages) 
        
    console.log('toneArray');
    console.log(toneArray);


    
    const config = {
        headers:{
            Authorization: "Bearer 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",
        }
      };

    //Explain the user message
    let explainInput = "Go through this conversation between individuals, and Use Plutchik's Psycho-evolutionary Theory of Emotion to summarize the overall emotions in this array of tones down to three tones and add a * at the beginning of each tone. Use the same theory to determine the associated colour and provide it in hex values " + "\ToneArray:" + toneArray
    let explainPayload = {
        model: "text-davinci-003",
        prompt: explainInput,
        temperature: 0,
        max_tokens: 60,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
    }

    axios.post('https://api.openai.com/v1/completions', explainPayload, config)
    .then((res)=> {
        // console.log(res);
        
        let tone = res.data.choices[0].text 
        // console.log(tone);           
        let newText = tone.replace('\n', '');   
        
        console.log(newText);  
    })
    .catch(function (error) {
        console.log(error);
    });

 
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
            {/* <Text  style={{color:'white'}}>{chatMessages}</Text> */}
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