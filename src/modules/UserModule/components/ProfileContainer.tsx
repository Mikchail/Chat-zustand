import { Card, Button } from '@nextui-org/react';
import { data } from 'autoprefixer';
import { User } from '../../../types/User';
import { useCallback } from 'react';
import { ProfileInfo } from './ProfileInfo';


export type ProfileProps = {
  onLogout: () => void;
  status?: string;
  error?: string;
  user: User | null;
}


export const ProfileContainer = ({ onLogout, status, error, user }: ProfileProps) => {
  const loading = status === 'loading';
  const isError = status === 'error';

  const renderUser = useCallback(() => {
    if (!user) {
      return null;
    }
    return (
      <Card className="flex space-y-4 p-5 text-2xl font-bold flex flex-col">
        <ProfileInfo title="Имя:" info={user.name} />
        <ProfileInfo title="Почта:" info={user.email} />
        {/* <ProfileInfo title="Дата рождения:" info={formatToClientDate(data.dateOfBirth)} />
                    <ProfileInfo title="Обо мне:" info={data.bio} /> */}
      </Card>
    )
  }, [user])

  return (
    <>
      <div className="grid grid-cols-2 gap-4 max-w-screen-lg mx-auto">
        {/* <Card className="flex flex-col items-center text-center space-y-4 p-5 flex-2">
          <Image
                        src={`${BASE_URL}${data.avatarUrl}`}
                        alt={data.name}
                        width={200}
                        height={200}
                        className="border-4 border-white"
                    />
          <div className="flex flex-col text-2xl font-bold gap-4 items-center">

            <Button
                                endContent={<CiEdit />}
                                onClick={() => onOpen()}
                            > 
                                Редактировать
                            </Button>
          </div>
        </Card> */}
        {renderUser()}
      </div>
      {/* <EditProfile isOpen={isOpen} onClose={handleClose} user={data} /> */}
    </>
  );
}


