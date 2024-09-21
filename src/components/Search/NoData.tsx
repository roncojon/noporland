import React from 'react';

const NoDataFound = () => {
    return (
        <div className="hero min-h-[50vh] bg-base-200 rounded-lg">
            <div className="hero-content text-center">
                <div className="max-w-xl" id="no-data-content">
                    <h1 className="text-5xl font-bold">No Results Found</h1>
                    <p className="py-6">
                        We couldn't find any matches for your search. Try adjusting your
                        search terms or filters to find what you're looking for.
                    </p>
                    <button
                        className="btn btn-primary"
                        onClick={/* async */ () => {
                            // const searchCloseButton = document.getElementById('search-close-icon') as HTMLButtonElement;
                            // searchCloseButton.click();
                            // setTimeout(() => {
                                const searchInput = document.getElementById('search-input') as HTMLInputElement;
                                searchInput.focus();
                            // }, 200);
                        }}
                    >Try Another Search</button>
                </div>
            </div>
        </div>
    );
};

export default NoDataFound;
