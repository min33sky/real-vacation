import MainLayout from '@/components/layouts/MainLayout';
import ListingForm, { HomeInput } from '@/components/ListingForm';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '@/lib/prisma';
import React from 'react';
import { Home } from '@prisma/client';
import axios from 'axios';

interface Props {
  home: Home;
}

export default function EditPage({ home }: Props) {
  const handleOnSubmit = async (data: HomeInput) => {
    await axios.patch(`/api/homes/${home.id}`, data);
  };

  return (
    <MainLayout>
      <div className="max-w-screen-sm mx-auto">
        <h1 className="text-xl font-medium text-gray-800">Edit your home</h1>
        <p className="text-gray-500">
          Fill out the form below to update your home.
        </p>
        <div className="mt-8">
          <ListingForm
            initialValues={home}
            buttonText="Update home"
            redirectPath={`/homes/${home.id}`}
            onSubmit={handleOnSubmit}
          />
        </div>
      </div>
    </MainLayout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);

  const redirect = {
    redirect: {
      destination: '/?next_url=/homes',
      permanent: false,
    },
  };

  // Check if the user is authenticated
  if (!session) {
    return redirect;
  }

  // Retrieve the authenticated user
  const user = await prisma.user.findUnique({
    where: {
      email: session.user?.email ?? '',
    },
    select: {
      listedHomes: true,
    },
  });

  // Check if authenticated user is the owner of this home
  const id = context.params?.id;
  const home = user?.listedHomes.find((home) => home.id === id);
  if (!home) {
    return redirect;
  }

  return {
    props: {
      home: JSON.parse(JSON.stringify(home)),
    },
  };
}
