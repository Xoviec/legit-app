import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../../Legited logo.svg'
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { NavbarSimple } from '../Layout/NavbarSimple/NavbarSimple';
import { Table } from './Table';




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
    const[legitedItemsList, setLegitedItemsList] = useState()
    const[legitedItemsListCurrentPage, setLegitedItemsListCurrentPage] = useState(1)
    const[legitedItemsListPageLimit, setLegitedItemsListPageLimit] = useState()
    const[jwt, setJwt] = useState()




    const API = process.env.REACT_APP_API

    const itemRegisterSuccess = (item) => toast.success(`Pomyślnie dodano ${item}`, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });


    const itemAssignSuccess = (item, user) => toast.success(`Pomyślnie przypisano ${item} uzytkownikowi ${user}`, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });


    useEffect(() => {

        const fetchData = async () => {
    
          const { data: { user } } = await supabase.auth.getUser()
          const { data: {session}, error } = await supabase.auth.getSession()
    
          console.log(user)
          setJwt(session.access_token)
      
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
    
    
          } catch (error) {
            console.error('Error fetching data:', error);
          }

          try{
            const legitedItemsRes = await fetch(`${API}/legited-items?page=${legitedItemsListCurrentPage}`); // szuka wszystkich uzytkownikow
            const legitedItemsData = await legitedItemsRes.json();

            legitedItemsData.data.map((item)=>(
              item.legited_at = format(item.legited_at, "yyyy-MM-dd HH:mm:ss")
            ))
            setLegitedItemsList(legitedItemsData.data)
            setLegitedItemsListPageLimit(legitedItemsData.pageLimit)
            console.log(legitedItemsData)
          }catch(err){
            console.log(error)
          }
        };

        fetchData()


      }, [legitedItemsListCurrentPage]);



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
            handleUpdateFoundItems()
            }
            //zmiana state do szukania itemu 
            else{
            setOgItemIdVal(e.target.value)
            handleUpdateFoundItems(e.target.value)
            handleUpdateFoundUsers()
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
            'image': e.target.image.value
          }
          setItemsList((prevItemsList) => [...prevItemsList, data]);


          try{
            await axios.post(`${API}/items`, {
              itemData: data,
              jwt: jwt,
            })
            itemRegisterSuccess(e.target.name.value)
                        
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
          const response = await axios.post(`${API}/register-item`, {
                itemData: data,
                jwt: jwt,
              })

          itemAssignSuccess(ogItemIdVal, ownerId)
       
          }catch(err){
            console.log(err)
          }
        }
      }


      function compareByName(a, b) {
        return a.name - b.name;
      }


      console.log(itemsList)
     

      // itemsList?.sort(function(a, b) {
      //   var keyA = (a.name),
      //     keyB = (b.name);
      //   // Compare the 2 dates
      //   if (keyA < keyB) return -1;
      //   if (keyA > keyB) return 1;
      //   return 0;
      // });
      
      console.log(itemsList);

      const changeLegitedItemsPage = (num) =>{

        switch(num){
          case 1:
            {
              if(legitedItemsListCurrentPage < legitedItemsListPageLimit){
                setLegitedItemsList()
                setLegitedItemsListCurrentPage((prev)=>prev+num)
              }
              break
            }
          case -1:
            {
              if(legitedItemsListCurrentPage > 1){
                setLegitedItemsList()
                setLegitedItemsListCurrentPage((prev)=>prev+num)
              }
              break
            }
        }

        // setLegitedItemsList()

        // setLegitedItemsListCurrentPage((prev)=>prev+num)
        // console.log(num)
      }

      console.log(itemsList);

      const changeItemsPage = (num) =>{

        console.log('dupa XD', num)
      }
      
      const tables = [
        {
          title: 'All items list',
          columns:[
            'name',
            'sku',
            'id',
            'brand'
          ],
          items: itemsList?.sort(function(a, b) {
                let keyA = (a.name),
                  keyB = (b.name);
                if (keyA < keyB) return -1;
                if (keyA > keyB) return 1;
                return 0;
              }),
          // pagination: changeItemsPage
        },
        {
          title: 'Legited items list',
          columns:[
            'current_owner_nickname',
            'item_name',
            'id',
            'legited_at',
          ],
          items: legitedItemsList,
          pagination: changeLegitedItemsPage
        }
      ]


      // ?.sort(function(a, b) {
      //   let keyA = new Date(a.legited_at),
      //     keyB = new Date(b.legited_at);
      //   if (keyA < keyB) return 1;
      //   if (keyA > keyB) return -1;
      //   return 0;
      // })


    return(
        <div className='admin-panel'>

          <NavbarSimple/>


            <ToastContainer
                    position="bottom-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
            /> 

    <div className="item-register-form">
        <p className='register-form-title'>Dodaj nowy przedmiot</p>
        <form onSubmit={handleAddItem}>
            <span>Nazwa przedmiotu</span>
            <input type="text" placeholder='Yeezy 350' name='name'/>
            <span>SKU </span>
            <input type="text" placeholder='HQ6315' name='sku'/>
            <span>Marka</span>
            <input type="text" placeholder='Adidas' name='brand'/>
            <span>Link do zdjęcia</span>
            <input type="text" placeholder='https://cdn.discordapp.com/attachments/1184307919836155944/1191085967868698694/JordanChic.jpg?ex=65c91240&is=65b69d40&hm=e02519310d5b2784bb658045c5e93cf8abede17edba53e49c7fc834e333955f3&' name='image'/>
            <button type='submit'>Dodaj przedmiot</button>
        </form>
    </div>



      <div className="item-register-form">
        <p className='register-form-title'>Przypisz przedmiot uzytkownikowi</p>
        <form onChange={handleRegisterChange} onSubmit={handleRegisterItem}>
            <span>Nazwa przedmiotu</span>
            <input type="text" placeholder='Yeezy 350' name='ogItemId' value={ogItemIdVal}/>

            {
            foundItems?.length > 0 && (
                <div className="pre-list">
                <div className="found-items">
                    {foundItems.map((item) => (
                    <div className='found-item' key={item.id}>
                        <p>{item.name}</p>
                        <button onClick={() => handleSetFoundItem(item)}>Wybierz</button>
                    </div>
                    ))}
                </div>
                </div>
            )
            }

         

            <span>Uzytkownik</span>
            <input type="text" placeholder='Xoviec' name='ownerHistory' value={ownerId}/>
            {
            foundUsers?.length > 0 && (
                <div className="pre-list">
                <div className="found-items">
                    {foundUsers.map((user) => (
                    <div className='found-item' key={user.id}>
                        <p>{user.nickname}</p>
                        <button onClick={() => handleSetNewOwner(user)}>Wybierz</button>
                    </div>
                    ))}
                </div>
                </div>
            )
            }
            <button type='submit'>Przypisz</button>
        </form>
      </div>


      {
        tables.map((table)=>(
          <Table {...table}/>
        ))
      }

      
    </div>
    )
}