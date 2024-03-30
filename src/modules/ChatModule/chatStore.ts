// import { messages } from './../../__mock__/messages'
import { apiService } from '../../api/api'
import { create } from 'zustand'
import { User } from '../../types/User'
import { Room, Message, MessageText } from '../../types/Chat'
// import { makeNavigateToChat } from '../../services/NavigationsService';
import { uuidv4 } from '../../utils'
// import { chats, messages, newMessages } from '../../__mock__/messages'

export interface IChatStore {
  status: 'initializing' | 'loading' | 'success' | 'error'
  error: string
  rooms: Room[]
  room: Room | null
  messages: Message[]
  messagesNew: Record<
    string,
    {
      messages: Message[]
      total: number
      limit: number
      offset: number
    }
  >
  getChats: (userId: string) => void
  // gethMessages: (chatId: string) => Promise<Message[]>;
  fetchMessages: (chatId: string) => Promise<void>
  addMessage: (message: MessageText, chatId: string) => Promise<void>
  openPrivateChat: (userId: string) => Promise<void>
  getRoomByRoomId: (roomId: string) => Promise<void>
}

export interface IRoomResponse {
  rooms: {
    id: string
    users: User[]
  }[]
}

const prepend = (currentMessages = [], messages: any, inverted = true) => {
  if (!Array.isArray(messages)) {
    messages = [messages]
  }
  return inverted ? currentMessages.concat(messages) : messages.concat(currentMessages)
}

const append = (currentMessages: any = [], messages: any, inverted = true) => {
  if (!Array.isArray(messages)) {
    messages = [messages]
  }
  return inverted ? messages.concat(currentMessages) : currentMessages.concat(messages)
}

export const useChatStore = create<IChatStore>((set, get) => ({
  status: 'initializing',
  error: '',
  rooms: [],
  room: null,
  messages: [],
  messagesNew: {},

  getChats: async (userId: string) => {
    try {
      const query = await apiService.post(
        'api/rooms',
        {
          userId,
        },
        {},
      )

      const responce = (await query.json()) as IRoomResponse
      // const rooms = [...get().rooms]
      // rooms.push(room)
      set({ status: 'success', rooms: responce.rooms })
      // makeNavigateToChat(room.id)
    } catch (error) {
      console.log({ error })
      set({ status: 'error', error: `Возникла ошибка попробуйте снова чуть позже` || 'error' })
      // return Promise.resolve("error")
    }
  },
  openPrivateChat: async (userId: string) => {
    // let room = getRoomByUserId(get(), userId)
    // if (room) {
    //   return
    // }
    try {
      const query = await apiService.post(
        'api/room',
        {
          userId: userId,
        },
        {},
      )

      console.log({ query })
      const room = (await query.json()) as Room
      const rooms = [...get().rooms]
      rooms.push(room)
      set({ status: 'success', rooms })
    } catch (error) {
      console.log({ error })
      set({ status: 'error', error: `Возникла ошибка попробуйте снова чуть позже` || 'error' })
      // return Promise.resolve("error")
    }
  },
  getRoomByRoomId: async (roomId: string) => {
    const query = await apiService.post('api/room/' + roomId, {}, {})
    const room = (await query.json()) as Room
    set({ room: room })
    // const rooms = get().rooms
    // return rooms.find((room) => room.id === chatId)
  },
  getRoomByUserId: async (roomId: string) => {
    const query = await apiService.post('room/' + roomId, {})
    const room = (await query.json()) as Room
    set({ room: room })
    // return room
  },
  fetchMessages: async (chatId: string) => {
    try {
      if (get().status === 'loading') {
        return
      }
      set({ status: 'loading' })
      const messagesOld = get().messagesNew
      const messagesByChatId = messagesOld[chatId] || {
        messages: [],
        offset: 0,
        limit: 10,
        total: 0,
      }

      // console.log('FINISH', messagesByChatId.offset, messagesByChatId.total)
      if (messagesByChatId.total && messagesByChatId.offset >= messagesByChatId.total) {
        set({ status: 'success' })
        return
      }
      const queryParams = new URLSearchParams()
      queryParams.append('limit', messagesByChatId.limit.toString())
      queryParams.append('offset', messagesByChatId.offset.toString())
      queryParams.append('loadedMessageIds', JSON.stringify([])) // not work
      const query = await apiService.get(`api/message/${chatId}?${queryParams}`, {})
      const response = (await query.json()) as { items: MessageDto[]; total: number }
      const transformedMessages = response.items.map((message) => trasformMessage(message))
      // const messages = [...get().messages].concat(transformedMessages)
      // console.log({ messages })
      const newOffset = messagesByChatId.offset + messagesByChatId.limit
      messagesByChatId.messages = transformedMessages.concat(messagesByChatId.messages)
      set({
        status: 'success',
        messagesNew: {
          ...messagesOld,
          [chatId]: {
            ...messagesByChatId,
            messages: messagesByChatId.messages,
            total: response.total,
            offset: response.total ? Math.min(newOffset, response.total) : newOffset,
          },
        },
      })
    } catch (error) {
      console.log({ error })
      set({ status: 'error', error: `Возникла ошибка попробуйте снова чуть позже` || 'error' })
      // return Promise.resolve("error")
    }
  },
  loadMore: async () => {},
  addMessage: async (message: MessageText, chatId: string) => {
   
    const messagesOld = get().messagesNew
    const messagesByChatId = messagesOld[chatId] || {
      messages: [],
      offset: 0,
      limit: 10,
      total: 0,
    }
    try {
      if (get().status === 'loading') {
        return
      }
      set({ status: 'loading' })
      // const query = await apiService.post(
      //   `api/message/${chatId}`,
      //   {
      //     text: message.text,
      //   },
      //   {},
      // )

      // const response = await query.json()
      messagesByChatId.messages = [...messagesByChatId.messages, trasformMessage(message)]
      set({
        status: 'success',
        messagesNew: {
          ...messagesOld,
          [chatId]: {
            ...messagesByChatId,
            offset: messagesByChatId.offset + 1
          },
        },
      })
    } catch (error) {
      console.log({ error })
      set({ status: 'error', error: `Возникла ошибка попробуйте снова чуть позже` || 'error' })
      // return Promise.resolve("error")
    }
  },
}))

