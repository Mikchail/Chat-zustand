import { apiService } from '../../api/api'
import { create } from 'zustand'
import { tokenHeader } from '../AuthModule/authStore'
import { User } from '../../types/User'

interface IUserStore {
  status: 'init' | 'loading' | 'success' | 'error'
  error: string
  // user: User
  currentUser: User | null
  getUser: () => Promise<void>
  updateUser: () => Promise<void>
  deleteUser: () => Promise<void>
}

export interface IUserResponse {
  name: string
  email: string
  id: number
}

export const useUserStore = create<IUserStore>((set, get) => ({
  status: 'init',
  error: '',
  currentUser: null,
  getUser: async () => {
    console.log('RUN getUser status', get().status)

    if (get().status === 'loading' || get().status === 'success') {
      return
    }
    set({ status: 'loading' })
    try {
      const res = await apiService.get('api/user/me', {
        ...tokenHeader(),
      })

      const user = (await res.json()) as IUserResponse
      console.log(user)
      set({ status: 'success', currentUser: transformUser(user) })
    } catch (error) {
      console.log({ error })
      set({ status: 'error', error: `Возникла ошибка попробуйте снова чуть позже` || 'error' })
      // return Promise.resolve("error")
    }
  },
  deleteUser: async () => {
    set({ status: 'loading' })
  },
  updateUser: async () => {
    set({ status: 'loading' })
  },
}))

const transformUser = (user: IUserResponse): User => ({
  id: user.id.toString(),
  name: user.name,
  email: user.email,
})

export const getUserSelector = (state: IUserStore) => {
  if (!state.currentUser) {
    return {
      id: '',
      name: 'NONE',
      email: 'none',
    }
  }
  return state.currentUser
}
