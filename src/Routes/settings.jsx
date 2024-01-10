import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../components/supabaseClient';
import FileUploadForm from '../components/FileUploadForm'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';


export const Settings = () =>{


    const updateSuccess = (nickname) => toast.success(`Przedmiot przesłany pomyślnie do uzytkownika ${nickname}`, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
    
    const updateFailed = () => toast.error('Błąd podczas przesyłania przedmiotu', {
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


    const [formData, setFormData] = useState({
        nickname: props?.nickname,
        description: props?.description,
        email: props?.email,
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

    const updateNicknameCheck = async ()=>{

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

    const validateEmail = (email) => {
        return String(email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
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

        e.preventDefault()
        checkPasswordChange()
        updateDescription()
        updateEmail()
        updateNicknameCheck()
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
            <div className="settings-container">
                <FileUploadForm avatar={publicUser?.avatar} userID={publicUser?.id} nickname={publicUser?.nickname}/>

                <form className='change-nickname' onSubmit={handleSubmit} onChange={handleInputChange}>
                    <p>Nickname</p>
                    <input className='nickname-input' type="text" value={formData.nickname} name='nickname'/>
                    {
                        errorData.nickname && 
                        <p className="error-card">
                            {errorData.nickname}
                        </p>
                    }
                    <p>Opis</p>
                    <textarea className='nickname-input' type="text" value={formData.description} name='description'/>
                    {
                        errorData.descriptions && 
                        <p className="error-card">
                            {errorData.descriptions}
                        </p>
                    }
                    <p>Email</p>
                    <input className='nickname-input' type="text" value={formData.email} name='email'/>
                    {
                        errorData.email && 
                        <p className="error-card">
                            {errorData.email}
                        </p>
                    }
                    <p>Nowe hasło</p>
                    <input className='nickname-input' type="text" value={formData.newPassword} name='newPassword'/>
                    <p>Potwierdź haslo</p>
                    <input className='nickname-input' type="text" value={formData.confirmPassword} name='confirmPassword'/>
                    {
                        errorData.newPassword && 
                        <p className="error-card">
                            {errorData.newPassword}
                        </p>
                    }
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