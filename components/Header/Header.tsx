import React from 'react'
import HeaderLinks from './HeaderLinks'
import HeaderAuth from './HeaderAuth'
import { Wrench } from 'lucide-react'
import Link from 'next/link'

const Header = () => {
  return (
    <header className='text-foreground font-bold text-xl bg-background border-b border-border sticky top-0'>
        <nav className='container mx-auto flex justify-between w-full py-3'>
            <Link href={"/"}>
              <h1 className='inline-flex gap-2'><Wrench></Wrench> FIXMATE</h1>
            </Link>
            <HeaderLinks />
            <HeaderAuth />
        </nav>
    </header>
  )
}

export default Header