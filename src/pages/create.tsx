import MainLayout from '@/components/layouts/MainLayout';
import ListingForm from '@/components/ListingForm';
import React from 'react';
import axios from 'axios';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';

export default function Create() {
  const addHome = async (data: any) => {
    console.log('addHome');
    const respone = await axios.post('/api/homes', data);
    console.log('result: ', respone.data);
  };

  return (
    <MainLayout>
      <div className="max-w-screen-sm mx-auto">
        <h1 className="textxl font-medium text-gray-800">List your home</h1>
        <p className="text-gray-500">
          Fill out the form below to list a new home
        </p>
        <div className="mt-8">
          <ListingForm
            buttonText="Add Home"
            redirectPath="/"
            onSubmit={addHome}
          />
        </div>
      </div>
    </MainLayout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // Check if user is authenticated
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: '/?next_url=/create',
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
}
