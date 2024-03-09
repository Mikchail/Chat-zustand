import { Room } from "../types/Chat"


const img = 'https://i.pravatar.cc/150?img=3'

export const messages = [
  {
    roomId: "123",
    _id: 1,
    text: 'This is a system message',
    createdAt: new Date(Date.UTC(2016, 5, 11, 17, 20, 0)),
    system: true,
    user: {
      _id: 1,
      name: '<NAME>',
    },
    // Any additional custom parameters are passed through
  },
  {
    roomId: "123",
    _id: 1,
    text: 'My message',
    createdAt: new Date(Date.UTC(2016, 5, 11, 17, 20, 0)),
    user: {
      _id: 2,
      name: 'React Native',
      avatar: 'https://facebook.github.io/react/img/logo_og.png',
    },
    image: 'https://facebook.github.io/react/img/logo_og.png',
    // You can also add a video prop:
    audio: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    // Mark the message as sent, using one tick
    sent: true,
    // Mark the message as received, using two tick
    received: true,
    // Mark the message as pending with a clock loader
    // Any additional custom parameters are passed through
  },
  {
    roomId: "123",
    _id: 2,
    text: 'How are you?',
    createdAt: new Date(),
    user: {
      _id: 2,
      name: 'React Native 222',
      avatar: 'https://i.pravatar.cc/140',
    },
    quickReplies: {
      type: 'checkbox', // or 'checkbox',
      keepIt: true,
      values: [
        {
          title: '😋 Yes',
          value: 'yes',
        },
        {
          title: '📷 Yes, let me show you with a picture!',
          value: 'yes_picture',
        },
        {
          title: '😞 Nope. What?',
          value: 'no',
        },
      ],
    },
  },
  {
    roomId: "123",
    _id: 3,
    text: 'How are you?',
    createdAt: new Date(),
    user: {
      _id: 1,
      name: 'React Native 222',
      avatar: img,
    },
    quickReplies: {
      type: 'radio',
      values: [{
        title: "string",
        value: "asssvalu",
        messageId: 2,
      }]
    }
  },
]


export const newMessages = [
  {
    "author": {
      id: "2",
      // email: message.message_author.email,
      // isActive: message.message_author.is_active,
      // isSuperUser: message.message_author.is_superuser,
      // isVerified: message.message_author.is_vercified,
      // username: message.message_author.username,
      firstName: "one",
      imageUrl: "https://i.pravatar.cc/150?img=3",
      // about: message.message_author.about,
      lastName: "two"
    }, "id": "21", "roomId": "38", "text": "Hello!", "type": "text", createdAt: 12
  },
  {
    "author": {
      id: "1",
      // email: message.message_author.email,
      // isActive: message.message_author.is_active,
      // isSuperUser: message.message_author.is_superuser,
      // isVerified: message.message_author.is_vercified,
      // username: message.message_author.username,
      firstName: "1",
      imageUrl: "https://i.pravatar.cc/150?img=3",
      // about: message.message_author.about,
      lastName: "5"
    }, "id": "221", "roomId": "38", "text": "Hello you too!", "type": "text", createdAt: 123
  },
  {
    "author": {
      id: "1",
      // email: message.message_author.email,
      // isActive: message.message_author.is_active,
      // isSuperUser: message.message_author.is_superuser,
      // isVerified: message.message_author.is_vercified,
      // username: message.message_author.username,
      firstName: "1",
      imageUrl: "https://i.pravatar.cc/150?img=3",
      // about: message.message_author.about,
      lastName: "5"
    }, "id": "22", "roomId": "38", "text": "What are you doing?", "type": "text", createdAt: 1231
  }
]


export const chats: Room[] = [
  {
    id: "38",
    participants: [
      {
        id: "1",
        username: "user1",
        email: "<EMAIL>"
      },
      {
        id: "2",
        username: "user2",
        email: "<EMAIL>"
      },
    ]
  }
]
