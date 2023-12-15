import React from "react";
import {Route, Routes, useLocation} from 'react-router-dom';

import App from "./App";
import { Login } from "./components/login";
import { Register } from "./components/register";
import { Anonymous } from "./components/anonymous";
import { UserPage } from "./components/userPage";
import { Settings } from "./components/settings";
import {Mainpage} from "./components/Main";
import { Navbar } from "./Navbar";

export const Main = () =>{

    const location = useLocation();
    const path = location.pathname

    console.log('xdd', path)

    const excludedRoutes = ['/', '/login', '/register'];

    const item = JSON.parse(localStorage.getItem('sb-bpkpqswpimtoshzxozch-auth-token'));
    const nameFromLocalStorage = item.user.user_metadata.full_name


    return(
        <>
        {/* {(path !== '/login' && path!== '/register') && <Navbar/>} */}
        {/* {(!path && path !== '/login' && path !== '/register') && <Navbar />} */}
        {!excludedRoutes.includes(location.pathname) && <Navbar />}

        <Routes>
            

            <Route path='/' element={<App/>}/>
            <Route path={`/users/${nameFromLocalStorage}`} element={<Mainpage/>}/>

            <Route path='/users/:id' element={<UserPage/>}/>
            <Route path='/settings' element={<Settings/>}/>
            <Route path='/main' element={<Mainpage/>}/>
            


            <Route element={<Anonymous />}>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
            </Route>

            {/* <Route path='/users' element={<Users data={data} handleAddData={addData}/>}/>
            <Route path='/users/:id' element={<User data={data} setData={setData}/>}/> */}
         </Routes>
        </>
    )
}