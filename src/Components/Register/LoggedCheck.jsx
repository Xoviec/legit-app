import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

export const LoggedCheck = () => {//uzytkownik zalogowany -> wypierdala go ze strony logowania
    const item = JSON.parse(localStorage.getItem('sb-bpkpqswpimtoshzxozch-auth-token'));
  
    return item ? <Navigate to="/" replace /> : <Outlet />;
  }