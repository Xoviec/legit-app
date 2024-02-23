import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Demo } from './Components/DemoPage/Demo'
import {Route, Routes, useLocation, useNavigate} from "react-router-dom";
import { Mainpage } from './Components/Mainpage/Main'
import {LoggedCheck} from './Components/Register/LoggedCheck'
import {Register} from './Components/Register/register'
import { UserPage } from './Components/UserPage/userPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route path="/" element={<Demo/>}/>
        
        <Route path='/main' element={<Mainpage/>}/>
        <Route path="/users/:nickname" element={<UserPage/>} />

        <Route element={<LoggedCheck />}>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Register />} />
        </Route>

      </Routes>
    </>
  )
}

export default App
