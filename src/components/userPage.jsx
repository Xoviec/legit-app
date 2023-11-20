
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';



export const UserPage = (key) =>{

    const[user, setUser] = useState()


    const location = useLocation();
    const pathSegments = location.pathname.split('/');
    const usernameFromPath = pathSegments[2];
    console.log(usernameFromPath)

    useEffect(()=>{
        const getNicknameData = async (nickname) => {
            try {
                console.log(nickname)
                const response = await fetch(`http://localhost:8000/nicknames/${usernameFromPath}`);
                const data = await response.json();
                console.log(data);
                setUser(data[0])
            } catch (error) {
                console.error('Błąd podczas pobierania danych:', error);
            }
        };

        getNicknameData()
    }, [])


    
    // Przykładowe użycie



    return(
        <div>
            {usernameFromPath}-{user?.id}

        </div>
    )
}