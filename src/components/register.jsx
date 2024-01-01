import { useState } from "react"
import { supabase } from "./supabaseClient"
import { useNavigate, useSearchParams} from 'react-router-dom';
import * as Tabs from '@radix-ui/react-tabs';
import logo from '../Legited logo.svg'
import { Link } from 'react-router-dom';
import { useEffect } from "react";


export const Register = () =>{

    const navigate = useNavigate();

    const [isRequiredRegister, setIsRequiredRegister] = useState(false)
    const [isRequiredLogin, setIsRequiredLogin] = useState(false)

    const [searchParams, setSearchParams] = useSearchParams({activeTab: " "})

    const [activeTab, setActiveTab] = useState('')
    const [loginError, setLoginError] = useState()



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


    console.log('aktiw', activeTab)


    console.log( searchParams.get("activeTab"))
    
    const [formData, setFormData] = useState(
        {
            fullname: '',
            registerEmail: '',
            registerPassword: '',
            loginEmail: '',
            loginPassword: ''
        }
    )

    const handlexd = () =>{
        console.log('elo dupa')
    }
    console.log(formData)


    // Tutaj to normalnie ma byc pierowotnie
    const handleSubmitRegister = async (e) =>{

        // e.preventDefault()
        try{
            const { data, error } = await supabase.auth.signUp(
                {
                email: formData.registerEmail,
                password: formData.registerPassword,
                options: {
                    data: {
                    full_name: formData.fullname,
    
                }}}
            )
            if(!error)navigate('/settings');

            if (error) throw error
        }  catch(error){

            if(formData.registerPassword.length < 6){
                setLoginError('Hasło powinno zawierać przynajmniej 6 znaków')
            }
            else if(error.message === 'Unable to validate email address: invalid format'){
                setLoginError("Wpisz poprawny adres e-mail")
            }
            else{
                setLoginError('Spróbuj ponownie później')
            }
            console.log(error.message)
        }

    }


    const handleSubmitLogin = async (e) =>{

        // e.preventDefault()
        try{
            const { data, error } = await supabase.auth.signInWithPassword({
                email: formData.loginEmail,
                password: formData.loginPassword,
              })




            if(!error)navigate('/')
            if (error) throw error
        }  catch(error){
            // alert(error.name)
            // setLoginError('Zły adres email')
            console.log(error.message)

            if(error.message === 'Invalid login credentials'){
                setLoginError('Złe dane logowania')
            }
            else{
                setLoginError('Spróbuj ponownie później')
            }
        }
    }


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value.replace(/\s+/g, '')
        }));
    
        console.log(formData)
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
            console.log('ee brakuje kurwo')
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
            <div className="login-nav">
                <Link to='/main'>
                    <div className="logo">
                        <img src={logo} alt="" />   
                    </div>    
                </Link>

            </div>

        
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
                        By signing up, you agree you've read and accepted our <a className="terms-link" href="">Terms and Conditions.</a>  Please see our <a className="terms-link" href="">Privacy Policy</a>  for information on how we process your data.
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

                            <button type="submit">Zaloguj się</button>
                            <p className="terms">
                                By logging in, you agree to the
                                    <a className="terms-link" href=""> Terms of Service </a>
                                and 
                                    <a className="terms-link" href=""> Privacy Policy </a> 
                            </p>
                
                        </form>
                        <p className="login-form-footer-text">Nie masz konta? <span className="login-switch-tab" onClick={switchQueryParams}>Zarejestruj się</span></p>
                    </Tabs.Content>
            </Tabs.Root>

        </div>

        </>

    )
}