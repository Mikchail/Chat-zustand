import { useEffect } from 'react';
import { ChatsContainer } from '../components/ChatsContainer';
import { useChatStore } from '../chatStore';
import { useUserStore } from '@/modules/UserModule';

export const ChatsPage = () => {
  const currentUser = useUserStore((state) => state.user)
  const { rooms, status, getChats } = useChatStore((state) => ({
    rooms: state.rooms,
    status: state.status,
    getChats: state.getChats,
  }))

  useEffect(() => {
    getChats(currentUser.id)
  }, [])
  return (
    <ChatsContainer
      rooms={rooms}
      status={status}
      currentUser={currentUser}
    />
  );
}
