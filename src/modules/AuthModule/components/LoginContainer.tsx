import {
  Card,
  Spacer,
  Button,
  Input,
  Checkbox,
  CardHeader,
  Divider,
  CardBody,
} from '@nextui-org/react';

export type LoginProps = {
  onNavigateToRegister: () => void,
  status: string;
  error?: string;
  onSubmit: () => void;
  onChangeEmail: (login: string) => void;
  onChangePassword: (password: string) => void;
  email: string;
  password: string;
}

export const LoginContainer = ({
  onNavigateToRegister,
  status,
  error,
  onSubmit,
  password,
  email,
  onChangeEmail,
  onChangePassword
}: LoginProps) => {
  const loading = status === "loading";
  const isError = status === "error";
  return (
    <Card className="max-w-[400px] m-auto">
      <CardHeader className="flex gap-3">
        NextUI Login
      </CardHeader>
      <Divider />
      <CardBody>
        <Input
          value={email}
          onChange={(e) => {
            onChangeEmail(e.target.value)
          }}

          fullWidth
          color="primary"
          size="lg"
          placeholder="Email"
        />
        <Spacer y={1} />
        <Input
          value={password}
          onChange={(e) => {
            onChangePassword(e.target.value)
          }}
          fullWidth
          color="primary"
          size="lg"
          placeholder="Password"
        />
        <Spacer y={1} />
        <Button onClick={onSubmit} color="primary" >Sign in</Button>
      </CardBody>
    </Card>
  );
}
