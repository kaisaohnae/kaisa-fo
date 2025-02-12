'use client';

import React, {} from 'react';
import Link from 'next/link';
import Menu from './menu';
import IconLogo from '@/components/icons/icon-logo';

export default function Header() {

  return (
    <header id="header">
      <h1>
        {/*<Link href="/"><img src={process.env.NEXT_PUBLIC_IMG_HOST + '/common/logo.png'} width={140} alt=''/></Link>*/}
        <Link href="/"><IconLogo /></Link>
      </h1>
      <Menu />
    </header>
  );
}
