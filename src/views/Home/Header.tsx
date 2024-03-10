import { useAuthStore } from '@/modules/AuthModule/authStore'
import { useUserStore } from '@/modules/UserModule/userStore'
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button } from '@nextui-org/react'
// import { logout, selectIsAuthenticated } from "../../features/user/userSlice"
import { useNavigate } from 'react-router-dom'

export const Header = () => {
  const isAuthenticated = useAuthStore((state) => {
    return !!state.access_token
  })
  const getUser = useUserStore((state) => {
    return state.getUser
  })
  const logout = useAuthStore((state) => {
    return state.logout
  })

  useEffect(() => {
    if (isAuthenticated) {
      getUser()
    }
  }, [isAuthenticated])
  // const { theme, toggleTheme } = useContext(ThemeContext)
  const navigate = useNavigate()

  const handleAuth = () => {
    navigate('/auth')
  }
  const handleRegistration = () => {
    navigate('/registration')
  }
  const handleProfile = () => {
    navigate('/profile')
  }

  const handleUsers = () => {
    navigate('/users')
  }

  const handleChat = () => {
    navigate('/chat') // temporary
  }
  const handleChats = () => {
    navigate('/chats') // temporary
  }

  const handleLogout = async () => {
    const confirmed = await confirm('Are you sure?')
    if (confirmed) {
      logout()
    }

    //  // temporary
  }

  return (
    <Navbar>
      <NavbarBrand onClick={() => navigate('/')} className="cursor-pointer hover">
        <p className="font-bold text-inherit">Network Social</p>
      </NavbarBrand>

      <NavbarContent justify="end">
        {!isAuthenticated && (
          <>
            <NavbarItem className="cursor-pointer hover" onClick={handleAuth}>
              Login
            </NavbarItem>
            <NavbarItem className="cursor-pointer hover" onClick={handleRegistration}>
              Registration
            </NavbarItem>
          </>
        )}
        {isAuthenticated && (
          <>
            <NavbarItem className="cursor-pointer hover" onClick={handleUsers}>
              Users
            </NavbarItem>
            <NavbarItem className="cursor-pointer hover" onClick={handleProfile}>
              Profile
              {/* {theme === "light" ? <FaRegMoon /> : <LuSunMedium />} */}
            </NavbarItem>
            <NavbarItem className="cursor-pointer hover" onClick={handleChat}>
              Chat
              {/* {theme === "light" ? <FaRegMoon /> : <LuSunMedium />} */}
            </NavbarItem>
            <NavbarItem className="cursor-pointer hover" onClick={handleChats}>
              Chats
              {/* {theme === "light" ? <FaRegMoon /> : <LuSunMedium />} */}
            </NavbarItem>
            <NavbarItem className="cursor-pointer hover" onClick={handleLogout}>
              Logout
              {/* {theme === "light" ? <FaRegMoon /> : <LuSunMedium />} */}
            </NavbarItem>
          </>
        )}
        <NavbarItem>
          {/* {isAuthenticated && (
                        <Button
                            color="default"
                            variant="flat"
                            className="gap-2"
                            onClick={hadleLogout}
                        >
                            <CiLogout /> <span>Выйти</span>
                        </Button>
                    )} */}
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  )
}
