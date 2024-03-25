import { create } from 'zustand'
import { User } from '../../types/User'
import { apiService } from '@/api/api'
// import { mockUsers } from '@/__mock__/users'

interface IUsersStore {
  status: 'done' | 'loading' | 'success' | 'error'
  error: string
  users: User[]
  total: number
  offset: number
  limit: number
  getUsers: (offset?: number) => Promise<void>
  loadMore: () => Promise<void>
}

export interface IUsersResponse {
  items: User[]
  total: number
  offset: number
  limit: number
}

export const useUsersStore = create<IUsersStore>((set, get) => ({
  status: 'done',
  error: '',
  users: [],
  total: 0,
  offset: 0,
  limit: 10,
  getUsers: async (_offset?: number) => {
    set({ status: 'loading' })
    const offset_ = get().offset
    const limit = get().limit
    const total = get().total
    // console.log({ total: total, offset: get().offset.toString() });

    try {
      if (total && offset_ >= total) {
        set({ status: 'done' })
        return
      }
      const oldUsers = [...get().users]
      const queryParams = new URLSearchParams()
      queryParams.append('limit', limit.toString())
      queryParams.append('offset', offset_.toString())
      queryParams.append('loadedUserIds', JSON.stringify(oldUsers.map((o) => o.id))) // not work
      const query = await apiService.get('api/users?' + queryParams, {})
      console.log({query});
      
      const response = (await query.json()) as IUsersResponse
      console.log({ response })

      // console.log({users: response.items });
      const users = [...oldUsers, ...response.items]
      // console.log(users.map((user) => user.id));
      const newOffset = offset_ + limit
      set({
        status: 'success',
        users: users,
        total: response.total,
        offset: total ? Math.min(newOffset, total) : newOffset,
      })
    } catch (error) {
      console.log({ error })
      set({ status: 'error', error: `Возникла ошибка попробуйте снова чуть позже` || 'error' })
      // return Promise.resolve("error")
    }
  },
  loadMore: async () => {
    try {
      console.log('loadMore')

      await get().getUsers()
    } catch (error) {
      console.log({ error })
      set({ status: 'error', error: `Возникла ошибка попробуйте снова чуть позже` || 'error' })
      // return Promise.resolve("error")
    }
  },
}))
