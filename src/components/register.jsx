import { useState } from "react"
import { supabase } from "./supabaseClient"

export const Register = () =>{


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
            if (error) throw error
            // alert(error)
        }  catch(error){
            alert(error)
        }




    }

    return(
        <form onSubmit={handleSubmit} onChange={handleChange}>
            <input type="text" placeholder="full name" name="fullname"/>
            <input type="text" placeholder="email" name="email"/>
            <input type="text" placeholder="password" name="password"/>
            <button type="submit">Submit</button>
        </form>
    )
}