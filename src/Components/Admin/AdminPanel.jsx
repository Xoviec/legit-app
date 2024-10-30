import React, { useState, useMemo } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../../assets/Legited logo.svg'
import { format } from "date-fns";
import { da, pl } from "date-fns/locale";
import { NavbarSimple } from '../Layout/NavbarSimple/NavbarSimple';
import { Table } from './Table';
import { useSession, useUser } from '../../Context/Context';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query' 




export const AdminPanel = () =>{

  const queryClient = useQueryClient();

    const [itemsList, setItemsList] = useState()
    const [publicUser, setPublicUser] = useState()
    const [userList, setUserList] = useState()
    const [ownerId, setOwnerId] = useState('')
    const [foundUsers, setFoundUsers] = useState()
    const [foundItems, setFoundItems] = useState()
    const [ogItemIdVal, setOgItemIdVal] = useState('')
    const[newOwner, setNewOwner] = useState()
    const[assignedItem, setAssignedItem] = useState()
    const[legitedItemsList, setLegitedItemsList] = useState()
    const[cachedLegitedItemsList, setCachedLegitedItemsList] = useState([])
    const[legitedItemsListCurrentPage, setLegitedItemsListCurrentPage] = useState(1)
    const[legitedItemsListPageLimit, setLegitedItemsListPageLimit] = useState()



    const session = useSession()
    const user = useUser()


    const API = import.meta.env.VITE_API

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

        const getLegitedItems = async (nickname) => {
          return await fetch(`http://localhost:3030/legitedItems`)
          .then(res=>res.json())
          .then(res=>res.items)
      
          return responseData;
      };
  
      const {
          status: legitedItemsStatus,
          error: legitedItemsError,
          data: legitedItemsData,
        } = useQuery({
          queryKey: ['legitedItems', legitedItemsListCurrentPage],
          queryFn: getLegitedItems,
        })

        const getItems = async () =>{
          return await fetch(`http://localhost:3030/getAllItems`)
          .then(res=>res.json())
          .then(res=>res.items)
        }

        const {
          status: itemsStatus,
          error: itemsError,
          data: itemsData,
        } = useQuery({
          queryKey: ['items'],
          queryFn: getItems,
        })


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
        try{
          const response = await fetch(`http://localhost:3030/searchUser/${nickname}`);
          const data = await response.json();
          setFoundUsers(data.users)
        }catch(err){
            console.log(err)
        }
}


      const handleRegisterChange = (e) =>{
            if(e.target.name==='ownerHistory'){
            setOwnerId(e.target.value)
            handleUpdateFoundUsers(e.target.value)
            handleUpdateFoundItems()
            }
            else{
            setOgItemIdVal(e.target.value)
            handleUpdateFoundItems(e.target.value)
            handleUpdateFoundUsers()
            }
        }

        


      const handleUpdateFoundItems = async (item) =>{
 
        
        try{
          const response = await fetch(`http://localhost:3030/getItems/${item}`);
          const data = await response.json();
          setFoundItems(data.items)
        }catch(err){
            console.log(err)
        }
      }

      const addItem = async ({itemData}) =>{
        console.log('dupa', {...itemData})
        await axios.post(`http://localhost:3030/itemCreate`,{
          ...itemData
        })
      }

        const addItemMutation = useMutation({
          mutationFn: addItem,
          onSuccess: (data,variable,context) => {
            itemRegisterSuccess(variable.itemData.name)
            queryClient.invalidateQueries({
              queryKey: ['items'],
            });
          },
          onError: (err) => {
            console.log(err);
          },
        })

        const handleMutateItem = (e) =>{
          e.preventDefault()
          const data = {
            name: e.target.name.value,
            brand: e.target.brand.value,
            sku: e.target.sku.value,
            image: e.target.image.value
          }
          addItemMutation.mutate({
            itemData: data,
            jwt: session.access_token
          })
        }
      
      const registerItem = async ({itemData, jwt}) =>{
        console.log("kurwa halo", itemData)
          return await axios.post(`http://localhost:3030/itemRegister`, {
            itemId: itemData.ogItemId,
            ownerId: itemData.ownerHistory
          })
      }

      const registerItemMutation = useMutation({
        mutationFn: registerItem,
        onSuccess: (data,variable,context) => {
          itemAssignSuccess(variable.itemData.ownerId, variable.itemData.ogItemIdVal);
          queryClient.invalidateQueries({
            queryKey: ['legitedItems', legitedItemsListCurrentPage],
          });
        },
        onError: (err) => {
          console.log(err);
        },
      });

      const handleMutateRegisterItem = (e) =>{
        e.preventDefault()
        const data = 
        {
          ogItemId: assignedItem,
          ownerHistory: newOwner,
          ownerId,
          ogItemIdVal
        } 
        registerItemMutation.mutate({
          itemData: data,
          jwt: session.access_token
        })
        
      }

      const tables = [
        {
          title: 'Legited items list',
          columns:[
            'owner',
            'name',
            'id',
            'legited_at',
          ],
          items: legitedItemsData,
        },
        {
          title: 'All items list',
          columns:[
            'name',
            'sku',
            'id',
            'brand'
          ],
          items: itemsData
        }
      ]


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
        <form onSubmit={handleMutateItem}>
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
        <form onChange={handleRegisterChange} onSubmit={handleMutateRegisterItem}>
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
            <input type="text" placeholder='Xoviec' name='ownerHistory'  value={ownerId}/> 
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
          <Table key={table.title} {...table}/>
        ))
      }
    </div>
    )
}