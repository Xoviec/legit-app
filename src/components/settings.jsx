import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import axios from 'axios';


export const Settings = () =>{


    const location = useLocation();
    const props = location.state;

    const [userData, setUserData] = useState(props)
    const [publicUser, setPublicUser] = useState(props)
    const [nickname, setNickname] = useState(props?.nickname)

    console.log(userData)



    const getUserDataFromDB = async()=>{
        const { data: { user } } = await supabase.auth.getUser()
        setUserData(user)
        const publicUserResponse = await fetch(`http://localhost:8000/secret/${user.id}`);
        const publicUserData = await publicUserResponse.json();
        console.log(publicUserData[0])
        setPublicUser(publicUserData[0])
        setNickname(publicUserData[0].nickname)

    }

    const handleChange = (e) =>{
        setNickname(e.target.value)
    }

    const handleSubmit = async (e) =>{
        e.preventDefault()

        console.log(nickname)
        console.log(publicUser.id)
        try{
            await axios.post('http://localhost:8000/update-nickname', {
                newNickname: nickname,
              id: publicUser.id,
            });
          }catch(err){
            console.log(err)
          }
    }

    console.log(nickname)


    //Jeżeli dane użytkownika nie zostały wzięte z props, bierze je prosto z supabase
    useEffect(()=>{
        if(!props){
            getUserDataFromDB()
        }
  
    }, [])


    return(
        <div>
            <p>{publicUser?.id}</p>
            <p>{publicUser?.email}</p>
            {/* <p>{publicUser?.nickname}</p> */}
            <p>{publicUser?.is_verified} </p>
            <form onSubmit={handleSubmit} onChange={handleChange}>
                <input type="text" value={nickname}/>
                <button type='submit'>zapisz</button>
            </form>
            {/* <input placeholder={e.name} style={{display: idEdit == e.id ? 'block' : 'none'}}/>  */}
        </div>
    )
}