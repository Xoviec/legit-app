import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../../assets/logo-legited.png'
import monogram from '../../../assets/monogram-legited.png'
import { supabase } from '../../../supabaseClient';
import { useEffect, useState } from 'react';
import { CommentsAvatar } from '../../../Shared/Avatar/commentsAvatar';
import { useRef } from 'react';
import { useAdmin } from '../../../Context/Context';
import { useUserData,UserSessionUpdateContext } from '../../../Context/Context';
import { useContext } from 'react';


export const Navbar = () =>{

    const location = useLocation();
    const navigate = useNavigate();
    const admin = useAdmin()
    const userData = useUserData()
    const {handleSetUserData} = useContext(UserSessionUpdateContext)

    const API = import.meta.env.VITE_API

    const [foundUsers, setFoundUsers] = useState()
    const [isNavActive, setIsNavActive] = useState(false)

    const searchRef = useRef();

    const logout = async()=>{
        handleSetUserData("")
        window.location.reload(true);
      }
    const handleUpdateFoundUsers = async (nickname) =>{
        const response = await fetch(`http://localhost:3030/searchUser/${nickname}`);
        const data = await response.json();

        setFoundUsers(data.users)

        try{

        }catch(err){
            console.log(err)
        }
    }

    const changeUserPage = (userProfile) =>{

        setIsNavActive(false)
        handleUpdateFoundUsers('')
        navigate(`/Users/${userProfile}`
        );
        searchRef.current.value = ''
    }

    return(
        <nav>
            <Link to='/'>
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
                    <input ref={searchRef} onChange={((e)=>handleUpdateFoundUsers(e.target.value))} type="text" placeholder='Szukaj uzytkownika'/>
                    {
                foundUsers?.length > 0 && (
                    <div className="pre-list">
                    <div className="found-users">
                        {searchRef.current.value.length > 0 && foundUsers.map((user) => (
                            <button onClick={(()=>changeUserPage(user.nickname))} className='found-user' key={user.id}>
                                <CommentsAvatar avatar={user.avatar} nickname={user.nickname}/>
                                <p>{user.nickname}</p>
                            </button>
                        ))}
                    </div>
                    </div>
                )
                }

                </div>

                <div className="rest">
             
                {
                    userData ?
                    (
                        <>
                        {
                            userData.accountType === "admin" && 
                            <Link to='/adminpanel'>
                                <button className='btn-admin'>
                                    Admin panel
                                </button>
                            </Link>
                        }
                        <button onClick={logout} className='btn-register'>
                            Wyloguj się
                        </button>
                        </>
                        
                    )
                    :
                    (
                        <>
                            <Link to='/login?activeTab=login'
                             >
                                <button className='btn-login'>
                                    Zaloguj się
                                </button>
                        </Link>
                            <Link to='/login?activeTab=register'>
                                <button className='btn-register'
                                //  replace={false}
                                 >
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