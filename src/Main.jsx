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


    const navigate = useNavigate();

    // const API = process.env.REACT_APP_API


    const location = useLocation();

    const myPath = location.pathname


    const getMostItems = async () =>{
        try{
          const mostItemsRes = await fetch(`${API}/most-items`); // szuka wszystkich uzytkownikow
          const mostItemsData = await mostItemsRes.json();
          setMostItems(mostItemsData)
        }catch(error){
        }
    
      } 

      
    const[mostItems, setMostItems] = useState()


    const excludedRoutes = ['/', '/login', '/register', '/adminpanel',];

    const rankingRoutes = ['/main', '/Users']



    //to ponizej przekierowuje uzytkownika na strone glowna po wpisaniu w url /users/swoj nick
    useEffect(()=>{


        const item = JSON.parse(localStorage.getItem('sb-bpkpqswpimtoshzxozch-auth-token'));
        const nameFromLocalStorage = item?.user.user_metadata.full_name


        if(location.pathname === `/Users/${nameFromLocalStorage}`){
            navigate('/main', { replace: true })
        }
    }, [myPath])



    const isProfileRoute = () =>{
        return((location.pathname.startsWith('/Users')||location.pathname.startsWith('/main')))
      
    }

    return(
        <>

        {!excludedRoutes.includes(location.pathname) && <Navbar />}


        <div className='central-page'>
        <Routes>

            <Route path='/' element={<App/>}/>

        
            <Route path='/main' element={<Mainpage/>}/>

            <Route path='/users/:nickname' element={<UserPage/>} />
            <Route path='/users/:/*' element={<NotFound/>} />



            <Route element={<NotLoggedCheck />}>
                <Route path='/settings' element={<Settings/>}/>
            </Route>


            <Route path='/verify/:id' element={<LegitedItem/>} />
            <Route path='/verify/:/*' element={<NotFound/>} />
            <Route path='/verify/*' element={<LegitedItem/>} />
            {/* <Route path='/verify/:/*' element={<NotFound/>} /> p        Po upłynięciu czasu certyfikatu pokazuje się not found 404              */} 


            <Route path='/auth-failed' element={<AuthFailed/>}/>
            {/* <Route path='/unregistered-tag' element={<NFCTagNotRegisteredYet/>}/> */}
 


            <Route element={<AdminCheck />}>
                <Route path='/adminpanel' element={<AdminPanel/>}/>
            </Route>

            <Route path='/privacy' element={<Privacy/>}/>
            <Route path='/terms' element={<Terms/>}/>
            <Route path='/rodo' element={<Rodo/>}/>
            
        


            <Route element={<LoggedCheck />}>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Register />} />
            </Route>
            <Route path='*'  element={<NotFound />} />

         </Routes>
         </div>
         {!excludedRoutes.includes(location.pathname) && <Footer />}
        </>
    )
}