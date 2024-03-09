import { User } from "./User";
// import { MessageType } from "@flyerhq/react-native-chat-ui";

export type Message = any
export type MessageText = MessageType.Text
export type MessagePartialText = MessageType.PartialText
export type MessageImage = MessageType.Image
export type Room = {
  id: string;
  participants: User[];
}
