import { Link } from 'react-router-dom';
import logo from './Legited logo.svg'
import { supabase } from './components/supabaseClient';
import { useEffect, useState } from 'react';




export const Navbar = () =>{

    const logout = async()=>{
        await supabase.auth.signOut()
        window.location.reload(true);
      }




    const isLogged = JSON.parse(localStorage.getItem('sb-bpkpqswpimtoshzxozch-auth-token'));

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

            {
                isLogged ?
                (
                    <button onClick={logout} className='btn-register'>
                        Wyloguj się
                    </button>
                )
                :
                (
                    <>
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
                    
                    </>
                )

            }
            </div>
            
        </nav>
    )
}