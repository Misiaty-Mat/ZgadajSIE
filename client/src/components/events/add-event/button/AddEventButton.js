import BasicModal from "../../../modal/BasicModal";
import { useState } from "react";
import AddEventForm from "../form/AddEventForm";

const AddEventButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = (e) => {
    e?.preventDefault();
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <button onClick={toggleModal}>Stwórz wydarzenie</button>
      <BasicModal
        isOpen={isModalOpen}
        title="Stwórz wydarzenie"
        onClose={toggleModal}
      >
        <AddEventForm onReturn={toggleModal} />
      </BasicModal>
    </>
  );
};

export default AddEventButton;
