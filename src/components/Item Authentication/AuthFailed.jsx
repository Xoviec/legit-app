import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import gone from '../../410.svg'
import unauthorized from '../../401.svg'
import notFound from '../../404.svg'
import badRequest from '../../400.svg'
import { ItemAuthPassed } from "./AuthPassed";
import { useEffect, useState } from 'react';


export const AuthFailed = (props) =>{


    const API = process.env.REACT_APP_API
    const {state} = useLocation();
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const [data, setData] = useState(state)
    const [itemsData, setItemData] = useState(state?.itemsData)
    const error = searchParams.get("error")
    const idFromPath = searchParams.get('id');

    const getItemData = async () =>{
        
        try{
            const itemDataResponse = await fetch(`${API}/legited-item/${idFromPath}`);
            const itemData = await itemDataResponse.json();
            setItemData(itemData)

        }catch(err){
            console.log(err)
        }

    }

    useEffect(()=>{

        if(!state && !idFromPath){
            navigate('/404')
            return        
        }
        else if(!state && idFromPath){
            getItemData()
        }
    }, [])


    const getDate = () =>{
        const a = new Date(Date.now());
        const months = ['Sty','Lut','Mrz','Kw','Maj','Cz','Lip','Sier','Wrz','Paź','Lis','Gr'];
        const year = a.getFullYear();
        const month = months[a.getMonth()];
        const date = a.getDate();
        const hour = a.getHours().toString().padStart(2, '0');
        const min = a.getMinutes().toString().padStart(2, '0');
        const sec = a.getSeconds().toString().padStart(2, '0');
        const time = date + '\xa0' + month + '\xa0' + year + '\xa0' + hour + ':' + min + ':' + sec ;
        return time;
    }



    console.log('data', data)

    console.log('itemdata', itemsData)


    return(
        <div className="certificate-page">
            <div className="item-auth-failed">
            <div className="auth-card">
                <h1>Nie udało się zweryfikować</h1>
                <div className="auth-data">
                    <p>Próba weryfikacji: {getDate()}</p>
                    <p className="auth-item-id">ID: {itemsData?.id}</p>
                </div>
                <div className="auth-item">
                    <div className="image-overlay">
                                Spróbuj ponownie
                    </div>
                    <div className="image">
                       
                        <img src={itemsData?.image} alt="auth item" />
                    </div>
                    <div className="auth-item-info">
                        <p className="auth-item-name">{itemsData?.name}</p>
                        <p className="auth-item-sku">{itemsData?.sku}</p>
                        <p className="auth-item-owner">Właściel: <span className="auth-item-owner-nickname">{itemsData?.nickname}</span></p>
                        <p className='auth-item-registered'>Zarejestrowane <span className='register-date'>{itemsData?.legited_at?.slice(0, 10).split('-').reverse().join('.')}</span></p>
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
