import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, ListRenderItemInfo, TouchableOpacity } from 'react-native';
import { Room } from '../../types/Chat';
import { User } from '../../types/User';

type Props = {
  rooms: Room[];
  status: string;
  // onLoadMore: () => void;
  // openPrivateChat: (userId: string) => void;
  currentUser: User;
}


export const ChatsContainer = ({ rooms, status, currentUser }: Props) => {
  const isLoading = status === 'loading';
  const renderItem = useCallback((item: ListRenderItemInfo<Room>
  ) => {
    const room = item.item;
    // const onPrivateChat = () => openPrivateChat(user.id);
    return (
      <TouchableOpacity onPress={() => { }} style={styles.item}>
        <View style={styles.row}>
          <View style={styles.avatar} />
          <View>
            <Text style={styles.name}>Имя: {room.participants?.[0]?.username}</Text>
              <Text style={styles.email}>Имя: {room.participants?.[1]?.username}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }, [rooms])

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={rooms}
        renderItem={renderItem}
        keyExtractor={(item: Room) => item.id.toString()}
      // onEndReached={isLoading ? undefined : onLoadMore}
      />
      {isLoading ? <ActivityIndicator style={styles.loader} size="large" color="#00ff00" /> : null}
    </View>
  );
}


const styles = StyleSheet.create({
  item: {
    minHeight: 50,
    // backgroundColor: '#F5FCFF',
    borderBottomColor: '#E0E0E0',
    borderTopColor: '#E0E0E0',
    borderBottomWidth: 2,
    // borderTopWidth: 1,
    padding: 16,
    // marginHorizontal: 16,
    // marginVertical: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
  },
  loader: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    marginRight: 18,
    borderRadius: 20,
    backgroundColor: '#000000',
  }
});
