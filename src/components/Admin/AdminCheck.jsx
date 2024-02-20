import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { supabase } from '../supabaseClient';
import {Route, Routes, useLocation, useNavigate, replace} from "react-router-dom";
import { useAdmin, useSession, useUser } from "../Context/Context";
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query' 


export const AdminCheck = () => {


    const admin = useAdmin()

    const isAdmin = async () =>{
      return admin
    }

    const {
        status: isAdminStatus,
        error: isAdminError,
        data: isAdminData,
        isPending,
    
      } = useQuery({
        queryKey: ['adminCheck'],
        queryFn: isAdmin,
        enabled: admin !== undefined, // Fetch data only if session is defined
      })


      if(isPending){
        return(
            <p>weryfikowanie...</p>
        )
      }
      else if(!isPending && isAdminData){
        return <Outlet replace={true}/>
      }
      else{
        return <Navigate to="/main" replace />; 
      }

}
