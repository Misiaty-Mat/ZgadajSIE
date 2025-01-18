import { useAuth } from "../../../hooks/useAuth";

const LogoutButton = () => {
  const { logout } = useAuth();
  return <button onClick={logout}>Wyloguj</button>;
};

export default LogoutButton;
