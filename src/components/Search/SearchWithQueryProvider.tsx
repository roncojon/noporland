import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SearchBar from './SearchBar';
import type { FetchVideosDataType } from '../../services/awsServices';

// Create a query client
const queryClient = new QueryClient();

const SearchWithQueryProvider = ({initialVideos}:{initialVideos:FetchVideosDataType}) => {
  // queryClient.setQueryData(['videos', { searchTerm: '', selectedTags: [], currentPage: 1 }], {
  //   videoFiles: initialVideos.videoFiles,
  //   currentPage: initialVideos.currentPage,
  //   totalPages: initialVideos.totalPages,
  //   totalResults: initialVideos.totalResults,
  //   tags: initialVideos.tags,
  // });

  return (
    <QueryClientProvider client={queryClient}>
      <SearchBar initialVideos={initialVideos}/>
     </QueryClientProvider>
  );
};

export default SearchWithQueryProvider;
