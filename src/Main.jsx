import React, {useState} from "react";
import {Route, Routes, useLocation, useNavigate, replace} from 'react-router-dom';

import App from "./App";
import { Login } from "./components/login";
import { Register } from "./Routes/register";
import { Anonymous } from "./components/anonymous";
import { UserPage } from "./Routes/userPage";
import { Settings } from "./Routes/settings";
import {Mainpage} from "./Routes/Main";
import { Navbar } from "./Navbar";
import { useEffect } from "react";
import { LoggedCheck } from "./components/loggedCheck";
import { AdminCheck } from "./components/adminCheck";
import { AdminPanel } from "./Routes/AdminPanel";
import { NotFound } from "./Routes/NotFound";
import { Privacy } from "./Routes/Privacy";
import { Terms } from "./Routes/Terms";
import { Rodo } from "./Routes/Rodo";
import { Footer } from "./components/Footer";
import { UserRanking } from "./components/UserRanking";

export const Main = () =>{


    const navigate = useNavigate();

    const API = process.env.REACT_APP_API


    const location = useLocation();

    const path = location.pathname


    const getMostItems = async () =>{
        try{
          const mostItemsRes = await fetch(`${API}/most-items`); // szuka wszystkich uzytkownikow
          const mostItemsData = await mostItemsRes.json();
          setMostItems(mostItemsData)
          console.log('eee', mostItemsData)
      
        }catch(error){
        }
    
      } 

      
    const[mostItems, setMostItems] = useState()


    const excludedRoutes = ['/', '/login', '/register', '/adminpanel',];

    const item = JSON.parse(localStorage.getItem('sb-bpkpqswpimtoshzxozch-auth-token'));
    const nameFromLocalStorage = item?.user.user_metadata.full_name


    //to ponizej przekierowuje uzytkownika na strone glowna po wpisaniu w url /users/swoj nick
    useEffect(()=>{
        getMostItems()

        if(location.pathname === `/Users/${nameFromLocalStorage}`){
            navigate('/main', { replace: true })
        }
    }, [path])

    return(
        <>

        {!excludedRoutes.includes(location.pathname) && <Navbar />}


        

        <div className="central-page">
        <UserRanking list={mostItems}/>


        <Routes>
            <Route path='/' element={<App/>}/>
       

            <Route path='/users' >
                <Route path=':nickname' element={<UserPage/>} />
            </Route>

            <Route path='*'  element={<NotFound />} />

            <Route element={<LoggedCheck />}>
                <Route path='/settings' element={<Settings/>}/>
            </Route>

            <Route element={<AdminCheck />}>
                <Route path='/adminpanel' element={<AdminPanel/>}/>
            </Route>

            

            <Route path='/main' element={<Mainpage/>}/>
            <Route path='/privacy' element={<Privacy/>}/>
            <Route path='/terms' element={<Terms/>}/>
            <Route path='/rodo' element={<Rodo/>}/>
        

            <Route path="/users/*" element={<NotFound />} />

            


            <Route element={<Anonymous />}>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Register />} />
            </Route>

         </Routes>
         </div>
         {!excludedRoutes.includes(location.pathname) && <Footer />}

        </>
    )
}