import {useState} from "react";
import BasicModal from "../../modal/BasicModal";
import LoginForm from "../auth-form/login-form/LoginForm";
import RegisterForm from "../auth-form/register-form/RegisterForm";

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
                return <LoginForm onSubmitExternal={toggleModal} onReturn={clearAuthType}/>;
            case "register":
                return <RegisterForm onSubmitExternal={toggleModal} onReturn={clearAuthType}/>;
            default:
                return (
                    <div>
                        <button onClick={() => setAuthType("login")}>Login</button>
                        <button onClick={() => setAuthType("register")}>Register</button>
                    </div>
                );
        }
    };

    return (
        <>
            <button onClick={toggleModal}>Login</button>
            <BasicModal
                isOpen={isModalOpen}
                title="Authentication"
                onClose={toggleModal}
            >
                {renderFormByAuthType()}
            </BasicModal>
        </>
    );
};

export default AuthModalButton;
