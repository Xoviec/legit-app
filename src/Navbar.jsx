import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from './Legited logo.svg'
import { supabase } from './components/supabaseClient';
import { useEffect, useState } from 'react';
import { CommentsAvatar } from './shared/commentsAvatar';




export const Navbar = () =>{

    const location = useLocation();
    const navigate = useNavigate();

    const API = process.env.REACT_APP_API

    const [foundUsers, setFoundUsers] = useState()

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


// const handleRegisterChange = (e) =>{
//     //zmiana state do szukania usera
//         if(e.target.name==='ownerHistory'){
//         console.log(e.target.value)
//         setOwnerId(e.target.value)
//         handleUpdateFoundUsers(e.target.value)
//         handleUpdateFoundItems()
//         }
//         //zmiana state do szukania itemu 
//         else{
//         setOgItemIdVal(e.target.value)
//         handleUpdateFoundItems(e.target.value)
//         handleUpdateFoundUsers()
//         }
//     }




    const isLogged = JSON.parse(localStorage.getItem('sb-bpkpqswpimtoshzxozch-auth-token'));

    return(
        <nav>
            <Link to='/main'>
                <div className="logo">
                    <img src={logo} alt="legited-logo" />   
                </div>
            </Link>

            
            <div placeholder='Szukaj uzytkownika' className="search-bar">
                <input onChange={((e)=>handleUpdateFoundUsers(e.target.value))} type="text" placeholder='Szukaj uzytkownika'/>
                {
            foundUsers?.length > 0 && (
                <div className="pre-list">
                <div className="found-users">
                    {foundUsers.map((user) => (
                    <Link to={`/Users/${user.nickname}`}>
                        <div className='found-user' key={user.id}>
                            <CommentsAvatar avatar={user.avatar} nickname={user.nickname}/>
                            <p>{user.nickname}</p>
                            {/* <p>ID: {item.id}</p> */}
                            {/* <button onClick={() => handleSetFoundItem(item)}>Wybierz</button> */}
                        </div>

                    </Link>
   
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
            
        </nav>
    )
}