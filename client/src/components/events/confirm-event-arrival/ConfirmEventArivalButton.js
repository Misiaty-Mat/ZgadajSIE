import { useState } from "react";
import BasicModal from "../../modal/BasicModal";
import ConfirmEventArrivalForm from "./confirm-event-arrival-form/ConfirmEventArrivalForm";

const ConfirmEventArrivalButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = (e) => {
    e?.preventDefault();
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <button onClick={toggleModal}>Confirm event arrival</button>
      <BasicModal isOpen={isModalOpen} title="Add event" onClose={toggleModal}>
        <ConfirmEventArrivalForm />
      </BasicModal>
    </>
  );
};

export default ConfirmEventArrivalButton;
