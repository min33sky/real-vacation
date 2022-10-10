import Grid from '@/components/Grid';
import MainLayout from '@/components/layouts/MainLayout';
import homes from '../data.json';

export default function Home() {
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
