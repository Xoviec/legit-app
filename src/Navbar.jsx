import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from './Legited logo.svg'
import monogram from './monogram.svg'
import { supabase } from './components/supabaseClient';
import { useEffect, useState } from 'react';
import { CommentsAvatar } from './shared/commentsAvatar';




export const Navbar = () =>{

    const location = useLocation();
    const navigate = useNavigate();

    const API = process.env.REACT_APP_API

    const [foundUsers, setFoundUsers] = useState()
    const [isNavActive, setIsNavActive] = useState(false)

    const logout = async()=>{
        await supabase.auth.signOut()
        window.location.reload(true);
      }


    const handleUpdateFoundUsers = async (nickname) =>{
        const response = await fetch(`${API}/search-users?letters=${nickname}`);
        const data = await response.json();

        console.log(data)
        setFoundUsers(data)

        try{

        }catch(err){
            console.log(err)
        }
    }

    const changeUserPage = (userProfile) =>{

        setIsNavActive(false)
        handleUpdateFoundUsers('')
        navigate(`/Users/${userProfile}`, { replace: false })


    }

    const isLogged = JSON.parse(localStorage.getItem('sb-bpkpqswpimtoshzxozch-auth-token'));

    return(
        <nav>
            <Link to='/main'>
                <div className="logo">
                    <img src={logo} alt="legited-logo" />   
                    <img src={monogram} alt="legited-logo" className='monogram' />   
                </div>
            </Link>
            <button onClick={() => setIsNavActive(prev => !prev)} className='burger'>
                <span></span>
                <span></span>
                <span></span>
            </button>

            <div className={`nav-links ${isNavActive ? `` : `disabled`}`}>
                <div placeholder='Szukaj uzytkownika' className="search-bar">
                    <input onChange={((e)=>handleUpdateFoundUsers(e.target.value))} type="text" placeholder='Szukaj uzytkownika'/>
                    {
                foundUsers?.length > 0 && (
                    <div className="pre-list">
                    <div className="found-users">
                        {foundUsers.map((user) => (
                        // <Link to={`/Users/${user.nickname}`}>
                            <button onClick={(()=>changeUserPage(user.nickname))} className='found-user' key={user.id}>
                                <CommentsAvatar avatar={user.avatar} nickname={user.nickname}/>
                                <p>{user.nickname}</p>
                                {/* <p>ID: {item.id}</p> */}
                                {/* <button onClick={() => handleSetFoundItem(item)}>Wybierz</button> */}
                            </button>

                        // </Link>
    
                        ))}
                    </div>
                    </div>
                )
                }

                </div>

                <div className="rest">
                <Link to='/register'>
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
                            <Link to='/login?activeTab=login' replace={false}>
                                <button className='btn-login'>
                                    Zaloguj się
                                </button>
                        </Link>
                            <Link to='/login?activeTab=register'>
                                <button className='btn-register' replace={false}>
                                    Zarejestruj się
                                </button>
                            </Link>
                        
                        </>
                    )

                }
                </div>
            </div>


   
            
        </nav>
    )
}