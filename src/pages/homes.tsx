import Grid from '@/components/Grid';
import MainLayout from '@/components/layouts/MainLayout';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '@/lib/prisma';
import React from 'react';
import { Home } from '@prisma/client';

interface Props {
  homes: Home[];
}

export default function HomesPage({ homes }: Props) {
  return (
    <MainLayout>
      <h1 className="text-xl font-medium text-gray-800">Your listings</h1>
      <p className="text-gray-500">
        Manage your homes and update your listings
      </p>
      <div className="mt-8">
        <Grid homes={homes} />
      </div>
    </MainLayout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/?next_url=/homes',
        permanent: false,
      },
    };
  }

  const homes = await prisma.home.findMany({
    where: {
      owner: {
        email: session.user?.email,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return {
    props: {
      homes: JSON.parse(JSON.stringify(homes)),
    },
  };
}
