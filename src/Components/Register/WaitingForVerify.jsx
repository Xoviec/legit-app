import { useLocation, useNavigate } from 'react-router-dom';
import './WaitingForVerify.css'
import mailed from '../../assets/mailed.svg'
import { useEffect } from 'react';


export const WaitingForVerify = () =>{

    const {state} = useLocation();

    const navigate = useNavigate()

    useEffect(()=>{

        if(!state){
            navigate('/main',{replace:true})
        }

    }, [])


    console.log(state)
    return(
        <div className="login-page">
            <div className="verify-container">
                <img src={mailed} alt="mail icon" />
                <h1>Zweryfikuj swój email</h1>
                <p>Na adres <span className='email-address'>{state?.formData?.registerEmail}</span> został przesłany link weryfikacyjny w celu dokończenia rejestracji. Logowanie będzie możliwe po jego otwarciu. </p>
            </div>
        </div>
    )

}