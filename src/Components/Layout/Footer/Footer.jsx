import instagram from '../../../assets/instagram.svg'
import logo from '../../../assets/Legited logo.svg'
import './Footer.css'
import { Link } from 'react-router-dom';


export const Footer = () =>{


    return(
        <footer className="footer">

            <Link className='logo' to={`/main`} >
                <img src={logo} alt="" />
            </Link>

      
            <div className="footer-text">
                <Link to={`/privacy`} >
                    Polityka prywatności
                </Link>
                <Link to={`/terms`} >
                    Regulamin
                </Link>
                <Link className='instagram-logo' to={`https://instagram.com/legited.app`}  target="_blank" >
                    <img src={instagram} alt="" />
                </Link>

            </div>
          
      </footer>
    )
}