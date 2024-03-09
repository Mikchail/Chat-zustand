import { useVcosole } from '@hooks/useVconsole'
import {NextUIProvider} from "@nextui-org/react";
import MyRoutes from '@/router'
// 这个是全局的页面 还可以做一些其他的操作

export default function App() {
  useVcosole()
  return (
    <NextUIProvider>
      <MyRoutes />
    </NextUIProvider>
  )
}
