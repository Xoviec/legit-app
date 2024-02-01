import { Link } from 'react-router-dom';
import logo from '../../../Legited logo.svg'

export const NavbarSimple = () =>{

    return(
        <div className="login-nav">
            <Link to='/main'>
                <div className="logo">
                    <img src={logo} alt="" />   
                </div>    
            </Link>
        </div>
    )
    
}