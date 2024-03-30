// import { GiftedChat, IMessage, User } from 'react-native-gifted-chat';
import { User } from '../../../types/User'
import { Message, MessagePartialText } from '../../../types/Chat'
import { Button, Input } from '@nextui-org/react'
import style from './index.module.scss'
import { forwardRef } from 'react'
export type Props = {
  messages: Message[] | null
  onSend: (message: MessagePartialText) => void
  loadMore: () => void
  user: User
}

export type ScrollHandle = {
  scrollDown: () => void
}

export const ChatContainer = forwardRef<ScrollHandle, Props>(
  ({ messages, onSend, loadMore, onImageSend, user }: Props, ref) => {
    // console.log('ChatContainer', { messages })
    const isScrolledDown = useRef(false)
    const value = useRef('')
    const scrollElementRef = useRef<HTMLDivElement>(null)
    const formRef = useRef<HTMLFormElement>(null)
    const inpurRef = useRef<HTMLInputElement>(null)
    useImperativeHandle(
      ref,
      () => {
        return {
          scrollDown,
        }
      },
      [],
    )

    const scrollApi = useMemo(
      () => ({
        scrollToBottom: (behavior = 'auto') => {
          isScrolledDown.current = true
          return scrollElementRef.current &&
            (scrollElementRef.current.scrollTo
              ? scrollElementRef.current.scrollTo({
                  top: scrollElementRef.current.scrollHeight,
                  //@ts-expect-error
                  behavior,
                })
              : (scrollElementRef.current.scrollTop = scrollElementRef.current.scrollHeight))
        },
        scrollTo: (top: number) =>
          scrollElementRef.current &&
          (scrollElementRef.current.scrollTo
            ? scrollElementRef.current.scrollTo({
                top: top,
              })
            : (scrollElementRef.current.scrollTop = top)),
        scrolledToBottom: () => {
          if (scrollElementRef.current) {
         
            
            return (
              scrollElementRef.current?.scrollHeight -
                scrollElementRef.current?.scrollTop -
                scrollElementRef.current?.clientHeight <
              70
            )
          }

          return false
        },
        // scrolledToLoadThreshold: () =>
        //   scrollElementRef.current && scrollElementRef.current.scrollTop <= props.loadOldMessagesThreshold,
        scrollTop: () => scrollElementRef.current && scrollElementRef.current.scrollTop,
        scrollHeight: () => scrollElementRef.current && scrollElementRef.current.scrollHeight,
        clientHeight: () => scrollElementRef.current && scrollElementRef.current.clientHeight,
      }),
      [scrollElementRef.current],
    )

    const sendMessage = () => {
      onSend(value.current)
      value.current = ''
      formRef.current?.reset()
    }

    useEffect(() => {
      if (messages?.length) {
        scrollDown()
      }
    }, [messages])

    const scrollDown = () => {
      if (!isScrolledDown.current || scrollApi.scrolledToBottom()) {
        scrollApi.scrollToBottom()
      }
      return
    }

    const handleScroll = async (e: React.UIEvent<HTMLDivElement>) => {
   
      if (isScrolledDown.current) {
        const currentScrollPos = e.currentTarget.scrollTop
        if (currentScrollPos <= 100) {
          loadMore()
          // scrollDown(scrollElementRef.current, 'smooth', true)
          // console.log('currentScrollPos', currentScrollPos)
        }
      }
    }

    return (
      <div className="grid  max-w-screen-lg mx-auto">
        <div
          ref={scrollElementRef}
          style={{
            width: '80%',
            height: '60vh',
            border: '1px solid gray',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}
          onScroll={handleScroll}
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
                    <div className="pr-2 text-xs text-slate-400">{user.email}</div>
                  ) : (
                    <div className="pr-2 text-xs text-slate-300">{message.author.email}</div>
                  )}

                  <div>{message.text}</div>
                </div>
              )
            })}
        </div>
        <form className="grid grid-cols-2 gap-4 max-w-screen-lg" ref={formRef}>
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
        </form>
      </div>
    )
  },
)
