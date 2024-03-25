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
import { NavbarSimple } from './Components/Layout/NavbarSimple/NavbarSimple'
import {NotLoggedCheck} from './Components/Register/NotLoggedCheck'
import { Settings } from './Components/Settings/settings'
import { LegitedItem } from './Components/Item Authentication/LegitedItem'
import { AuthFailed } from './Components/Item Authentication/AuthFailed'
import { NotFound } from './Components/PageNotFound/NotFound'
import { AdminCheck } from './Components/Admin/AdminCheck'
import { AdminPanel } from './Components/Admin/AdminPanel'
import { Footer } from './Components/Layout/Footer/Footer'
import { Privacy } from './Components/InfoPages/Privacy'
import { Terms } from './Components/InfoPages/Terms'
import { Rodo } from './Components/InfoPages/Rodo'
import ScrollToTop from './Components/ScrollToTop/ScrollToTop'
import { WaitingForVerify } from './Components/Register/WaitingForVerify'
import { HelmetProvider } from './Components/Helmet/Helmet'
import { HowItWorks } from './Components/HowItWorks/HowItWorks'


function App() {


  const navigate = useNavigate();

  const API = import.meta.env.VITE_API


  const location = useLocation();

  const myPath = location.pathname
  const [count, setCount] = useState(0)

  const excludedRoutes = ["/", "/login", "/register", "/adminpanel","/confirm"];
  const userRoutes = "/Users"



  useEffect(()=>{


    const item = JSON.parse(localStorage.getItem("sb-bpkpqswpimtoshzxozch-auth-token"));
    const nameFromLocalStorage = item?.user.user_metadata.full_name


    if(location.pathname.toLowerCase() === (`/Users/${nameFromLocalStorage}`).toLowerCase()){
        navigate("/main", { replace: true })
    }
}, [myPath])



const isProfileRoute = () =>{
    return((location.pathname.toLowerCase().startsWith(("/Users").toLowerCase())||location.pathname.toLowerCase().startsWith(("/main").toLowerCase())))
  
}

  return (
    <>

<ScrollToTop/>
{!excludedRoutes.includes(location.pathname) && <Navbar />}
{!location.pathname.includes(userRoutes) && <HelmetProvider/>}





<div className={ isProfileRoute() ? `central-page` :``}>
      <Routes>
        <Route path="/" element={<Demo/>}/>
        
        <Route path='/main' element={<Mainpage/>}/>
        <Route path="/users/:nickname" element={<UserPage/>} />

        <Route element={<LoggedCheck />}>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Register />} />
                <Route path="/confirm" element={
                  <>
                              <NavbarSimple/>
                              <WaitingForVerify/>
                  </>
                } />

        </Route>

        <Route element={<NotLoggedCheck />}>
                <Route path="/settings" element={<Settings/>}/>
        </Route>
        <Route path="/how-it-works" element={<HowItWorks/>} />

        <Route path="/verify/:id" element={<LegitedItem/>} />
        <Route path="/verify/:/*" element={<NotFound/>} />
        <Route path="/verify/*" element={<LegitedItem/>} />
        <Route path="/auth-failed" element={<AuthFailed/>}/>

        <Route path="/privacy" element={<Privacy/>}/>
          <Route path="/terms" element={<Terms/>}/>
          <Route path="/rodo" element={<Rodo/>}/>

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
