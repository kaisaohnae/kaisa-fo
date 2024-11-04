import React, {useState, useRef, useEffect} from 'react';
import Link from 'next/link';
import Menu from './menu';

export default function Header() {

  return (
    <header id="header" className={open ? 'open' : ''}>
      <h1>
        <Link href="/"><img src={process.env.NEXT_PUBLIC_IMG_HOST + '/common/logo.png'} width={140} alt=''/></Link>
      </h1>
      <Menu/>
    </header>
  );
}
