import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { supabase } from './supabaseClient';

const API = process.env.REACT_APP_API;

export const AdminCheck = () => {
    const item = JSON.parse(localStorage.getItem('sb-bpkpqswpimtoshzxozch-auth-token'));
    const [user, setUser] = useState();
    const [dataLoaded, setDataLoaded] = useState(false);
    const [hasAdminRole, setHasAdminRole] = useState()
 
    const getData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            const { data: {session}, error } = await supabase.auth.getSession()

            // const userResponse = await fetch(`${API}/secret/${user.id}`, {
            //     method: 'GET',
            //     headers: {
            //       'jwt': JSON.stringify(session.access_token),
            //     }
            //   })
            const adminAccessVerify = await fetch(`${API}/admin-access`, {
                method: 'GET',
                headers: {
                  'jwt': session.access_token,
                }
              })

            if(adminAccessVerify.ok){
                setHasAdminRole(true)
            }else{
                setHasAdminRole(false)
            }

            console.log(adminAccessVerify.ok)
            // const userData = await userResponse.json();
            // setUser(userData[0]);
            setDataLoaded(true);
        } catch (error) {
            console.error("Error fetching data:", error);
            setDataLoaded(true);
        }
    }

    useEffect(() => {
        getData();
    }, []);

    if (!item) {
        return <Navigate to="/main" replace />;
    } else if (item && !dataLoaded) {
        return (
            <div>Weryfikowanie</div>
        );
    } else if (dataLoaded && !hasAdminRole) {
        return <Navigate to="/main" replace />;
    } else if (dataLoaded && hasAdminRole) {
        return <Outlet />;
    } else {
        return <Navigate to="/main" replace />;
    }
}
