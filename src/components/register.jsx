import { useState } from "react"
import { supabase } from "./supabaseClient"
import { useNavigate} from 'react-router-dom';
import FileUploadForm from "./UploadFileForm";
import * as Tabs from '@radix-ui/react-tabs';


export const Register = () =>{

    const navigate = useNavigate();

    const [isRequired, setIsRequired] = useState(false)
    const [formData, setFormData] = useState(
        {
            fullname: '',
            email: '',
            password: ''
        }
    )

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
    // const handleSubmit = async (e) =>{

    //     e.preventDefault()
    //     try{
    //         const { data, error } = await supabase.auth.signUp(
    //             {
    //             email: formData.email,
    //             password: formData.password,
    //             options: {
    //                 data: {
    //                 full_name: formData.fullname,
    
    //             }}}
    //         )
    //         if(!error)navigate('/');

    //         if (error) throw error
    //         // alert(error)
    //     }  catch(error){
    //         alert(error)
    //     }

    // }


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value
        }));
    
        console.log(formData)
      };

      const handleSubmit = (e) =>{

        if(formData.fullname && formData.email && formData.password){
            setIsRequired(false)
            console.log('essa działa')
          }
          else{
            setIsRequired(true)
            console.log('ee brakuje kurwo')
          }

          e.preventDefault()
          
    }


    return(
        <>

        <div className="login-page">

            {/* <FileUploadForm/> */}
        
            <Tabs.Root className="login-root" defaultValue="tab1">
                <Tabs.List className="TabsList" aria-label="Manage your account">
                    <Tabs.Trigger className="TabsTrigger login-trigger" value="tab1">
                    Rejestracja
                    </Tabs.Trigger>
                    <Tabs.Trigger className="TabsTrigger login-trigger" value="tab2">
                    Logowanie
                    </Tabs.Trigger>
                </Tabs.List>
                    <Tabs.Content className="login-tab" value="tab1">
                        <form onSubmit={handleSubmit}  onChange={handleInputChange}>
                            <div className="input-title">
                                <p>Nickname</p>
                                <p className={`required-alert ${isRequired ? `${formData.fullname ? `hidden`: ``}` : `hidden`}`}>This field is required</p>
                            </div>
                            <input type="text" placeholder="Cinal007" name="fullname" value={formData.fullname}/>
                            <div className="input-title">
                                <p>Email</p>
                                <p className={`required-alert ${isRequired ? `${formData.email ? `hidden`: ``}` : `hidden`}`}>This field is required</p>
                            </div>
                            <input type="text" placeholder="wujek@rada.scpl" name="email" value={formData.email}/>
                            <div className="input-title">
                                <p>Password</p>
                                <p className={`required-alert ${isRequired ? `${formData.password ? `hidden`: ``}` : `hidden`}`}>This field is required</p>
                            </div>
                            <input type="text" placeholder="########" name="password" value={formData.password}/>

                            <button type="submit">Zarejestruj się</button>
                            <p className="terms">
                        By signing up, you agree you've read and accepted our <a className="terms-link" href="">Terms and Conditions.</a>  Please see our <a className="terms-link" href="">Privacy Policy</a>  for information on how we process your data.
                        </p>
                
                        </form>
                    
                    </Tabs.Content>
                    <Tabs.Content className="login-tab" value="tab2">
                    <form onSubmit={handleSubmit}  onChange={handleInputChange}>

                    <div className="input-title">
                                <p>Email</p>
                                <p className={`required-alert ${isRequired ? `${formData.email ? `hidden`: ``}` : `hidden`}`}>This field is required</p>
                            </div>
                            <input type="text" placeholder="wujek@rada.scpl" name="email" value={formData.email}/>
                            <div className="input-title">
                                <p>Password</p>
                                <p className={`required-alert ${isRequired ? `${formData.password ? `hidden`: ``}` : `hidden`}`}>This field is required</p>
                            </div>
                            <input type="text" placeholder="########" name="password" value={formData.password}/>

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