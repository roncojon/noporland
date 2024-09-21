import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { searchResponseQuery } from '../../apiTest';
import type { VideoAndThumbnailUrlType } from '../../env';
import CardReact from '../CardReact';
import styles from '../Card.module.css';
import { useQuery } from '@tanstack/react-query';
import Loader from './Loader';
import { CloseIcon } from './CloseIcon';
import NoDataFound from './NoData';

interface SearchBarProps {
  tags: string[];
  onSearch: (searchTerm: string, selectedTags: string[]) => void;
}



const SearchBar: React.FC<SearchBarProps> = ({ tags, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState<string>(''); // Current search term
  const [selectedTags, setSelectedTags] = useState<string[]>([]); // Current selected tags

  const [searchState, setSearchState] = useState({
    savedSearchTerm: '',
    savedSelectedTags: [],
    isSearchCommitted: false,
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false); // Dropdown visibility

  // Ref for the search input to blur it after search
  const searchInputRef = useRef<HTMLInputElement>(null);

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
      isSearchCommitted: false,
    });
    setIsDropdownOpen(false);
    searchInputRef.current?.blur(); // Remove focus from the search bar after clearing

  };

  // Toggle tag selection
  const toggleTagSelection = (tag: string, e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation(); // Prevent click from bubbling up to the click outside handler
    setSelectedTags(prevSelectedTags =>
      prevSelectedTags.some(selectedTag => selectedTag === tag)
        ? prevSelectedTags.filter(selectedTag => selectedTag !== tag) // Unselect tag if it's already selected
        : [...prevSelectedTags, tag] // Select tag
    );
  };

  // Handle search action (save state)
  const handleSearch = () => {
    setSearchState({
      savedSearchTerm: searchTerm,
      savedSelectedTags: [...selectedTags],
      isSearchCommitted: true,
    });
    // onSearch(searchTerm, selectedTags); // Trigger search action
    setIsDropdownOpen(false);
    searchInputRef.current?.blur(); // Remove focus from the search bar after search
  };

  // Handle clicking outside the search bar to revert or keep the state
  useEffect(() => {
    const searchBarElement: HTMLDivElement = document.querySelector('.search-bar-container');

    const handleClickOutside = (event: MouseEvent) => {
      // If user clicks outside, revert if search was not committed
      if (searchBarElement && !searchBarElement.contains(event.target as Node)) {
        if (!searchState.isSearchCommitted) {
          setSearchTerm(searchState.savedSearchTerm); // Revert to last committed search term
          setSelectedTags(searchState.savedSelectedTags); // Revert to last committed selected tags
        }
        setIsDropdownOpen(false); // Close dropdown
      }
    };
    const handleEscKeyPressed = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // If user clicks outside, revert if search was not committed
        // if (!isSearchCommitted) {
        setSearchTerm(searchState.savedSearchTerm); // Revert to last committed search term
        setSelectedTags(searchState.savedSelectedTags); // Revert to last committed selected tags
        // }
        setIsDropdownOpen(false); // Close dropdown
        searchInputRef.current.blur();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscKeyPressed);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchState]);

  // Handle Enter key to trigger search
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLDivElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // When the search input is focused, open the dropdown
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.stopPropagation(); // Prevent focus event from bubbling up
    setSearchState({ ...searchState, isSearchCommitted: false }) // Reset commit flag when editing
    setIsDropdownOpen(true); // Open dropdown
  };

  const [videos, setVideos] = useState<VideoAndThumbnailUrlType[]>([]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['videos', searchState], // Unique query key
    queryFn: async () => {
      if (searchState.savedSearchTerm.length > 0 || searchState.savedSelectedTags.length > 0) {
        return await searchResponseQuery(searchState.savedSearchTerm, searchState.savedSelectedTags);
      } else {
        return [];
      }
    }, // API call function
    enabled: searchState.isSearchCommitted, // Only run when search is committed
    refetchOnMount: false, // Do not refetch on component mount
    refetchOnWindowFocus: false, // Do not refetch on window focus
    staleTime: 600000, // Cache results for 60 seconds
  });

  useEffect(() => {
    if (data) {
      setVideos(data?.map(item=>(
        {
          ...item,
          videoKey:item?.videoKey?.slice(11)
          }
        )) ?? []);
    }
  }, [data]);

  useEffect(() => {
    const initialCards = document.getElementById('link-card-grid-container');
    const linkCardGridContainer = document.getElementById('linkCardGrid-container');

    if (!isLoading) {

      if (searchState.savedSearchTerm.length || searchState.savedSelectedTags.length) {
        if (initialCards) {
          initialCards.style.display = 'none';
        };
        if (linkCardGridContainer) {
          linkCardGridContainer.style.display = 'block';
        };

      }
      else {
        if (initialCards) {
          initialCards.style.display = 'block';
        };

        if (linkCardGridContainer && !searchState.savedSearchTerm.length && !searchState.savedSelectedTags.length) {
          linkCardGridContainer.style.display = 'none';
        };

      }

    }
  }, [isLoading, searchState]);

  const [root, setRoot] = useState(null);

  useEffect(() => {
    const containerBackground = document.getElementById('link-card-grid-container-background');
    if (!root) {
      const newRoot = ReactDOM.createRoot(containerBackground);
      setRoot(newRoot);
    }
    if (isLoading) {
      if (root) {
        root.render(<Loader />);
      }
    }
    else {
      if (root) {
        root.render(null);
      }
    }
  }, [isLoading, root]);

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
          {/* CloseIcon positioned as a sibling to the Search button */}
          {/* {(searchTerm.length > 0 || selectedTags.length > 0) && (
            <button
              id="search-close-icon"
              className="absolute right-2 top-[2px] text-gray-400 hover:text-gray-600 p-2 pt-1 "
              onClick={handleClearSearch}
            >
              {isLoading ?
                <div className="loading loading-spinner loading-xs text-gray-400"></div>
                :
                <CloseIcon />}

            </button>
          )} */}
          {/* Search Button inside the input */}
          {(searchTerm.length === 0 && selectedTags.length === 0) ||
            (searchTerm !== searchState.savedSearchTerm ||
              JSON.stringify(selectedTags) !== JSON.stringify(searchState.savedSelectedTags))
            ? (
              <button
              className={`absolute right-3 top-2 w-8 h-8 p-1 rounded-full flex items-center justify-center transition-colors ${
                (searchTerm.length > 0 || selectedTags.length > 0)
                  ? 'animate-ripple-effect bg-transparent'
                  : 'text-gray-400 hover:text-gray-600'
              } ${
                (searchTerm.length > 0 || selectedTags.length > 0)
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
            {isLoading ?
              <div className="loading loading-spinner loading-sm text-gray-400"></div>
              :
              <CloseIcon />}

          </button>}


          {/* Tags Dropdown */}
          {isDropdownOpen && (
            <div className="absolute w-full mt-1 bg-stone-300 bg-opacity-70 shadow-lg rounded-md p-2 z-[201]">
              {tags.map(tag => (
                <div
                  key={tag}
                  className={`badge cursor-pointer p-3 m-1 shadow-[3px_3px_6px_rgba(var(--accent-dark),0.5)]  ${selectedTags.some(selectedTag => selectedTag === tag)
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
          {selectedTags.map(tag => (
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
      <div id='linkCardGrid-container' className=' w-full h-full relative box-content'> {/*  min-w-1 min-h-1 */}
        {isLoading && <Loader />}
        {
          (videos?.length > 0) &&
          <ul role="list" className={styles.linkCardGrid}>
            {videos.map(({ videoKey, videoUrl, thumbnailUrl, previewUrl }) => (
              <CardReact
                key={videoKey/* ?.slice(11) */}
                href={videoUrl}
                title={videoKey/* ?.slice(11) */}
                body="Watch the video"
                thumbnailUrl={thumbnailUrl}
                previewUrl={previewUrl}
              />
            ))}
          </ul>
        }
        {!isLoading && !videos.length && <NoDataFound />}
      </div>
    </>
  );
};

export default SearchBar;
