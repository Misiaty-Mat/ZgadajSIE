import React from "react";
import AuthModalButton from "../auth-modal-button/AuthModalButton";
import EventMap from "../map/EventMap";

import "./main-page.styles.css"

const MainPage = () => {


    return (
        <div className="main-page">
            <h1>Main Page</h1>
            <AuthModalButton/>
            {/* <EventList /> */}
            <EventMap/>
        </div>
    );
};

export default MainPage;
