import { Dropdown, DropdownTrigger, DropdownMenu, DropdownSection, DropdownItem, Button, cn } from '@nextui-org/react'
type Props = {
  onCreateChat: () => void
}
export const DropMenu = ({ onCreateChat }: Props) => {
  const iconClasses = 'text-xl text-default-500 pointer-events-none flex-shrink-0'

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered">Open Menu</Button>
      </DropdownTrigger>
      <DropdownMenu variant="faded" aria-label="Dropdown menu with description">
        <DropdownSection>
          <DropdownItem
            key="delete"
            className="text-danger"
            color="danger"
            onClick={onCreateChat}
            // startContent={<p>Create Chat</p>}
          >
            Create Chat
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  )
}
