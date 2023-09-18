import { child, get, getDatabase, push, ref, remove, set, update } from "firebase/database";
import { getFirebaseApp } from "../firebaseHelper";
import { addUserChat, deleteUserChat, getUserChats } from "./userActions";

export const createChat = async (loggedInUserId, chatData) => {

    const newChatData = {
        ...chatData,
        createdBy: loggedInUserId,
        updatedBy: loggedInUserId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const newChat = await push(child(dbRef, 'chats'), newChatData);

    const chatUsers = newChatData.users;
    for (let i = 0; i < chatUsers.length; i++) {
        const userId = chatUsers[i];
        await push(child(dbRef, `userChats/${userId}`), newChat.key);
    }

    return newChat.key;
}

export const sendTextMessage = async (chatId, senderId, messageText, toneColor1, toneColor2, toneColor3, activeTone1, activeTone2, activeTone3, currentExplain, replyTo) => {
    await sendMessage(chatId, senderId, messageText, toneColor1, toneColor2, toneColor3, activeTone1, activeTone2, activeTone3, currentExplain, null, replyTo, null);
}

export const sendInfoMessage = async (chatId, senderId, messageText, toneColor1, toneColor2, toneColor3, activeTone1, activeTone2, activeTone3, currentExplain,) => {
    await sendMessage(chatId, senderId, messageText, toneColor1, toneColor2, toneColor3, activeTone1, activeTone2, activeTone3, currentExplain,  null, null, "info");
}

export const sendImage = async (chatId, senderId, imageUrl, replyTo) => {
    await sendMessage(chatId, senderId, '#ffffff', '#ffffff', '#ffffff', 'Image', 'Image', 'Image', 'Image', 'Image', imageUrl, replyTo, null);
}

export const updateChatData = async (chatId, userId, chatData) => {
    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const chatRef = child(dbRef, `chats/${chatId}`);

    await update(chatRef, {
        ...chatData,
        updatedAt: new Date().toISOString(),
        updatedBy: userId
    })
}

const sendMessage = async (chatId, senderId, messageText, toneColor1, toneColor2, toneColor3, activeTone1, activeTone2, activeTone3,  currentExplain, imageUrl, replyTo, type) => {
    const app = getFirebaseApp();
    const dbRef = ref(getDatabase());
    const messagesRef = child(dbRef, `messages/${chatId}`);
    // console.log(toneColor1 + toneColor2 + toneColor3 + activeTone1 + activeTone2 + activeTone3);

    const messageData = {
        sentBy: senderId,
        sentAt: new Date().toISOString(),
        text: messageText,
    };

    if (replyTo) {
        messageData.replyTo = replyTo;
    }

    if (imageUrl) {
        messageData.imageUrl = imageUrl;
    }

    if (toneColor1) {
        messageData.toneColor1 = toneColor1;
    }
    if (toneColor2) {
        messageData.toneColor2 = toneColor2;
    }
    if (toneColor3) {
        messageData.toneColor3 = toneColor3;
    }

    if (activeTone1) {
        messageData.activeTone1 = activeTone1;
    }
    if (activeTone2) {
        messageData.activeTone2 = activeTone2;
    }
    if (activeTone3) {
        messageData.activeTone3 = activeTone3;
    }
    
    if (currentExplain) {
        messageData.currentExplain = currentExplain;
    }

    if (type) {
        messageData.type = type;
    }

    await push(messagesRef, messageData);

    const chatRef = child(dbRef, `chats/${chatId}`);
    await update(chatRef, {
        updatedBy: senderId,
        updatedAt: new Date().toISOString(),
        latestMessageText: messageText
    });
}

export const starMessage = async (messageId, chatId, userId) => {
    try {
        const app = getFirebaseApp();
        const dbRef = ref(getDatabase(app));
        const childRef = child(dbRef, `userStarredMessages/${userId}/${chatId}/${messageId}`);

        const snapshot = await get(childRef);

        if (snapshot.exists()) {
            // Starred item exists - Un-star
            await remove(childRef);
        }
        else {
            // Starred item does not exist - star
            const starredMessageData = {
                messageId,
                chatId,
                starredAt: new Date().toISOString()
            }

            await set(childRef, starredMessageData);
        }
    } catch (error) {
        console.log(error);        
    }
}

export const removeUserFromChat = async (userLoggedInData, userToRemoveData, chatData) => {
    const userToRemoveId = userToRemoveData.userId;
    const newUsers = chatData.users.filter(uid => uid !== userToRemoveId);
    await updateChatData(chatData.key, userLoggedInData.userId, { users: newUsers });

    const userChats = await getUserChats(userToRemoveId);

    for (const key in userChats) {
        const currentChatId = userChats[key];

        if (currentChatId === chatData.key) {
            await deleteUserChat(userToRemoveId, key);
            break;
        }
    }

    const messageText = userLoggedInData.userId === userToRemoveData.userId ?
        `${userLoggedInData.firstName} left the chat` :
        `${userLoggedInData.firstName} removed ${userToRemoveData.firstName} from the chat`;

    await sendInfoMessage(chatData.key, userLoggedInData.userId, messageText);
}


const generateMessageData = (userLoggedInData, newUsers, userAddedName) => {
    const moreUsersMessage = newUsers.length > 1 ? `and ${newUsers.length - 1} others ` : '';
    const messageText = `${userLoggedInData.firstName} ${userLoggedInData.lastName} added ${userAddedName} ${moreUsersMessage}to the chat`;

    // Replace 'some value' with the actual values or logic to generate these values
    const toneColor1 = 'some value';
    const toneColor2 = 'some value';
    const toneColor3 = 'some value';
    const activeTone1 = 'some value';
    const activeTone2 = 'some value';
    const activeTone3 = 'some value';
    const currentExplain = 'some value';

    return {
        messageText,
        toneColor1,
        toneColor2,
        toneColor3,
        activeTone1,
        activeTone2,
        activeTone3,
        currentExplain
    };
}

export const addUsersToChat = async (userLoggedInData, usersToAddData, chatData) => {
    const existingUsers = Object.values(chatData.users);
    const newUsers = [];

    let userAddedName = "";

    usersToAddData.forEach(async userToAdd => {
        const userToAddId = userToAdd.userId;

        if (existingUsers.includes(userToAddId)) return;

        newUsers.push(userToAddId);

        await addUserChat(userToAddId, chatData.key);

        userAddedName = `${userToAdd.firstName} ${userToAdd.lastName}`;
    });

    if (newUsers.length === 0) {
        return;
    }

    await updateChatData(chatData.key, userLoggedInData.userId, { users: existingUsers.concat(newUsers) })

    const messageData = generateMessageData(userLoggedInData, newUsers, userAddedName);

    await sendInfoMessage(chatData.key, userLoggedInData.userId, messageData.messageText, messageData.toneColor1, messageData.toneColor2, messageData.toneColor3, messageData.activeTone1, messageData.activeTone2, messageData.activeTone3, messageData.currentExplain);
}