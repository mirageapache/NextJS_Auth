import Link from "next/link"

import MainNav from "@/components/shared/MainNav"
import UserNav from "@/components/shared/UserNav"
import { Code } from "lucide-react"

const Navbar = () => {
  return (
    <header className="w-full fixed z-10 top-0 bg-gray-100 dark:bg-gray-900 border-b border-gray-200">
      <nav className="h-16 px-8 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <Code />
          </Link>
          <MainNav />
        </div>
        <div className="flex items-center">
          <UserNav />
        </div>
      </nav>
    </header>
  )
}

export default Navbar