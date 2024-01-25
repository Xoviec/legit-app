import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

export const Anonymous = () => {



    const[isScanSuccess, setIsScanSuccess] = useState()
    const[isDataLoaded, setIsDataLoaded] = useState(false)

  

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
    
    useEffect(()=>{
        AuthLink()
    }, [])



    return item ? <Navigate to="/legited-item" replace /> : <Outlet />;
  }