import React from 'react';
import Header from '../common/Header';

interface Props {
  children: React.ReactNode;
}

export default function MainLayout({ children }: Props) {
  return (
    <div className="h-screen bg-slate-200 flex flex-col">
      <Header />
      <div>{children}</div>
    </div>
  );
}
