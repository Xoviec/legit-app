import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { supabase } from './supabaseClient';

const API = process.env.REACT_APP_API;

export const AdminCheck = () => {
    const item = JSON.parse(localStorage.getItem('sb-bpkpqswpimtoshzxozch-auth-token'));
    const [user, setUser] = useState();
    const [dataLoaded, setDataLoaded] = useState(false);

    const getData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            const userResponse = await fetch(`${API}/secret/${user?.id}`);
            const userData = await userResponse.json();
            setUser(userData[0]);
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
            <div>Loading...</div>
        );
    } else if (dataLoaded && user.account_type !== 'admin') {
        return <Navigate to="/main" replace />;
    } else if (dataLoaded && user.account_type === 'admin') {
        return <Outlet />;
    } else {
        return <Navigate to="/main" replace />;
    }
}
