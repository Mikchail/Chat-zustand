import { Fragment, useCallback, useRef } from 'react'
import { User } from '../../../types/User'
import { User as UserUI } from '@nextui-org/react'
import style from './index.module.scss'
import { throttle } from '@/utils'
import { DropMenu } from './Menu'
type Props = {
  users: User[]
  status: string
  onLoadMore: () => void
  openPrivateChat: (userId: string) => void
  currentUser: User
}

export const UsersContainer = ({ users, onLoadMore, status, openPrivateChat, currentUser }: Props) => {
  const isLoading = status === 'loading'
  const listRef = useRef<HTMLDivElement | null>(null) // ссылка на элемент списка

  function handleScroll() {
    const listElement = listRef.current
    console.log('scret')

    if (listElement) {
      const height = document.body.offsetHeight
      const screenHeight = window.innerHeight

      const scrolled = window.scrollY
      const threshold = height - screenHeight / 4

      const position = scrolled + screenHeight

      if (position >= threshold) {
        onLoadMore()
      }
    }
  }

  useEffect(() => {
    const throttled = throttle(handleScroll, 300)
    window.addEventListener('scroll', throttled)
    return () => window.removeEventListener('scroll', throttled)
  }, [])

  const renderItem = useCallback(
    (user: User) => {
      const onPrivateChat = () => openPrivateChat(user.id)
      return (
        <div className={style['user-border']}>
          <UserUI
            // onClick={onPrivateChat}
            name={user.name ? user.name : user.email}
            description="Product Designer"
            avatarProps={{
              src: 'https://i.pravatar.cc/150?u=a04258114e29026702d',
            }}
          />
          <DropMenu onCreateChat={onPrivateChat} />
        </div>
      )
    },
    [users],
  )

  return (
    <div className="grid gap-4 max-w-screen-lg  mx-auto" ref={listRef}>
      {users.map((user) => {
        return <Fragment key={user.id}>{renderItem(user)}</Fragment>
      })}
    </div>
  )
}
