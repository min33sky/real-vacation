import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HeartIcon } from '@heroicons/react/24/solid';

interface Props {
  id: string;
  image: string;
  title: string;
  guests: number;
  beds: number;
  baths: number;
  price: number;
  favorite: boolean;
  onClickFavorite: (id: string) => void;
}
export default function Card({
  id,
  baths,
  beds,
  favorite,
  guests,
  image,
  onClickFavorite,
  price,
  title,
}: Props) {
  return (
    <Link href={`/homes/${id}`}>
      <a className="block w-full">
        <div className="relative">
          <div className="bg-gray-200 rounded-lg shadow overflow-hidden aspect-w-16 aspect-h-9">
            {image ? (
              <Image
                src={image}
                alt={title}
                layout="fill"
                objectFit="cover"
                className="hover:opacity-80 transition"
              />
            ) : null}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              if (typeof onClickFavorite === 'function') {
                onClickFavorite(id);
              }
            }}
            className="absolute top-2 right-2"
          >
            <HeartIcon
              className={`w-7 h-7 drop-shadow-lg transition ${
                favorite ? 'text-red-500' : 'text-white'
              }`}
            />
          </button>
        </div>

        <div className="mt-2 w-full text-gray-700 font-semibold leading-tight">
          {title ?? ''}
        </div>

        <ol className="mt-1 inline-flex items-center space-x-1 text-gray-500">
          <li>
            <span>{guests ?? 0} guests</span>
            <span aria-hidden="true"> · </span>
          </li>
          <li>
            <span>{beds ?? 0} beds</span>
            <span aria-hidden="true"> · </span>
          </li>
          <li>
            <span>{baths ?? 0} baths</span>
          </li>
        </ol>

        <p className="mt-2">
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(price ?? 0)}{' '}
          <span className="text-gray-500">/night</span>
        </p>
      </a>
    </Link>
  );
}
