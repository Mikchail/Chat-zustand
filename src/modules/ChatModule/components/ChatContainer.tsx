// import { GiftedChat, IMessage, User } from 'react-native-gifted-chat';
import { User } from '../../../types/User';
import { Message, MessagePartialText } from '../../../types/Chat';
import { Button, Input } from '@nextui-org/react';


export type Props = {
  messages: Message[];
  onSend: (message: MessagePartialText) => void;
  user: User
}

export const ChatContainer = ({ messages, onSend, onImageSend, user }: Props) => {
  console.log("ChatContainer", { messages });
  const [value, setValue] = useState('');
  const divRef = useRef<HTMLDivElement>(null)

  const sendMessage = () => {
    onSend(value)
  }

  return (
    <div
      className='grid  max-w-screen-lg mx-auto'>
      <div ref={divRef} style={{ width: '80%', height: '60vh', border: '1px solid gray', overflowY: 'auto' }}>
        {messages && messages.map((message, index) =>
          <div style={{
            margin: 10,
            // border: user.uid === message.uid ? '2px solid green' : '2px dashed red',
            // marginLeft: user.uid === message.uid ? 'auto' : '10px',
            width: 'fit-content',
            padding: 5,
          }}
          // key={user.uid + "chat" + index}
          >
            {/* <Grid container>
              <Avatar src={message.photoURL} />
              <div>{message.displayName}</div>
            </Grid> */}
            <div>{message.text}</div>
          </div>
        )}
      </div>
      <div
        className='grid grid-cols-2 gap-4 max-w-screen-lg'
      >
        <Input
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
          }}
          fullWidth
          color="primary"
          placeholder="message"
        />
        <Button className='w-20' onClick={sendMessage}>Отправить</Button>
      </div>
    </div>
  );
}
