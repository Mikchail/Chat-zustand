import { apiService } from '../../api/api';
import { create } from 'zustand'
import { tokenHeader } from '../AuthModule/authStore';
import { User } from '../../types/User';

interface IUserStore {
  status: 'done' | 'loading' | 'success' | 'error';
  error: string;
  user: User;
  curretnUser: User | null;
  getUser: () => Promise<void>;
  updateUser: () => Promise<void>;
  deleteUser: () => Promise<void>;
}


export interface IUserResponse {
  username: string;
  email: string;
  id: number;
}


export const useUserStore = create<IUserStore>((set, get) => ({
  status: 'done',
  error: '',
  curretnUser: null,
  get user(): User {
    const curretnUser = get().curretnUser
    if (!curretnUser) {
      // get().getUser()
      return {
        id: "1",
        username: "Тесовый Павел",
        email: "Pavel@googlemugle.sru"
      }
    }
    return curretnUser;
  },
  getUser: async () => {
    set({ status: 'loading' })
    try {
      const res = await apiService.get("users/me", {
        ...tokenHeader()
      })
      const user = await res.json() as IUserResponse;
      set({ status: 'success', user: transformUser(user) })
    } catch (error) {
      console.log({ error });
      set({ status: 'error', error: `Возникла ошибка попробуйте снова чуть позже` || "error" })
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
  username: user.username,
  email: user.email
})


export const getUserSelector = (state: IUserStore) => state.user
