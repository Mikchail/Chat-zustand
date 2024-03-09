import { create } from 'zustand'
import { apiService } from '../../api/api'
import { PersistStorage, persist } from "zustand/middleware"

interface IPersistAuth {
  access_token: string;
}

interface IAuth extends IPersistAuth {
  status: 'done' | 'loading' | 'success' | 'error';
  error: string;
  login: (login: string, password: string) => Promise<string>;
  register: (username: string, email: string, password: string) => Promise<string>;
  logout: () => Promise<void>;
}



export type RegisterResponse = {
  email: string;
  username: string;
}

export type LoginResponse = {
  access_token: string;
  token_type: string;
}
// PersistOptions<IAuth, IPersistAuth>
export const useAuthStore = create<IAuth>()(
  persist(
    (set, get) => ({
      status: 'done' as const,
      error: '',
      access_token: 'asdadssda',
      login: async (email: string, password: string) => {
        console.log(email, password);

        const formData = new FormData()
        formData.append('username', email)
        formData.append('password', password)
        set({ status: 'loading' })
        try {
          console.log(apiService.post);
          const res = await apiService.post("auth/jwt/login", formData)
          console.log("apiService");
          const user = await res.json() as LoginResponse;
          set({ status: 'success', access_token: user.access_token })
          return Promise.resolve("success")
        } catch (error) {
          console.log("login", { error });

          set({ status: 'error', error: `Не правильный email или password` || "error" })
          cleanError(set)
          return Promise.resolve("error")
        }
      },
      register: async (username: string, email: string, password: string) => {
        set({ status: 'loading' })
        try {
          const res = await apiService.post("auth/register", {
            username,
            email,
            password,
            role_id: 1,
            id: 0
          })
          const user = await res.json() as RegisterResponse
          get().login(user.email, password);
          set({ status: 'success' })
          return Promise.resolve("success")
        } catch (error) {
          set({ status: 'error', error: `Возникла ошибка попробуйте снова чуть позже` || "error" })
          cleanError(set)
          return Promise.resolve("error")
        }
      },
      logout: async () => {
        set({ status: 'loading' })
        console.log({ "Authorization": "Bearer " + get().access_token });

        try {
          await apiService.post("auth/jwt/logout", {}, {
            "Authorization": "Bearer " + get().access_token,
          })

        } catch (error) {
          console.log({ error });
          set({ status: 'error', error: `Возникла ошибка попробуйте снова чуть позже` || "error" })
          cleanError(set)
        } finally {
          set({ status: 'success', access_token: "" })
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state: IAuth) => {
        // as PersistStorage<IPersistAuth>'
        return { access_token: state.access_token } as unknown as PersistStorage<IPersistAuth>
      }
    }
  ))

function cleanError(set: (partial: IAuth | Partial<IAuth> | ((state: IAuth) => IAuth | Partial<IAuth>), replace?: boolean | undefined) => void) {
  setTimeout(() => {
    set({ status: 'done', error: '' })
  }, 3000)
}

export const tokenHeader = (): Record<string, string> => {
  const token = useAuthStore.getState().access_token;
  return token ? {
    "Authorization": "Bearer " + token,
  } : {}
}
