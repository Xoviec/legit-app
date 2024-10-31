import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import FileUploadForm from './FileUploadForm'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { UserSessionContext,UserSessionUpdateContext, useSession, useUser, useUserData } from '../../Context/Context';
import { useContext } from 'react';


export const Settings = () =>{

    const toastData = {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light"
    }

    const updateAvatarSuccess = (nickname) => toast.success(`Pomyślnie zaktualizowano avatar`, {
        ...toastData,
        });

    const updateAvatarFailed = (data) => toast.error(`${data}`, {
        ...toastData,
        });

    const updateDataSuccess = (nickname) => toast.success(`Pomyślnie zaktualizowano profil`, {
        ...toastData,
        });

    
    const updateFailed = (data) => toast.error(`${data}`, {
        ...toastData,
        });
        

    const API = import.meta.env.VITE_API


    // const user = useUser()
    const user = useUserData()
    const session = useSession()
    const {handleSetUserData} = useContext(UserSessionUpdateContext)

    const location = useLocation();
    const props = location.state;

    const [userData, setUserData] = useState(props)
    const [publicUser, setPublicUser] = useState(props)
    const [nickname, setNickname] = useState(props?.nickname)
    const [email, setEmail] = useState(userData?.email)
    const [errorData, setErrorData] = useState({
        nickname: '',
        description: '',
        email: '',
        newPassword:''
    })
    const [updateSettingsError, setUpdateSettingsError] = useState()
    const [isSaved, setIsSaved] = useState(false)
    const [isNicknameTaken, setIsNicknameTaken] = useState(false)
    const[jwt, setJwt] = useState()


    const [formData, setFormData] = useState({
        nickname: '',
        description: '',
        email: '',
        newPassword: '',
        confirmPassword: ''
    })


    useEffect(()=>{
        const newFormData = {
            ...formData,
            nickname: userData?.nickname,
            email: userData?.email,
            description: userData?.description
        }
        setFormData(newFormData)
    }, [userData])

    const updateNickname = async ()=>{
        try{
            const nicknameData = await axios.put(`http://localhost:3030/updateNickname/${userData.userId}`, {
                nickname: formData.nickname,
            });
            const descriptionData = await axios.put(`http://localhost:3030/updateDescription/${userData.userId}`, {
                description: formData.description,
            });
            const newData = {...userData, nickname: nicknameData.data.newNickname, description: descriptionData.data.newDescription}
            handleSetUserData(newData)
        }catch(err){
            console.log(err)
            setUpdateSettingsError(err.response.data.error)
        }
    }

    const handleInputChange = async (e) => {
        setIsSaved(false)
        setUpdateSettingsError()
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: name !== 'description' ? value.replace(/\s+/g, '') : value
        }))
      };
    const handleSubmit = async (e) =>{
        e.preventDefault()
        if(formData.nickname.length>=3){
            updateNickname()
            setUpdateSettingsError()
        }
        else{
            setUpdateSettingsError("Nick musi mieć przynajmniej 3 znaki")
        }
    }

    const handleDeleteAccount = async () =>{

        try{
            const deletion = axios.delete(`http://localhost:3030/deleteAccount/${user.userId}`)
            handleSetUserData("")
        }catch(err){
            console.log(err)
        }



    }


    return(
        <div className='settings'>
            
            <h1>Ustawienia</h1>
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />  
            <div className="settings-container">
                <form className='change-nickname' onSubmit={handleSubmit} onChange={handleInputChange}>
                    <p>Nickname</p>
                    <input className={`${(isSaved && !errorData.nickname) && `border-success `} nickname-input`} type="text" defaultValue={formData.nickname} name='nickname'/>
                
                    <p>Opis</p>
                    <textarea className={`${(isSaved && !errorData.description) && `border-success `} nickname-input`} type="text" defaultValue={formData.description} name='description'/>
                    <button className='settings-save-btn' type='submit'>zapisz</button>
                </form>
                <button onClick={handleDeleteAccount}>Usuń konto</button>

                {
                            updateSettingsError && 

                            <div className="error-card">{updateSettingsError}</div>

                        }
            </div>


            <p>{publicUser?.is_verified} </p>

        </div>
    )
}