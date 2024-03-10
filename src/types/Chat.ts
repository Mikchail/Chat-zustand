import { User } from "./User";
// import { MessageType } from "@flyerhq/react-native-chat-ui";

export type Message = {
  id: number,
  text: string,
  createdAt: string,
  updatedAt: string,
  userId: string,
  roomId: string,
  author: {
    email: string,
    name: string
  }
}
export type MessageText = MessageType.Text
export type MessagePartialText = MessageType.PartialText
export type MessageImage = MessageType.Image
export type Room = {
  id: string;
  users: User[];
}
