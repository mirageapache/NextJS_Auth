import Link from "next/link"
import { getUserSession } from "@/lib/actions/authAction"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { buttonVariants } from "../ui/button"
import UserAvatar from "@/components/shared/UserAvatar"
import SignOutButton from "@/components/button/SignOutButton"

const UserNav = async () => {
  const { session } = await getUserSession()

  return (
    <div>
      {session ? (
        <DropdownMenu>
          <DropdownMenuTrigger><UserAvatar /></DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/profile">
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <SignOutButton />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link className={buttonVariants()} href="/signin">
          Sign In
        </Link>
      )}
    </div>
  )
}

export default UserNav