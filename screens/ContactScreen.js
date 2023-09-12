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

const ContactScreen = props => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(false);
    const storedUsers = useSelector(state => state.users.storedUsers);
    const userData = useSelector(state => state.auth.userData);
    const currentUser = storedUsers[props.route.params.uid];

    const storedChats = useSelector(state => state.chats.chatsData);
    const [commonChats, setCommonChats] = useState([]);

    const chatId = useSelector(state => state.auth.userData.userId)
    const chatData = chatId && storedChats[chatId];

    const user1Chats = useSelector(state => state.analysis.user1Chats);
    const user2Chats = useSelector(state => state.analysis.user2Chats);

    let user1msg = user1Chats.map(message => message.text);
    let user2msg = user2Chats.map(message => message.text);
    
    const [toneColor1, setToneColor1] = useState();
    const [toneColor2, setToneColor2] = useState();
    const [toneColor3, setToneColor3] = useState();

    let [activeTone1, setActiveTone1] = useState();
    let [activeTone2, setActiveTone2] = useState();
    let [activeTone3, setActiveTone3] = useState();

    useEffect(() => {
        return navigation.addListener('blur', () => {
        dispatch(setUser1Chats([]));
        dispatch(setUser2Chats([]));
        });
    }, [navigation]);
    
    useEffect(() => {
        
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
            // console.log(res);
         
            let tone = res.data.choices[0].text.toLowerCase().toString().split(/[\s,]+/)
            // console.log(tone);  
    
            let msgColour = tone.filter((colour) => colour.startsWith("#")).map((item) => item.replace(/[*_"_'_:_;_._{_}_(_)]/g,''));
            // console.log(msgColour);
    
            let activeMsgTone = tone.filter((colour) => colour.startsWith("*")).map((item) => item.replace(/[*_"_'_:_;_._{_}_(_)]/g,''));
            // console.log(activeMsgTone);
    
            // //Main Tone  
            setActiveTone1(activeMsgTone[0])
            setToneColor1(msgColour[0])
            setActiveTone2(activeMsgTone[1])                
            setToneColor2(msgColour[1])
            setActiveTone3(activeMsgTone[2])                
            setToneColor3(msgColour[2]) 
    
        })
        .catch(function (error) {
            console.log(error);
        });

        const configExplain = {
            headers:{
                Authorization: "Bearer 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",
            }
          };
    
        //Explain the user message
        let explainInputExplain = "Analyse the messages between individuals in this conversation and provide an overview of the general emotions, atmosphere, and tone of the conversation, but keep it to about lines . /The conversation includes the following messages:  " + userData.firstLast + " expressed " + user1msg + " while " + currentUser.firstName + " " + currentUser.lastName + " conveyed " + user2msg
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
            // console.log(res);

            //Main Tone
            let tone = res.data.choices[0].text 
            // console.log(tone);           
            let newText = tone.replace('\n', '');   
            setExplainTone(newText)  
            // console.log(newText); 
    
        })
        .catch(function (error) {
            console.log(error);
        });
    
    }, [])
  
    
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
            <View style={styles.topContainer}>
                <ProfileImage
                    uri={currentUser.profilePicture}
                    size={125}
                    style={{ marginBottom: 20 }}
                />

                <Text style={styles.titleText} >{currentUser.firstName} {currentUser.lastName}</Text>
            </View>
           
            <View >
                <Text style={styles.explainTitle1}>Overall theme of the conversation:</Text>
                <Text style={styles.explainResponse}>{explainTone}</Text>
                <Text style={styles.explainTitle2}>Overall tone of conversation </Text>
                
                <View style={styles.toneContainer}>
                    <Tone text={activeTone1} color={toneColor1} />
                    <Tone text={activeTone2} color={toneColor2} />
                    <Tone text={activeTone3} color={toneColor3} />
                </View>
                
            </View>
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
    titleText: {
        fontSize: 28,
        color: colors.darkBlue,
        fontFamily: 'bold',
        letterSpacing: 0.3
    },
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
    },
    explainTitle1: {
        color: colors.darkBlue,
        fontFamily: 'bold',
        textAlign:'left',
    },
    explainTitle2: {
        color: colors.darkBlue,
        fontFamily: 'bold',
        textAlign:'left',
        marginTop:'2%',
        marginBottom:'2%'
    },
    explainResponse: {
        color: colors.darkBlue, 
    },
    toneContainer:{
        flexDirection: 'row',
        width:'100%',
    },
    
});

export default ContactScreen;