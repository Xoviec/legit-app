import { Link } from 'react-router-dom';
import logo from './LOGO.png'

export const Navbar = () =>{
    return(
        <nav>
            <div className="logo">
                <img src={logo} alt="" />   
            </div>
            <div className="rest">
            <Link to='/login'>
                <button>
                    Jak to działa
                </button>
            </Link>

            <Link to='/login'>
                <button>
                    O nas
                </button>
            </Link>

            <Link to='/login'>
                <button className='btn-login'>
                    Zaloguj się
                </button>
            </Link>
            <Link to='/register'>
                <button className='btn-register'>
                    Zarejestruj się
                </button>
            </Link>
            </div>
            
        </nav>
    )
}