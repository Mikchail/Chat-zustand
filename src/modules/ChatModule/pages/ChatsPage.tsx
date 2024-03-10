import { useEffect } from 'react'
import { ChatsContainer } from '../components/ChatsContainer'
import { useChatStore } from '../chatStore'
import { getUserSelector, useUserStore } from '@/modules/UserModule'

export const ChatsPage = () => {
  const currentUser = useUserStore(getUserSelector)
  const navigate = useNavigate()
  const { rooms, status, getChats } = useChatStore((state) => ({
    rooms: state.rooms,
    status: state.status,
    getChats: state.getChats,
  }))

  useEffect(() => {
    if (currentUser) {
      getChats(currentUser.id)
    }
  }, [currentUser])

  const handleOpenChat = (roomId: string | number) => {
    navigate('/chat/' + roomId)
  }
  return <ChatsContainer rooms={rooms} status={status} currentUser={currentUser} openChat={handleOpenChat} />
}
