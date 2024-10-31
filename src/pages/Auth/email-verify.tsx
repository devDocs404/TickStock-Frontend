import React, { useEffect, useState } from 'react';
import { Mail, PartyPopper, CheckCircle } from 'lucide-react';
import { useVerifyEmail } from '@/Queries/AuthQueries';
import { Toaster } from 'sonner';
import { useParams } from 'react-router-dom';

const EmailVerifiedCard = () => {
  const [alreadyVerified, setAlreadyVerified] = useState(true);
  const { id } = useParams();

  const verifyEmail = useVerifyEmail({
    params: {
      id: id || '',
    },
    setAlreadyVerified,
  });

  useEffect(() => {
    if (verifyEmail.isSuccess) {
      console.log(verifyEmail.data, 'Success data');
      setAlreadyVerified(true);
      // setStatusCode(verifyEmail.data.status);
    }
    if (verifyEmail.isError) {
      console.error(verifyEmail.error?.cause?.status, 'Error occurred');
    }
  }, [
    verifyEmail.isSuccess,
    verifyEmail.isError,
    verifyEmail.data,
    verifyEmail.error,
  ]);

  if (verifyEmail.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Toaster />
      <div className="flex justify-center items-center h-screen">
        <div className="bg-white rounded-lg shadow-md p-10 w-1/3 md:w-1/2 lg:w-1/3 max-w-2xl h-1/3 min-w-[350px] mx-auto relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => {
              const randomValue: number = Math.random();
              return (
                <span
                  key={i}
                  className={`absolute text-blue-400 opacity-50 ${
                    randomValue > 0.5 ? 'animate-pulse' : 'animate-bounce'
                  }`}
                  style={{
                    left: `${randomValue * 100}%`,
                    top: `${Math.random() * 100}%`,
                    transform: `rotate(${Math.random() * 360}deg)`,
                  }}
                >
                  {['+', '×', '•'][Math.floor(Math.random() * 3)]}
                </span>
              );
            })}
          </div>

          {/* Main content */}
          <div className="relative flex flex-col items-center text-center h-full justify-center">
            <div className="mb-8 transform -rotate-12 inline-block relative">
              <Mail className="w-24 h-24 text-blue-500" />
              <div className="absolute top-1/4 left-1/4 w-3/4 h-1/2 bg-pink-200 rounded-sm -z-10 transform rotate-12"></div>
            </div>
            <h2 className="text-3xl font-bold text-blue-600 mb-2">
              {alreadyVerified ? "You're all set!" : 'Congratulations!'}
            </h2>
            <div className="flex items-center">
              <p className="text-xl text-gray-700">
                {alreadyVerified ? 'Already Verified' : 'Email Verified!!'}
              </p>
              {alreadyVerified ? (
                <CheckCircle className="w-6 h-6 text-green-500 ml-2" />
              ) : (
                <PartyPopper className="w-6 h-6 text-blue-500 ml-2" />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmailVerifiedCard;
