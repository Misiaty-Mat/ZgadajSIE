import React, {useEffect, useState} from "react";
import AuthModalButton from "../auth-modal-button/AuthModalButton";
import EventMap from "../map/EventMap";

import 'react-toastify/dist/ReactToastify.css';
import "./main-page.styles.css"
import {ToastContainer} from "react-toastify";
import {useAuth} from "../../hooks/useAuth";
import LogoutButton from "../logout-button/LogoutButton";

const MainPage = () => {

    const {user} = useAuth();
    
    const [username, setUsername] = useState();
    
    useEffect(() => {
        if (user) {
            if (user.username) {
                setUsername(user.username);
            }

            if (user.name) {
                setUsername(user.name);
            }
        }
    }, [user]);

    const getAuthButton = () => {
        return user ? <LogoutButton /> : <AuthModalButton />;
    }

    return (
        <div className="main-page">
            <h1>Main Page</h1>
            <h2>{username}</h2>
            {getAuthButton()}
            {/* <EventList /> */}
            <EventMap/>
            <ToastContainer />
        </div>
    );
};

export default MainPage;
