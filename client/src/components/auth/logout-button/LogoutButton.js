import { useAuth } from "../../../hooks/useAuth";

const LogoutButton = () => {
  const { logout } = useAuth();
  return (
    <button className="nav-userLabel-button" onClick={logout}>
      Wyloguj
    </button>
  );
};

export default LogoutButton;
