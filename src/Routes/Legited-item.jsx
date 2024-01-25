import { useLocation, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';


export const LegitedItem = () =>{

    const API = process.env.REACT_APP_API


    const location = useLocation();
    const pathSegments = location.pathname.split('/');
    const itemIdFromPath = pathSegments[2];

    const [itemData, setItemData] = useState()

    console.log(itemIdFromPath)

    const getItemData = async () =>{

        try{
            const itemDataResponse = await fetch(`${API}/legited-item/${itemIdFromPath}`);
            const itemData = await itemDataResponse.json();
            setItemData(itemData[0])
            console.log(itemData[0])

        }catch(err){
            console.log(err)
        }

    }

    useEffect(()=>{
        getItemData()
    }, [])


    useEffect(() => {
        // Tworzymy element skryptu
        const script = document.createElement('script');
    
        // Ustawiamy atrybuty skryptu (src, defer itp.)
        script.src = 'https://t.ixkio.com/s/traceback.js?code=Gnuxzv';
        script.defer = true;
    
        // Dodajemy skrypt do elementu head dokumentu
        document.head.appendChild(script);
    
        // Opcjonalnie, możemy oczyścić skrypt przy odmontowywaniu komponentu
        return () => {
          document.head.removeChild(script);
        };
      }, []); // 
    


    

    return(
        <div className="central-page">
            xD
        </div>
    )
}


