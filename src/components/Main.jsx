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
import { MyAvatar } from '../shared/Avatar';
import { LastEvents } from './LastEvents';
import { NotLogged } from './notLogged';

export const Mainpage =()=> {


// supabase.auth.getUser()
const item = JSON.parse(localStorage.getItem('sb-bpkpqswpimtoshzxozch-auth-token'));
const nickNameFromLocalStorage = item?.user.user_metadata.full_name



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
  const[mostItems, setMostItems] = useState()


  const API = process.env.REACT_APP_API

  console.log(API)




  // console.log(getSession().session.user)

  const essa = async()=>{
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase.auth.getSession()

    setUser(user)

    console.log(data)
  }

  const getMostItems = async () =>{
    try{
      const mostItemsRes = await fetch(`${API}/most-items`); // szuka wszystkich uzytkownikow
      const mostItemsData = await mostItemsRes.json();
      setMostItems(mostItemsData)
  
      console.log(mostItemsData)
    }catch(error){
      console.log(error)
    }

  } 

  const getComments = async () =>{

    console.log('sraka')
    console.log(user?.id)
    // const commentsRes = await fetch(`${API}/get-comments/${user.id}`)
    // const commentsData = await commentsRes.json()
    // setComments(commentsData)
  }


  const getUserItems = async () =>{

    try{
      const userItemsListResponse = await fetch(`${API}/user-items/${nickNameFromLocalStorage}`);
      const userItemsData = await userItemsListResponse.json()
      setUserItemsList(userItemsData)
      console.log(userItemsData)
    }catch(userItemsError){
      console.log(userItemsError)
    }
  }

  useEffect(() => {

    const fetchData = async () => {

      const { data: { user } } = await supabase.auth.getUser()
      const { data, error } = await supabase.auth.getSession()

      console.log(user)
  
      setUser(user)

      try{
        const commentsRes = await fetch(`${API}/get-comments/${user.id}`)
        const commentsData = await commentsRes.json()
        setComments(commentsData)
      }catch(commentsError){
        console.log(commentsError)
      }
    
      try{
        const publicUserResponse = await fetch(`${API}/secret/${user.id}`); //dane uzytkownika
        const publicUserData = await publicUserResponse.json();
        setPublicUser(publicUserData[0])
      }catch(userDataError){
        console.log(userDataError)
      }


      try {
        const usersDataResponse = await fetch(`${API}/nicknames`); // szuka wszystkich uzytkownikow
        const usersData = await usersDataResponse.json();
        const itemsResponse = await fetch(`${API}/items`); //wszystkie itemy
        const itemsData = await itemsResponse.json();

        setUserList(usersData)
        setItemsList(itemsData)
        console.log(user.email)
        console.log(user.id)


      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };


    getUserItems()
    getMostItems()
    fetchData()
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

  console.log('kuuurwa', user)
  

  console.log(comments)
  return (
    

    <div className="App">
      <div className='central-page'>
        <LastEvents list={mostItems}/>

        {

            item ? 
            (

              publicUser ? 
              
            <div className="profile-container">
            <div className="user-info">
                <MyAvatar user={publicUser}/>
                <h1>{publicUser?.nickname}</h1>
                <Link state={publicUser}to={`/settings`} className='settings-btn'>
                  <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.8536 1.14645C11.6583 0.951184 11.3417 0.951184 11.1465 1.14645L3.71455 8.57836C3.62459 8.66832 3.55263 8.77461 3.50251 8.89155L2.04044 12.303C1.9599 12.491 2.00189 12.709 2.14646 12.8536C2.29103 12.9981 2.50905 13.0401 2.69697 12.9596L6.10847 11.4975C6.2254 11.4474 6.3317 11.3754 6.42166 11.2855L13.8536 3.85355C14.0488 3.65829 14.0488 3.34171 13.8536 3.14645L11.8536 1.14645ZM4.42166 9.28547L11.5 2.20711L12.7929 3.5L5.71455 10.5784L4.21924 11.2192L3.78081 10.7808L4.42166 9.28547Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
                  <span className='settings-text'>Edytuj profil</span>
                </Link>
            </div>
            {
                publicUser?.description && <><p className='user-about'></p> <p>{publicUser?.description}</p></>
            }
            <ProfileTabs userItemsList={userItemsList} comments={comments}/>
          </div> 
          
          : 

          <div>

            Ładuje
          </div>


            )

            :

            <NotLogged/>

        }

       
      </div>
      {/* {
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
  

  
      <form onSubmit={handleAddItem}>
        <input type="text" placeholder='name' name='name'/>
        <input type="text" placeholder='sku' name='sku'/>
        <input type="text" placeholder='brand' name='brand'/>
        <button type='submit'>add item</button>
      </form>


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
      } */}
      
    </div>
    

  );
}

// export default App;
