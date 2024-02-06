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

    {/* <div className="header-wrapper">
      <header className="header">

        <img
          className="logo"
          src="https://cdn.discordapp.com/attachments/770352932398432279/1182084582158372965/logo.png?ex=6583690e&is=6570f40e&hm=6f3e110953e9c1abc8f97a1192e926aaad74a0015171973f0957245e27a936c6&"
          alt=""
        />

        <div className="login">
          <p className="login-text">
            <i className="fas lock-icon fa-lock"></i>Dostęp tylko dla członków
          </p>
        </div>
      </header>
    </div> */}
    {/* <main className="main">
      <div className="box">
        <span className="heading-secondary">Już wkrótce</span>
        {/* <span className="cursor blink"></span> */}
        {/* <p className="paragraph">.....</p> */}
   
      {/* </div> */}
    {/* </main> */} 
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
