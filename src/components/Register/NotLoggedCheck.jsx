import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

export const NotLoggedCheck = () => { //Użytkownik niezalogowany -> przenosi go na strone z logowaniem
    const item = JSON.parse(localStorage.getItem('sb-bpkpqswpimtoshzxozch-auth-token'));
    return !item ? <Navigate to="/login" replace /> : <Outlet />;
  }