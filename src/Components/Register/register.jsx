import { useState } from "react"
import { supabase } from "../../supabaseClient"
import { useNavigate, useSearchParams} from 'react-router-dom';
import * as Tabs from '@radix-ui/react-tabs';
import logo from '../../assets/Legited logo.svg'
import { Link } from 'react-router-dom';
import { useEffect } from "react";
import { NavbarSimple } from "../Layout/NavbarSimple/NavbarSimple";
import { useMutation } from '@tanstack/react-query';
import { useContext } from "react";
import axios from 'axios';
import {UserSessionUpdateContext, useUserData } from "../../Context/Context";

export const Register = () =>{

    const navigate = useNavigate();

    const [isRequiredRegister, setIsRequiredRegister] = useState(false)
    const [isRequiredLogin, setIsRequiredLogin] = useState(false)

    const [searchParams, setSearchParams] = useSearchParams({activeTab: " "})

    const [activeTab, setActiveTab] = useState('')
    const [loginError, setLoginError] = useState()

    const userData = useUserData()
    const {handleSetUserData} = useContext(UserSessionUpdateContext)

    useEffect(()=>{
        if(searchParams.get("activeTab")==='login'){
            setActiveTab('login')
        }
        else if(searchParams.get("activeTab")==='register'){
            setActiveTab('register')
        }
 
        else{
            setActiveTab('register')
        }

    }, [])

    const [formData, setFormData] = useState(
        {
            fullname: '',
            registerEmail: '',
            registerPassword: '',
            loginEmail: '',
            loginPassword: ''
        }
    )

    const addItem = async (userData) => {
        await axios.post('http://localhost:3000/register', userData);
      };
      
      const addItemMutation = useMutation({
        mutationFn: addItem,
        onSuccess: (data, variable, context) => {
          itemRegisterSuccess(variable.nickname); 
          queryClient.invalidateQueries({
            queryKey: ['items'],
          });
        },
        onError: (err) => {
          console.log(err);
        },
      });

      const handleSubmitRegister = async (e) => {
        try {
          const response = await axios.post('http://localhost:3030/register', {
            email: formData.registerEmail,
            password: formData.registerPassword,
            nickname: formData.fullname,
          });
    
          if (response.status === 201) {
            handleSetUserData(response.data.data)
            setActiveTab('login')
          }
        } catch (error) {
          console.log(error);
        }
      };

    const handleSubmitLogin = async (e) => {
        try {
            const response = await axios.post('http://localhost:3030/login', {
                email: formData.loginEmail,
                password: formData.loginPassword
            });
    
            if (response.status === 200) {
                handleSetUserData(response.data.userData)
                navigate('/main', { replace: true });
            }
        } catch (error) {
            if (error.response && error.response.data.error.includes('email')) {
                setLoginError('Nieprawidłowy email lub hasło.');
            } else {
                setLoginError('Wystąpił błąd. Spróbuj ponownie później.');
            }
    
            console.log(error.message);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value.replace(/\s+/g, '')
        }));
      };

      const handleRegisterSubmit = (e) =>{

        if(formData.fullname && formData.registerEmail && formData.registerPassword){
            setIsRequiredRegister(false)
            handleSubmitRegister()
          }
          else{
            setIsRequiredRegister(true)
          }
          e.preventDefault()
    }

    const handleLoginSubmit = (e) =>{

        if(formData.loginEmail && formData.loginPassword){
            setIsRequiredLogin(false)
            handleSubmitLogin()
          }
          else{
            setIsRequiredLogin(true)
          }
          e.preventDefault()
    }

    const switchQueryParams = () => {
        setLoginError()
        switch(activeTab){
            case 'login':
                setActiveTab('register')
                searchParams.set("activeTab", 'register')
                setSearchParams(searchParams, {replace: true})
                break
            case 'register':
                setActiveTab('login')
                searchParams.set("activeTab", 'login')
                setSearchParams(searchParams, {replace: true})
                break;
        }
      };

    return(
        <>
        <div className="login-page">
            <NavbarSimple/>
            <Tabs.Root className="login-root" defaultValue="login" value={activeTab} onValueChange={switchQueryParams} >
                <Tabs.List className="TabsList" aria-label="Manage your account">
                    <Tabs.Trigger className="TabsTrigger login-trigger" value="register">
                    Rejestracja
                    </Tabs.Trigger>
                    <Tabs.Trigger className="TabsTrigger login-trigger" value="login">
                    Logowanie 
                    </Tabs.Trigger>
                </Tabs.List>
                    <Tabs.Content className="login-tab" value="register">
                        <form onSubmit={handleRegisterSubmit}  onChange={handleInputChange}>
                        {
                            loginError && 

                            <div className="error-card">{loginError}</div>

                        }
                            <div className="input-title">
                                <p>Nickname</p>
                                <p className={`required-alert ${isRequiredRegister ? `${formData.fullname ? `hidden`: ``}` : `hidden`}`}>This field is required</p>
                            </div>
                            <input type="text" placeholder="Cinal007" name="fullname" value={formData.fullname}/>
                            <div className="input-title">
                                <p>Email</p>
                                <p className={`required-alert ${isRequiredRegister ? `${formData.registerEmail ? `hidden`: ``}` : `hidden`}`}>This field is required</p>
                            </div>
                            <input type="text" placeholder="wujek@rada.scpl" name="registerEmail" value={formData.registerEmail}/>
                            <div className="input-title">
                                <p>Password</p>
                                <p className={`required-alert ${isRequiredRegister ? `${formData.registerPassword ? `hidden`: ``}` : `hidden`}`}>This field is required</p>
                            </div>
                            <input type="password" placeholder="########" name="registerPassword" value={formData.registerPassword}/>
                            <button type="submit">Zarejestruj się</button>
                            <p className="terms">
                        Rejestrując się, potwierdzasz przeczyatnie i akceptację <a className="terms-link" href="/terms">Regulamin serwisu.</a>  Przeczytaj <a className="terms-link" href="/privacy">Politykę prywatności </a>aby dowiedzieć się w jaki sposób przetwarzamy Twoje dane.
                        </p>
                
                        </form>
                        <p className="login-form-footer-text">Masz juz konto? <span className="login-switch-tab" onClick={switchQueryParams}>Zaloguj się</span></p>

                    </Tabs.Content>
                    <Tabs.Content className="login-tab" value="login">
                    <form onSubmit={handleLoginSubmit}  onChange={handleInputChange}>

                    {
                        loginError && 

                        <div className="error-card">{loginError}</div>

                    }
                    <div className="input-title">
                                <p>Email</p>
                                <p className={`required-alert ${isRequiredLogin ? `${formData.loginEmail ? `hidden`: ``}` : `hidden`}`}>This field is required</p>
                            </div>
                            <input type="text" placeholder="wujek@rada.scpl" name="loginEmail" value={formData.loginEmail}/>
                            <div className="input-title">
                                <p>Password</p>
                                <p className={`required-alert ${isRequiredLogin ? `${formData.loginPassword ? `hidden`: ``}` : `hidden`}`}>This field is required</p>
                            </div>
                            <input type="password" placeholder="########" name="loginPassword" value={formData.loginPassword}/>
                            <Link className="forgot-password-button" to='/forgot-password'>
                                <button type="button" className="forgot-password-button">Nie pamiętasz hasła?</button>
                            </Link>
                            <button type="submit">Zaloguj się</button>
                            <p className="terms">
                                Logując się akceptujesz
                                    <a className="terms-link" href="/terms"> Regulamin Serwisu </a>
                                oraz 
                                    <a className="terms-link" href="/privacy"> Politykę Prywatności. </a> 
                            </p>
                        </form>
                        <p className="login-form-footer-text">Nie masz konta? <span className="login-switch-tab" onClick={switchQueryParams}>Zarejestruj się</span></p>
                    </Tabs.Content>
            </Tabs.Root>

        </div>

        </>

    )
}