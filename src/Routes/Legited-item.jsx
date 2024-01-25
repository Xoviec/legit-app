import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';


export const LegitedItem = () =>{



    const navigate = useNavigate();


    const[scanData, setScanData] = useState()
    const[isScanSuccess, setIsScanSuccess] = useState()
    const[isDataLoaded, setIsDataLoaded] = useState()
    const[authError, setAuthError] = useState()
 
    const AuthLink = async () =>{

        try{

        let ixk_txtdelay = 0;

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
        setIsDataLoaded(true)
        if(promiseData.status === 'key_fail'){
            setIsScanSuccess(false)
            setAuthError(promiseData.qserror)
            // navigate('/auth-failed?error=410', { replace: true, state: {error: 'xd'} })
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
        AuthLink()
        getItemData()
    }, [])

    return(
        <div className="central-page">


            {
                !isDataLoaded ?
                <div>Weryfikowanie...</div>
                :
                <>

                Status weryfikacji
                {isScanSuccess ? 
                <>
                    current owner:
                    {itemData?.current_owner}
                    <p>Udana</p> 
                    
                </>
                : <p>Nieudana</p>}
                {authError}

                </>

            }

            

        </div>
    )
}


