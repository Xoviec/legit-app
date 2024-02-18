import './App.css';
import React, { useEffect, useState } from 'react';
import { supabase } from './components/supabaseClient';
import { User } from '@supabase/supabase-js';
import { Register } from './components/Register/register';
import { Login } from './components/Register/login';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Script } from './script';
import { MainNotLogged } from './components/MainPageNotLoggedd/MainNotLogged';
import { NavbarSimple } from './components/Layout/NavbarSimple/NavbarSimple';
import { SoonText } from './components/MainPageNotLoggedd/SoonText';


function App() {


  


  return (
    <>


    <NavbarSimple isDemo={true}/>
    <div className="central-page">

    <MainNotLogged SoonText={<SoonText/>}/>
    </div>
    <footer className="footer">
      <div className="copyright">
        © <span id="currentYear"></span> Legited. All rights reserved.
      </div>
    </footer>
      {/* <p className='info'>Page designed by Lorinnio</p> */}

    </>
  );
}

export default App;
