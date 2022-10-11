import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import ImageUpload from './ImageUpload';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { nanoid } from 'nanoid';
import { supabase } from '@/lib/supabase';
import { Home } from '@prisma/client';

const homeSchema = z.object({
  title: z.string().min(1, { message: 'Title Required' }).max(100).trim(),
  description: z.string().min(1).max(1000).trim(),
  price: z.number().min(1),
  guests: z.number().min(1),
  beds: z.number().min(1),
  baths: z.number().min(1),
});

export type HomeInput = z.infer<typeof homeSchema>;

interface Props {
  initialValues?: Home;
  buttonText: string;
  redirectPath: string;
  onSubmit: (data: any) => void;
}

export default function ListingForm({
  initialValues,
  buttonText,
  redirectPath,
  onSubmit,
}: Props) {
  const { image, title, description, price, guests, beds, baths } =
    initialValues ?? {};
  console.log('initialValues: ', initialValues);

  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<z.infer<typeof homeSchema>>({
    resolver: zodResolver(homeSchema),
  });

  const [imageUrl, setImageUrl] = useState(image ? image : '');

  const uploadImage = async (image: File) => {
    if (!image) return;

    let toastId;
    try {
      const ext = image.name.split('.').pop();
      const path = `${image.name.split('.')[0]}_${nanoid()}.${ext}`;

      toastId = toast.loading('Uploading...');

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET!)
        .upload(path, image);

      const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL!.replace(
        '.co',
        '.in',
      )}/storage/v1/object/public/${uploadData?.Key}`;

      setImageUrl(url);
      toast.success('Successfully uploaded', { id: toastId });
    } catch (e) {
      toast.error('Unable to upload', { id: toastId });
      setImageUrl('');
    } finally {
    }
  };

  const onValid: SubmitHandler<z.infer<typeof homeSchema>> = async (data) => {
    console.log(data);
    let toastId = toast.loading('Submitting...');
    await onSubmit({
      image: imageUrl,
      ...data,
    });
    toast.success('Successfully submitted', { id: toastId });
    // Redirect user
    if (redirectPath) {
      router.push(redirectPath);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <ImageUpload
          label="upload"
          initialImage={imageUrl}
          onChangePicture={uploadImage}
        />
      </div>

      <form
        onSubmit={handleSubmit(onValid)}
        className="space-y-2 flex flex-col"
      >
        <label htmlFor="">Title</label>
        <input
          {...register('title')}
          type="text"
          name="title"
          placeholder="Entire rental unit = Amsterdam"
          defaultValue={title}
        />

        <label htmlFor="">Description</label>
        <textarea
          {...register('description')}
          name="description"
          placeholder="Very charming and modern apartment in Amsterdam..."
          rows={5}
          className="resize-none outline-none"
          defaultValue={description}
        />

        <label htmlFor="">Price</label>
        <input
          {...register('price', { valueAsNumber: true })}
          type="number"
          name="price"
          min={0}
          placeholder="100"
          defaultValue={price}
        />
        <p>{errors.price?.message}</p>

        <div className="flex flex-wrap justify-between gap-2">
          <label htmlFor="">Guests</label>
          <input
            {...register('guests', { valueAsNumber: true })}
            type="number"
            name="guests"
            min={0}
            placeholder="2"
            className="flex-1"
            defaultValue={guests}
          />
          <label htmlFor="">Beds</label>
          <input
            {...register('beds', { valueAsNumber: true })}
            type="number"
            name="beds"
            min={0}
            placeholder="1"
            className="flex-1"
            defaultValue={beds}
          />
          <label htmlFor="">Baths</label>
          <input
            {...register('baths', { valueAsNumber: true })}
            type="number"
            name="baths"
            min={0}
            placeholder="1"
            className="flex-1"
            defaultValue={baths}
          />
        </div>

        <button
          type="submit"
          className="py-2 px-4 bg-slate-500 text-white rounded-md hover:bg-slate-600 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
