
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';




export const UserPage = (key) =>{

    const[user, setUser] = useState()
    const[userItemsList, setUserItemsList] = useState()
    const[foundUsers, setFoundUsers] = useState()
    const[newOwner, setNewOwner] = useState()
    const[userID, setUserID] = useState('none')
 
    const location = useLocation();
    const pathSegments = location.pathname.split('/');
    const usernameFromPath = pathSegments[2];


    const getUserDataFromDB = async()=>{
        const { data: { user } } = await supabase.auth.getUser()

        setUserID(user?.id)
    }

    useEffect(()=>{
        const getNicknameData = async (nickname) => {
            try {
                const response = await fetch(`http://localhost:8000/nicknames/${usernameFromPath}`);
                const userItemsListResponse = await fetch(`http://localhost:8000/user-items/${usernameFromPath}`);
                const userItemsList = await userItemsListResponse.json()
                const data = await response.json();
                setUserItemsList(userItemsList)
                setUser(data[0])
            } catch (error) {
                console.error('Błąd podczas pobierania danych:', error);
            }
        };

        getUserDataFromDB()
        getNicknameData()
    }, [])


    const handleUpdateFoundUsers = async (e) =>{
        console.log(e.target.value)
            const response = await fetch(`http://localhost:8000/search-users?letters=${e.target.value}`);
            const data = await response.json();

            console.log(data)
            setFoundUsers(data)

        try{

        }catch(err){
            console.log(err)
        }
    }

    // Przykładowe użycie
    const handleDeleteItem = async (item) =>{
        
        const currentOwner = item.ownersHistory[item.ownersHistory.length-1]
        if(item.registerID && currentOwner.ownerID && newOwner && newOwner!==currentOwner){
            try{
                await axios.post('http://localhost:8000/change-owner', {
                    registerID: item.registerID,
                    currentOwner: currentOwner.ownerID,
                    newOwner: newOwner,
                    verifyID: userID
                });
            setNewOwner()
            }catch(error){
                console.log(error.response.data.error)
            }
        }
    }


    return(
        <div>
            {usernameFromPath}-{user?.id}


            <p>Przedmioty uzytkownika {usernameFromPath}</p>
            <div>
                {
                    userItemsList?.map((item)=>(
                        <div>
                            <p key={item.id}>{item.name} registered {item.ownersHistory[0].registerDate}</p>
                            <p>It belongs to {user.nickname} since {item.ownersHistory[item.ownersHistory.length-1].registerDate}</p>
                            <img src={item.image} alt="" />
                            <button onClick={()=>handleDeleteItem(item)}>prześlij item</button>
                        </div>
                    ))
                }
            </div>
            <div>

                <input onChange={handleUpdateFoundUsers} type="text" name="search" id="" />

                <div>
                                <p>Wybierz uzytkownika:</p>
                                {
                                    foundUsers?.length > 0 && 
                                    foundUsers?.map((user)=>(
                                        <div key={user.id}>
                                            <p>Nickname: {user.nickname}</p>
                                            <p>ID: {user.id}</p>
                                            <button onClick={(()=>setNewOwner(user.id))}>Wybierz uzytkownika</button>
                                        </div>
                                    ))
                            
                                }
                            </div>
            </div>

        </div>
    )
}