type MessageDto = {
  id: number
  roomId: number
  text: string
  createdAt: Date
  userId: number
  user: AuthorDto
  // message_author: AuthorDto
}

type AuthorDto = {
  id: number
  email: string
  is_active: boolean
  is_superuser: boolean
  is_verified: boolean
  username: string
  name: string
  first_name: string
  avatar: string
  about: string
  last_name: string
}

const trasformMessage = (message: MessageDto): Message => {
  return {
    type: 'text',
    id: message.id.toString(),
    roomId: message.roomId.toString(),
    userId: message.userId.toString(),
    text: message.text,
    createdAt: new Date(message.createdAt).getTime(),
    // createdAt: message.created_at,
    author: {
      id: message.user?.id.toString(),

      email: message.user?.email,
      name: message.user?.name,
      // isActive: message.message_author.is_active,
      // isSuperUser: message.message_author.is_superuser,
      // isVerified: message.message_author.is_vercified,
      // username: message.message_author.username,
      // firstName: message.message_author.first_name,
      // imageUrl: message.message_author.avatar,
      // about: message.message_author.about,
      // lastName: message.message_author.last_name,
    },
  }
}

export const getRoomSelector = (state: IChatStore, roomId: string) =>
  state.rooms.find((room: Room) => room.id === roomId)

export const getRoomByUserId = (state: IChatStore, userId: string) => {
  return state.rooms.find((room) => {
    return room.users.find((participant) => participant.id === userId)
  })
}

export const getMessagesSelector = (state: IChatStore, roomId: string) => {
  if (!state.messagesNew?.[roomId]?.messages) {
    return null
  }
  const messages = state.messagesNew[roomId].messages.sort((a: any, b: any) => {
    return a.createdAt - b.createdAt
  })
  return messages
}
