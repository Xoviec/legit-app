import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';
import { supabase } from './components/supabaseClient';
import { User } from '@supabase/supabase-js';
import { Register } from './components/register';
import { Login } from './components/login';



function App() {


// supabase.auth.getUser()


  const [user, setUser] = useState(null)




  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/nicknames'); // Zastąp tym adresem URL swoim adresem serwera
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);


  // const login = async()=>{
  //   await supabase.auth.signInWithOAuth({
  //     provider: "github"
  //   })
  // }

 
  const handleSetUser = (newUser) =>{
    setUser(newUser)
  }

  const logout = async()=>{
    await supabase.auth.signOut()
    setUser(null)
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

    // supabase.auth.onAuthStateChange((event, session)=>{

    //   switch(event){
    //     case "SIGNED_IN":
    //       setUser(user)
    //       break;

    //     case "SIGNED_OUT":
    //       console.log('pizdunio')
    //       setUser(null)
    //       break
    //   }

    // })


  }, [])

  console.log(user)

  return (
    <div className="App">
      {
        user ? 
        
        <button onClick={logout}>
          Wyloguj się
        </button>
        :
        <>
          Rejestracja<Register/>
          Logowanie<Login handleSetUser={handleSetUser}/>
        </>
        // <button onClick={login}>Login with github</button>

      }


      {
        user && 
        <div>Witaj, {user.id}</div>
      }
    </div>
  );
}

export default App;
