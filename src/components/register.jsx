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

            <FileUploadForm/>
        
            <Tabs.Root className="TabsRoot" defaultValue="tab1">
                <Tabs.List className="TabsList" aria-label="Manage your account">
                    <Tabs.Trigger className="TabsTrigger" value="tab1">
                    Login
                    </Tabs.Trigger>
                    <Tabs.Trigger className="TabsTrigger" value="tab2">
                    Register
                    </Tabs.Trigger>
                </Tabs.List>
                    <Tabs.Content className="login-tab" value="tab1">
                        <form onSubmit={handleSubmit} onChange={handleChange}>
                            <input type="text" placeholder="full name" name="fullname"/>
                            <input type="text" placeholder="email" name="email"/>
                            <input type="text" placeholder="password" name="password"/>
                            <button type="submit">Submit</button>
                        </form>
                
                    </Tabs.Content>
                    <Tabs.Content className="login-tab" value="tab2">
                    </Tabs.Content>
            </Tabs.Root>
        </>

    )
}