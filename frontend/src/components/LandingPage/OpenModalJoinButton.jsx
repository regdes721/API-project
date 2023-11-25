// import React from 'react';
import { useModal } from "../../context/Modal";
// import './GroupDetailsPage.css'

function OpenModalActionButton({
  modalComponent, // component to render inside the modal
  itemText, // text of the menu item that opens the modal
  onItemClick, // optional: callback function that will be called once the menu item that opens the modal is clicked
  onModalClose // optional: callback function that will be called once the modal is closed
}) {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {
    if (onModalClose) setOnModalClose(onModalClose);
    setModalContent(modalComponent);
    if (typeof onItemClick === "function") onItemClick();
  };

  return (
    <button className='join-meetup-button' onClick={onClick}>{itemText}</button>
  );
}

export default OpenModalActionButton;