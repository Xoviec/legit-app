import './App.css';
import React, { useEffect, useState } from 'react';
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
