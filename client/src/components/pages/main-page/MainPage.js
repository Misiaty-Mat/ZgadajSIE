import React, { useEffect } from "react";
import EventMap from "../../map/EventMap";

import "react-toastify/dist/ReactToastify.css";
import "./main-page.styles.css";
import { ToastContainer } from "react-toastify";
import EventList from "../../events/event-list/EventList";
import { useStores } from "../../../contexts/event-context";
import useGeolocation from "../../../hooks/useGeolocation";
import NavBar from "../../nav-bar/NavBar";

const MainPage = () => {
  const { eventStore } = useStores();
  const { location } = useGeolocation();

  useEffect(() => {
    eventStore.fetchEvents(location);
  }, [eventStore, location]);

  return (
    <>
      <NavBar />
      <div className="main-page">
        <div className="main-page-sectionLeft">
          <h1>Strona główna</h1>
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
