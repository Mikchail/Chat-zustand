import { ProfileContainer } from '../components/ProfileContainer';
import { useAuthStore } from '../../AuthModule';
import { useCallback, useEffect } from 'react';
import { useUserStore } from "../userStore"

export const ProfilePage = () => {
  const logout = useAuthStore((state) => state.logout);

  const { user, status, error } = useUserStore((state) => ({
    user: state.user,
    status: state.status,
    error: state.error,
  }));

  const userUseCase = useUserStore((state) => ({
    getUser: state.getUser,
    updateUser: state.updateUser,
  }));

  // useEffect(() => {
  //   userUseCase.getUser()
  // }, [userUseCase.getUser])

  const onLogout = useCallback(() => {
    alert("Вы покинули профиль")
    logout()
  }, [logout]);


  return (
    <ProfileContainer
      onLogout={onLogout}
      status={status}
      error={error}
      user={user}
    />
  );
}
