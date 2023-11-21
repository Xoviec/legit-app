
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';



export const UserPage = (key) =>{

    const[user, setUser] = useState()
    const[userItemsList, setUserItemsList] = useState()

    const location = useLocation();
    const pathSegments = location.pathname.split('/');
    const usernameFromPath = pathSegments[2];

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

        getNicknameData()
    }, [])


    console.log(userItemsList)

    userItemsList?.map(item=>{

        console.log(item)
    })
    
    // Przykładowe użycie



    return(
        <div>
            {usernameFromPath}-{user?.id}


            <p>Przedmioty uzytkownika {usernameFromPath}</p>
            <div>
                {
                    userItemsList?.map((item)=>(
                        <div>
                            <p key={item.id}>{item.name}</p>
                            <img src={item.image} alt="" />
                        </div>
                    ))
                }
            </div>
        </div>
    )
}