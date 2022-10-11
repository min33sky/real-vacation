import { signIn } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const emailSchema = z.object({
  email: z.string().email().min(1).trim(),
});

interface Props {
  show: boolean;
  onClose: () => void;
}

export default function AuthModal({ show, onClose }: Props) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const { handleSubmit, register } = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
  });

  const signInWithGoogle = () => {
    toast.loading('Redirecting...');
    // Perform sign in
    signIn('google', {
      callbackUrl: window.location.href,
    });
  };

  const signInWithEmail = async ({ email }: { email: string }) => {
    let toastId;
    try {
      toastId = toast.loading('Loading...');
      // Perform sign in
      await signIn('email', {
        redirect: false,
        callbackUrl: window.location.href,
        email,
      });
      setShowConfirm(true);
      toast.dismiss(toastId);
    } catch (err) {
      toast.error('Unable to sign in', { id: toastId });
    } finally {
    }
  };

  const onSubmit: SubmitHandler<z.infer<typeof emailSchema>> = (data) => {
    signInWithEmail(data);
  };

  useEffect(() => {
    if (!show) {
      setTimeout(() => {
        setShowConfirm(false);
        setShowSignIn(false);
      }, 299);
    }
  }, [show]);

  // Remove pending toasts if any
  useEffect(() => {
    toast.dismiss();
  }, []);

  return (
    <div className="fixed h-full w-full">
      <div onClick={onClose} className="fixed h-full w-full bg-black/50"></div>
      <div className="flex flex-col justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md h-1/2 px-10 py-8 bg-white z-50">
        <h1 className="text-center">Auth Modal</h1>
        {/* Sign with Google */}
        <button
          onClick={() => signInWithGoogle()}
          className="h-[46px] w-full mx-auto border rounded-md p-2 flex justify-center items-center space-x-2 text-gray-500 hover:text-gray-600 hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-400 focus:ring-opacity-25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-gray-500 disabled:hover:bg-transparent disabled:hover:border-gray-200 transition-colors"
        >
          <span>Sign {showSignIn ? 'in' : 'up'} with Google</span>
        </button>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-4"
        >
          <input {...register('email')} type="text" className="border" />
          <button className="bg-pink-500 text-white">Sign Up</button>
        </form>
        <ConfirmView show={showConfirm} email="haha@naver.com" />
      </div>
    </div>
  );
}

const ConfirmView = ({
  show = false,
  email,
}: {
  show: boolean;
  email: string;
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-white">
      <div className="flex items-center justify-center h-full p-8">
        <div className="overflow-hidden transition-all transform">
          <h3 className="text-center text-lg font-medium leading-6">
            <div className="flex flex-col justify-center items-center space-y-4">
              {/* <MailOpenIcon className="w-12 h-12 shrink-0 text-rose-500" /> */}
            </div>
            <p className="text-2xl font-semibold mt-2">Confirm your email</p>
          </h3>

          <p className="text-lg text-center mt-4">
            We emailed a magic link to <strong>{email ?? ''}</strong>.
            <br />
            Check your inbox and click the link in the email to login or sign
            up.
          </p>
        </div>
      </div>
    </div>
  );
};
