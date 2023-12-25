import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import FileUploadForm from './FileUploadForm'
import axios from 'axios';


export const Settings = () =>{

    const API = process.env.REACT_APP_API


    const location = useLocation();
    const props = location.state;

    const [userData, setUserData] = useState(props)
    const [publicUser, setPublicUser] = useState(props)
    const [nickname, setNickname] = useState(props?.nickname)

    console.log(userData)



    const getUserDataFromDB = async()=>{
        const { data: { user } } = await supabase.auth.getUser()
        setUserData(user)
        const publicUserResponse = await fetch(`${API}/secret/${user.id}`);
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


        try{
            
            const { data, error } = await supabase.auth.updateUser({
                data: { full_name: nickname }
            })
            await axios.post(`${API}/update-nickname`, {
                newNickname: nickname,
                id: publicUser.id,
            });
            if (error) throw error
            // alert(error)
        }  catch(error){
            console.log(error)
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
        <div className='settings'>
            
            <h1>Ustawienia</h1>

            <form onSubmit={handleSubmit} onChange={handleChange}>
                <p>Aktualny nickname</p>
                <input type="text" value={nickname}/>
                <button type='submit'>zapisz</button>
            </form>
            <FileUploadForm avatar={publicUser?.avatar} userID={publicUser?.id} nickname={publicUser?.nickname}/>
            <p>{publicUser?.email}</p>
            {/* <p>{publicUser?.nickname}</p> */}
            <p>{publicUser?.is_verified} </p>

            {/* <input placeholder={e.name} style={{display: idEdit == e.id ? 'block' : 'none'}}/>  */}
        </div>
    )
}