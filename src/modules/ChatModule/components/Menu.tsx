import { Dropdown, DropdownTrigger, DropdownMenu, DropdownSection, DropdownItem, Button, cn } from '@nextui-org/react'

export default function DropMenu() {
  const iconClasses = 'text-xl text-default-500 pointer-events-none flex-shrink-0'

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered">Open Menu</Button>
      </DropdownTrigger>
      <DropdownMenu variant="faded" aria-label="Dropdown menu with description">
        <DropdownSection title="Danger zone">
          <DropdownItem
            key="delete"
            className="text-danger"
            color="danger"
            shortcut="⌘⇧D"
            description="Permanently delete the file"
            startContent={<p>asdasd</p>}
          >
            Delete file
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  )
}
