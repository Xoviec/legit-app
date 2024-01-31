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

    console.log(state.authDate)

    console.log(error)

    // const [itemData, setItemData] = useState()

    // const getItemData = async () =>{

    //     try{
    //         const itemDataResponse = await fetch(`${API}/legited-item/${state}`);
    //         const itemData = await itemDataResponse.json();
    //         setItemData(itemData)
    //         console.log(itemData)

    //     }catch(err){
    //         console.log(err)
    //     }

    // }

    // useEffect(()=>{
    //     getItemData()
    // }, [])


    const getDate = () =>{
        const a = new Date(state?.authDate * 1);
        const months = ['Sty','Lut','Mrz','Kw','Maj','Cz','Lip','Sier','Wrz','Paź','Lis','Gr'];
        const year = a.getFullYear();
        const month = months[a.getMonth()];
        const date = a.getDate();
        const hour = a.getHours().toString().padStart(2, '0');
        const min = a.getMinutes().toString().padStart(2, '0');
        const sec = a.getSeconds().toString().padStart(2, '0');
        const time = date + '\xa0' + month + '\xa0' + year + '\xa0' + hour + ':' + min + ':' + sec ;
        return time;
        return 1
    }



    return(
        <div className="certificate-page">
            <div className="item-auth-failed">
            <div className="auth-card">
                <h1>Nie udało się zweryfikować</h1>
                <div className="auth-data">
                    <p>Próba weryfikacji: {getDate()}</p>
                    <p className="auth-item-id">ID: {state?.itemsData?.id}</p>
                </div>
                <div className="auth-item">
                    <div className="image-overlay">
                                Spróbuj ponownie
                    </div>
                    <div className="image">
                       
                        <img src={state?.itemsData?.image} alt="auth item" />
                    </div>
                    <div className="auth-item-info">
                        <p className="auth-item-name">{state?.itemsData?.name}</p>
                        <p className="auth-item-sku">{state?.itemsData?.sku}</p>
                        <p className="auth-item-owner">Właściel: <span className="auth-item-owner-nickname">{state?.itemsData?.nickname}</span></p>
                        <p className='auth-item-registered'>Zarejestrowane <span className='register-date'>{state?.itemsData?.legited_at?.slice(0, 10).split('-').reverse().join('.')}</span></p>
                    </div>
    
                </div>
                {/* <p>401 key not found</p> */}
            </div>




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
                {/* <ItemAuthPassed/> */}
        
           
            </div>
        </div>
    )
}
