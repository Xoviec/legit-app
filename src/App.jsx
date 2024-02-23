import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Demo } from './Components/DemoPage/Demo'
import {Route, Routes, useLocation, useNavigate} from "react-router-dom";
import { Mainpage } from './Components/Mainpage/Main'
import {LoggedCheck} from './Components/Register/LoggedCheck'
import {Register} from './Components/Register/register'
import { UserPage } from './Components/UserPage/userPage'
import { Navbar } from './Components/Layout/Navbar/Navbar'
import {NotLoggedCheck} from './Components/Register/NotLoggedCheck'
import { Settings } from './Components/Settings/settings'
import { LegitedItem } from './Components/Item Authentication/LegitedItem'
import { AuthFailed } from './Components/Item Authentication/AuthFailed'
import { NotFound } from './Components/PageNotFound/NotFound'
import { AdminCheck } from './Components/Admin/AdminCheck'
import { AdminPanel } from './Components/Admin/AdminPanel'
import { Footer } from './Components/Layout/Footer/Footer'

function App() {


  const navigate = useNavigate();

  const API = import.meta.env.VITE_API


  const location = useLocation();

  const myPath = location.pathname
  const [count, setCount] = useState(0)

  const excludedRoutes = ["/", "/login", "/register", "/adminpanel",];

  useEffect(()=>{


    const item = JSON.parse(localStorage.getItem("sb-bpkpqswpimtoshzxozch-auth-token"));
    const nameFromLocalStorage = item?.user.user_metadata.full_name


    if(location.pathname === `/Users/${nameFromLocalStorage}`){
        navigate("/main", { replace: true })
    }
}, [myPath])



const isProfileRoute = () =>{
    return((location.pathname.startsWith("/Users")||location.pathname.startsWith("/main")))
  
}

  return (
    <>


{!excludedRoutes.includes(location.pathname) && <Navbar />}


<div className={ isProfileRoute() ? `central-page` :``}>
      <Routes>
        <Route path="/" element={<Demo/>}/>
        
        <Route path='/main' element={<Mainpage/>}/>
        <Route path="/users/:nickname" element={<UserPage/>} />

        <Route element={<LoggedCheck />}>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Register />} />
        </Route>

        <Route element={<NotLoggedCheck />}>
                <Route path="/settings" element={<Settings/>}/>
        </Route>

        <Route path="/verify/:id" element={<LegitedItem/>} />
        <Route path="/verify/:/*" element={<NotFound/>} />
        <Route path="/verify/*" element={<LegitedItem/>} />
        <Route path="/auth-failed" element={<AuthFailed/>}/>


        <Route element={<AdminCheck />}>
          <Route path="/adminpanel" element={<AdminPanel/>}/>
        </Route>


        <Route path="*" element={<NotFound />} />

      </Routes>
      </div>
      {!excludedRoutes.includes(location.pathname) && <Footer />}

    </>
  )
}

export default App
