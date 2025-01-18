import React, { useEffect, useState } from "react";
import EventMap from "../map/EventMap";

import "react-toastify/dist/ReactToastify.css";
import "./main-page.styles.css";
import { ToastContainer } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";
import LogoutButton from "../auth/logout-button/LogoutButton";
import AuthModalButton from "../auth/auth-modal-button/AuthModalButton";
import AddEventButton from "../events/add-event/button/AddEventButton";
import ConfirmEventArrivalButton from "../events/confirm-event-arrival/ConfirmEventArivalButton";

const MainPage = () => {
  const { user } = useAuth();

  const [name, setName] = useState();

  useEffect(() => {
    setName(user?.name);
  }, [user]);

  const getAuthButton = () => {
    return user ? <LogoutButton /> : <AuthModalButton />;
  };

  return (
    <div className="main-page">
      <h1>Main Page</h1>
      <h2>{name}</h2>
      {getAuthButton()}
      <AddEventButton />
      <ConfirmEventArrivalButton />
      {/* <EventList /> */}
      <EventMap />
      <ToastContainer />
    </div>
  );
};

export default MainPage;
