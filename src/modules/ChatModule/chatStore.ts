import { apiService } from '../../api/api';
import { create } from 'zustand'
import { tokenHeader } from '../AuthModule/authStore';
import { User } from '../../types/User';
import { Room, Message, MessageText } from '../../types/Chat';
// import { makeNavigateToChat } from '../../services/NavigationsService';
import { uuidv4 } from '../../utils';
import { chats, messages, newMessages } from '../../__mock__/messages';

interface IChatStore {
  status: 'initializing' | 'loading' | 'success' | 'error';
  error: string;
  rooms: Room[];
  messages: Message[];
  getChats: (userId: string) => void;
  // gethMessages: (chatId: string) => Promise<Message[]>;
  fetchMessages: (chatId: string) => Promise<void>;
  addMessage: (message: MessageText, chatId: string) => Promise<void>;
  openPrivateChat: (userId: string) => Promise<void>;
}

export interface IRoomResponse {
  id: string;
  participants: User[];
}

const prepend = (currentMessages = [], messages: any, inverted = true) => {
  if (!Array.isArray(messages)) {
    messages = [messages];
  }
  return inverted
    ? currentMessages.concat(messages)
    : messages.concat(currentMessages);
};

const append = (currentMessages: any = [], messages: any, inverted = true) => {
  if (!Array.isArray(messages)) {
    messages = [messages];
  }
  return inverted
    ? messages.concat(currentMessages)
    : currentMessages.concat(messages);
};

export const useChatStore = create<IChatStore>((set, get) => ({
  status: 'initializing',
  error: '',
  rooms: [],
  messages: messages,
  getChats: async (userId: string) => {
    console.log("userId", userId);

    try {
      const query = await apiService.post("chat/", {
        user_id: userId
      }, {
        ...tokenHeader(),
      })

      console.log({ query });
      const room = await query.json() as IRoomResponse;
      console.log({ room });

      // const rooms = [...get().rooms]
      // rooms.push(room)
      // set({ status: "success", rooms })
      // makeNavigateToChat(room.id)
    } catch (error) {
      console.log({ error });
      set({ status: 'error', error: `Возникла ошибка попробуйте снова чуть позже` || "error" })
      // return Promise.resolve("error")
    }

  },
  openPrivateChat: async (userId: string) => {
    let room = getRoomByUserId(get(), userId);
    if (room) {
      return
    }
    try {
      const query = await apiService.post("chat/", {
        user_id: userId
      }, {
        ...tokenHeader(),
      })

      const room = await query.json() as IRoomResponse;
      const rooms = [...get().rooms]
      rooms.push(room)
      set({ status: "success", rooms })
    } catch (error) {
      console.log({ error });
      set({ status: 'error', error: `Возникла ошибка попробуйте снова чуть позже` || "error" })
      // return Promise.resolve("error")
    }


  },
  getRoomByRoomId: (chatId: string) => {
    const rooms = get().rooms;
    return rooms.find((room) => room.id === chatId)
  },
  getRoomByUserId: (userId: string) => {
    const rooms = get().rooms;
    return rooms.find((room) => room.id === userId)
  },
  fetchMessages: async (chatId: string) => {
    try {
      const query = await apiService.get(`chat/${chatId}`, {
        ...tokenHeader(),
      })

      const message = await query.json() as MessageDto[];
      const transformedMessages = message.map((message) => trasformMessage(message))
      const messages = [...get().messages].concat(transformedMessages)
      console.log({ messages });

      set({ status: "success", messages })

    } catch (error) {
      console.log({ error });
      set({ status: 'error', error: `Возникла ошибка попробуйте снова чуть позже` || "error" })
      // return Promise.resolve("error")
    }
  },
  loadMore: async () => {

  },
  addMessage: async (message: MessageText, chatId: string) => {
    set({ status: 'loading' })


    try {

      const query = await apiService.post(`chat/${chatId}`, {
        text: message.text
      },
        {
          ...tokenHeader(),
        })

      const response = await query.json();
      console.log({ response });
      const messages = [trasformMessage(response), ...get().messages]
      set({ status: "success", messages })
    } catch (error) {
      console.log({ error });
      set({ status: 'error', error: `Возникла ошибка попробуйте снова чуть позже` || "error" })
      // return Promise.resolve("error")
    }
  }
}))

type MessageDto = {
  id: number,
  chat_id: number,
  text: string,
  created_at: Date,
  message_author: AuthorDto
}

type AuthorDto = {
  id: number,
  email: string,
  is_active: boolean,
  is_superuser: boolean,
  is_verified: boolean,
  username: string,
  first_name: string,
  avatar: string,
  about: string,
  last_name: string
}


const trasformMessage = (message: MessageDto): Message => {
  return {
    type: "text",
    id: message.id.toString(),
    roomId: message.chat_id.toString(),
    text: message.text,
    createdAt: new Date(message.created_at).getDate(),
    // createdAt: message.created_at,
    author: {
      id: message.message_author.id.toString(),

      // email: message.message_author.email,
      // isActive: message.message_author.is_active,
      // isSuperUser: message.message_author.is_superuser,
      // isVerified: message.message_author.is_vercified,
      // username: message.message_author.username,
      firstName: message.message_author.first_name,
      imageUrl: message.message_author.avatar,
      // about: message.message_author.about,
      lastName: message.message_author.last_name
    }
  }
}



export const getRoomSelector = (state: IChatStore, roomId: string) =>
  state.rooms.find((room: Room) => room.id === roomId)


export const getRoomByUserId = (state: IChatStore, userId: string) => {
  return state.rooms.find((room) => {
    return room.participants.find((participant) => participant.id === userId)
  })
}


export const getMessagesSelector = (state: IChatStore, chatId: string) => {
  const messages = state.messages
    .filter((item: Message) => item.roomId?.toString() === chatId.toString())
    .sort((a: any, b: any) => {
      return b.createdAt - a.createdAt
    });
  return messages
}
