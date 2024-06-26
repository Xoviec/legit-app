import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
import { useNavigate} from 'react-router-dom';

export const Login = ({handleSetUser}) =>{

    const navigate = useNavigate();


    const [formData, setFormData] = useState(
        {
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


    const essa = async()=>{
        const { data: { user } } = await supabase.auth.getUser()
        const { data, error } = await supabase.auth.getSession()
    

        // handleSetUser(user)
    
        console.log(user)
        console.log(data)
      }
    
    

    const handleSubmit = async (e) =>{

        e.preventDefault()
        try{
            const { data, error } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
              })



            essa()
            if(!error)navigate('/')
            if (error) throw error
        }  catch(error){
            alert(error)
        }




    }

    return(
        <form onSubmit={handleSubmit} onChange={handleChange}>
            <input type="text" placeholder="email" name="email"/>
            <input type="password" placeholder="password" name="password"/>
            <button type="submit">Submit</button>
        </form>
    )
}