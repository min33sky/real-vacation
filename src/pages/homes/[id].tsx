import MainLayout from '@/components/layouts/MainLayout';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { prisma } from '@/lib/prisma';
import { Home } from '@prisma/client';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Props {
  home: Home;
}

export default function HomeDetailPage({ home }: Props) {
  const router = useRouter();

  const { data: session } = useSession();
  const [isOwner, setIsOwner] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const deleteHome = async () => {
    let toastId;
    try {
      toastId = toast.loading('Deleting...');
      setDeleting(true);
      // Delete home from DB
      await axios.delete(`/api/homes/${home.id}`);
      // Redirect user
      toast.success('Successfully deleted', { id: toastId });
      router.push('/homes');
    } catch (e) {
      console.log(e);
      toast.error('Unable to delete home', { id: toastId });
      setDeleting(false);
    }
  };

  useEffect(() => {
    (async () => {
      if (session?.user) {
        try {
          const response = await axios.get(`/api/homes/${home.id}/owner`);
          setIsOwner(response.data.email === session.user.email);
        } catch (error) {
          setIsOwner(false);
        }
      }
    })();
  }, [home, session?.user]);

  // Fallback version - "fallback: true" in getStaticPaths
  if (router.isFallback) {
    return 'Loading...';
  }

  return (
    <MainLayout>
      {' '}
      <div className="max-w-screen-lg mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:space-x-4 space-y-4">
          <div>
            <h1 className="text-2xl font-semibold truncate">
              {home?.title ?? ''}
            </h1>
            <ol className="inline-flex items-center space-x-1 text-gray-500">
              <li>
                <span>{home?.guests ?? 0} guests</span>
                <span aria-hidden="true"> · </span>
              </li>
              <li>
                <span>{home?.beds ?? 0} beds</span>
                <span aria-hidden="true"> · </span>
              </li>
              <li>
                <span>{home?.baths ?? 0} baths</span>
              </li>
            </ol>
          </div>

          {isOwner ? (
            <div className="...">
              <button
                type="button"
                disabled={deleting}
                onClick={() => router.push(`/homes/${home.id}/edit`)}
                className="...."
              >
                Edit
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={deleteHome}
                className="..."
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          ) : null}
        </div>

        <div className="mt-6 relative aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg shadow-md overflow-hidden">
          {home?.image ? (
            <Image
              src={home.image}
              alt={home.title}
              layout="fill"
              objectFit="cover"
            />
          ) : null}
        </div>

        <p className="mt-8 text-lg">{home?.description ?? ''}</p>
      </div>
    </MainLayout>
  );
}

export async function getStaticPaths() {
  const homes = await prisma.home.findMany({
    select: {
      id: true,
    },
  });

  const paths = homes.map((home) => ({
    params: { id: home.id },
  }));

  return { paths, fallback: true };
}

//TODO: Production에서는 값을 업데이트했을 때 기존에 빌드한 페이지가 보여줘서 ssr로 교체해야할듯??
//? Development에서는 매번 요청마다 페이지를 새로 만드니 업데이트가 잘 되는것처럼 보인다.
//? 아니면 react-query로 optimistic update를 해서 바꾸는 ㅂ방법도 있을듯
export async function getStaticProps({ params }: { params: any }) {
  const home = await prisma.home.findUnique({
    where: {
      id: params.id,
    },
  });

  if (home) {
    return {
      props: {
        home: JSON.parse(JSON.stringify(home)),
      },
    };
  }

  return {
    redirect: {
      destination: '/',
      permanent: false,
    },
  };
}
