import React, { useState, useEffect, useRef } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import CardReact from '../CardReact';
import styles from '../Card.module.css';
import Loader from './Loader';
import { CloseIcon } from './CloseIcon';
import NoDataFound from './NoData';
import { fetchVideosData } from '../../services/awsServices';

const elementsPerPage = 3;

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>(''); // Current search term
  const [selectedTags, setSelectedTags] = useState<string[]>([]); // Current selected tags
  // const [currentPage, setCurrentPage] = useState(1); // Track the current page number
  const [searchState, setSearchState] = useState({
    savedSearchTerm: '',
    savedSelectedTags: [] as string[],
    currentPage:1
  });
  // const [totalPages, setTotalPages] = useState<number>(1); // Track the total pages returned by the backend
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false); // Dropdown visibility
  const searchInputRef = useRef<HTMLInputElement>(null); // Ref for the search input

  // Handle the search input change
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Clear all states when CloseIcon is clicked
  const handleClearSearch = () => {
    setSearchTerm('');
    setSelectedTags([]);
    setSearchState({
      savedSearchTerm: '',
      savedSelectedTags: [],
      currentPage: 1,
    });
    setIsDropdownOpen(false);
    searchInputRef.current?.blur(); // Remove focus from the search bar after clearing
  };

  
  // Toggle tag selection
  const toggleTagSelection = (tag: string, e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation(); // Prevent click from bubbling up to the click outside handler
    setSelectedTags((prevSelectedTags) =>
      prevSelectedTags.includes(tag)
        ? prevSelectedTags.filter((selectedTag) => selectedTag !== tag) // Unselect tag if it's already selected
        : [...prevSelectedTags, tag] // Select tag
    );
  };

  // Handle search action (save state)
  const handleSearch = () => {
    setSearchState({
      savedSearchTerm: searchTerm,
      savedSelectedTags: [...selectedTags],
      currentPage: 1,
    });
    setIsDropdownOpen(false);
    searchInputRef.current?.blur(); // Remove focus from the search bar after search
  };

  // Handle Enter key to trigger search
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLDivElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
    if (e.key === 'Escape') {
      handleClearSearch();
    }
  };

  // Handle clicking outside the search bar to revert or keep the state
  useEffect(() => {
    const searchBarElement: HTMLDivElement = document.querySelector('.search-bar-container');

    const handleClickOutside = (event: MouseEvent) => {
      // If user clicks outside, revert if search was not committed
      if (searchBarElement && !searchBarElement.contains(event.target as Node)) {
        setSearchTerm(searchState.savedSearchTerm); // Revert to last committed search term
        setSelectedTags(searchState.savedSelectedTags); // Revert to last committed selected tags
        setIsDropdownOpen(false); // Close dropdown
      }
    };
    const handleEscKeyPressed = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // If user clicks outside, revert if search was not committed
        setSearchTerm(searchState.savedSearchTerm); // Revert to last committed search term
        setSelectedTags(searchState.savedSelectedTags); // Revert to last committed selected tags
        setIsDropdownOpen(false); // Close dropdown
        searchInputRef.current.blur();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscKeyPressed);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchState]);

  // When the search input is focused, open the dropdown
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.stopPropagation(); // Prevent focus event from bubbling up
    setIsDropdownOpen(true); // Open dropdown
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['videos', searchState], // Unique query key based on searchState and currentPage
    queryFn: async () => {
      const result = await fetchVideosData({
        elementsPerPage,
        searchText: searchState.savedSearchTerm,
        searchTags: searchState.savedSelectedTags,
        page: searchState.currentPage , // Pass the continuation token to the query
      });
      return result;
    },
    // keepPreviousData: true, // Keep previous data while fetching new data
    staleTime: 600000, // Cache results for 10 minutes
  });

  // const videos = data?.videoFiles || [];

  // Handle Previous and Next Buttons
  const handlePreviousPage = () => {
    if (searchState.currentPage > 1) {
      setSearchState((prev) => ({
        ...prev,
        currentPage: prev.currentPage - 1,
      }));
    }
  };

  const handleNextPage = () => {
    setSearchState((prev) => ({
      ...prev,
      currentPage: prev.currentPage + 1,
    }));
  };

  return (
    <>
      <div
        className={`search-bar-container w-full mt-4 relative ${isLoading ? 'opacity-50 pointer-events-none' : ''
          }`}
      >
        {/* Search Input */}
        <div className="relative">
          <input
            id="search-input"
            ref={searchInputRef} // Add the ref to the input
            type="text"
            className="input input-bordered w-full pr-32 z-10" // Adjust padding to fit the CloseIcon and Search button
            value={searchTerm}
            onChange={handleSearchInputChange}
            onKeyDown={handleKeyDown} // Trigger search on Enter key
            onFocus={handleFocus}
            placeholder="Search..."
          />
       
          {/* Search Button inside the input */}
          {(searchTerm.length === 0 && selectedTags.length === 0) ||
            (searchTerm !== searchState.savedSearchTerm ||
              JSON.stringify(selectedTags) !== JSON.stringify(searchState.savedSelectedTags))
            ? (
              <button
                className={`absolute right-3 top-2 w-8 h-8 p-1 rounded-full flex items-center justify-center transition-colors ${(searchTerm.length > 0 || selectedTags.length > 0)
                    ? 'animate-ripple-effect bg-transparent'
                    : 'text-gray-400 hover:text-gray-600'
                  } ${(searchTerm.length > 0 || selectedTags.length > 0)
                    ? 'hover:animate-ripple-effect-hover focus:animate-ripple-effect-hover' // Darker ripple on hover/focus
                    : ''
                  }`}
                onClick={handleSearch}
                aria-label="Search"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>

            ) :
            <button
              id="search-close-icon"
              className="absolute right-3 top-2 w-8 h-8 p-1 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600"
              onClick={handleClearSearch}
            >
              {isLoading ? (
                <div className="loading loading-spinner loading-sm text-gray-400"></div>
              ) : (
                <CloseIcon />
              )}
            </button>
          }

          {/* Tags Dropdown */}
          {(isDropdownOpen /* && tags.length > 0 */) && (
            <div className="absolute w-full mt-1 bg-stone-300 bg-opacity-70 shadow-lg rounded-md p-2 z-[201]">
              {data?.tags?.map((tag) => (
                <div
                  key={tag}
                  className={`badge cursor-pointer p-3 m-1 shadow-[3px_3px_6px_rgba(var(--accent-dark),0.5)]  ${selectedTags.some((selectedTag) => selectedTag === tag)
                    ? 'badge-primary border-none bg-[rgb(var(--accent))]  text-[rgb(var(--accent-light))] font-bold'
                    : 'badge-outline border-none bg-stone-300 text-gray-700 font-bold'
                    }`}
                  onClick={(e) => toggleTagSelection(tag, e)}
                  onKeyDown={(e) => handleKeyDown(e)} // Trigger search on Enter key for tags
                  tabIndex={0} // Allow focusing the tag chips for keyboard accessibility
                >
                  {tag}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Tags Below Search Bar */}
        <div className="flex flex-wrap my-2 w-full">
          {selectedTags.map((tag) => (
            <div
              key={tag}
              className="badge badge-primary flex items-center p-3 m-1 border-none bg-[rgb(var(--accent))]  text-[rgb(var(--accent-light))] font-bold "
              tabIndex={0} // Allow focusing the tag chips for keyboard accessibility
              onKeyDown={(e) => handleKeyDown(e)} // Trigger search on Enter key for tags
            >
              {tag}
            </div>
          ))}
        </div>
      </div>

      <div id="linkCardGrid-container" className="w-full h-full relative box-content">
        {isLoading && <Loader />}
        {data?.videoFiles?.length > 0 ? (
          <ul role="list" className={styles.linkCardGrid}>
            {data?.videoFiles?.map(({ videoKey, videoUrl, thumbnailUrl, previewUrl }) => (
              <CardReact
                key={videoKey}
                href={videoUrl}
                title={videoKey}
                body="Watch the video"
                thumbnailUrl={thumbnailUrl}
                previewUrl={previewUrl}
              />
            ))}
          </ul>
        ) : (
          !isLoading && <NoDataFound />
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4">
        <div className="join">
          {/* Previous Button */}
          <button
            className="join-item btn"
            onClick={handlePreviousPage}
            disabled={searchState.currentPage === 1 || isLoading}
          >
            «
          </button>
          
          {/* Page Number */}
          <button className="join-item btn">Page {isLoading ? '...' : searchState.currentPage} {!isLoading && 'of'} {data?.totalPages}</button>
          
          {/* Next Button */}
          <button
            className="join-item btn"
            onClick={handleNextPage}
            disabled={searchState.currentPage === data?.totalPages || data?.totalPages === 0 || isLoading}
          >
            »
          </button>
        </div>
      </div>
    </>
  );
};

export default SearchBar;
