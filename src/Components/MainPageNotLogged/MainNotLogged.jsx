import { Link } from 'react-router-dom';
// import logo from '../../Legited logo.svg'
import iphoneScreen from '../../assets/ip14pro.png'
import './MainNotLogged.css'


export const MainNotLogged = ({SoonText})=>{

    return(
        <div className="hero">
            <div className="hero-text">
                {/* <h1>Legited</h1> */}
                {/* <img src={logo} alt="legited-logo" />    */}

                <h1>Uwierzytelnianie oraz permanentny legit check na Twoje sneakersy za pomocą tagów NFC</h1>
                {/* <h1>Permanentne LC na Twoje sneakersy</h1> */}
                {/* <h2>Z łatwością uwierzytelnij swoje buty za pomocą tagów NFC</h2> */}
                {
                    SoonText
                    ||
                    <div className="buttons">
                        <Link to='/login?activeTab=register' >
                            <button className='btn-join'>Dołącz</button>
                        </Link>
                        <Link to='/how-it-works' >
                            <button className='btn-how'>Jak to działa?</button>
                        </Link>
                    </div>
                }
                
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