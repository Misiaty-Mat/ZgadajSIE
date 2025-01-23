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
      <div className="addEventDiv">
        <p>Dodaj Wydarzenie</p>
        <button className="addEventDiv-button" onClick={toggleModal}>
          +
        </button>
      </div>
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
