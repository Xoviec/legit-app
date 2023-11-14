import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';
import { supabase } from './components/supabaseClient';
import { User } from '@supabase/supabase-js';



function App() {


// supabase.auth.getUser()


  const [user, setUser] = useState(null)


  const login = async()=>{
    const { data, error } = await supabase.auth.refreshSession()
    await supabase.auth.signInWithOAuth({
      provider: "github"
    })
  }


  const logout = async()=>{
    await supabase.auth.signOut()
  }


  const essa = async()=>{
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase.auth.getSession()

    setUser(user)

    console.log(user)
    console.log(data)
  }


  useEffect(()=>{

    essa()

    supabase.auth.onAuthStateChange((event, session)=>{

      switch(event){
        case "SIGNED_IN":
          setUser(user)
          break;

        case "SIGNED_OUT":
          setUser(null)
          break
      }

    })


  }, [])

  return (
    <div className="App">
      {
        user ? 
        
        <button onClick={logout}>
          Wyloguj się
        </button>
        :
        <button onClick={login}>Login with github</button>

      }


      {
        user && 
        <div>Witaj, {user.identities[0].identity_data.preferred_username}</div>
      }
    </div>
  );
}

export default App;
