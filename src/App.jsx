import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';
import { supabase } from './components/supabaseClient';
import { User } from '@supabase/supabase-js';
import { Register } from './components/register';
import { Login } from './components/login';
import { Link } from 'react-router-dom';
import axios from 'axios';



function App() {


  return (
    <div className="App">
      Do zobaczenia w styczniu
    </div>
  );
}

export default App;
