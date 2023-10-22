import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
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
import Tone from '../components/Tone';
import { useNavigation } from '@react-navigation/native';

import LottieView from 'lottie-react-native';
import loadingAnimation from '../assets/lottie/loading.json';

import { Animated } from 'react-native';

const ContactScreen = props => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(false);
    const storedUsers = useSelector(state => state.users.storedUsers);
    const userData = useSelector(state => state.auth.userData);
    const currentUser = storedUsers[props.route.params.uid];

    const storedChats = useSelector(state => state.chats.chatsData);   

    const [commonChats, setCommonChats] = useState([]);

    const currentUserId = userData.userId;
    const contactId = props.route.params.uid;

    const chatId = Object.keys(storedChats).find(id => {
      const chat = storedChats[id];
      return chat.users.includes(currentUserId) && chat.users.includes(contactId);
    });

    const chatMessages = useSelector(state => {
      if (!chatId) return [];
      
      const chatMessagesData = state.messages.messagesData[chatId];

      if (!chatMessagesData) return [];

      const messageList = [];
      for (const key in chatMessagesData) {
        const message = chatMessagesData[key];
        
        messageList.push({
          key,
          ...message
        });
      }

      return messageList;
    });

    const userAMessages = chatMessages.filter(message => message.sentBy === currentUserId);
    const userBMessages = chatMessages.filter(message => message.sentBy === contactId);

    const chatData = chatId && storedChats[chatId];

    let user1msg = userAMessages.map(message => message.text);
    let user2msg = userBMessages.map(message => message.text);
    
    const [toneColor1, setToneColor1] = useState();
    const [toneColor2, setToneColor2] = useState();
    const [toneColor3, setToneColor3] = useState();

    let [activeTone1, setActiveTone1] = useState();
    let [activeTone2, setActiveTone2] = useState();
    let [activeTone3, setActiveTone3] = useState();

    const [APIisLoading, setAPIIsLoading] = useState(false);
    const [APIRan, setAPIRan] = useState(false);
    const [enoughMSG, setEnoughMSG] = useState(false);
    
    const [fadeAnim] = useState(new Animated.Value(0));  // Initial value for opacity: 0

    useEffect(() => {
        return navigation.addListener('blur', () => {
            dispatch(setUser1Chats([]));
            dispatch(setUser2Chats([]));
        });
    }, [navigation]);
    
    useEffect(() => {
        // Check if there are at least 5 messages from either user
        if (user1msg.length >= 5 || user2msg.length >= 5) {
            setAPIIsLoading(true);
            setAPIRan(true)
            setEnoughMSG(true)
        const configTone = {
            headers:{
                Authorization: "Bearer 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",
            }
          };

        //Explain the user message
        let explainInputTone = "Go through this conversation between individuals, and Use Plutchik's Psycho-evolutionary Theory of Emotion to summarize the overall emotions in this conversation break it down to three tones add a * at the beginning of each tone. Use the same theory to determine the associated colour and provide it in hex values " + "\Messages: User1 " + user1msg + " User2 " + user2msg
        let explainPayloadTone = {
            model: "text-davinci-003",
            prompt: explainInputTone,
            temperature: 0,
            max_tokens: 60,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0
        }
    
        axios.post('https://api.openai.com/v1/completions', explainPayloadTone, configTone)
        .then((res)=> {
            let tone = res.data.choices[0].text.toLowerCase().toString().split(/[\s,]+/)
            let msgColour = tone.filter((colour) => colour.startsWith("#")).map((item) => item.replace(/[*_"_'_:_;_._{_}_(_)]/g,''));
            let activeMsgTone = tone.filter((colour) => colour.startsWith("*")).map((item) => item.replace(/[*_"_'_:_;_._{_}_(_)]/g,''));

            // //Main Tone  
            setActiveTone1(activeMsgTone[0])
            setToneColor1(msgColour[0])
            setActiveTone2(activeMsgTone[1])                
            setToneColor2(msgColour[1])
            setActiveTone3(activeMsgTone[2])                
            setToneColor3(msgColour[2]) 

            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true
            }).start();

            setAPIIsLoading(false);
        })
        .catch(function (error) {
            console.log(error);
            setAPIIsLoading(false);
        });

        const configExplain = {
            headers:{
                Authorization: "Bearer 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",
            }
          };
    
        //Explain the user message
        let explainInputExplain = "Analyse the following conversation between " + userData.firstName + " and " + currentUser.firstName + ". Provide an overview of the general emotions, atmosphere, and tone. Limit your analysis to about three lines. The information will be passed in as an array. " + userData.firstName + " sent " + user1msg.join(' ') + " and " + currentUser.firstName + " sent " + user2msg.join(' ');
        let explainPayloadExplain = {
            model: "text-davinci-003",
            prompt: explainInputExplain,
            temperature: 0,
            max_tokens: 60,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0
        }
    
        axios.post('https://api.openai.com/v1/completions', explainPayloadExplain, configExplain)
        .then((res)=> {
            //Main Tone
            let tone = res.data.choices[0].text 
            // console.log(tone);           
            let newText = tone.replace('\n', '');   
            setExplainTone(newText)  
            // console.log(newText); 
            setAPIIsLoading(false);
            setAPIRan(false)
        })
        .catch(function (error) {
            console.log(error);
            setAPIIsLoading(false);
        });
        
    } else {
        // If there are less than 5 messages, you can show a message to the user or handle this case as needed
        setEnoughMSG(false);
        console.log("Not enough messages to analyze the conversation.");
    }
}, [enoughMSG]); // Add user1msg and user2msg as dependencies
  
    let [explainTone, setExplainTone] = useState();
 
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
        <View>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop:'7%', marginBottom:'3%'}}>
                <ProfileImage
                    uri={currentUser.profilePicture}
                    width={125}
                    height={125}
                    style={{ marginRight: 10 }}
                />
                <View style={{width:'62%', marginLeft:'1%'}}>
                    <Text style={styles.titleText}>{currentUser.firstName} {currentUser.lastName}</Text>
                    {
                        currentUser.about &&
                        <>
                            <Text style={[styles.about, {fontFamily: 'medium', marginTop:'1%', fontSize: 16,}]} numberOfLines={2}>About:</Text>
                            <Text style={styles.about}>{currentUser.about}</Text>
                        </>
                    }
                </View>
            </View>           

            <View style={{width:'100%', height:'30%'}}>
                {!enoughMSG && 
                    <>
                        <Text style={{fontFamily:'semiBold', fontSize:16, letterSpacing: 0.3,marginBottom:'1%'}}>Cant run AI</Text>
                        <Text style={{fontSize:14, letterSpacing: 0.3, marginBottom:'1%'}}>There needs to be more than 5 messages between you and {currentUser.firstName} before you can analyse the conversation</Text>
                    </>
                }
                
                {APIisLoading && APIRan&& <LottieView  style={{width:'100%', height:'100%', marginLeft:'22%',}} source={loadingAnimation} autoPlay loop />}
                
                {!APIisLoading && !APIRan &&
                    <Animated.View style={{opacity: fadeAnim}}>
                        <Text style={styles.explainTitle1}>Overall theme of the conversation:</Text>
                        <Text style={styles.explainResponse}>{explainTone} </Text>
                        <Text style={styles.explainTitle2}>Overall tone of conversation </Text>
                        
                        <View style={styles.toneContainer}>
                            <Tone text={activeTone1} color={toneColor1} />
                            <Tone text={activeTone2} color={toneColor2} />
                            <Tone text={activeTone3} color={toneColor3} />
                        </View>
                    </Animated.View>
                }
            </View>
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
    titleText: {
        fontSize: 16,
        color: colors.darkBlue,
        fontFamily: 'semiBold',
        letterSpacing: 0.3,
        marginTop:0
    },
    about: {
        marginBottom:'3%',
        fontFamily: 'regular',
        fontSize: 14,
        letterSpacing: 0.3,
        color: colors.darkBlue,
    },
    topContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20
    },
    heading: {
        fontFamily: 'bold',
        letterSpacing: 0.3,
        color: colors.textColor,
        marginVertical: 8
    },
    explainTitle1: {
        color: colors.darkBlue,
        fontFamily: 'semiBold',
        textAlign:'left',
        marginTop:'5%',
    },
    explainTitle2: {
        color: colors.darkBlue,
        fontFamily: 'semiBold',
        textAlign:'left',
        marginTop:'5%',
    },
    explainResponse: {
        color: colors.darkBlue, 
        // marginTop:'5%',
    },
    toneContainer:{
        flexDirection: 'row',
        width:'100%',
        marginTop:'3%',
    },
});

export default ContactScreen;