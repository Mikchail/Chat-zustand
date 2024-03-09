import { useRoutes, Navigate } from 'react-router-dom'

import Home from '@/views/Home'
import { LoginPage } from '@/modules/AuthModule/pages/LoginPage'
import { useAuthStore } from '@/modules/AuthModule/authStore'
import { RegisterPage } from '@/modules/AuthModule/pages/RegisterPage'
import { ProfilePage } from '@/modules/UserModule/pages/ProfilePage'
import { UsersPage } from '@/modules/UsersModule/pages/UsersPage'
import { ChatPage } from '@/modules/ChatModule/pages/ChatPage'

export default function Router() {
  const isAuthenticated = useAuthStore((state) => !!state.access_token)

  const routes = useMemo(() => {
    const routes = [{
      path: "*",
      element: <Navigate to="/" />
    }]
    if (!isAuthenticated) {
      routes.push(
        {
          path: "/auth",
          element: <LoginPage />
        },
        {
          path: "/registration",
          element: <RegisterPage />
        }
      )
    }
    if (isAuthenticated) {
      routes.push({
        path: "/profile",
        element: <ProfilePage />
      })
      routes.push({
        path: "/users",
        element: <UsersPage />
      })
      routes.push({
        path: "/chat/:chatId",
        element: <ChatPage />
      })
    }
    return routes
  }, [isAuthenticated])

  return useRoutes([
    {
      path: '/',
      element: <Home />,
      children: routes
    },
  ])
}
