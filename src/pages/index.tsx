import Grid from '@/components/Grid';
import MainLayout from '@/components/layouts/MainLayout';
// import homes from '../data.json';
import { prisma } from '@/lib/prisma';

interface Props {
  homes: any;
}

export default function Home({ homes }: Props) {
  console.log('first homes', homes);

  return (
    <MainLayout>
      <h1 className="text-xl font-medium text-gray-800">
        Top-rated places to stay
      </h1>
      <p className="text-gray-500">
        Explore some of the best places in the world
      </p>

      <div className="mt-8">
        <Grid homes={homes} />
      </div>
    </MainLayout>
  );
}

export async function getServerSideProps() {
  const homes = await prisma.home.findMany({});

  //? Prisma의 DateTime Field는 직렬화해서 보내야한다.
  return {
    props: {
      homes: JSON.parse(JSON.stringify(homes)),
    },
  };
}
