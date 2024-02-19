import React, {useState} from "react";
import {Route, Routes, useLocation, useNavigate, replace} from 'react-router-dom';

import App from "./App";
import { Login } from "./components/Register/login";
import { Register } from "./components/Register/register";
import { LoggedCheck } from "./components/Register/LoggedCheck";
import { UserPage } from "./components/UserPage/userPage";
import { Settings } from "./components/Settings/settings";
import {Mainpage} from "./components/MainPage/Main";
import { Navbar } from "./components/Layout/Navbar/Navbar";
import { useEffect } from "react";
import { NotLoggedCheck } from "./components/Register/NotLoggedCheck";
import { AdminCheck } from "./components/Admin/AdminCheck";
import { AdminPanel } from "./components/Admin/AdminPanel";
import { NotFound } from "./components/PageNotFound/NotFound";
import { Privacy } from "./components/InfoPages/Privacy";
import { Terms } from "./components/InfoPages/Terms";
import { Rodo } from "./components/InfoPages/Rodo";
import { Footer } from "./components/Layout/Footer/Footer";
import { UserRanking } from "./components/Layout/Sidebar/UserRanking";
import { LegitedItem } from "./components/Item Authentication/LegitedItem";
import { AuthFailed } from "./components/Item Authentication/AuthFailed";
import { NFCTagNotRegisteredYet } from "./components/Item Authentication/NFCTagNotRegisteredYet";

export const Main = () =>{


   

    return(
        <>

        {/* {!excludedRoutes.includes(location.pathname) && <Navbar />} */}



        <Routes>

            <Route path='/' element={<App/>}/>

        
            <Route path='/main' element={<Mainpage/>}/>

            <Route path='/users/:nickname' element={<UserPage/>} />
            <Route path='/users/:/*' element={<NotFound/>} />


            <Route path='/privacy' element={<Privacy/>}/>
            <Route path='/terms' element={<Terms/>}/>
            <Route path='/rodo' element={<Rodo/>}/>
            
        


            <Route element={<LoggedCheck />}>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Register />} />
            </Route>
            <Route path='*'  element={<NotFound />} />

         </Routes>
         {/* {!excludedRoutes.includes(location.pathname) && <Footer />} */}
        </>
    )
}