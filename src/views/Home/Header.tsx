import { useAuthStore } from "@/modules/AuthModule/authStore"
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
} from "@nextui-org/react"
// import { logout, selectIsAuthenticated } from "../../features/user/userSlice"
import { useNavigate } from "react-router-dom"

export const Header = () => {
  const isAuthenticated = useAuthStore((state) => {
    console.log("isAuthenticated", state);
    return !!state.access_token
  })

  // const { theme, toggleTheme } = useContext(ThemeContext)
  const navigate = useNavigate()

  const hadleLogout = () => {
    // dispatch(logout())
    localStorage.removeItem('token')
    navigate("/auth")
  }

  const handleAuth = () => {
    navigate("/auth")
  }
  const handleRegistration = () => {
    navigate("/registration")
  }
  const handleProfile = () => {
    navigate("/profile")
  }

  const handleUsers = () => {
    navigate("/users")
  }

  const handleChat = () => {
    navigate("/chat") // temporary
  }
  return (
    <Navbar>
      <NavbarBrand onClick={() => navigate("/")} className="cursor-pointer hover">
        <p className="font-bold text-inherit">Network Social</p>
      </NavbarBrand>

      <NavbarContent justify="end">
        {!isAuthenticated &&
          <>
            <NavbarItem
              className="cursor-pointer hover"
              onClick={handleAuth}
            >
              Login
            </NavbarItem>
            <NavbarItem
              className="cursor-pointer hover"
              onClick={handleRegistration}
            >
              Registration
            </NavbarItem>
          </>
        }
        {isAuthenticated &&
          <>
            <NavbarItem
              className="cursor-pointer hover"
              onClick={handleUsers}
            >
              Users
            </NavbarItem>
            <NavbarItem
              className="cursor-pointer hover"
              onClick={handleProfile}
            >
              Profile
              {/* {theme === "light" ? <FaRegMoon /> : <LuSunMedium />} */}
            </NavbarItem>
            <NavbarItem
              className="cursor-pointer hover"
              onClick={handleChat}
            >
              Chat
              {/* {theme === "light" ? <FaRegMoon /> : <LuSunMedium />} */}
            </NavbarItem>
          </>
        }
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
