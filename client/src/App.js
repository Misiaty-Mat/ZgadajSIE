import { Route, Routes } from "react-router-dom";
import MainPage from "./components/main-page/MainPage";
import { UserContextProvider } from "./contexts/user-context";

const App = () => {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<MainPage />} />
      </Routes>
    </UserContextProvider>
  );
};

export default App;
