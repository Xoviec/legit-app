import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Demo } from './Components/DemoPage/Demo'
import {Route, Routes, useLocation, useNavigate} from "react-router-dom";
import { Mainpage } from './Components/Mainpage/Main'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route path="/" element={<Demo/>}/>
        
        <Route path='/main' element={<Mainpage/>}/>

      </Routes>
    </>
  )
}

export default App
