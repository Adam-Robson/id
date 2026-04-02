'use client';

import Navlink from '@/app/components/navlink';
import { PersonSimpleCircleIcon, RadioIcon } from '@phosphor-icons/react';
import '@/app/components/navigation.css';

export default function Navigation() {
  return (
    <nav className='site-nav nav'>
        <ul className='nav-list'>
          <li className='nav-li'>
            <Navlink 
              href='/about' 
              className='nav-link nav-about' 
              value="ABOUT"
              icon={PersonSimpleCircleIcon} 
            />
          </li>
          <li className='nav-li'>
            <Navlink 
              href='/contact' 
              className='nav-link nav-contact' 
              value='CONTACT'
              icon={RadioIcon}
            />
          </li>
        </ul>
      </nav>
  )
}
