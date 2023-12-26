import React from "react";
import {Route, Routes, useLocation, useNavigate, replace} from 'react-router-dom';

import App from "./App";
import { Login } from "./components/login";
import { Register } from "./components/register";
import { Anonymous } from "./components/anonymous";
import { UserPage } from "./components/userPage";
import { Settings } from "./components/settings";
import {Mainpage} from "./components/Main";
import { Navbar } from "./Navbar";
import { useEffect } from "react";
import { LoggedCheck } from "./components/loggedCheck";

export const Main = () =>{

    const location = useLocation();
    const navigate = useNavigate();

    const path = location.pathname

    console.log('xdd', path)

    const excludedRoutes = ['/', '/login', '/register'];

    const item = JSON.parse(localStorage.getItem('sb-bpkpqswpimtoshzxozch-auth-token'));
    const nameFromLocalStorage = item?.user.user_metadata.full_name

    const handleRedirectUser = () =>{
    }


    //to ponizej przekierowuje uzytkownika na strone glowna po wpisaniu w url /users/swoj nick
    useEffect(()=>{
        if(location.pathname === `/Users/${nameFromLocalStorage}`){
            navigate('/main', { replace: true })
        }
    }, [path])

    // useEffect(() => {
    //     if (nameFromLocalStorage && location.pathname === `/users/${nameFromLocalStorage}`) {
    //       navigate('/main');
    //     }
    //   }, [nameFromLocalStorage, location.pathname]);
      


 

    console.log('xd', location.pathname)

    return(
        <>
        {/* {(path !== '/login' && path!== '/register') && <Navbar/>} */}
        {/* {(!path && path !== '/login' && path !== '/register') && <Navbar />} */}
        {!excludedRoutes.includes(location.pathname) && <Navbar />}
        

        <Routes>
            

            <Route path='/' element={<App/>}/>
            {/* <Route path={`/users/${nameFromLocalStorage}`}  element={<Mainpage/>}/> */}


            <Route path='/users/:nickname' element={<UserPage/>}/>


            <Route element={<LoggedCheck />}>

                <Route path='/settings' element={<Settings/>}/>

            </Route>

            <Route path='/main' element={<Mainpage/>}/>


            


            <Route element={<Anonymous />}>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Register />} />
            </Route>

            {/* <Route path='/users' element={<Users data={data} handleAddData={addData}/>}/>
            <Route path='/users/:id' element={<User data={data} setData={setData}/>}/> */}
         </Routes>
        </>
    )
}