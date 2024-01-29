import { useSearchParams, useLocation } from "react-router-dom";
import gone from '../410.svg'
import unauthorized from '../401.svg'
import notFound from '../404.svg'
import badRequest from '../400.svg'
import { ItemAuthPassed } from "../components/ItemAuthPassed";
import { useEffect, useState } from 'react';


export const AuthFailed = (props) =>{


    const API = process.env.REACT_APP_API

    const [searchParams] = useSearchParams();

    const error = searchParams.get("error")

    const {state} = useLocation();

    console.log(state)

    console.log(error)

    const [itemData, setItemData] = useState()

    const getItemData = async () =>{

        try{
            const itemDataResponse = await fetch(`${API}/legited-item/${state}`);
            const itemData = await itemDataResponse.json();
            setItemData(itemData)
            console.log(itemData)

        }catch(err){
            console.log(err)
        }

    }

    useEffect(()=>{
        getItemData()
    }, [])



    return(
        <div className="central-page">
            <div className="not-found">
                {/* {
                    error === '410' ?
                    <>
                       <img src={gone} alt="gone" />
                        <h2>
                        Link wygasł. Zeskanuj tag NFC ponownie.
                        </h2>
                    </>
                    :
                    error === '401' ? 
                    <>
                        <img src={unauthorized} alt="401 unauthorized" />
                        <h2>
                        Nieprawidłowy klucz.
                        </h2>
                    </>
                    :
                    <>
                        <img src={badRequest} alt="400 bad request" />
                        <h2>
                        Nieprawidłowe zapytanie.
                        </h2>
                    </>
                } */}
                <ItemAuthPassed/>
        
           
            </div>
        </div>
    )
}
