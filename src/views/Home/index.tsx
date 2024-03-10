import dockerLogo from '@assets/Docker.svg'
import { button } from '@assets/motion'
import reactLogo from '@assets/react.svg'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

import { Header } from './Header'
import HomeStyle from './index.module.scss'

function Home() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}

export default Home
