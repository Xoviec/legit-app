import React, {useState} from "react";
import {Route, Routes, useLocation, useNavigate, replace} from 'react-router-dom';

import App from "./App";
// import { Login } from "./components/Register/login";
// import { Register } from "./components/Register/register";
// import { LoggedCheck } from "./components/Register/LoggedCheck";
// import { UserPage } from "./components/UserPage/userPage";
// import { Settings } from "./components/Settings/settings";
// import {Mainpage} from "./components/MainPage/Main";
// import { Navbar } from "./components/Layout/Navbar/Navbar";
// import { useEffect } from "react";
// import { NotLoggedCheck } from "./components/Register/NotLoggedCheck";
// import { AdminCheck } from "./components/Admin/AdminCheck";
// import { AdminPanel } from "./components/Admin/AdminPanel";
// import { NotFound } from "./components/PageNotFound/NotFound";
// import { Privacy } from "./components/InfoPages/Privacy";
// import { Terms } from "./components/InfoPages/Terms";
// import { Rodo } from "./components/InfoPages/Rodo";
// import { Footer } from "./components/Layout/Footer/Footer";
// import { UserRanking } from "./components/Layout/Sidebar/UserRanking";
// import { LegitedItem } from "./components/Item Authentication/LegitedItem";
// import { AuthFailed } from "./components/Item Authentication/AuthFailed";
// import { NFCTagNotRegisteredYet } from "./components/Item Authentication/NFCTagNotRegisteredYet";
// import { useContext } from "react";
// import { UserSessionContext } from "./components/Context/Context";

export const Main = () =>{



    return(

        <Routes>

            <Route path='/' element={<App/>}/>

        
         </Routes>

    )
}