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
      <button onClick={() => setIsOpened(false)}>Anuluj</button>
      <button onClick={onConfirm}>Potwierdź</button>
    </BasicModal>
  );
};

export default ConfirmActionModal;
