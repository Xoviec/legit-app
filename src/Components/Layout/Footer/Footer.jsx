import instagram from '../../../assets/instagram.svg'
import logo from '../../../assets/logo-legited.png'
import './Footer.css'
import { Link } from 'react-router-dom';


export const Footer = () =>{


    return(
        <footer className="footer">

            <Link className='footer-logo' to={`/main`} >
                <img src={logo} alt="" />
            </Link>

      
            <div className="footer-text">
                <Link to={`/privacy`} >
                    Polityka prywatności
                </Link>
                <Link to={`/terms`} >
                    Regulamin
                </Link>
                <Link to={`/how-it-works`} >
                    Jak to działa?
                </Link>


            </div>
            <Link className='instagram-logo' to={`https://instagram.com/legited.app`}  target="_blank" >
                <img src={instagram} alt="" />
            </Link>
          
      </footer>
    )
}