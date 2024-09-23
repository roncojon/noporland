import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SearchBar from './SearchBar';

// Create a query client
const queryClient = new QueryClient();

const SearchWithQueryProvider = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SearchBar />
     </QueryClientProvider>
  );
};

export default SearchWithQueryProvider;
