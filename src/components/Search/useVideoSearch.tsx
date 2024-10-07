import React, { useEffect, useState } from 'react'
import type { VideoAndThumbnailUrlType } from '../../env';
import { useQuery } from '@tanstack/react-query';
import { fetchVideosData } from '../../services/awsServices';

const elementsPerPage = 20;

const useVideoSearch = ({initialVideos,searchState,searchTerm,selectedTags}) => {
  const [videos, setVideos] = useState<VideoAndThumbnailUrlType[] | undefined>(initialVideos?.videoFiles || []);
  const [isLoading, setIsLoading] = useState(false);


    const { data, isLoading: isLoadingQuery, isError, refetch } = useQuery({
        queryKey: ['videos', searchState], // Unique query key based on searchState and currentPage
        queryFn: async () => {
          if (searchTerm.length > 0 || selectedTags.length > 0 || searchState.currentPage > 1) {
            const result = await fetchVideosData({
              bringTags: false,
              elementsPerPage,
              searchText: searchState.savedSearchTerm,
              searchTags: searchState.savedSelectedTags,
              page: searchState.currentPage, // Pass the continuation token to the query
            });
            return result;
          }
          else return initialVideos;
        },
        // keepPreviousData: true, // Keep previous data while fetching new data
        // enabled: searchTerm.length > 0 || selectedTags.length > 0 || searchState.currentPage > 1, // Only fetch if there are filters or user paginates
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        staleTime: 6000000, // Cache results for 10 minutes
      });
    
      useEffect(() => {
        // if(searchTerm.length > 0 || selectedTags.length > 0 || searchState.currentPage > 1)
        if (!isLoadingQuery && data) {
          setIsLoading(false);
          setVideos(data?.videoFiles);
        }
        else if (isLoadingQuery) {
          setIsLoading(true);
        }
      }, [data, isLoadingQuery])

      return {
        data,
        videos,
        isLoading,
        refetch,
      }
      
}

export default useVideoSearch