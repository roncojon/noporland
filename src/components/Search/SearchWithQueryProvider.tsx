// src/components/SearchWithQueryProvider.jsx
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SearchBar from './SearchBar';

// Create a query client
const queryClient = new QueryClient();

const SearchWithQueryProvider = ({ tags }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SearchBar tags={tags} onSearch={function (searchTerm: string, selectedTags: string[]): void {
              throw new Error('Function not implemented.');
          } } />
     </QueryClientProvider>
  );
};

export default SearchWithQueryProvider;
