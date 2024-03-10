import { create } from 'zustand'
import { apiService } from '../../api/api'
import { PersistStorage, persist } from 'zustand/middleware'

interface IPersistAuth {
  access_token: string
}

interface IAuth extends IPersistAuth {
  status: 'done' | 'loading' | 'success' | 'error'
  error: string
  login: (login: string, password: string) => Promise<string>
  register: (username: string, email: string, password: string) => Promise<string>
  logout: () => Promise<void>
}

export type RegisterResponse = {
  user: {
    email: string
    username: string
    accessToken: string
  }
}

export type LoginResponse = {
  user: {
    accessToken: string
    token_type: string
  }
}
// PersistOptions<IAuth, IPersistAuth>
export const useAuthStore = create<IAuth>()(
  persist(
    (set, get) => ({
      status: 'done' as const,
      error: '',
      access_token: '',
      login: async (email: string, password: string) => {
        console.log(email, password)

        const formData = new FormData()
        formData.append('email', email)
        formData.append('password', password)
        set({ status: 'loading' })
        try {
          const res = await apiService.post('api/auth', { email, password })
          console.log('apiService')
          const {user} = (await res.json()) as LoginResponse
          console.log('user', user)

          set({ status: 'success', access_token: user.accessToken })
          return Promise.resolve('success')
        } catch (error) {
          console.log('login', { error })

          set({ status: 'error', error: `Не правильный email или password` || 'error' })
          cleanError(set)
          return Promise.resolve('error')
        }
      },
      register: async (username: string, email: string, password: string) => {
        set({ status: 'loading' })
        try {
          const res = await apiService.post('api/register', {
            username,
            email,
            password,
            role_id: 1,
            id: 0,
          })
          const { user } = (await res.json()) as RegisterResponse
          console.log({ user }, user.email)
          // get().login(user.email, password)
          set({ status: 'success', access_token: user.accessToken  })
          return Promise.resolve('success')
        } catch (error) {
          set({ status: 'error', error: `Возникла ошибка попробуйте снова чуть позже` || 'error' })
          cleanError(set)
          return Promise.resolve('error')
        }
      },
      logout: async () => {
        set({ status: 'loading' })
        console.log({ Authorization: 'Bearer ' + get().access_token })
        set({ access_token: '' })
        try {
          await apiService.post(
            '/logout',
            {},
            {
              Authorization: 'Bearer ' + get().access_token,
            },
          )
        } catch (error) {
          console.log({ error })
          set({ status: 'error', error: `Возникла ошибка попробуйте снова чуть позже` || 'error' })
          cleanError(set)
        } finally {
          set({ status: 'success', access_token: '' })
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state: IAuth) => {
        // as PersistStorage<IPersistAuth>'
        return { access_token: state.access_token } as unknown as PersistStorage<IPersistAuth>
      },
    },
  ),
)

function cleanError(
  set: (
    partial: IAuth | Partial<IAuth> | ((state: IAuth) => IAuth | Partial<IAuth>),
    replace?: boolean | undefined,
  ) => void,
) {
  setTimeout(() => {
    set({ status: 'done', error: '' })
  }, 3000)
}

export const tokenHeader = (): Record<string, string> => {
  const token = useAuthStore.getState().access_token
  return token
    ? {
        Authorization: 'Bearer ' + token,
      }
    : {}
}
