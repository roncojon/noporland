import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import UploadVideo from './UploadVideo';

// Create a QueryClient
const queryClient = new QueryClient();

const UploadVideoContainer = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <UploadVideo />
    </QueryClientProvider>
  );
};

export default UploadVideoContainer;
