import React from 'react';
/* w-full h-full  */
const Loader = () => {
  return (
    <div className=" absolute top-0 left-0 right-0 bottom-0 bg-gray-900 bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-[250] rounded-lg ">
      <div className="flex items-center justify-center">
        {/* DaisyUI Spinner Loader */}
        {/* <span className="loading loading-spinner loading-lg text-white"></span> */}
        {/* <span className="loading loading-spinner loading-lg text-primary"></span> */}
        <span className="loading loading-ring loading-xs text-primary"></span>
        <span className="loading loading-ring loading-sm text-primary"></span>
        <span className="loading loading-ring loading-md text-primary"></span>
        <span className="loading loading-ring loading-lg text-primary"></span>
        {/* <p className="mt-4 text-white">Loading...</p> */}
      </div>
    </div>
  );
};

export default Loader;
