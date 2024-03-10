import { useEffect } from 'react';
import { User } from '../../../types/User';
import { useUsersStore } from '../usersStore';
import { useChatStore } from '@/modules/ChatModule/chatStore';
import { useUserStore, getUserSelector } from '@/modules/UserModule/userStore';
import { UsersContainer } from '../components/UsersContainer';
// import { UsersContainer } from '../components/UsersContainer';

export const UsersPage = () => {
  const currentUser = useUserStore(getUserSelector)
  const { users, status } = useUsersStore((state) => ({
    users: state.users,
    status: state.status,
  }))

  const openPrivateChat = useChatStore((state) => state.openPrivateChat)

  const { getUsers, loadMore } = useUsersStore((state) => (
    {
      getUsers: state.getUsers,
      loadMore: state.loadMore,
    }
  ))


  useEffect(() => {
    getUsers()
  }, [])

  return (
    <UsersContainer
      onLoadMore={loadMore}
      status={status}
      openPrivateChat={openPrivateChat}
      users={users}
      currentUser={currentUser}
    />
  );
}


