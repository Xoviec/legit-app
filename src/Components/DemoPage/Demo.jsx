import '../Layout/Footer/Footer.css';
import React, { useEffect, useState } from 'react';
import { MainNotLogged } from '../MainPageNotLogged/MainNotLogged';
import { NavbarSimple } from '../Layout/NavbarSimple/NavbarSimple';
import { SoonText } from '../MainPageNotLogged/SoonText';



export const Demo = () =>{

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
