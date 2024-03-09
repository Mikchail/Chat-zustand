import { Card, CardHeader, Divider, CardBody, Spacer, Button, Input } from "@nextui-org/react";

export type RegisterProps = {
    status: string;
    error?: string;
    onSubmit: () => void;
    onChangeEmail: (login: string) => void;
    onChangeUserName: (login: string) => void;
    onChangePassword: (password: string) => void;
    onChangeRepeatPassword: (password: string) => void;
    userName: string;
    email: string;
    password: string;
    passwordRepeat: string;
}

export const RegisterContainer = ({
    status,
    error,
    onSubmit,
    onChangePassword,
    onChangeUserName,
    onChangeEmail,
    onChangeRepeatPassword,
    userName,
    email,
    password,
    passwordRepeat
}: RegisterProps) => {
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
                    value={userName}
                    onChange={(e) => {
                        onChangeUserName(e.target.value)
                    }}
                    fullWidth
                    color="primary"
                    size="lg"
                    placeholder="Name"
                />
                <Spacer y={1} />
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
                <Input
                    value={passwordRepeat}
                    onChange={(e) => {
                        onChangeRepeatPassword(e.target.value)
                    }}
                    fullWidth
                    color="primary"
                    size="lg"
                    placeholder="Repeat Password"
                />
                <Spacer y={1} />
                <Button onClick={onSubmit} color="primary" >Sign in</Button>
            </CardBody>
        </Card>
    )
}
