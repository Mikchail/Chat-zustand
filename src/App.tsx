import { useVcosole } from '@hooks/useVconsole'
import { NextUIProvider } from '@nextui-org/react'
import MyRoutes from '@/router'
import { apiService } from './api/api'
import { useAuthStore } from './modules/AuthModule'
// 这个是全局的页面 还可以做一些其他的操作
apiService.addHeadersHook(() => {
  let token = useAuthStore.getState().access_token
  return token
    ? {
        name: 'Authorization',
        value: 'Bearer ' + token,
      }
    : null
})

export default function App() {
  useVcosole()
  return (
    <NextUIProvider>
      <MyRoutes />
    </NextUIProvider>
  )
}
