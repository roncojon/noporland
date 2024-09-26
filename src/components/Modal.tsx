// Modal.js
import React from "react";

const Modal = ({ isVisible, onClose }) => {
  if (!isVisible) return null; // If modal is not visible, don't render anything
  return (
    <>
      <input type="checkbox" id="my-modal" className="modal-toggle" checked readOnly />
      <div className="modal backdrop-blur-xl">
        <div className="modal-box">
          <h3 className="font-bold text-xl"><span className=" text-warning">WARNING</span> this site is for adults only!</h3>
          <p className="py-4 text-lg">Are you 18 years old or older?</p>
          <div className="modal-action gap-2">
            <button onClick={onClose} className="btn w-24">
              Yes
            </button>
            <button onClick={()=>{localStorage?.setItem('adultConfirmed', 'false'); window.location.href = "https://google.com"}} className="btn w-24">
             No
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
