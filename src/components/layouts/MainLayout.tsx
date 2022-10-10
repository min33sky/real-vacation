import React from 'react';
import { Toaster } from 'react-hot-toast';
import Header from '../common/Header';

interface Props {
  children: React.ReactNode;
}

export default function MainLayout({ children }: Props) {
  return (
    <div className="h-screen bg-slate-200 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto">{children}</main>
      <Toaster />
    </div>
  );
}
