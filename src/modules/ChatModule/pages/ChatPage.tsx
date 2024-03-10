import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { uuidv4 } from '../../../utils'
import { Message, MessageImage, MessagePartialText, MessageText } from '../../../types/Chat'
import { getMessagesSelector, getRoomSelector, useChatStore } from '../chatStore'
import { getUserSelector, useUserStore } from '@/modules/UserModule'
import { ChatContainer } from '../components/ChatContainer'

type ChatProps = {}

export const ChatPage: React.FC<ChatProps> = () => {
  const navigate = useNavigate()
  let params = useParams()

  if (!params.chatId) {
    navigate('/')
  }
  let chatId = params.chatId as string
  // console.log('chatId', chatId)
  // var ws = React.useRef(new WebSocket('ws://w567l.sse.codesandbox.io/')).current;
  // const room = useChatStore((state) => getRoomSelector(state, chatId))

  const messages = useChatStore((state) => getMessagesSelector(state, chatId))
  const currentUser = useUserStore(getUserSelector)
  const addMessage = useChatStore((state) => state.addMessage)
  const getRoomByRoomId = useChatStore((state) => state.getRoomByRoomId)
  const fetchMessages = useChatStore((state) => state.fetchMessages)
  // console.log({ currentUser })

  useEffect(() => {
    // const serverMessagesList = [];
    // ws.onopen = () => {
    //   setServerState('Connected to the server')
    //   setDisableButton(false);
    // };
    // ws.onclose = (e) => {
    //   setServerState('Disconnected. Check internet or server.')
    //   setDisableButton(true);
    // };
    // ws.onerror = (e) => {
    //   setServerState(e.message);
    // };
    // ws.onmessage = (e) => {
    //   serverMessagesList.push(e.data);
    //   setServerMessages([...serverMessagesList])
    // };
console.log("render");

    if (params.chatId) {
      getRoomByRoomId(params.chatId)
      fetchMessages(params.chatId)
    }
  }, [])

  const onSend = useCallback((message: string) => {
    const textMessage: MessageText = {
      author: currentUser,
      createdAt: Date.now(),
      id: uuidv4(),
      roomId: chatId,
      text: message,
      type: 'text',
    }
    addMessage(textMessage, chatId)
  }, [])

  return <ChatContainer onSend={onSend} messages={messages} user={currentUser} />
}
