import {useState} from "react";
import AuthModal from "../auth-form/auth-modal/AuthModal";
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
                return <LoginForm onSubmit={toggleModal} onReturn={clearAuthType}/>;
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
            <AuthModal
                isOpen={isModalOpen}
                title="Authentication"
                onClose={toggleModal}
            >
                {renderFormByAuthType()}
            </AuthModal>
        </>
    );
};

export default AuthModalButton;
