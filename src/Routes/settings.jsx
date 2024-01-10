import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../components/supabaseClient';
import FileUploadForm from '../components/FileUploadForm'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';


export const Settings = () =>{


    const updateAvatarSuccess = (nickname) => toast.success(`Pomyślnie zaktualizowano avatar`, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });

    const updateAvatarFailed = (data) => toast.error(`${data}`, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });

    const updateDataSuccess = (nickname) => toast.success(`Pomyślnie zaktualizowano profil`, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });

    
    const updateFailed = (data) => toast.error(`${data}`, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
        

    const API = process.env.REACT_APP_API


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


    const [formData, setFormData] = useState({
        nickname: '',
        description: '',
        email: '',
        newPassword: '',
        confirmPassword: ''
    })



    const getUserDataFromDB = async()=>{

        try{
            const { data: { user } } = await supabase.auth.getUser()
            setUserData(user)
            const publicUserResponse = await fetch(`${API}/secret/${user?.id}`);
            const publicUserData = await publicUserResponse.json();
            console.log(publicUserData[0])
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

    // const updateNicknameCheck = async ()=>{

    //     if(formData.nickname.length === 0){
    //         setErrorData((prevData) => ({
    //             ...prevData,
    //             nickname:"Niedozwolony nick"
       
    //         }));
    //     }else{
    //         try{
    //             const { data, error } = await supabase.auth.updateUser({
    //                 data: { full_name: formData.nickname }
    //             })
    //             await axios.post(`${API}/update-nickname`, {
    //                 newNickname: formData.nickname,
    //                 id: publicUser.id,
    //             });
    //         }  catch(error){
    //             console.log(error)
    //             setErrorData((prevData) => ({
    //                 ...prevData,
    //                 nickname:"Podany nick jest zajęty"
           
    //             }));
    //         }    
    //     }

    // }

    

    const updateNicknameCheck = () => {
        return new Promise(async (resolve, reject) => {
            if (formData.nickname.length === 0) {
                setErrorData((prevData) => ({
                    ...prevData,
                    nickname: "Niedozwolony nick"
                }));
                reject('Niedozwolony nick');
            } else {
               resolve(true)
               console.log('zmiana nicku zdiała')
            }
        });
    };

    const updateNickname = async ()=>{

        if(formData.nickname.length === 0){
            setErrorData((prevData) => ({
                ...prevData,
                nickname:"Niedozwolony nick"
       
            }));
        }else{
            try{
                const { data, error } = await supabase.auth.updateUser({
                    data: { full_name: formData.nickname }
                })
                await axios.post(`${API}/update-nickname`, {
                    newNickname: formData.nickname,
                    id: publicUser.id,
                });
            }  catch(error){
                console.log(error)
                setErrorData((prevData) => ({
                    ...prevData,
                    nickname:"Podany nick jest zajęty"
           
                }));
            }    
        }

    }
    
    // // Wywołanie funkcji updateNicknameCheck z użyciem Promise
    // updateNicknameCheck()
    //     .then(() => {
    //         // Obsługa sukcesu (resolve)
    //         console.log('Operacja zakończona sukcesem');
    //     })
    //     .catch((error) => {
    //         // Obsługa błędu (reject)
    //         console.error('Wystąpił błąd:', error);
    //     });
    



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
                resolve(true)
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



    const handleInputChange = (e) => {
        setIsSaved(false)
        setUpdateSettingsError()
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: name !== 'description' ? value.replace(/\s+/g, '') : value
        }))
        setErrorData((prevData) => ({
            ...prevData,
            [name]:''
        }));
        console.log(formData)
      };

    const handleSubmit = async (e) =>{



        try{
            const results = await Promise.all([
                checkPasswordChangeCheck(),
                updateEmailCheck(),
                updateNicknameCheck()
            ]);
            updateDescription()
            updateNickname()
            updateEmail()
            passwordChange()
            updateDataSuccess()

            console.log('wszystko')
        }catch(err){
            updateFailed(err)
            console.log(err)
        }
        

        e.preventDefault()

  
        
    }



    //Jeżeli dane użytkownika nie zostały wzięte z props, bierze je prosto z supabase
    useEffect(()=>{
        // if(!props)
        {
            getUserDataFromDB()
        }
    }, [])



    const checkPasswordChangeCheck = () => {
        return new Promise(async (resolve, reject) => {
            if (formData.newPassword.length > 0) {
                if (formData.newPassword.length >= 6) {
                    if (formData.newPassword === formData.confirmPassword) {
                        console.log('Hasła są takie same');
    
                        resolve(true)

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
                resolve(); // Jeśli nowe hasło nie zostało podane, resolve bez błędu.
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
                    <input className={`${(isSaved && !errorData.nickname) && `border-success `} nickname-input`} type="text" value={formData.nickname} name='nickname'/>
                    {/* <p>{(isSaved && !errorData.nickname) && <p className='success-card'>zapisano</p> }</p>
                    {
                        errorData.nickname && 
                        <p className="error-card">
                            {errorData.nickname}
                        </p>
                    } */}
                    <p>Opis</p>
                    <textarea className={`${(isSaved && !errorData.description) && `border-success `} nickname-input`} type="text" value={formData.description} name='description'/>
                    {/* <p>{(isSaved && !errorData.description) && <p className='success-card'>zapisano</p> }</p>
                    {
                        errorData.descriptions && 
                        <p className="error-card">
                            {errorData.descriptions}
                        </p>
                    } */}
                    <p>Email</p>
                    <input className={`${(isSaved && !errorData.email) && `border-success `} nickname-input`} type="text" value={formData.email} name='email'/>
                    {/* <p>{(isSaved && !errorData.email) && <p className='success-card'>zapisano</p> }</p>
                    {
                        errorData.email && 
                        <p className="error-card">
                            {errorData.email}
                        </p>
                    } */}
                    <p>Nowe hasło</p>
                    <input className={`${(isSaved && !errorData.newPassword) && `border-success `} nickname-input`} type="text" value={formData.newPassword} name='newPassword'/>
                    {/* <p>{(isSaved && !errorData.newPassword) && <p className='success-card'>zapisano</p> }</p> */}
                    <p>Potwierdź haslo</p>
                    <input className={`${(isSaved && !errorData.newPassword) && `border-success `} nickname-input`} type="text" value={formData.confirmPassword} name='confirmPassword'/>
                    {/* <p>{(isSaved && !errorData.newPassword) && <p className='success-card'>zapisano</p> }</p>
                    {
                        errorData.newPassword && 
                        <p className="error-card">
                            {errorData.newPassword}
                        </p>
                    } */}
                    <button className='settings-save-btn' type='submit'>zapisz</button>

                </form>
                {
                            updateSettingsError && 

                            <div className="error-card">{updateSettingsError}</div>

                        }
            </div>


            {/* <p>{publicUser?.nickname}</p> */}
            <p>{publicUser?.is_verified} </p>

            {/* <input placeholder={e.name} style={{display: idEdit == e.id ? 'block' : 'none'}}/>  */}
        </div>
    )
}