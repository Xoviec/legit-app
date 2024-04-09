import { useState } from "react"
import { supabase } from "../../supabaseClient"
import { useNavigate, useSearchParams} from 'react-router-dom';
import * as Tabs from '@radix-ui/react-tabs';
import logo from '../../assets/Legited logo.svg'
import { Link } from 'react-router-dom';
import { useEffect } from "react";
import { NavbarSimple } from "../Layout/NavbarSimple/NavbarSimple";


export const ForgotPassword = () =>{

    const navigate = useNavigate();

    const [isRequiredRegister, setIsRequiredRegister] = useState(false)
    const [isRequiredLogin, setIsRequiredLogin] = useState(false)


    const [activeTab, setActiveTab] = useState('')
    const [loginError, setLoginError] = useState()
    const [sentLinkSuccesss, setSentLinkSuccess] = useState()




    console.log('aktiw', activeTab)


    
    const [formData, setFormData] = useState(
        {
            fullname: '',
            registerEmail: '',
            registerPassword: '',
            loginEmail: '',
            loginPassword: ''
        }
    )



    // Tutaj to normalnie ma byc pierowotnie
    const handleSubmitRegister = async (e) =>{

        // e.preventDefault()
        const redirectTo = 'https://legited.app/main'
        try{
            const { data, error } = await supabase.auth
                .resetPasswordForEmail(formData.registerEmail)

            
            if(!error){
                setLoginError()
                setSentLinkSuccess("Wysłano link do zresetowania hasła.")
                // setSuccess('wysłano link do zresetowania hasła')
            }

            if (error) throw error
         }  catch(error){
            if(error.message === 'Unable to validate email address: invalid format'){
                setLoginError("Wpisz poprawny adres e-mail")
            }
            else{
                setLoginError('Spróbuj ponownie później')
            }
            console.log(error.message)
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

        if(formData.registerEmail){
            setIsRequiredRegister(false)
            handleSubmitRegister()
          }
          else{
            setIsRequiredRegister(true)
          }
          e.preventDefault()
    }




   

    return(
        <>

        <div className="login-page">
            <NavbarSimple/>
            <Tabs.Root className="login-root" defaultValue="register" value='register' >
                <Tabs.List className="TabsList" aria-label="Manage your account">
                    <Tabs.Trigger className="TabsTrigger login-trigger" value="register">
                    Zresetuj hasło do konta
                    </Tabs.Trigger>
                </Tabs.List>
                    <Tabs.Content className="login-tab" value="register">
                        <form onSubmit={handleRegisterSubmit}  onChange={handleInputChange}>
                        {
                            loginError && 
                            <div className="error-card">{loginError}</div>
                        }
                        {
                            sentLinkSuccesss &&
                            <div className="success-card">{sentLinkSuccesss}</div>
                        }
                            <div className="input-title">
                                <p>Adres e-mail</p>
                                <p className={`required-alert ${isRequiredRegister ? `${formData.registerEmail ? `hidden`: ``}` : `hidden`}`}>This field is required</p>
                            </div>
                            <input type="text" placeholder="user@legited.app" name="registerEmail" value={formData.registerEmail}/>

                            <button type="submit">Wyślij link resetujący</button>
                        </form>
                    </Tabs.Content>
            </Tabs.Root>

        </div>

        </>

    )
}