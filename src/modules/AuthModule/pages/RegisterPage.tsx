import { isEmailValid } from "@/utils";
import { useAuthStore } from "../authStore";
import { RegisterContainer } from "../components/RegisterContainer";

export const RegisterPage = () => {
  const { status, register, error } = useAuthStore((state) => ({
    register: state.register,
    status: state.status,
    error: state.error,
  }));
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");

  const onChangeUserName = useCallback((userName: string) => setUserName(userName), [])
  const onChangeEmail = useCallback((email: string) => setEmail(email), [])
  const onChangePassword = useCallback((password: string) => setPassword(password), [])
  const onChangeRepeatPassword = useCallback((passwordRepeat: string) => setPasswordRepeat(passwordRepeat), [])

  const onSubmit = useCallback(() => {
    if (userName === "" || password === "" || email === "" || passwordRepeat === "") {
      alert("Введите все поля");
      return;
    }
    if (password !== passwordRepeat) {
      alert("Passwords do not match");
      return
    }
    if (!isEmailValid(email)) {
      alert("Need email");
      return
    }
    register(userName, email, password).then((response) => {
      if (response === "success") {
        // setUserName("")
        // setPassword("")
        // setEmail("")
      }
    })
  }, [email, userName, password, passwordRepeat, register]);

  return (
    <RegisterContainer
      onChangeEmail={onChangeEmail}
      onChangeUserName={onChangeUserName}
      onChangePassword={onChangePassword}
      onChangeRepeatPassword={onChangeRepeatPassword}
      userName={userName}
      email={email}
      password={password}
      passwordRepeat={passwordRepeat}
      onSubmit={onSubmit}
      status={status}
      error={error}
    />
  )
}
