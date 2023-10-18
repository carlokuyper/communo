import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import DataItem from '../components/DataItem';
import PageContainer from '../components/PageContainer';
import ProfileImage from '../components/ProfileImage';
import SubmitButton from '../components/SubmitButton';
import colors from '../constants/colors';
import { removeUserFromChat } from '../utils/actions/chatActions';
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

    const [APIisLoading, setAPIIsLoading] = useState(false);
    const [APIRan, setAPIRan] = useState(false);
    
    const [fadeAnim] = useState(new Animated.Value(0));  // Initial value for opacity: 0

    useEffect(() => {
        return navigation.addListener('blur', () => {
        dispatch(setUser1Chats([]));
        dispatch(setUser2Chats([]));
        });
    }, [navigation]);
    
    useEffect(() => {
        setAPIIsLoading(true);
        setAPIRan(true)

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
            console.log(activeMsgTone);
            
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
        let explainInputExplain = "Analyse the following conversation between two individuals and provide an overview of the general emotions, atmosphere, and tone. Limit your analysis to about three lines. The conversation is as follows: " + userData.firstLast + " expressed: " + user1msg.join(' ') + ". Meanwhile, " + currentUser.firstName + " " + currentUser.lastName + " conveyed: " + user2msg.join(' ');
        let explainPayloadExplain = {
            model: "text-davinci-003",
            prompt: explainInputExplain,
            temperature: 0,
            max_tokens: 60,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0
        }
        function removeNewlines(str) {
            return str.replace(/\n/g, '');
          }
        axios.post('https://api.openai.com/v1/completions', explainPayloadExplain, configExplain)
        .then((res)=> {
            //Main Tone
            let tone = res.data.choices[0].text 
            // console.log(tone);           
            let newText = removeNewlines(tone);  
            setExplainTone(newText)  
            // console.log(newText); 
            setAPIIsLoading(false);
            setAPIRan(false)
        })
        .catch(function (error) {
            console.log(error);
            setAPIIsLoading(false);
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
                    width={'95%'}
                    height={200}
                    style={{ marginBottom: '7.5%' }}
                />
                <Text style={styles.titleText} >{currentUser.firstName} {currentUser.lastName}</Text>
            </View>
            { currentUser.about &&
                <View style={{marginLeft:'5%'}}>
                    <Text style={styles.heading}>About</Text>
                    <Text style={styles.about} numberOfLines={2}>{currentUser.about}</Text>
                </View>
            }

              <View style={{width:'90%', height:'30%', marginTop:'5%', marginLeft:'5%'}}>
              {APIisLoading && APIRan&& <LottieView  style={{width:'100%', height:'100%', marginLeft:'22%', marginTop:'-5%'}} source={loadingAnimation} autoPlay loop />}
              {!APIisLoading && !APIRan &&
                <Animated.View style={{opacity: fadeAnim}}>
                    <Text style={styles.explainTitle1}>Overall theme of the conversation:</Text>
                    <Text style={styles.explainResponse}>{explainTone}</Text>

                    <Text style={styles.explainTitle2}>Overall tone of conversation </Text>
                    <View style={styles.toneContainer}>
                        <Tone text={activeTone1} color={toneColor1} />
                        <Tone text={activeTone2} color={toneColor2} />
                        <Tone text={activeTone3} color={toneColor3} />
                    </View>
                </Animated.View>}
                
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
        fontSize: 28,
        color: colors.darkBlue,
        fontFamily: 'semiBold',
        letterSpacing: 0.3
    },
    topContainer: {
        marginVertical: 20,
        marginLeft:'5%'
    },
    about: {
        fontFamily: 'regular',
        fontSize: 16,
        letterSpacing: 0.3,
    },
    heading: {
        fontFamily: 'semiBold',
        letterSpacing: 0.3,
        color: colors.textColor,
    },
    explainTitle1: {
        color: colors.darkBlue,
        fontFamily: 'semiBold',
        textAlign:'left',
        marginBottom:0
    },
    explainTitle2: {
        color: colors.darkBlue,
        fontFamily: 'semiBold',
        textAlign:'left',
        marginTop:'2%',
        marginBottom:'2%'
    },
    explainResponse: {
        color: colors.darkBlue, 
        marginTop:'2%',
    },
    toneContainer:{
        flexDirection: 'row',
        width:'100%',
    },
});

export default ContactScreen;