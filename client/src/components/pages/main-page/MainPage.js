import React, { useEffect } from "react";
import EventMap from "../../map/EventMap";

import "react-toastify/dist/ReactToastify.css";
import "./main-page.styles.css";
import { ToastContainer } from "react-toastify";
import EventList from "../../events/event-list/EventList";
import { useStores } from "../../../contexts/stores-context";
import NavBar from "../../nav-bar/NavBar";
import EventFilters from "../../events/event-list/event-filters/EventFilters";

const MainPage = () => {
  const { tagStore } = useStores();

  useEffect(() => {
    tagStore.fetchTags();
  }, [tagStore]);

  return (
    <>
      <NavBar />
      <div className="main-page">
        <div className="main-page-sectionLeft">
          <h1 className="main-page-sectionLeft-header">Znajdź wydarzenie</h1>
          <EventFilters />
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
