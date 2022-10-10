import { ExclamationCircleIcon } from '@heroicons/react/24/solid';
import Card from './common/Card';

interface Props {
  homes: any[];
}

export default function Grid({ homes = [] }: Props) {
  const isEmpty = homes.length === 0;

  const toggleFavorite = async (id: string) => {
    // TODO: Add / Remove home from the autheniticated user's favorites
  };

  if (isEmpty) {
    return (
      <p className="text-amber-700 bg-amber-100 px-4 rounded-md py-2 max-w-max inline-flex items-center space-x-1 ">
        <ExclamationCircleIcon className="shrink-0 w-5 h-5 mt-px" />
        <span>Unfortunately, there is nothing to display yet.</span>
      </p>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {homes.map((home) => (
        <Card key={home.id} {...home} onClickFavorite={toggleFavorite} />
      ))}
    </div>
  );
}
