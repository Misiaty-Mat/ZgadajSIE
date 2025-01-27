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
        <button className="addEventDiv-button" onClick={toggleModal}>
          Dodaj Wydarzenie +
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
