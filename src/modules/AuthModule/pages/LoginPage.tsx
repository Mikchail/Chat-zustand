import { useCallback, useState } from "react";
import { useAuthStore } from "../authStore";
import { LoginContainer } from "../components/LoginContainer";
import { isEmailValid } from "@/utils";

export const LoginPage = () => {
  const { error, status, onLogin } = useAuthStore((state) => ({
    onLogin: state.login,
    status: state.status,
    error: state.error,
  }));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onChangeEmail = useCallback((email: string) => setEmail(email), [])
  const onChangePassword = useCallback((password: string) => setPassword(password), [])
  const onNavigateToRegister = useCallback(() => { }, [])

  const onSubmit = useCallback(() => {
    if (email === "" || password === "") {
      return;
    }

    if (!isEmailValid(email)) {
      return
    }

    onLogin(email, password).then((response) => {
      if (response === "success") {
        setEmail("")
        setPassword("")
      }
    })

  }, [email, status, password, onLogin]);

  return (
    <LoginContainer
      onSubmit={onSubmit}
      onNavigateToRegister={onNavigateToRegister}
      status={status}
      onChangeEmail={onChangeEmail}
      onChangePassword={onChangePassword}
      email={email}
      error={error}
      password={password}
    />
  )
}
