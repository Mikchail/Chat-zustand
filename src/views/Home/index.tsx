import dockerLogo from '@assets/Docker.svg'
import { button } from '@assets/motion'
import reactLogo from '@assets/react.svg'
import { useUserStore } from '@/store/globalStore'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

import HomeStyle from './index.module.scss'
import { Header } from './Header'

const publicPath = import.meta.env.VITE_PUBLIC_PATH
function Home() {
  const { num, changeNum } = useUserStore()
  const navigate = useNavigate()
  const goAboutPage = () => {
    navigate('/about')
  }

  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}

export default Home
