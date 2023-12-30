import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { supabase } from './supabaseClient';
import { Link } from 'react-router-dom';




export const AdminPanel = () =>{

    const [itemsList, setItemsList] = useState()
    const [user, setUser] = useState(null)
    const [publicUser, setPublicUser] = useState()
    const [userList, setUserList] = useState()
    const [ownerId, setOwnerId] = useState('')
    const [foundUsers, setFoundUsers] = useState()
    const [foundItems, setFoundItems] = useState()
    const [ogItemIdVal, setOgItemIdVal] = useState('')
    const[newOwner, setNewOwner] = useState()
    const[assignedItem, setAssignedItem] = useState()



    const API = process.env.REACT_APP_API


    useEffect(() => {

        const fetchData = async () => {
    
          const { data: { user } } = await supabase.auth.getUser()
          const { data, error } = await supabase.auth.getSession()
    
          console.log(user)
      
          setUser(user)
    
        
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

        fetchData()


      }, []);



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


    return(
        <div className='admin-panel'>
            {
                publicUser && 
                <div>Witaj, {publicUser?.nickname} - {publicUser?.account_type}</div>
            }

      {/* {
        
        userList?.map((appUser)=>(
          <Link className={`${appUser?.id===user?.id ? `user` : null}`} key={appUser.name} to={`/Users/${appUser.nickname}`}>{appUser.nickname}</Link>
        ))
      } */}
  

    <div className="item-register-form">
        <p className='register-form-title'>Dodaj nowy przedmiot</p>
        <form onSubmit={handleAddItem}>
            <span>Nazwa przedmiotu</span>
            <input type="text" placeholder='Yeezy 350' name='name'/>
            <span>SKU </span>
            <input type="text" placeholder='HQ6315' name='sku'/>
            <span>Marka</span>
            <input type="text" placeholder='Adidas' name='brand'/>
            <button type='submit'>Dodaj przedmiot</button>
        </form>
    </div>



      <div className="item-register-form">
        <p className='register-form-title'>Przypisz przedmiot uzytkownikowi</p>
        <form onChange={handleRegisterChange} onSubmit={handleRegisterItem}>
            <span>Nazwa przedmiotu</span>
            <input type="text" placeholder='Yeezy 350' name='ogItemId' value={ogItemIdVal}/>
            <div className="found-items">

            {
            foundItems?.length > 0 && 
            foundItems?.map((item)=>(
                <div className='found-item' key={item.id}>
                    <p>{item.name}</p>
                    {/* <p>ID: {item.id}</p> */}
                    <button onClick={
                      (()=>handleSetFoundItem(item))}>Wybierz</button>
                </div>
            ))
    
        }
            </div>
            <span>Uzytkownik</span>
            <input type="text" placeholder='Xoviec' name='ownerHistory' value={ownerId}/>
            <button type='submit'>Przypisz</button>
        </form>
      </div>


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

      </div>
      <p>Items:</p>
      {
        
        itemsList?.map((item)=>(
          <div>{item.name} - {item.id}</div>
        ))
      }
      
    </div>
    )
}