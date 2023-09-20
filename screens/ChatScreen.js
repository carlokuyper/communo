import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import backgroundImage from "../assets/images/chatBackground.png";
import robot from "../assets/images/robot.png";

import colors from "../constants/colors";
import { useDispatch, useSelector } from "react-redux";
import PageContainer from "../components/PageContainer";
import Bubble from "../components/Bubble";
import ChatBubble from "../components/ChatBubble";
import MSGInfo from "../components/MSGInfo";
import { createChat, sendImage, sendTextMessage } from "../utils/actions/chatActions";
import ReplyTo from "../components/ReplyTo";
import { launchImagePicker, openCamera, uploadImageAsync } from "../utils/imagePickerHelper";
import AwesomeAlert from 'react-native-awesome-alerts';
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../components/CustomHeaderButton";
import axios from "axios";
import Tone from "../components/Tone";
import MaskedView from "@react-native-masked-view/masked-view";
import { AsyncStorage } from 'react-native';
import { Swipeable } from "react-native-gesture-handler";
import { clearAnalysis, setSelectedMessage, setUser1Chats, setUser2Chats } from "../store/analysisSlice";

const ChatScreen = (props) => {
  const [chatUsers, setChatUsers] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [chatId, setChatId] = useState(props.route?.params?.chatId);
  const [errorBannerText, setErrorBannerText] = useState("");
  const [replyingTo, setReplyingTo] = useState();
  const [tempImageUri, setTempImageUri] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const flatList = useRef();

  const userData = useSelector(state => state.auth.userData);
  const storedUsers = useSelector(state => state.users.storedUsers);
  const storedChats = useSelector(state => state.chats.chatsData);

  const dispatch = useDispatch();
  
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

  const chatData = (chatId && storedChats[chatId]) || props.route?.params?.newChatData || {};

  const getChatTitleFromName = () => {
    const otherUserId = chatUsers.find(uid => uid !== userData.userId);
    const otherUserData = storedUsers[otherUserId];

    return otherUserData && `${otherUserData.firstName} ${otherUserData.lastName}`;
  }

  const user1Chats = chatMessages.filter(message => message.sentBy === userData.userId);
  const user2Chats = chatMessages.filter(message => message.sentBy !== userData.userId);

  useEffect(() => {
    dispatch(setUser1Chats(user1Chats));
    dispatch(setUser2Chats(user2Chats));

    if (!chatData) return;
    
    props.navigation.setOptions({
      headerTitle: chatData.chatName ?? getChatTitleFromName(),
      headerStyle: {
        backgroundColor: colors.white
      },
      headerRight: () => {
        return <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          {
            chatId && 
            <Item
              title="Chat settings"
              iconName="settings-outline"
              onPress={() => chatData.isGroupChat ?
                props.navigation.navigate("ChatSettings", { chatId }) :
                props.navigation.navigate("Contact", { uid: chatUsers.find(uid => uid !== userData.userId) })}
            />
          }
        </HeaderButtons>
      }
    })
    setChatUsers(chatData.users)
  }, [chatUsers])
  
  const [timer, setTimer] = useState(null)

  const [toneColor1, setToneColor1] = useState();
  const [toneColor2, setToneColor2] = useState();
  const [toneColor3, setToneColor3] = useState();

  let [activeTone1, setActiveTone1] = useState();
  let [activeTone2, setActiveTone2] = useState();
  let [activeTone3, setActiveTone3] = useState();
  let [currentExplain, setCurrentExplain] = useState();
  
  const debounceTimer = useRef();

  const [APIisLoading, setAPIIsLoading] = useState(false);
  
  const runNLP = e => {
    // console.log("test nlpRequest");  
    
    setMessageText(e.target.value)

    clearTimeout(debounceTimer.current)
    setAPIIsLoading(true);
    debounceTimer.current = setTimeout(() => {
      
      // API config 
      const config = {
        headers:{
          Authorization: "Bearer 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",
        }
      };

      const newTimer = setTimeout (()=> {
        let msg = props.msg
        
        //Explain the tone of the message
        let msgTone = "Use Plutchik's Psycho-evolutionary Theory of Emotion to determine the three tones in the message and add a * at the beginning of each tone. Use the same theory to determine the associated colour and provide it in hex values also. Explain how the message will be understood keep it to two sentence" + "\nMessage:" + messageText 
        let tonesPayload = {
          model: "gpt-4",
          prompt: msgTone,
          temperature: 1,
          max_tokens: 256,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0
        }

        axios.post('https://api.openai.com/v1/completions', tonesPayload, config)
        .then((res)=> {

          console.log('res.data ');
          console.log(res.data);

          let tone = res.data.choices[0].text.toLowerCase().toString().split(/[\s,]+/)
          console.log(tone);  

          let msgColor = tone.filter((colour) => colour.startsWith("#")).map((item) => item.replace(/[*_"_'_:_;_._{_}_(_)]/g,''));
          console.log(msgColor);

          let activeMsgTone = tone.filter((colour) => colour.startsWith("*")).map((item) => item.replace(/[*_"_'_:_;_._{_}_(_)]/g,''));
          console.log(activeMsgTone);

          //Main Tone  
          setActiveTone1(activeMsgTone[0])                
          setToneColor1(msgColor[0])
          setActiveTone2(activeMsgTone[1])                
          setToneColor2(msgColor[1])
          setActiveTone3(activeMsgTone[2])                
          setToneColor3(msgColor[2])

        })
        .catch(function (error) {
            console.log(error);
        });

        //Explain the user message
        let explainInput = "Explain how the message will be understood keep it to two sentence \n\nMessage:" + messageText + "\nTone:\n"
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
            let tone = res.data.choices[0].text       
            let newText = tone.replace('\n', '');   
            setCurrentExplain(newText)  
            console.log(newText);  
        })
        .catch(function (error) {
            console.log(error);
        });
      })

      if (currentExplain !== null && activeTone1 !== null){
        setAPIIsLoading(false);
        console.log("loading done currentExplain");
      }
     
      
    }, 2000);

  }

  const sendMessage = useCallback(async () => {

    try {
      let id = chatId;
      if (!id) {
        // No chat Id. Create the chat
        id = await createChat(userData.userId, props.route.params.newChatData);
        setChatId(id);
      }

      await sendTextMessage(id, userData.userId, messageText, toneColor1, toneColor2, toneColor3, activeTone1, activeTone2, activeTone3, currentExplain, replyingTo && replyingTo.key);

      setMessageText("");
      setReplyingTo(null);
    } catch (error) {
      console.log(error);
      setErrorBannerText("Message failed to send");
      setTimeout(() => setErrorBannerText(""), 5000);
    }
  }, [messageText, chatId, toneColor1, toneColor2, toneColor3, activeTone1, activeTone2, activeTone3, currentExplain,]);


  const pickImage = useCallback(async () => {
    try {
      const tempUri = await launchImagePicker();
      if (!tempUri) return;

      setTempImageUri(tempUri);
    } catch (error) {
      console.log(error);
    }
  }, [tempImageUri]);

  const takePhoto = useCallback(async () => {
    try {
      const tempUri = await openCamera();
      if (!tempUri) return;

      setTempImageUri(tempUri);
    } catch (error) {
      console.log(error);
    }
  }, [tempImageUri]);

  const uploadImage = useCallback(async () => {
    setIsLoading(true);

    try {

      let id = chatId;
      if (!id) {
        // No chat Id. Create the chat
        id = await createChat(userData.userId, props.route.params.newChatData);
        setChatId(id);
      }

      const uploadUrl = await uploadImageAsync(tempImageUri, true);
      setIsLoading(false);

      await sendImage(id, userData.userId, uploadUrl, replyingTo && replyingTo.key)
      setReplyingTo(null);
      setTimeout(() => setTempImageUri(""), 500);
      
    } catch (error) {
      console.log(error);
      
    }
  }, [isLoading, tempImageUri, chatId])

  let lastPress = 0;
  let [activeMsg, setActiveMsg] = useState(false);

  const onDoublePress = () => {
    const time = new Date().getTime();
    const delta = time - lastPress;
    const DOUBLE_PRESS_DELAY = 400;

    if (delta < DOUBLE_PRESS_DELAY) {
      // Success double press
      if (activeMsg == true) {
        console.log("double press from chatScreen: " + activeMsg); 
        setActiveMsg(false)          
      }
      if (activeMsg == false) {
        console.log("double press from chatScreen: " + activeMsg); 
        setActiveMsg(true)
      }
    }
    lastPress = time;
  };

  const onDoublePressChat = () => {
    if (activeMsg == true) {
      console.log("double press from other components: " + activeMsg);
      setActiveMsg(false)
    }
    if (activeMsg == false) {
      console.log("double press from other components: " + activeMsg);
      dispatch(clearAnalysis());
      setActiveMsg(true)
    }
  }

  return (
    <SafeAreaView edges={["right", "left", "bottom"]} style={styles.container}>
  
      <ImageBackground
        source={backgroundImage}
        style={styles.backgroundImage}
        imageStyle={{resizeMode: "contain",  marginLeft: -120, marginTop:-200, width:'120%',
        height:'120%'}}>

        {activeMsg && 
          <MSGInfo onDoublePress={onDoublePressChat} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)',}}/>
        }

        <View style={{ paddingLeft: 20, flex: 1,}}>
          
          {
            !chatId && <Bubble text='This is a new chat. Say hi!' type="system" />
          }

          {
            errorBannerText !== "" && <Bubble text={errorBannerText} type="error" />
          }

          {
            chatId && 
            <FlatList style={{width:'100%'}}
              ref={(ref) => flatList.current = ref}
              onContentSizeChange={() => flatList.current.scrollToEnd({ animated: false })}
              onLayout={() => flatList.current.scrollToEnd({ animated: false })}
              data={chatMessages}
              renderItem={(itemData) => {
                const message = itemData.item;
                const isOwnMessage = message.sentBy === userData.userId;

                let messageType;
                if (message.type && message.type === "info") {
                  messageType = "info";
                }  
                else if (isOwnMessage) {
                  messageType = "myMessage";
                }
                else {
                  messageType = "theirMessage";
                } 
                
                const sender = message.sentBy && storedUsers[message.sentBy];
                const name = sender && `${sender.firstName} ${sender.lastName}`;

                return <View onStartShouldSetResponder={() => onDoublePress()} dispatch={dispatch}>
                  <ChatBubble 
                      onDoublePress={() => onDoublePressChat()}
                      onClick={(e) => handleClick(e)}
                      type={messageType}
                      text={message.text}
                      toneColor1={message.toneColor1}
                      toneColor2={message.toneColor2}
                      toneColor3={message.toneColor3}
                      activeTone1={message.activeTone1} 
                      activeTone2={message.activeTone2}
                      activeTone3={message.activeTone3}
                      currentExplain={message.currentExplain}
                      messageId={message.key}
                      userId={userData.userId}
                      chatId={chatId}
                      date={message.sentAt}
                      name={!chatData.isGroupChat || isOwnMessage ? undefined : name}
                      setReply={() => setReplyingTo(message)}
                      replyingTo={message.replyTo && chatMessages.find(i => i.key === message.replyTo)}
                      imageUrl={message.imageUrl}
                    />
                  </View>
              }}
            />
          } 

        </View>

        {
          replyingTo &&
          <ReplyTo
            text={replyingTo.text}
            user={storedUsers[replyingTo.sentBy]}
            onCancel={() => setReplyingTo(null)}
          />
        }

      <View style={styles.toneMainContainer}>
      {APIisLoading && <ActivityIndicator size="large" color="#0000ff" />}
          <View style={{ width: '100%', minHeight:80, flexDirection: 'row'}}>
            {messageText && currentExplain && <Text style={styles.explainText} >{currentExplain}</Text>}
            <Image source={robot} style={styles.robot}/>
          </View>
            {currentExplain && <View style={styles.toneContainer}>
            
            <Tone text={activeTone1} color={toneColor1} />
            <Tone text={activeTone2} color={toneColor2} />
            <Tone text={activeTone3} color={toneColor3} />
          </View>}
        </View>
      

      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={styles.mediaButton}
          onPress={pickImage}
        >
          <Feather name="plus" size={24} color={colors.blue} />
        </TouchableOpacity>

        <TextInput
          style={styles.textbox}
          placeholderTextColor="grey"
          placeholder="Type here..."
          value={messageText}
          onChangeText={(text) => setMessageText(text)}
          onSubmitEditing={sendMessage}
          onChange={runNLP}
        />

        {messageText === "" && (
          <TouchableOpacity
            style={styles.mediaButton}
            onPress={takePhoto}
          >
            <Feather name="camera" size={24} color={colors.blue} />
          </TouchableOpacity>
        )}

        {messageText !== "" && (
          <TouchableOpacity
            style={{ ...styles.mediaButton, ...styles.sendButton }}
            onPress={sendMessage}
          >
            <Feather name="send" size={20} color={"white"} />
          </TouchableOpacity>
        )}
          <AwesomeAlert
            show={tempImageUri !== ""}
            title='Send image?'
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={false}
            showCancelButton={true}
            showConfirmButton={true}
            cancelText='Cancel'
            confirmText="Send image"
            confirmButtonColor={colors.primary}
            cancelButtonColor={colors.red}
            titleStyle={styles.popupTitleStyle}
            onCancelPressed={() => setTempImageUri("")}
            onConfirmPressed={uploadImage}
            onDismiss={() => setTempImageUri("")}
            customView={(
              <View>
                {
                  isLoading &&
                  <ActivityIndicator size='small' color={colors.primary} />
                }
                {
                  !isLoading && tempImageUri !== "" &&
                  <Image source={{ uri: tempImageUri }} style={{ width: 200, height: 200 }} />
                }
              </View>
            )}
          />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor:"white"
  },
  screen: {
    flex: 1
  },
  backgroundImage: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 10,
    height: 50,
    backgroundColor: colors.background,
    
  },
  textbox: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors.lightGrey,
    marginHorizontal: 15,
    paddingHorizontal: 12,
    color:"white"
  },
  mediaButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 35,
  },
  sendButton: {
    backgroundColor: colors.blue,
    borderRadius: 50,
    padding: 8,
  },
  popupTitleStyle: {
    fontFamily: 'medium',
    letterSpacing: 0.3,
    color: colors.textColor
  },
  toneMainContainer:{
    width:'100%',
    // height:60,
    // backgroundColor: 'rgba(250, 52, 52, 0.)',
    marginBottom:'1%',
  },
  toneContainer:{
    flexDirection: 'row'
  },
  explainText: {
    backgroundColor: "white",
    borderRadius:20,
    padding:10,
    marginBottom:'2%',
    width:'82%'
  },
  robot:{
    flex:1,
    width: '15%',
    height: 60, 
    position: 'absolute',
    bottom:'1%',
    marginBottom:'2%',
    right:'1.5%',
    alignItems:'center',
    backgroundColor:'#393B3C',
    padding:5,
    borderRadius:10
  }
});

export default ChatScreen;
