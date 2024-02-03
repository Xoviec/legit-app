import { Link } from 'react-router-dom';
import logo from '../../Legited logo.svg'
import iphoneScreen from '../../ip14pro.png'
import './MainNotLogged.css'


export const MainNotLogged = ()=>{

    return(
        <div className="hero">
            <div className="hero-text">
                {/* <h1>Legited</h1> */}
                {/* <img src={logo} alt="legited-logo" />    */}

                <h1>Uwierzytelnianie oraz permanentny legit check na Twoje sneakersy za pomocą tagów NFC</h1>
                {/* <h2>Jeszcze nie wiem co tu napisać, ale na pewno tu coś będzie</h2> */}
                <div className="buttons">
                    <button className='btn-join'>Dołącz</button>
                    <button className='btn-how'>Jak to działa?</button>
                </div>
                {/* <Link to='/register'>
                    <span>Dołącz </span>  
                </Link> */}

                    {/* aby wykorzystać wszystkie funkcje! */}
            </div>
            <div className="hero-image-container">
                <img src={iphoneScreen} alt="" />
            </div>
    
        </div>
    )
}