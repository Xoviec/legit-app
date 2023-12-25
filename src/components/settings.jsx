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
    const [email, setEmail] = useState(userData?.email)

    const [formData, setFormData] = useState({
        nickname: props?.nickname,
        email: props?.email,
        newPassword: '',
        confirmPassword: ''
    })



    const getUserDataFromDB = async()=>{
        const { data: { user } } = await supabase.auth.getUser()
        setUserData(user)
        const publicUserResponse = await fetch(`${API}/secret/${user.id}`);
        const publicUserData = await publicUserResponse.json();
        console.log(publicUserData[0])
        setPublicUser(publicUserData[0])
        setNickname(publicUserData[0].nickname)
    }

    // const handleChange = (e) =>{
    //     setNickname(e.target.value)
    // }


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value.replace(/\s+/g, '')
        }));
    
        console.log(formData)
      };

    const handleSubmit = async (e) =>{

        e.preventDefault()

        try{
            const { data, error } = await supabase.auth.updateUser({
                email: formData.email
            })

        }catch(error){
            console.log(error)
        }


        try{
            const { data, error } = await supabase.auth.updateUser({
                data: { full_name: formData.nickname }
            })
            await axios.post(`${API}/update-nickname`, {
                newNickname: formData.nickname,
                id: publicUser.id,
            });

            checkPasswordChange()

            if (error) throw error
            // alert(error)
        }  catch(error){
            console.log(error)
        }
    }



    //Jeżeli dane użytkownika nie zostały wzięte z props, bierze je prosto z supabase
    useEffect(()=>{
        if(!props){
            getUserDataFromDB()
        }
  
    }, [])


    const checkPasswordChange = async () =>{
        if(formData.newPassword.length>0){
            if(formData.newPassword.length>=6){
                if(formData.newPassword === formData.confirmPassword){
                    console.log('hasła są takie same')


                    const { data, error } = await supabase.auth.updateUser({
                        password: formData.newPassword
                    })

                }
                else{
                    console.log('hasła sie róznią')
                }
            }
            else{
                console.log("Hasło powinno mieć minimum 6 znaków")
            }
        }
        else{
            return
        }
    }

    return(
        <div className='settings'>
            
            <h1>Ustawienia</h1>
            <div className="settings-container">
                <FileUploadForm avatar={publicUser?.avatar} userID={publicUser?.id} nickname={publicUser?.nickname}/>

                <form className='change-nickname' onSubmit={handleSubmit} onChange={handleInputChange}>
                    <p>Aktualny nickname</p>
                    <input className='nickname-input' type="text" value={formData.nickname} name='nickname'/>
                    <p>Email</p>
                    <input className='nickname-input' type="text" value={formData.email} name='email'/>
                    <p>Nowe hasło</p>
                    <input className='nickname-input' type="text" value={formData.newPassword} name='newPassword'/>
                    <p>Potwierdź haslo</p>
                    <input className='nickname-input' type="text" value={formData.confirmPassword} name='confirmPassword'/>
                    
                    <button className='settings-save-btn' type='submit'>zapisz</button>

                </form>
            </div>


            {/* <p>{publicUser?.nickname}</p> */}
            <p>{publicUser?.is_verified} </p>

            {/* <input placeholder={e.name} style={{display: idEdit == e.id ? 'block' : 'none'}}/>  */}
        </div>
    )
}