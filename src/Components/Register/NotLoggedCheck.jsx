import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useUserData } from "../../Context/Context";

export const NotLoggedCheck = () => { //Użytkownik niezalogowany -> przenosi go na strone z logowaniem
    const item = JSON.parse(localStorage.getItem('sb-bpkpqswpimtoshzxozch-auth-token'));

    const userData = useUserData()
    return !userData ? <Navigate to="/login" replace /> : <Outlet />;
  }