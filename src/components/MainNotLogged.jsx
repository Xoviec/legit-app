import { Link } from 'react-router-dom';
import logo from '../Legited logo.svg'


export const MainNotLogged = ()=>{

    return(
        <div className="welcomer">
            <h1>Legited</h1>
            {/* <img src={logo} alt="legited-logo" />    */}

            <p>Uwierzytelnianie oraz permanentny legit check na <span>Twoje</span> sneakersy za pomocą tagów NFC.</p>
            <p> 

            <div className="buttons">
                <button className='btn-join'>Dołącz</button>
                <button className='btn-how'>Jak to działa?</button>
            </div>
  

            {/* <Link to='/register'>
                <span>Dołącz </span>  
            </Link> */}

                {/* aby wykorzystać wszystkie funkcje! */}
                </p>
        </div>
    )
}