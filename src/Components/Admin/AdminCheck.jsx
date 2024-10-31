import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useSession, useUser, useAdmin, useUserData } from '../../Context/Context';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query' 


export const AdminCheck = () => {

    const user = useUserData()

      if(!user){
        return(
            <p>weryfikowanie...</p>
        )
      }
      else if(user.accountType === "admin"){
        return <Outlet replace={true}/>
      }
      else{
        return <Navigate to="/main" replace={true} />; 
      }

}
