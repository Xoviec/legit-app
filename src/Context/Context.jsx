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

export const useAdmin = () =>{
    const { admin } = useContext(UserSessionContext)
    return admin
}

export const useItemsSearch = () =>{
    const { itemsSearch } = useContext(UserSessionContext)
    return itemsSearch
}

export const useItemsSearchUpdate = () =>{
    return useContext(UserSessionUpdateContext)
}



export const UserSessionProvider = ({children}) =>{

    const API = import.meta.env.VITE_API


    const [user, setUser] = useState(undefined)
    const [session, setSession] = useState(undefined)
    const [admin, setAdmin] = useState(undefined)


    const [dupa, setDupa] = useState(true)
    const [essa, setEssa] = useState('uuu sigma')
    const [itemsSearch, setItemsSearch] = useState('')

    const handleChangeItemsSearch = (newVal) =>{
        setItemsSearch(newVal)
    }

    const handleChangeDupa = () =>{
        setDupa(false)
    }


    useEffect(()=>{
        getUser()
    }, [])

    const getUser = async () =>{
        const { data: { user } } = await supabase.auth.getUser()
        const { data: {session}, error } = await supabase.auth.getSession()
        
        if(user){
            setSession(session)
            try{
                const userResponse = await fetch(`${API}/secret/${user.id}`, {
                    method: 'GET',
                    headers: {
                      'jwt': (session.access_token),
                    }
                  })
                const usersDataResponse = await userResponse.json()
                setUser(usersDataResponse[0])
            }
            catch(err){
                console.log(err)
            }
            try{
                const isAdmin = await fetch(`${API}/admin-access`, {
                    method: 'GET',
                    headers: {
                      'jwt': session.access_token,
                    }
                  })
                  if (isAdmin.ok) {
                    const isAdminResponse = await isAdmin.json();
                    setAdmin(isAdminResponse);
                    return
                } else {
                    setAdmin(false);
                }
                // setAdmin(isAdmin.ok)
            }catch(err){
                return
            }
        }
        else{
            setSession(false)
            setUser(false)
            setAdmin(false)
        }
    }

    return(
        <UserSessionContext.Provider value={{user: user, session: session, admin: admin, itemsSearch: itemsSearch}}>
            <UserSessionUpdateContext.Provider value={{handleChangeDupa, handleChangeItemsSearch}}>
                {children}
            </UserSessionUpdateContext.Provider>
        </UserSessionContext.Provider>
    )
}