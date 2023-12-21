import { useState } from "react"
import { supabase } from "./supabaseClient"
import { useNavigate} from 'react-router-dom';
import FileUploadForm from "./UploadFileForm";
import * as Tabs from '@radix-ui/react-tabs';


export const Register = () =>{

    const navigate = useNavigate();



    const [formData, setFormData] = useState(
        {
            fullname: '',
            email: '',
            password: ''
        }
    )

    console.log(formData)

    const handleChange = (event) =>{
        setFormData((prevFormData)=>{
            return{
                ...prevFormData,
                [event.target.name]:event.target.value
            }
        })
    }


    const handleCheckUser = () =>{
        
    }

    

    const handleSubmit = async (e) =>{

        e.preventDefault()
        try{
            const { data, error } = await supabase.auth.signUp(
                {
                email: formData.email,
                password: formData.password,
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

    return(
        <>

        <div className="login-page">

            {/* <FileUploadForm/> */}
        
            <Tabs.Root className="login-root" defaultValue="tab1">
                <Tabs.List className="TabsList" aria-label="Manage your account">
                    <Tabs.Trigger className="TabsTrigger login-trigger" value="tab1">
                    Register
                    </Tabs.Trigger>
                    <Tabs.Trigger className="TabsTrigger login-trigger" value="tab2">
                    Login
                    </Tabs.Trigger>
                </Tabs.List>
                    <Tabs.Content className="login-tab" value="tab1">
                        <form onSubmit={handleSubmit} onChange={handleChange}>
                            <input type="text" placeholder="nickname" name="fullname"/>
                            <input type="text" placeholder="email" name="email"/>
                            <input type="text" placeholder="password" name="password"/>
                            <button type="submit">Register</button>
                            <p className="terms">
                        By signing up, you agree you've read and accepted our <a className="terms-link" href="">Terms and Conditions.</a>  Please see our <a className="terms-link" href="">Privacy Policy</a>  for information on how we process your data.
                        </p>
                
                        </form>
                    
                    </Tabs.Content>
                    <Tabs.Content className="login-tab" value="tab2">
                    <form onSubmit={handleSubmit} onChange={handleChange}>
                            <input type="text" placeholder="email" name="email"/>
                            <input type="text" placeholder="password" name="password"/>
                            <button type="submit">Login</button>
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