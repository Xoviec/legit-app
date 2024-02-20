import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { supabase } from '../supabaseClient';
import {Route, Routes, useLocation, useNavigate, replace} from "react-router-dom";
import { useSession, useUser } from "../Context/Context";
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query' 


const API = process.env.REACT_APP_API;

export const AdminCheck = () => {
    const item = JSON.parse(localStorage.getItem('sb-bpkpqswpimtoshzxozch-auth-token'));
    const [dataLoaded, setDataLoaded] = useState(false);
    const [hasAdminRole, setHasAdminRole] = useState()

    const session = useSession()

    const getData = async () =>{

        if(session==='failed'){
            return false
        }
        else{
            return await fetch(`${API}/admin-access`, {
                method: 'GET',
                headers: {
                  'jwt': session.access_token,
                }
              })
        }
    }

    const {
        status: isAdminStatus,
        error: isAdminError,
        data: isAdminData,
        isPending,
    
      } = useQuery({
        queryKey: ['adminCheck'],
        queryFn: getData,
        enabled: !!session, // Fetch data only if session has a value
      })


      if(isPending){
        return(
            <p>weryfikowanie...</p>
        )
      }
      else if(!isPending && isAdminData.ok){
        return <Outlet replace={true}/>
      }
      else{
        return <Navigate to="/main" replace />; 
      }

}
