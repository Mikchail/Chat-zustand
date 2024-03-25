import { Room } from '@/types/Chat'
import { User } from '@/types/User'
import { Fragment, useCallback } from 'react'
import { User as UserUI } from '@nextui-org/react'
import style from './index.module.scss'
type Props = {
  rooms: Room[]
  status: string
  // onLoadMore: () => void;
  // openPrivateChat: (userId: string) => void;
  openChat: (roomId: string) => void;
  currentUser: User
}

export const ChatsContainer = ({ rooms, status, currentUser, openChat }: Props) => {
  const isLoading = status === 'loading'
  if(!rooms || !("length" in rooms)) {
    return null
  }
  const renderItem = useCallback(
    (room: Room) => {
      const onPrivateChat = () => openChat(room.id)
      return (
        <UserUI
          onClick={onPrivateChat}
          name={room.name}
          className={style['chat-border']}
          description="Chat Designer"
          contextMenu='asdads'
          avatarProps={{
            src: 'https://i.pravatar.cc/150?u=a04258114e29026702d',
          }}
        />
      )
    },
    [rooms],
  )

  return (
    <div className="grid gap-4 max-w-screen-lg  mx-auto">
      {rooms.map((room) => {
        return <Fragment key={room.id}>{renderItem(room)}</Fragment>
      })}
    </div>
  )
}
