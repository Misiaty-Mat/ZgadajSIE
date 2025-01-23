import { useState } from "react";
import BasicModal from "../../modal/BasicModal";
import LoginForm from "../auth-form/login-form/LoginForm";
import RegisterForm from "../auth-form/register-form/RegisterForm";
import "./AuthModalButton-style.css";

const AuthModalButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authType, setAuthType] = useState();

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    clearAuthType();
  };

  const clearAuthType = (e) => {
    e?.preventDefault();
    setAuthType();
  };

  const renderFormByAuthType = () => {
    switch (authType) {
      case "login":
        return (
          <LoginForm onSubmitExternal={toggleModal} onReturn={clearAuthType} />
        );
      case "register":
        return (
          <RegisterForm
            onSubmitExternal={toggleModal}
            onReturn={clearAuthType}
          />
        );
      default:
        return (
          <div className="Modal-logOrRegister">
            <div className="Modal-logOrRegister-Log">
              <p className="Modal-logOrRegister-Text">Masz już konto?</p>
              <button
                className="Modal-logOrRegister-button"
                onClick={() => setAuthType("login")}
              >
                Zaloguj się
              </button>
            </div>
            <div className="Modal-logOrRegister-Register">
              <p className="Modal-logOrRegister-Text">
                Nie masz jeszcze konta?
              </p>
              <button
                className="Modal-logOrRegister-button"
                onClick={() => setAuthType("register")}
              >
                Zarejestruj się!
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <button className="main-page-ButtonLogin" onClick={toggleModal}>
        Zaloguj się
      </button>
      <BasicModal isOpen={isModalOpen} title="" onClose={toggleModal}>
        {renderFormByAuthType()}
      </BasicModal>
    </>
  );
};

export default AuthModalButton;
