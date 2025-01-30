import BasicModal from "./BasicModal";

const ConfirmActionModal = ({
  title,
  onConfirm,
  isOpened,
  setIsOpened,
  children,
}) => {
  return (
    <BasicModal
      isOpen={isOpened}
      title={title}
      onClose={() => setIsOpened(false)}
    >
      {children}
      <button
        className="Modal-logOrRegister-button"
        onClick={() => setIsOpened(false)}
      >
        Anuluj
      </button>
      <button
        className="confirmButton Modal-logOrRegister-button"
        onClick={onConfirm}
      >
        Potwierdź
      </button>
    </BasicModal>
  );
};

export default ConfirmActionModal;
