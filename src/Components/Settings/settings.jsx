import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import FileUploadForm from './FileUploadForm'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useSession, useUser } from '../../Context/Context';


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


    const user = useUser()
    const session = useSession()


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


    const availableNicknameCheck = async (nickname) =>{
        
        console.log(nickname)

        const response = await fetch(`${API}/search-user?nickname=${nickname}`);
        const data = await response.json()
        console.log('xdd', data[0])
        return data[0]

    }


    const getUserDataFromDB = async()=>{

        try{
            const { data: { user } } = await supabase.auth.getUser()
            const { data: {session}, error } = await supabase.auth.getSession()
            setJwt(session)
            setUserData(user)
            const publicUserResponse = await fetch(`${API}/secret/${user.id}`, {
                method: 'GET',
                headers: {
                  'jwt': session.access_token,
                }
              })
            const publicUserData = await publicUserResponse.json();
            setPublicUser(publicUserData[0])
            setFormData((prevData) => ({
                ...prevData,
                nickname: publicUserData[0].nickname,
                email: publicUserData[0].email,
                description: publicUserData[0].description
              }));
            setNickname(publicUserData[0].nickname)
        }catch(error){
            console.log(error)
        }
    }

    const updateNicknameCheck = async (e) => {


        return new Promise(async (resolve, reject) => {
    
                if (formData.nickname.length === 0) {
                    setErrorData((prevData) => ({
                        ...prevData,
                        nickname: "Niedozwolony nick"
                    }));
                    reject('Niedozwolony nick');
                }         

                else {
                   resolve('Success')
                   console.log('zmiana nicku zdiała')
                }
        });

    };

    const updateNickname = async ()=>{

                const { data, error } = await supabase.auth.updateUser({
                    data: { full_name: formData.nickname }
                })
                await axios.post(`${API}/update-nickname`, {
                    newNickname: formData.nickname,
                    id: publicUser.id,
                });
               
                if(error){
                    console.log(error)
                }
    }

    const validateEmail = (email) => {
        return String(email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
      };

    const updateEmailCheck = () => {
        return new Promise(async (resolve, reject) => {
            if (validateEmail(formData.email)) {
                resolve('Success')
                console.log('email ok')
            } else {
                setErrorData((prevData) => ({
                    ...prevData,
                    email: "Wpisz poprawny adres email"
                }));
                reject('Nieprawidłowy adres email');
            }
        });
    };

    const updateEmail = async()=>{

        if(validateEmail(formData.email)){
            try{
                const { data, error } = await supabase.auth.updateUser({
                    email: formData.email
                })
    
            }catch(error){
                console.log(error)
                setErrorData((prevData) => ({
                    ...prevData,
                    email:"Wpisz poprawny adres email"
           
                }));
            }
        }else{
            setErrorData((prevData) => ({
                ...prevData,
                email:"Wpisz poprawny adres email"
       
            }));
        }
    }
    
    const updateDescription = async()=>{
        try{
            await axios.post(`${API}/update-description`, {
                newDescription: formData.description,
                id: publicUser.id,
            });


        }  catch(error){
            setErrorData((prevData) => ({
                ...prevData,
                nickname:"Wystąpił błąd"
       
            }));
            console.log(error)
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
        // if(name==='nickname'){
        //     const isAvailable = await availableNicknameCheck(value)
        //     console.log(isAvailable)
        //     console.log(publicUser)
        //     if(isAvailable && isAvailable?.id !== publicUser.id){
        //         console.log('zajęty')
        //         setIsNicknameTaken(true)
        //     }
        //     else{
        //         setIsNicknameTaken(false)
        //     }

        //     console.log("halooooooo")

        // }

        console.log(formData)
      };

    const handleSubmit = async (e) =>{

        e.preventDefault()

        const response = await fetch(`${API}/search-user?nickname=${formData.nickname}`);
        const data = await response.json()

        try{
            if(data.length !== 0 && (data[0]?.id !== publicUser.id)){
                updateFailed('Nickname zajęty')
            }
            else{
                try{
                    const results = await Promise.all([
                        checkPasswordChangeCheck(),
                        updateEmailCheck(),
                        updateNicknameCheck(e),
                    ])
                    .then((res)=>{
                        console.log(res)
                        updateDescription()
                        updateNickname()
                        updateEmail()
                        passwordChange()
                        updateDataSuccess()
                    })
                }catch(err){
                    updateFailed(err)
                }
            }

        }catch(err){
            updateFailed(err)
        }
    }


    useEffect(()=>{
            getUserDataFromDB()
    }, [])



    const checkPasswordChangeCheck = () => {
        return new Promise(async (resolve, reject) => {
            if (formData.newPassword.length > 0) {
                if (formData.newPassword.length >= 6) {
                    if (formData.newPassword === formData.confirmPassword) {
                        console.log('Hasła są takie same');
    
                        resolve('Success')

                    } else {
                        console.log('Hasła się różnią');
                        setErrorData((prevData) => ({
                            ...prevData,
                            newPassword: "Hasła nie są takie same"
                        }));
                        reject('Hasła nie są takie same');
                    }
                } else {
                    console.log("Hasło powinno mieć minimum 6 znaków");
                    setErrorData((prevData) => ({
                        ...prevData,
                        newPassword: "Hasło powinno mieć minimum 6 znaków"
                    }));
                    reject('Hasło powinno mieć minimum 6 znaków');
                }
            } else {
                resolve("Success"); // Jeśli nowe hasło nie zostało podane, resolve bez błędu.
            }
        });
    };

    const passwordChange = async () =>{


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
                    setErrorData((prevData) => ({
                        ...prevData,
                        newPassword:"Hasła nie są takie same"
               
                    }));
                }
            }
            else{
                console.log("Hasło powinno mieć minimum 6 znaków")
                setErrorData((prevData) => ({
                    ...prevData,
                    newPassword:"Hasło powinno mieć minimum 6 znaków"
           
                }));
            }
        }
        else{
            return
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
                <FileUploadForm avatar={publicUser?.avatar} userID={publicUser?.id} nickname={publicUser?.nickname} toast={updateAvatarSuccess} toastFailed={updateAvatarFailed}/>

                <form className='change-nickname' onSubmit={handleSubmit} onChange={handleInputChange}>
                    <p>Nickname</p>
                    <input className={`${(isSaved && !errorData.nickname) && `border-success `} nickname-input`} type="text" defaultValue={formData.nickname} name='nickname'/>
                
                    <p>Opis</p>
                    <textarea className={`${(isSaved && !errorData.description) && `border-success `} nickname-input`} type="text" defaultValue={formData.description} name='description'/>
               
                    <p>Email</p>
                    <input className={`${(isSaved && !errorData.email) && `border-success `} nickname-input`} type="text" defaultValue={formData.email} name='email'/>
                
                    <p>Nowe hasło</p>
                    <input className={`${(isSaved && !errorData.newPassword) && `border-success `} nickname-input`} type="text" defaultValue={formData.newPassword} name='newPassword'/>
                    <p>Potwierdź haslo</p>
                    <input className={`${(isSaved && !errorData.newPassword) && `border-success `} nickname-input`} type="text" defaultValue={formData.confirmPassword} name='confirmPassword'/>
                  
                    <button className='settings-save-btn' type='submit'>zapisz</button>

                </form>
                {
                            updateSettingsError && 

                            <div className="error-card">{updateSettingsError}</div>

                        }
            </div>


            <p>{publicUser?.is_verified} </p>

        </div>
    )
}