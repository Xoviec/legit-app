import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

export const LoggedCheck = () => {
    const item = JSON.parse(localStorage.getItem('sb-bpkpqswpimtoshzxozch-auth-token'));
    // const token = item?.accessToken;

  
    return !item ? <Navigate to="/login" replace /> : <Outlet />;
  }