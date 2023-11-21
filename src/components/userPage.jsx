
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
    const handleDeleteItem = async (item) =>{
        
        const currentOwner = item.ownersHistory[item.ownersHistory.length-1]
        // console.log(item.ownersHistory[item.ownersHistory.length-1])

        try{
            await axios.post('http://localhost:8000/change-owner', {
                registerID: item.registerID,
                currentOwner: currentOwner.ownerID,
                // currentOwner: '0b972e35-c28d-4052-a4cd-260b5c2c965b',
                newOwner: '2a572792-97fe-4efb-9f9f-060700e58154',
            });
        }catch(error){
            console.log(error)
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
                            <p key={item.id}>{item.name}</p>
                            <img src={item.image} alt="" />
                            <button onClick={()=>handleDeleteItem(item)}>X</button>

                        </div>
                    ))
                }
            </div>
        </div>
    )
}