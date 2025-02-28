import { Route, Routes } from "react-router-dom";
import MainPage from "./components/pages/main-page/MainPage";
import { UserContextProvider } from "./contexts/user-context";
import CreatedEvents from "./components/pages/my-events/CreatedEvents";
import JoinedEvents from "./components/pages/joined-events/JoinedEvents";
import { useStores } from "./contexts/stores-context";
import EventModal from "./components/events/event-modal/EventModal";
import { observer } from "mobx-react-lite";
import { ToastContainer } from "react-toastify";
import UserProfile from "./components/pages/user-profile/UserProfile";

const App = observer(() => {
  const { eventStore } = useStores();

  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/created-events" element={<CreatedEvents />} />
        <Route path="/joined-events" element={<JoinedEvents />} />
        <Route path="/my-profile" element={<UserProfile />} />
      </Routes>

      {eventStore.selectedEvent && <EventModal />}
      <ToastContainer />
    </UserContextProvider>
  );
});

export default App;
