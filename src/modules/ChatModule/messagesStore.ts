import { Message } from "../../types/Chat";
import {create} from "zustand";
// import { combine } from "zustand/middleware";

// // import ioClient from "socket.io-client";

// /*
//  The initial state shapes what values we can have in our store.
//  We can order them as we like or use multiple stores.
//  For our game, I'll use only one store.

//  Our server only sends the game state updates so that's almost all we need.
//  We use the 'ready' state to know if we are connected to the server or not.
// */
// const initialState = {
//   ready: false,
// };

// /*
//  Here we have access to two functions that
//  let us mutate or get data from our state.

//  This is where the magic happens, we can fully hide
//  the WebSocket implementation here and then use our store anywhere in our app!
//  */
// const mutations = (setState, getState) => {
// //   const socket = ioClient();
//   const ws = new WebSocket('ws://w567l.sse.codesandbox.io/');

//   // this is enough to connect all our server events
//   // to our state managment system!
//   ws.onopen = () => {
//     setServerState('Connected to the server')
//     setDisableButton(false);
//   };
//   ws.onclose = (e) => {
//     setServerState('Disconnected. Check internet or server.')
//     setDisableButton(true);
//   };
//   ws.onerror = (e) => {
//     setServerState(e.message);
//   };
//   ws.onmessage = (e) => {
//     serverMessagesList.push(e.data);
//     setServerMessages([...serverMessagesList])
//   };

//   return {
//     actions: {
//       startGame() {
//         socket.emit("start-game");
//       },

//       play(boxId: number) {
//         const isPlayerTurn = getState().game?.playerTurn === Players.PLAYER;

//         if (isPlayerTurn) {
//           socket.emit("play", boxId);
//         }
//       },
//     },
//   };
// };

type IMessagesStore = {
    ready: boolean,
    messages: Array<Message>,
    start: (chatId: string) => void,
    // open: () => void,
    // open: () => void,
    // open: () => void,   
}

//We created our first store!
// export const useStore = create(combine(initialState, mutations));
export const useStore = create<IMessagesStore>((set, get) => ({
    ready: false,
    messages: [],
    start: (chatId: string) => {
        const ws = new WebSocket(`ws://w567l.sse.codesandbox.io/${chatId}`);
        ws.onopen = () => {
        };
        ws.onclose = (e) => {
         
        };
        ws.onerror = (e) => {
        };
        ws.onmessage = (e) => {
            const messages = [trasformMessage(e.data), ...get().messages]
            console.log({ messages });

            set({ messages })
        };
        return () => {
            ws.close()
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