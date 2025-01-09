'use client';

import React from 'react';
import AuthenticatedPage from '@/components/AuthenticatedPage';

const ComingSoon = () => {
  return (
    <AuthenticatedPage>
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800">
        COMING SOON IN JANUARY
      </h1>
    </div>
    </AuthenticatedPage>
  );
};

export default ComingSoon;
