import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import AuthModal from '../common/AuthModal';
import Header from '../common/Header';

interface Props {
  children: React.ReactNode;
}

export default function MainLayout({ children }: Props) {
  const [showModal, setShowModal] = useState(false);

  const showAuthModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="h-screen bg-slate-200 flex flex-col">
      <Header showModal={showAuthModal} />
      <main className="flex-grow container mx-auto">{children}</main>
      {showModal && <AuthModal show={showModal} onClose={closeModal} />}
      <Toaster />
    </div>
  );
}
