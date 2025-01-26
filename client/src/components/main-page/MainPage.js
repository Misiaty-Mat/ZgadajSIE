import React, { useEffect, useState } from "react";
import EventMap from "../map/EventMap";

import "react-toastify/dist/ReactToastify.css";
import "./main-page.styles.css";
import { ToastContainer } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";
import LogoutButton from "../auth/logout-button/LogoutButton";
import AuthModalButton from "../auth/auth-modal-button/AuthModalButton";
import ConfirmEventArrivalButton from "../events/confirm-event-arrival/ConfirmEventArivalButton";
import EventList from "../events/event-list/EventList";
import { useStores } from "../../contexts/event-context";
import useGeolocation from "../../hooks/useGeolocation";

const MainPage = () => {
  const [name, setName] = useState();

  const { user } = useAuth();
  const { eventStore } = useStores();
  const { location } = useGeolocation();

  useEffect(() => {
    eventStore.fetchEvents(location);
  }, [eventStore, location]);

  useEffect(() => {
    setName(user?.name);
  }, [user]);

  const getAuthButton = () => {
    return user ? <LogoutButton /> : <AuthModalButton />;
  };

  return (
    <>
      <ConfirmEventArrivalButton />
      <div className="nav">
        <div class="nav-userLabel">
          {getAuthButton()}{" "}
          <img className="nav-userLabel-img" src="./user.png" alt=""></img>
          <span className="nav-userLabel-arrow">&#129171;</span>
        </div>
      </div>
      <div className="main-page">
        <div className="main-page-sectionLeft">
          <h1>Strona główna</h1>
          <h2>{name}</h2>
          {/* {getAuthButton()} */}
          <EventList />
        </div>
        <div className="main-page-sectionRight">
          <ToastContainer />
        </div>
        <EventMap />
      </div>
    </>
  );
};

export default MainPage;
