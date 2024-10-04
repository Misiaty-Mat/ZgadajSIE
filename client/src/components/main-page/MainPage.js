import React from "react";
import AuthModalButton from "../auth-modal-button/AuthModalButton";
import EventList from "../events/event-list/EventList";

const MainPage = () => {
  return (
    <div>
      <h1>Main Page</h1>
      <AuthModalButton />
      <EventList />
    </div>
  );
};

export default MainPage;
