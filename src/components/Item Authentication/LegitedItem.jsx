import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AuthPassed } from './AuthPassed';
import { NFCTagNotRegisteredYet } from './NFCTagNotRegisteredYet';


export const LegitedItem = () =>{




    const API = process.env.REACT_APP_API


    const location = useLocation();
    const pathSegments = location.pathname.split('/');
    const itemIdFromPath = pathSegments[2];


    const navigate = useNavigate();


    const[scanData, setScanData] = useState()
    const[isScanSuccess, setIsScanSuccess] = useState()
    const[isDataLoaded, setIsDataLoaded] = useState()
    const[authError, setAuthError] = useState()
    const[authDate, setAuthDate] = useState()
    const[itemData, setItemData] = useState()
    const[xuidKey, setXuidKey] = useState()

 
    const AuthLink = async () =>{

        const itemsData = await getItemData()

        try{
            var i = new URLSearchParams(window.location.search);

            if((i.get('failed'))===true){
                navigate('/auth-failed?error=400', { replace: true,  state: {itemsData, authDate}})
                return
            }

            let ixk_txtdelay = 0;

            let ixk_failurl = "https://legited.app/auth-failed";
            let ixk_errqs = true;

            var ixk_target = "";
            var ixk_tbresponse = {
                status: 'unknown_error'
            };
            var ixk_ts = Date.now();
            const authDate = ixk_ts
            setAuthDate(authDate)
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

            setXuidKey(promiseData['ixkdd-xuid'])
            setIsDataLoaded(true)
            if(promiseData.status === 'key_pass' && !promiseData['ixkdd-cuid']){ //tag nie jest przypisany
                setIsScanSuccess(false)
                return
            }
            // else if(promiseData.status === 'key_fail' && !promiseData['ixkdd-cuid']){
            //     navigate('/404', { replace: true})
            //     return
            // }
            else if(promiseData.status === 'key_fail'){
                setIsScanSuccess(false)
                setAuthError(promiseData.qserror)
                switch(promiseData.qserror){
                    default:
                        navigate('/auth-failed?error=400', { replace: true,  state: {itemsData, authDate}})
                        return
                    case('expired_key'):
                        navigate('/auth-failed?error=410', { replace: true,  state: {itemsData, authDate}})
                        return
                    case('no_key'):
                        navigate('/auth-failed?error=400', { replace: true,  state: {itemsData, authDate}})
                        return
                    case('key_not_found'):
                        navigate('/auth-failed?error=401', { replace: true,  state: {itemsData, authDate}})
                        return
                }
            }
            else{
                setIsScanSuccess(true)

            }
            console.log(promiseData)

        }catch(err){
            console.log(err)
        }

    }
    


    console.log(itemIdFromPath)

    const getItemData = async () =>{

        if(itemIdFromPath){
            try{
                const itemDataResponse = await fetch(`${API}/legited-item/${itemIdFromPath}`);
                const itemData = await itemDataResponse.json();
                setItemData(itemData)
                console.log(itemData)
                return itemData
    
            }catch(err){
                console.log(err)
            }
        }
        else{
            setItemData('Not registered')
            return('Not registered')
        }



    }

    useEffect(()=>{
        AuthLink()
    }, [])

    return(
        <div className="certificate-page">


            {
                !isDataLoaded ?
                <div>Weryfikowanie...</div>
                :
                <>

                {isScanSuccess ? 
                <>
                   
                   <AuthPassed authDate={authDate} data={itemData}/>
                    
                </>
                : 
                
                <NFCTagNotRegisteredYet xuid={xuidKey}/>
                
                
                }
                {/* {authError} */}

                </>

            }
              
            

        </div>
    )
}


