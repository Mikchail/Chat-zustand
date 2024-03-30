import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { uuidv4 } from '../../../utils'
import { Message, MessageImage, MessagePartialText, MessageText } from '../../../types/Chat'
import { IChatStore, getMessagesSelector, getRoomSelector, useChatStore } from '../chatStore'
import { getUserSelector, useUserStore } from '@/modules/UserModule'
import { ChatContainer, ScrollHandle } from '../components/ChatContainer'
import { socket } from '@/api/socket'
import { Socket, io } from 'socket.io-client'

type ChatProps = {}

export const ChatPage: React.FC<ChatProps> = () => {
  const navigate = useNavigate()
  let params = useParams()

  if (!params.chatId) {
    navigate('/')
  }
  let chatId = params.chatId as string
  const scrollElementRef = useRef<ScrollHandle>(null)
  const getMessages = useCallback((state: IChatStore) => getMessagesSelector(state, chatId), [chatId])
  const messages = useChatStore(getMessages)
  const currentUser = useUserStore(getUserSelector)
  const addMessageToState = useChatStore((state) => state.addMessage)
  const getRoomByRoomId = useChatStore((state) => state.getRoomByRoomId)
  // const status = useChatStore((state) => state.status)
  const fetchMessages = useChatStore((state) => state.fetchMessages)
  const socketRef = useRef<Socket<any, any> | null>(null)
  // console.log({ currentUser })

  useEffect(() => {
    // отправляем запрос на получение сообщений
    if (currentUser.id && params.chatId) {
      socketRef.current = io('http://127.0.0.1:3000/', {
        query: { roomId: chatId },
      })
      // socketRef.current.emit('message:get')
      socketRef.current.emit('user:add', currentUser)
      socketRef.current.on('message', (message: Message) => {
        addMessageToState(message, chatId)
        // scrollElementRef.current?.scrollDown()
      })
    }

    // обрабатываем получение сообщений
    //  socketRef.current.on('messages', (messages) => {
    //    // определяем, какие сообщения были отправлены данным пользователем,
    //    // если значение свойства "userId" объекта сообщения совпадает с id пользователя,
    //    // то добавляем в объект сообщения свойство "currentUser" со значением "true",
    //    // иначе, просто возвращаем объект сообщения
    //    const newMessages = messages.map((msg) =>
    //      msg.userId === userId ? { ...msg, currentUser: true } : msg
    //    )
    //    // обновляем массив сообщений
    //    setMessages(newMessages)
    //  })

    if (params.chatId) {
      getRoomByRoomId(params.chatId)
      fetchMessages(params.chatId)
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [currentUser.id])

  const loadMore = useCallback(() => {
    if (params.chatId) {
      fetchMessages(params.chatId)
    }
  }, [params.chatId])

  const onSend = useCallback((message: string) => {
    if (params.chatId) {
      if (socketRef.current) {
        socketRef.current.emit('message:add', { message: message })
      }
    }
  }, [])
console.log({messages});

  return (
    <ChatContainer onSend={onSend} loadMore={loadMore} messages={messages} user={currentUser} ref={scrollElementRef} />
  )
}
