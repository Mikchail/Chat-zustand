// import { GiftedChat, IMessage, User } from 'react-native-gifted-chat';
import { User } from '../../../types/User'
import { Message, MessagePartialText } from '../../../types/Chat'
import { Button, Input } from '@nextui-org/react'
import style from './index.module.scss'

export type Props = {
  messages: Message[]
  onSend: (message: MessagePartialText) => void
  user: User
}

export const ChatContainer = ({ messages, onSend, onImageSend, user }: Props) => {
  console.log('ChatContainer', { messages })
  const value = useRef('')
  const divRef = useRef<HTMLDivElement>(null)
  const inpurRef = useRef<HTMLInputElement>(null)

  const sendMessage = () => {
    onSend(value.current)
    value.current = ''
    // inpurRef.current.clear()
  }
  return (
    <div className="grid  max-w-screen-lg mx-auto">
      <div
        ref={divRef}
        style={{
          width: '80%',
          height: '60vh',
          border: '1px solid gray',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {messages &&
          messages.map((message) => {
            const isCurrentUser = message.userId === user.id
            return (
              <div
                key={message.id}
                className={`flex m-2 flex-col ${isCurrentUser ? style['user-message--current'] : style['user-message']}`}
              >
                {isCurrentUser ? (
                  <div className='pr-2 text-xs text-slate-400'>{user.email}</div>
                ): (
                  <div className='pr-2 text-xs text-slate-300'>{message.author.email}</div>
                )}
                
                <div>{message.text}</div>
              </div>
            )
          })}
      </div>
      <div className="grid grid-cols-2 gap-4 max-w-screen-lg">
        <Input
          ref={inpurRef}
          defaultValue={value.current}
          onChange={(e) => {
            value.current = e.target.value
          }}
          fullWidth
          color="primary"
          placeholder="message"
        />
        <Button className="w-20" onClick={sendMessage}>
          Отправить
        </Button>
      </div>
    </div>
  )
}
