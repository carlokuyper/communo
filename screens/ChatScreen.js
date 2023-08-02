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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import backgroundImage from "../assets/images/chatScreen.png";
import robot from "../assets/images/robot.png";

import colors from "../constants/colors";
import { useSelector } from "react-redux";
import PageContainer from "../components/PageContainer";
import Bubble from "../components/Bubble";
import { createChat, sendImage, sendTextMessage } from "../utils/actions/chatActions";
import ReplyTo from "../components/ReplyTo";
import { launchImagePicker, openCamera, uploadImageAsync } from "../utils/imagePickerHelper";
import AwesomeAlert from 'react-native-awesome-alerts';
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../components/CustomHeaderButton";
import axios from "axios";
import Tone from "../components/Tone";

const ChatScreen = (props) => {
  const [chatUsers, setChatUsers] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [chatId, setChatId] = useState(props.route?.params?.chatId);
  const [errorBannerText, setErrorBannerText] = useState("");
  const [replyingTo, setReplyingTo] = useState();
  const [tempImageUri, setTempImageUri] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [toneColor, setToneColor] = useState()

  const flatList = useRef();

  const userData = useSelector(state => state.auth.userData);
  const storedUsers = useSelector(state => state.users.storedUsers);
  const storedChats = useSelector(state => state.chats.chatsData);
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

  useEffect(() => {
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

  const sendMessage = useCallback(async () => {

    try {
      let id = chatId;
      if (!id) {
        // No chat Id. Create the chat
        id = await createChat(userData.userId, props.route.params.newChatData);
        setChatId(id);
      }

      await sendTextMessage(id, userData.userId, messageText, toneColor, replyingTo && replyingTo.key);

      setMessageText("");
      setReplyingTo(null);
    } catch (error) {
      console.log(error);
      setErrorBannerText("Message failed to send");
      setTimeout(() => setErrorBannerText(""), 5000);
    }
  }, [messageText, chatId, toneColor]);


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

  
  const [timer, setTimer] = useState(null)

  const [toneColor1, setToneColor1] = useState();
  const [toneColor2, setToneColor2] = useState();
  const [toneColor3, setToneColor3] = useState();

  let [activeTone1, setActiveTone1] = useState();
  let [activeTone2, setActiveTone2] = useState();
  let [activeTone3, setActiveTone3] = useState();
  let [currentExplain, setCurrentExplain] = useState();
  
  const runNLP = e => {
    // console.log("test nlpRequest");  
    
    setActiveTone1();
    setActiveTone2();
    setActiveTone3();
    setCurrentExplain();

    setMessageText(e.target.value)

    clearTimeout(timer)

    // API config 
    const config = {
      headers:{
          Authorization: "Bearer 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",
      }
    };

    const newTimer = setTimeout (()=> {

      let msg = props.msg
      
      //Explain the tone of the message
      let msgTone = "Identify the three tones in the message but add a * add the beginning of to the tone. \nTone:" + "\nGive the associated color in hex value using Plutchik’s Psycho-evolutionary Theory of Emotion" + "\nMessage:" + messageText 
      let tonesPayload = {
        model: "text-davinci-003",
        prompt: msgTone,
        temperature: 0,
        max_tokens: 60,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      }

      axios.post('https://api.openai.com/v1/completions', tonesPayload, config)
      .then((res)=> {
        // console.log(res);

        let tone = res.data.choices[0].text.toLowerCase().toString().split(/[\s,]+/)
        console.log(tone);  

        let stringColor = tone.filter((colour) => colour.startsWith("#"));
        console.log(stringColor);

        let tones = tone.filter((tone) => tone.startsWith("*"));
        str = 'Hello cy Adele';

        newStr = str.replace('e', '');
        console.log(newStr);

        //Main Tone
        let myTone = tone[3]
        let msgColor = myTone.toString()
        console.log(msgColor);
        setToneColor(msgColor)

        setActiveTone1(tone[2])                
        setToneColor1(stringColor[0])
        setActiveTone2(tone[5])                
        setToneColor2(stringColor[1])
        setActiveTone3(tone[8])                
        setToneColor3(stringColor[2])
        
      })
      .catch(function (error) {
          console.log(error);
      });

      //Explain the user message
      let explainInput = " Explain how the message will be understood \n\nMessage:" + messageText + "\nTone:\n"
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
          console.log(tone);           
          let newText = tone.replace('\n', '');   
          setCurrentExplain(newText)  
          console.log(newText);  

      })
      .catch(function (error) {
          console.log(error);
      });

      
    }, 1000)
    setTimer(newTimer)
  }


  return (
    <SafeAreaView edges={["right", "left", "bottom"]} style={styles.container}>
      
        <ImageBackground
          source={backgroundImage}
          style={styles.backgroundImage}
        >
          <PageContainer style={{ backgroundColor: 'transparent'}}>

            {
              !chatId && <Bubble text='This is a new chat. Say hi!' type="system" />
            }

            {
              errorBannerText !== "" && <Bubble text={errorBannerText} type="error" />
            }

            {
              chatId && 
              <FlatList
                ref={(ref) => flatList.current = ref}
                onContentSizeChange={() => flatList.current.scrollToEnd({ animated: false })}
                onLayout={() => flatList.current.scrollToEnd({ animated: false })}

                // onContentSizeChange={() => chatMessages.length > 0 && flatList.current.scrollToEnd({ animated: false })}
                // onLayout={() => chatMessages.length > 0 && flatList.current.scrollToEnd({ animated: false })}

                // onContentSizeChange={() => selectedUsers.length > 0 && selectedUsersFlatList.current.scrollToEnd() }

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

                  return <Bubble
                              type={messageType}
                            text={message.text}
                            toneColor={message.toneColor}
                            messageId={message.key}
                            userId={userData.userId}
                            chatId={chatId}
                            date={message.sentAt}
                            name={!chatData.isGroupChat || isOwnMessage ? undefined : name}
                            setReply={() => setReplyingTo(message)}
                            replyingTo={message.replyTo && chatMessages.find(i => i.key === message.replyTo)}
                            imageUrl={message.imageUrl}
                          />
                }}
              />
            }


          </PageContainer>

          {
            replyingTo &&
            <ReplyTo
              text={replyingTo.text}
              user={storedUsers[replyingTo.sentBy]}
              onCancel={() => setReplyingTo(null)}
            />
          }


        <View style={styles.toneMainContainer}>
            <View style={{ width: '100%', minHeight:80, flexDirection: 'row'}}>
            {messageText && currentExplain && <Text style={styles.explainText} >{currentExplain}</Text>}
              <Image source={robot} style={styles.robot}/>
            </View>
            {messageText && activeTone1 &&<View style={styles.toneContainer}>
              <Tone text={activeTone1} color={toneColor1} />
              <Tone text={activeTone2} color={toneColor2} />
              <Tone text={activeTone3} color={toneColor3} />
            </View>}
          </View>

        </ImageBackground>

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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
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
    borderRadius: 50,
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
    // backgroundColor: 'rgba(52, 52, 52, alpha)'
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
