// import React, { useState } from "react";

const Modal = ({ isVisible, onClose }) => {
  // const [termsAccepted, setTermsAccepted] = useState(false);

  // const handleCheckboxChange = (e) => {
  //   setTermsAccepted(e.target.checked);
  // };

  if (!isVisible) return null; // If modal is not visible, don't render anything

  return (
    <>
      <input
        type="checkbox"
        id="my-modal"
        className="modal-toggle"
        checked
        readOnly
        aria-hidden="true"
      />
      <div className="modal backdrop-blur-xl">
        <div className="modal-box ">
          <p className="font-bold text-2xl mb-2">
            <span className="text-warning">WARNING</span> This site is for adults only!
          </p>
          {/* <p className="py-4 text-lg">Are you 18 years old or older?</p> */}
          {/* <p className="py-4 text-lg"> By entering this website, you affirm that you are at least 18 years of age
          and agree to the Terms of Service, which are available <a href="google.com">HERE</a>
          </p> */}

          <div className="py-2 flex justify-center">
            <label className="flex items-center gap-2 max-w-[402px]">
              {/* <input
                type="checkbox"
                checked={termsAccepted}
                onChange={handleCheckboxChange}
              /> */}
              <span>
              By entering this website, I acknowledge  that I am at least 18 years old and agree to the{" "}
                <a
                  href="/information/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Terms and Conditions
                </a>{" "}
                and the{" "}
                <a
                  href="/information/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Privacy Policy
                </a>
                
              </span>
            </label>
          </div>

          <div className="modal-action gap-4 flex flex-col sm:flex-row justify-center items-center">
  <button
    onClick={onClose}
    className="btn text-lg w-full sm:w-auto"
  >
    I am 18 or older - ENTER
  </button>
  <button
    onClick={() => {
      localStorage?.setItem("adultConfirmed", "false");
      // window.location.href = "https://google.com";
      window.location.href = "https://www.google.com/search?q=noporland";
    }}
    className="btn text-lg w-full sm:w-auto !ml-0"
  >
    I am under 18 - EXIT
  </button>
</div>

        </div>
      </div>
    </>
  );
};

export default Modal;
