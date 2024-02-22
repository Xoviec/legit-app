import { Link } from 'react-router-dom';
// import logo from '../../../Legited logo.svg'

export const NavbarSimple = ({isDemo}) =>{

    return(
        <div className="login-nav nav-simple">
            <Link to={!isDemo && `/main`}>
                <div className="logo">
                    {/* <img src={logo} alt="" />    */}
                </div>    
            </Link>
        </div>
    )
    
}