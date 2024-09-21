import "./App.css";
import { Route, Routes } from "react-router-dom";
import MainPage from "./components/main-page/MainPage";
import LoginForm from "./components/auth-form/login-form/LoginForm";


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/login" element={<LoginForm />} />
    </Routes>
  );
};

export default App;
