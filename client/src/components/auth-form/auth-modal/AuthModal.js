import Modal from "react-modal";
import "./auth-modal.css";
import { RiCloseLine } from "react-icons/ri";

const AuthModal = ({ isOpen, onClose, title, children }) => {
  return (
    <Modal
      ariaHideApp={false}
      isOpen={isOpen}
      onRequestClose={() => onClose()}
      shouldCloseOnOverlayClick={true}
      className="centered modal"
      overlayClassName="dark-background"
    >
      <div className="modal-header">
        <h2 className="heading">{title}</h2>
      </div>
      <button className="closeBtn" onClick={onClose}>
        <RiCloseLine style={{ marginBottom: "-3px" }} />
      </button>
      <div className="modal-content">{children}</div>
    </Modal>
  );
};

export default AuthModal;
