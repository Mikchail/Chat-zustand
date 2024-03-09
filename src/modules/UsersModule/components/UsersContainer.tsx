import React, { Fragment, useCallback } from 'react';
import { View, Text, FlatList, ListRenderItemInfo, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { User } from '../../../types/User';
import { User as UserUI } from '@nextui-org/react';
import style from './index.module.scss'
type Props = {
  users: User[];
  status: string;
  onLoadMore: () => void;
  openPrivateChat: (userId: string) => void;
  currentUser: User;
}

export const UsersContainer = ({ users, onLoadMore, status, openPrivateChat, currentUser }: Props) => {
  const isLoading = status === 'loading';
  const renderItem = useCallback((user: User
  ) => {
    const onPrivateChat = () => openPrivateChat(user.id);
    return (
      <UserUI
        onClick={onPrivateChat}
        name={user.username}
        className={style['user-border']}
        description="Product Designer"
        avatarProps={{
          src: "https://i.pravatar.cc/150?u=a04258114e29026702d"
        }}
      />
    )
  }, [users])

  return (
    <div className="grid gap-4 max-w-screen-lg  mx-auto">
      {users.map((user) => {
        return (<Fragment key={user.id}>
          {renderItem(user)}
        </Fragment>)
      })}
    </div>
  );
}

