import { ChatContainer } from '@modules/ChatModule/components/ChatContainer';
import { getMessagesSelector, getRoomSelector, useChatStore } from '@modules/ChatModule/chatStore';
import { getUserSelector, useUserStore } from '@modules/UserModule/userStore';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { uuidv4 } from '../../../utils';
import { Message, MessageImage, MessagePartialText, MessageText } from '../../../types/Chat';
import { useNavigation, useRoute } from '@react-navigation/core';
import { MessageType } from '@flyerhq/react-native-chat-ui';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavOptions } from '../../../hooks/useNavOptions';
import { ChatScreenProps } from '@routers/types';


// example chat 
// https://github.com/cometchat-pro-tutorials/react-native-gifted-chat-app/blob/main/components/Chat.js

//https://www.cometchat.com/tutorials/build-a-chat-app-with-react-native-gifted-chat


// chat without gifted chat
// https://dev.to/novu/building-a-chat-app-with-socketio-and-react-native-k1b

// use https://docs.flyer.chat/react-native/chat-ui
export const ChatScreen: React.FC<ChatScreenProps> = ({ route }) => {
  const chatId = route.params?.chatId 
  console.log("chatId", chatId);
  
  const room = useChatStore((state) => getRoomSelector(state, chatId))
 
  const messages = useChatStore((state) => getMessagesSelector(state, room?.id || ""))
  const currentUser = useUserStore(getUserSelector)
  console.log({currentUser});
  
  const navOptions = useMemo(() => {
    const title = room?.participants.find((user) => user.id !== currentUser.id)?.username
    return { title }
  }, [room?.participants])
  useNavOptions(navOptions)

  const addMessage = useChatStore((state) => state.addMessage)
  const fetchMessages = useChatStore((state) => state.fetchMessages)
  
  useEffect(() => {
    fetchMessages(chatId)
  }, [])

  const onSend = useCallback((message: MessagePartialText) => {
    const textMessage: MessageText = {
      author: currentUser,
      createdAt: Date.now(),
      id: uuidv4(),
      roomId: chatId,
      text: message.text,
      type: 'text',
    }
    addMessage(textMessage, chatId)
  }, []);

  const handleImageSelection = () => {
    launchImageLibrary(
      {
        includeBase64: true,
        maxWidth: 1440,
        mediaType: 'photo',
        quality: 0.7,
      },
      ({ assets }) => {
        const response = assets?.[0]

        if (response?.base64) {
          const imageMessage: MessageImage = {
            author: currentUser,
            createdAt: Date.now(),
            height: response.height,
            id: uuidv4(),
            name: response.fileName ?? response.uri?.split('/').pop() ?? '🖼',
            size: response.fileSize ?? 0,
            type: 'image',
            uri: `data:image/*;base64,${response.base64}`,
            width: response.width,
          }
          addMessage(imageMessage)
        }
      }
    )
  }
  
  if(!room) {
    return <></>
  }

  return (
    <ChatContainer
      onSend={onSend}
      onImageSend={handleImageSelection}
      messages={messages}
      user={currentUser}
    />
  );
}