import BasicModal from "../../../modal/BasicModal";
import {useState} from "react";
import AddEventForm from "../form/AddEventForm";

const AddEventButton = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = (e) => {
        e?.preventDefault();
        setIsModalOpen(!isModalOpen);
    };

    return (
        <>
            <button onClick={toggleModal}>Create event</button>
            <BasicModal
                isOpen={isModalOpen}
                title="Add event"
                onClose={toggleModal}
            >
                <AddEventForm onSubmitExternal={toggleModal} onReturn={toggleModal}/>
            </BasicModal>
        </>
    )
}

export default AddEventButton;