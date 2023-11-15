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


// supabase.auth.getUser()


  const [user, setUser] = useState(null)
  const [publicUser, setPublicUser] = useState()
  const [userList, setUserList] = useState()
  const [itemsList, setItemsList] = useState()


  const essa = async()=>{
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase.auth.getSession()

    setUser(user)

    console.log(user)
    console.log(data)
  }



  useEffect(() => {
    // const fetchUserData = async () => {
    //   try {
        
    //     setUserList(data)
    //     // console.log(data.find(user=>user.id===user.id))
    //     // console.log(data);
    //   } catch (error) {
    //     console.error('Error fetching data:', error);
    //   }
    // };

    

    const fetchData = async () => {
      // essa()

      const { data: { user } } = await supabase.auth.getUser()
      const { data, error } = await supabase.auth.getSession()
  
      setUser(user)

      try {
        const usersDataResponse = await fetch('http://localhost:8000/nicknames'); // Zastąp tym adresem URL swoim adresem serwera
        const usersData = await usersDataResponse.json();
        const itemsResponse = await fetch('http://localhost:8000/items'); // Zastąp tym adresem URL swoim adresem serwera
        const itemsData = await itemsResponse.json();

        setUserList(usersData)
        setItemsList(itemsData)
        setPublicUser(usersData?.find(profile=>profile.id===user?.id))
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData()
    // fetchUserData();
  }, []);


  const handleAddItem = async (e) =>{
    e.preventDefault()
    if(user){
      const data = 
      {
        'name': e.target.name.value,
        'brand': e.target.brand.value,
        'sku': e.target.sku.value,
      }
      setItemsList((prevItemsList) => [...prevItemsList, data]);

      try{
        await axios.post('http://localhost:8000/items', {
          itemData: data,
          accountType: publicUser.account_type,
        });
      }catch(err){
        console.log(err)
        setItemsList((previousArr) => (previousArr.slice(0, -1)));

      }
    }

  }
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




  useEffect(()=>{


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
        <div>
          <Link  to='/login'>
            <button>
                Zaloguj się
            </button>
          </Link>
          <Link  to='/register'>
            <button>
                Zarejestruj się
            </button>
          </Link>
        </div>
        // <>
        //   Rejestracja<Register/>
        //   Logowanie<Login handleSetUser={handleSetUser}/>
        // </>
        // <button onClick={login}>Login with github</button>

      }


      {
        publicUser && 
        <div>Witaj, {publicUser?.nickname}</div>
      }
      {
        
        userList?.map((appUser)=>(
          <div className={`${appUser?.id===user?.id ? `user` : null}`}>{appUser.nickname}</div>
        ))
      }
      <form onSubmit={handleAddItem}>
        <input type="text" placeholder='name' name='name'/>
        <input type="text" placeholder='sku' name='sku'/>
        <input type="text" placeholder='brand' name='brand'/>
        <button type='submit'>add item</button>
      </form>
      <p>Items:</p>
      {
        
        itemsList?.map((item)=>(
          <div>{item.name}</div>
        ))
      }
    </div>
  );
}

export default App;
