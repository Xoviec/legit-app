import { useState } from "react"
import { supabase } from "./supabaseClient"
import { useNavigate, useSearchParams} from 'react-router-dom';
import FileUploadForm from "./UploadFileForm";
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



    useEffect(()=>{
        if(searchParams.get("activeTab")==='login'){
            // console.log('xd')
            setActiveTab('login')
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

    // const handleChange = (event) =>{
    //     setFormData((prevFormData)=>{
    //         return{
    //             ...prevFormData,
    //             [event.target.name]:event.target.value
    //         }
    //     })
    // }

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
            if(!error)navigate('/');

            if (error) throw error
            // alert(error)
        }  catch(error){
            alert(error)
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
            alert('udao sie')
        }  catch(error){
            alert(error)
        }
    }


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value
        }));
    
        console.log(formData)
      };

      const handleRegisterSubmit = (e) =>{

        if(formData.fullname && formData.registerEmail && formData.registerPassword){
            setIsRequiredRegister(false)
            handleSubmitRegister()
            console.log('essa działa')
          }
          else{
            setIsRequiredRegister(true)
            console.log('ee brakuje kurwo')
          }
          e.preventDefault()
    }

    const handleLoginSubmit = (e) =>{

        if(formData.loginEmail && formData.loginPassword){
            setIsRequiredLogin(false)
            handleSubmitLogin()
            console.log('essa działa')
          }
          else{
            setIsRequiredLogin(true)
            console.log('ee brakuje kurwo')
          }
          e.preventDefault()
    }


    const removeQueryParams = () => {
        const param = searchParams.get('activeTab');
    
        if (param) {
          searchParams.delete('activeTab');
    
          setSearchParams(searchParams);
          setActiveTab()
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

            {/* <FileUploadForm/> */}
        
            <Tabs.Root className="login-root" defaultValue="login" value={activeTab} onValueChange={removeQueryParams} >
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
                            <input type="text" placeholder="########" name="registerPassword" value={formData.registerPassword}/>

                            <button type="submit">Zarejestruj się</button>
                            <p className="terms">
                        By signing up, you agree you've read and accepted our <a className="terms-link" href="">Terms and Conditions.</a>  Please see our <a className="terms-link" href="">Privacy Policy</a>  for information on how we process your data.
                        </p>
                
                        </form>
                    
                    </Tabs.Content>
                    <Tabs.Content className="login-tab" value="login">
                    <form onSubmit={handleLoginSubmit}  onChange={handleInputChange}>

                    <div className="input-title">
                                <p>Email</p>
                                <p className={`required-alert ${isRequiredLogin ? `${formData.loginEmail ? `hidden`: ``}` : `hidden`}`}>This field is required</p>
                            </div>
                            <input type="text" placeholder="wujek@rada.scpl" name="loginEmail" value={formData.loginEmail}/>
                            <div className="input-title">
                                <p>Password</p>
                                <p className={`required-alert ${isRequiredLogin ? `${formData.loginPassword ? `hidden`: ``}` : `hidden`}`}>This field is required</p>
                            </div>
                            <input type="text" placeholder="########" name="loginPassword" value={formData.loginPassword}/>

                            <button type="submit">Zaloguj się</button>
                            <p className="terms">
                                By logging in, you agree to the
                                    <a className="terms-link" href=""> Terms of Service </a>
                                and 
                                    <a className="terms-link" href=""> Privacy Policy </a> 
                            </p>
                
                        </form>
                        {/* <p>Already have and account?</p> */}
                    </Tabs.Content>
            </Tabs.Root>

        </div>

        </>

    )
}