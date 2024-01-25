import { useLocation, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';


export const LegitedItem = () =>{


    const[scanData, setScanData] = useState()
    const[isScanSuccess, setIsScanSuccess] = useState()
 
    const dupa = async () =>{

        try{

        let ixk_txtdelay = 0;

        let ixk_textdb = "Authentication Check<br>In Progress...";
        let ixk_failurl = "https://legited.app/auth-failed";
        let ixk_errqs = true;

        var i = new URLSearchParams(window.location.search);
        var ixk_target = "";
        var ixk_tbresponse = {
            status: 'unknown_error'
        };
        var ixk_ts = Date.now();
        const controller = new AbortController();
        const options = {
            method: 'GET',
            signal: controller.signal
        };
        var ixk_curl = encodeURI(window.location.hostname + window.location.pathname);

        console.log(ixk_ts)
        console.log(i.get('ixr'))
        console.log(ixk_curl)
        const promise = await fetch('https://t.ixkio.com/traceback?ixc=Gnuxzv&ts=' + ixk_ts + '&ixr=' + i.get('ixr') + '&ixu=' + ixk_curl, options);
        const promiseData = await promise.json()
        if(promiseData.status === 'key_fail'){
            setIsScanSuccess(false)
        }
        else{
            setIsScanSuccess(true)
        }
        console.log(promiseData)

        }catch(err){
            console.log(err)
        }

    }
    

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
        dupa()
        getItemData()
    }, [])


    


    // useEffect(() => {
    //     // Tworzymy element skryptu
    //     const script = document.createElement('script');
    
    //     // Ustawiamy atrybuty skryptu (src, defer itp.)
    //     script.src = 'https://t.ixkio.com/s/traceback.js?code=Gnuxzv';
    //     script.defer = true;
    
    //     // Dodajemy skrypt do elementu head dokumentu
    //     document.head.appendChild(script);

    
    //     // Opcjonalnie, możemy oczyścić skrypt przy odmontowywaniu komponentu
    //     return () => {
    //       document.head.removeChild(script);
    //     };
    //   }, []); 
    

    return(
        <div className="central-page">
            current owner:
            {itemData?.current_owner}
            {isScanSuccess ? <p>Tak</p> : <p>Nie</p>}

        </div>
    )
}


