import './App.css';
import React, { useEffect, useState } from 'react';
import { supabase } from './components/supabaseClient';
import { User } from '@supabase/supabase-js';
import { Register } from './components/register';
import { Login } from './components/login';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Script } from './script';


function App() {


  


  return (
    <>
    <head>
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
    />
  </head>
  <body>
    <div className="header-wrapper">
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
    </div>
    <main className="main">
      <div className="box">
        <span className="heading-secondary">Już wkrótce</span>
        
        {/* <span className="cursor blink"></span> */}
        {/* <p className="paragraph">.....</p> */}
   
      </div>
    </main>
    <footer className="footer">
      <div className="copyright">
        © <span id="currentYear"></span> Legited. All rights reserved.
      </div>
      {/* <p className='info'>Page designed by Lorinnio</p> */}
    </footer>
  </body>
    </>
  );
}

export default App;
