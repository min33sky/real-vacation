import React from 'react';
import { useSession, signOut } from 'next-auth/react';

export default function Header() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const isLoadingUser = status === 'loading';

  return (
    <header className="bg-slate-500 text-white py-4">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        <div>Logo</div>
        <div className="flex items-center gap-2">
          <p>{user ? '로그인 상태' : '로그아웃 상태'}</p>
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
