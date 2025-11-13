'use client'
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from './ui/button'

const Navbar = () => {
  const { data: session } = useSession()
  const user: User = session?.user as User

  return (
    <nav className="p-4 md:p-6 bg-white shadow-md text-slate-800">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <Link href='/' className="text-2xl font-bold mb-4 md:mb-0 text-indigo-700 hover:text-indigo-900 transition-colors duration-200">
          ShhBox
        </Link>
        {session ? (
          <div className="flex items-center space-x-4">
            <span className="text-lg font-medium">Welcome, {user?.username || user?.email}</span>
            <Button
              onClick={() => signOut()}
              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-md shadow-sm transition-all duration-200"
            >
              Logout
            </Button>
          </div>
        ) : (
          <Link href='/sign-in'>
            <Button
              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-md shadow-sm transition-all duration-200"
            >
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar