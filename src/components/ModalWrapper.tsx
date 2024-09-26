import React, { useEffect, useState } from 'react'
import Modal from './Modal';

const ModalWrapper = () => {
    const [showModal, setShowModal] = useState(false);

  // Show the modal as soon as the component mounts
  useEffect(() => {
    if(localStorage.getItem('adultConfirmed')!=='true')
    setShowModal(true);
  }, []);

  const closeModal = () => {
    localStorage?.setItem('adultConfirmed', 'true')
    setShowModal(false);
  };
  
  
  return (
    <Modal isVisible={showModal} onClose={closeModal} />
  )
}

export default ModalWrapper