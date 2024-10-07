import React, { useState, useEffect, useRef } from 'react';
import CardReact from '../CardReact';
import styles from '../Card.module.css';
import Loader from './Loader';
import { CloseIcon } from './CloseIcon';
import NoDataFound from './NoData';
import { type FetchVideosDataType } from '../../services/awsServices';
import Modal from '../Modal';
import useVideoSearch from './useVideoSearch';

const SearchBar = ({ initialVideos, tags }: { initialVideos: FetchVideosDataType, tags: string[] | any }) => {
  const [isClient, setIsClient] = useState(false);
  const [searchParams, setSearchParams] = useState<URLSearchParams | null>(null);
  const [urlProcessed, setUrlProcessed] = useState(false); // NEW: Track if URL params have been processed

  // Initialize the state
  const initialSearchState = {
    savedSearchTerm: '',
    savedSelectedTags: [] as string[],
    currentPage: 1,
  };

  const [searchTerm, setSearchTerm] = useState<string>(initialSearchState.savedSearchTerm);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialSearchState.savedSelectedTags);
  const [searchState, setSearchState] = useState(initialSearchState);
  const [isUpdatingUrl, setIsUpdatingUrl] = useState(false); // Track URL updates

  // Detect if we're on the client (to manage URL params)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsClient(true);
      setSearchParams(new URLSearchParams(window.location.search));
    }
  }, []);

  // Update the state with URL search params only ONCE when navigating back to the page
  useEffect(() => {
    if (isClient && searchParams && !urlProcessed) {
      const searchText = searchParams.get('searchText');
      const searchTags = searchParams.get('searchTags')?.split(',') || [];
      const page = Number(searchParams.get('page')) || 1;

      // Only update if the URL parameters have actual values and are different
      if (
        (searchText || searchTags.length > 0 || page !== 1) && // Avoid resetting to empty values
        (searchText !== searchState.savedSearchTerm ||
          searchTags.toString() !== searchState.savedSelectedTags.toString() ||
          page !== searchState.currentPage)
      ) {
        setSearchState({
          savedSearchTerm: searchText || '',
          savedSelectedTags: searchTags,
          currentPage: page,
        });
        setSearchTerm(searchText || '');
        setSelectedTags(searchTags);
        setUrlProcessed(true); // Mark URL as processed to avoid re-triggering
      }
    }
  }, [isClient, searchParams, urlProcessed]);

  // Hook that fetches videos based on the state
  const { data, videos, isLoading, refetch } = useVideoSearch({
    initialVideos,
    searchState,
    // searchTerm,
    // selectedTags,
  });

  // Update URL when search parameters change, but avoid infinite loop
  useEffect(() => {
    if (isClient && searchParams) {
      const newParams = new URLSearchParams();
      
      // Only set URL params if the values are not empty
      if (searchState.savedSearchTerm) {
        newParams.set('searchText', searchState.savedSearchTerm);
      }
      if (selectedTags.length > 0) {
        newParams.set('searchTags', searchState.savedSelectedTags.join(','));
      }
      newParams.set('page', searchState.currentPage.toString());

      // Only update the URL if the params differ from the current URL
      if (newParams.toString() !== searchParams.toString()) {
        setIsUpdatingUrl(true); // Indicate we're about to update the URL
        setSearchParams(newParams);
        window.history.replaceState(null, '', '?' + newParams.toString());
        setIsUpdatingUrl(false); // Reset after URL update
      }
    }
  }, [searchState, isClient, searchParams]);

  // Rest of the component logic (e.g., handling input changes, search, etc.)...



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
  const [showModal, setShowModal] = useState(false);

  // Show the modal as soon as the component mounts
  useEffect(() => {
    if (localStorage.getItem('adultConfirmed') !== 'true')
      setShowModal(true);
  }, []);

  const closeModal = () => {
    localStorage?.setItem('adultConfirmed', 'true')
    setShowModal(false);
  };

  return (
    <>
      <Modal isVisible={showModal} onClose={closeModal} />
      <div
        className={`search-bar-container w-full h-full mt-4 relative ${isLoading ? 'opacity-50 pointer-events-none' : ''
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
                className={`absolute right-3 top-2 w-8 h-8 p-1 rounded-lg flex items-center justify-center transition-colors ${(searchTerm.length > 0 || selectedTags.length > 0)
                  ? 'animate-ripple-effect bg-transparent'
                  : 'text-gray-400 hover:text-gray-600'
                  } ${(searchTerm.length > 0 || selectedTags.length > 0)
                    ? 'hover:animate-ripple-effect-hover focus:animate-ripple-effect-hover' // Darker ripple on hover/focus
                    : ''
                  }`}
                onClick={handleSearch}
                aria-label="Search"
              >
                {!isLoading ? 
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
                </svg> :
                <div className="loading loading-spinner loading-sm text-gray-400"></div>

                }
              </button>

            ) :
            <button
              id="search-close-icon"
              className="absolute right-3 top-2 w-8 h-8 p-1 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600"
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
           <div className="absolute w-full mt-1 bg-stone-400 bg-opacity-70 shadow-lg rounded-md p-2 z-[201]">
           {tags?.map((tag) => (
             <div
               key={tag}
               className={`badge cursor-pointer p-3 m-1 shadow-[3px_3px_6px_rgba(var(--accent-dark),0.5)] 
                 ${selectedTags.some((selectedTag) => selectedTag === tag)
                   ? "badge badge-primary  border-none bg-[rgb(var(--accent))]  text-[rgb(var(--accent-light))]  hover:shadow-[5px_5px_10px_rgba(var(--accent-dark),0.8)] scale-105 "
                  //  'badge-primary border-none bg-[rgb(var(--accent))] text-[rgb(var(--accent))] font-bold hover:shadow-[5px_5px_10px_rgba(var(--accent-dark),0.8)] hover:scale-95' // Add scale and hover shadow for selected tags
                   : '!bg-stone-200  badge-outline border-none text-gray-700 font-bold hover:shadow-[5px_5px_10px_rgba(0,0,0,0.4)] hover:scale-95' // Add scale and hover shadow for unselected tags
                 }  transition-transform duration-200`} // Added transition for smooth effect
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

      <div /* id="linkCardGrid-container" */ className="w-full h-full !relative min-h-[300px]">
        {isLoading && (searchTerm.length > 0 || selectedTags.length > 0 || searchState.currentPage > 1) && <Loader />}
        {videos?.length > 0/*  && !isLoading  */ ? (
          <ul role="list" className={styles.linkCardGrid}>
            {videos?.map(({ videoKey, videoUrl, thumbnailUrl, previewUrl, tags, index }) => (
              <CardReact
                key={videoKey}
                href={videoUrl}
                title={videoKey}
                body="Watch the video"
                thumbnailUrl={thumbnailUrl}
                previewUrl={previewUrl}
                tags={tags}
                index={index}
              />
              // <iframe src="https://es.pornhub.com/embed/66298b36e9dcf" frameBorder="0" allowFullScreen className={styles.linkCard}/>

            ))}
          </ul>
        ) : (
          !isLoading && videos !== undefined && <NoDataFound />
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
      {/* < RSSFeedReader rssUrl="https://es.pornhub.com/video/webmasterss" /> */}
      {/* <video src="https://es.pornhub.com/embed/663da88381fa3"/> */}
      {/* <div className=' w-full h-[400px] relative'>
        <iframe
          src="https://es.pornhub.com/embed/6460f34aacdaf"
          frameBorder="0"
          allowFullScreen
          width="100%"
          height="100%"
          onLoad={handleLoadIframe}
        />
        <div className={`w-[100px] h-[36px]  absolute right-10 bottom-0 ${isHidingPornHubIcon ? 'backdrop-blur-md' : ''}`}></div>
      </div> */}
    </>
  );
};

export default SearchBar;
