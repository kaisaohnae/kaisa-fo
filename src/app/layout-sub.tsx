'use client';

import SiteValidator from '@/components/site-validator';
import {useState, Suspense} from 'react';

/**
 * OrgValidator: 페이지 새로고침 및 이동시 공통으로 소속을 검증한다.
 * 검증시 화면 깜박임을 없애고자 onReady 추가
 *
 * @param children
 * @constructor
 */
export default function LayoutSub({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isReady, setReady] = useState(false);
  const onReady = () => {
    setReady(true);
  };
  return (
    <Suspense>
      <>{isReady && children}</>
      <SiteValidator onReady={onReady} />
    </Suspense>
  );
}
