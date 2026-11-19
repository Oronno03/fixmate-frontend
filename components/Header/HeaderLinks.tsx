import Link from 'next/link'
import React from 'react'

const HeaderLinks = () => {
  return (
    <ul className='flex gap-4'>
       <li className='text-muted-foreground hover:text-foreground'><Link href={"/"}>Home</Link></li> 
       <li className='text-muted-foreground hover:text-foreground'><Link href={"/services"}>Services</Link></li>
       <li className='text-muted-foreground hover:text-foreground'><Link href={"/about"}>About</Link></li>
    </ul>
  )
}

export default HeaderLinks