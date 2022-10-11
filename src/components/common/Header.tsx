import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

interface Props {
  openModal: () => void;
}

export default function Header({ openModal }: Props) {
  const { data: session, status } = useSession();
  const user = session?.user;
  const isLoadingUser = status === 'loading';
  const router = useRouter();

  return (
    <header className="bg-slate-500 text-white py-4">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        <div>Logo</div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              session?.user ? router.push('/create') : openModal();
            }}
            className="hidden sm:block hover:bg-gray-200 transition px-3 py-1 rounded-md"
          >
            List your home
          </button>
          <p>{user ? '로그인 상태' : '로그아웃 상태'}</p>
          {!user && (
            <button
              onClick={openModal}
              className="bg-red-400 text-white px-2 py-2"
            >
              로그인
            </button>
          )}

          {user && (
            <button
              className="bg-violet-300 px-2 py-1 text-black"
              onClick={() => signOut()}
            >
              로그아웃
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
