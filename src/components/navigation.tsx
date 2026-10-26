'use client';

import Navlink from '@/components/navlink';
import '@/components/styles/navigation.css';

export default function Navigation() {
  return (
    <nav className='site-nav nav'>
      <ul className='nav-list'>
        <li className='nav-li'>
          <Navlink href='/albums' className='nav-link' value='Albums' />
        </li>
        <li className='nav-li'>
          <Navlink href='/about' className='nav-link' value='About' />
        </li>
        <li className='nav-li'>
          <Navlink href='/contact' className='nav-link' value='Contact' />
        </li>
      </ul>
    </nav>
  );
}
