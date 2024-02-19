import { useContext, useState } from "react"
import { createContext } from "react"
import { supabase } from '../supabaseClient';
import { useEffect } from "react";




export const UserSessionContext = createContext()
export const UserSessionUpdateContext = createContext()

export const useDupa = () =>{
    const { val1 } = useContext(UserSessionContext);
    return val1;}

export const useDupaUpdate = () =>{
    return useContext(UserSessionUpdateContext)
}

export const useUser = () =>{
    const { user } = useContext(UserSessionContext);
    return user
}

export const useSession = () =>{
    const { session } = useContext(UserSessionContext);
    return session
}


export const UserSessionProvider = ({children}) =>{


    const [user, setUser] = useState(undefined)
    const [session, setSession] = useState(undefined)


    const [dupa, setDupa] = useState(true)
    const [essa, setEssa] = useState('uuu sigma')

    const handleChangeDupa = () =>{
        setDupa(false)
    }


    useEffect(()=>{
        getSession()
        getUser()
    }, [])

    const getUser = async () =>{
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
    }


    const getSession = async () =>{
        const { data: {session}, error } = await supabase.auth.getSession()
        setSession(session)
    }



    return(
        <UserSessionContext.Provider value={{user: user, session: session}}>
            <UserSessionUpdateContext.Provider value={handleChangeDupa}>
                {children}
            </UserSessionUpdateContext.Provider>
        </UserSessionContext.Provider>
    )
}