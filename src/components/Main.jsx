// import logo from './logo.svg';
import './Main.css';
import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { User } from '@supabase/supabase-js';
import { Register } from './register';
import { Login } from './login';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ProfileTabs } from '../shared/ProfileTabs';


export const Mainpage =()=> {


// supabase.auth.getUser()


  const [user, setUser] = useState(null)
  const [publicUser, setPublicUser] = useState()
  const [userList, setUserList] = useState()
  const [itemsList, setItemsList] = useState()
  const [userItemsList, setUserItemsList] = useState()
  const [ogItemIdVal, setOgItemIdVal] = useState('')
  const [ownerId, setOwnerId] = useState('')
  const [foundUsers, setFoundUsers] = useState()
  const [foundItems, setFoundItems] = useState()
  const[newOwner, setNewOwner] = useState()
  const[assignedItem, setAssignedItem] = useState()
  const[comments, setComments] = useState()


  const API = process.env.REACT_APP_API

  console.log(API)

  const essa = async()=>{
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase.auth.getSession()

    setUser(user)

    console.log(user)
    console.log(data)
  }


//   const getComments = async () =>{

//     try{


//     }catch(err){
//         console.log(err)
//     }
// }



  useEffect(() => {

    const fetchData = async () => {

      const { data: { user } } = await supabase.auth.getUser()
      const { data, error } = await supabase.auth.getSession()
  
      setUser(user)

      try {
        const usersDataResponse = await fetch(`${API}/nicknames`); // szuka wszystkich uzytkownikow
        const usersData = await usersDataResponse.json();
        const itemsResponse = await fetch(`${API}/items`); //wszystkie itemy
        const itemsData = await itemsResponse.json();

        setUserList(usersData)
        setItemsList(itemsData)
        console.log(user.email)
        console.log(user.id)
        
        const publicUserResponse = await fetch(`${API}/secret/${user.id}`); //dane uzytkownika
        const publicUserData = await publicUserResponse.json();
        console.log(publicUserData[0])
        const userItemsListResponse = await fetch(`${API}/user-items/${publicUserData[0].nickname}`);
        const userItemsData = await userItemsListResponse.json()

        const commentsResponse = await fetch(`${API}/get-comments/${publicUserData[0].nickname}`);
        const commentsData = await commentsResponse.json();
        setComments(commentsData)
        console.log(commentsData)

        setUserItemsList(userItemsData)
        console.log(userItemsData)
        setPublicUser(publicUserData[0])

        // setPublicUser(usersData?.find(profile=>profile.id===user?.id))
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
        await axios.post(`${API}/items`, {
          itemData: data,
          accountType: publicUser.account_type,
        });
      }catch(err){
        console.log(err)
        setItemsList((previousArr) => (previousArr.slice(0, -1)));
      }
    }
  }


  const handleRegisterChange = (e) =>{
    //zmiana state do szukania usera
    if(e.target.name==='ownerHistory'){
      console.log(e.target.value)
      setOwnerId(e.target.value)
      handleUpdateFoundUsers(e.target.value)
    }
    //zmiana state do szukania itemu 
    else{
      setOgItemIdVal(e.target.value)
      handleUpdateFoundItems(e.target.value)
    }
  }

  const handleUpdateFoundItems = async (item) =>{
    const response = await fetch(`${API}/search-items?letters=${item}`);
    const data = await response.json();
  
    console.log(data)
    setFoundItems(data)
  
  try{
  
  }catch(err){
    console.log(err)
  }
  }

  const handleSetFoundItem = (item) =>{
    setAssignedItem(item.id)
    setOgItemIdVal(item.name)
    setFoundItems()
  }

  const handleSetNewOwner = (user) =>{
    setNewOwner(user.id)  
    setOwnerId(user.nickname)
    setFoundUsers() 
  }

  const handleUpdateFoundUsers = async (nickname) =>{
        const response = await fetch(`${API}/search-users?letters=${nickname}`);
        const data = await response.json();

        console.log(data)
        setFoundUsers(data)

    try{

    }catch(err){
        console.log(err)
    }
}



  const handleRegisterItem = async (e) =>{
    e.preventDefault()
    if(user){
      const data = 
      {
        'ogItemId': assignedItem,
        'ownerHistory': newOwner,
      }
      try{
        await Promise.all([
          axios.post(`${API}/register-item`, {
            itemData: data,
            accountType: publicUser.account_type,
          }),
        ]);
      }catch(err){
        console.log(err)
      }
    }
  }
 
  const handleSetUser = (newUser) =>{
    setUser(newUser)
  }

  const logout = async()=>{
    await supabase.auth.signOut()
    setUser(null)
    setPublicUser(null)
  }


  return (
    <div className="App">
      <input placeholder='Szukaj uzytkownika' className="search-bar"/>
      <div className='central-page'>
        <aside></aside>
        <div className="profile-container">
          <h1>
            Witaj<span className='user-nickname'> {publicUser?.nickname}</span>
          </h1>
          {/* <p className='user-items-title'>Twoje przedmioty:</p>
          <div className="items-container">
            {
              userItemsList?.map((item)=>(
                <div className='item' key={item.id}>
                  <div className="image">
                    <img src={item.image} alt="" />
                  </div>
                  <p className='item-name'>{item.name}</p> 
                  <p className='item-registered'>Registered <span className='register-date'>{item.legited_at.slice(0, 10)}</span></p>
                </div>
              ))
            }

          </div> */}
          <ProfileTabs userItemsList={userItemsList} comments={comments}/>
        </div>
      </div>
      {
        publicUser && 
        <div>Witaj, {publicUser?.nickname} - {publicUser?.id}</div>
      }
      <div>
        <Link state={publicUser}to={`/settings`}>Ustawienia</Link>

      </div>
      {
        
        userList?.map((appUser)=>(
          <Link className={`${appUser?.id===user?.id ? `user` : null}`} key={appUser.name} to={`/Users/${appUser.nickname}`}>{appUser.nickname}</Link>
        ))
      }
  

      {/* dodawanie nowego itemu */}
  
      <form onSubmit={handleAddItem}>
        <input type="text" placeholder='name' name='name'/>
        <input type="text" placeholder='sku' name='sku'/>
        <input type="text" placeholder='brand' name='brand'/>
        <button type='submit'>add item</button>
      </form>

      {/* rejestracja itemu */}

      <form onChange={handleRegisterChange} onSubmit={handleRegisterItem}>
        <input type="text" placeholder='og item id' name='ogItemId' value={ogItemIdVal}/>
        <input type="text" placeholder='owner id' name='ownerHistory' value={ownerId}/>
        <button type='submit'>register item</button>
      </form>

      <div>
        <p>Wybierz uzytkownika:</p>
        {
            foundUsers?.length > 0 && 
            foundUsers?.map((user)=>(
                <div key={user.id}>
                    <p>Nickname: {user.nickname}</p>
                    <p>ID: {user.id}</p>
                    <button onClick={(()=>handleSetNewOwner(user))}>Wybierz uzytkownika</button>
                </div>
            ))
    
        }
      </div>
      <div>
        <p>Wybierz item:</p>
        {
            foundItems?.length > 0 && 
            foundItems?.map((item)=>(
                <div key={item.id}>
                    <p>Nazwa: {item.name}</p>
                    <p>ID: {item.id}</p>
                    <button onClick={
                      (()=>handleSetFoundItem(item))}>Wybierz przedmiot</button>
                </div>
            ))
    
        }
      </div>
      <p>Items:</p>
      {
        
        itemsList?.map((item)=>(
          <div>{item.name} - {item.id}</div>
        ))
      }
    </div>
  );
}

// export default App;
