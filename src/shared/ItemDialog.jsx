import React from 'react';
import { useState } from 'react';
import { CommentsAvatar } from './commentsAvatar';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { supabase } from '../components/supabaseClient';

import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import './ItemDialog.css'
import { useRef } from 'react';
import { useEffect } from 'react';


export const ItemDialog = (props) =>{

  const API = process.env.REACT_APP_API

  const inputRef = useRef()
  const[foundUsers, setFoundUsers] = useState()
  const[newOwner, setNewOwner] = useState('')
  const[user, setUser] = useState()


  const getUserData = async () =>{

    const { data: { user } } = await supabase.auth.getUser()

    setUser(user)
  }

  useEffect(()=>{

    getUserData()
  }, [])


  const handleUpdateFoundUsers = async (e) =>{
    console.log(e.target.value)
        const response = await fetch(`${API}/search-users?letters=${e.target.value}`);
        const data = await response.json();

        console.log(data)
        setFoundUsers(data)

    try{

    }catch(err){
        console.log(err)
    }
}

  const handleSetNewOwner = (user) =>{

    setNewOwner(user.id)
    setFoundUsers()
    inputRef.current.value = user.nickname;

  }


  const handleTradeItem = async (item) =>{
        
    const currentOwner = item.current_owner

    console.log(item.id)

    console.log(currentOwner)
    console.log(newOwner)
    console.log(user)

    if(item.id && currentOwner && newOwner && newOwner!==currentOwner){
        try{
            await axios.post(`${API}/change-owner`, {
                registerID: item.id,
                currentOwner: currentOwner,
                newOwner: newOwner,
                verifyID: user.id
            });
        setNewOwner()
        }catch(error){
            console.log(error.response ? error.response.data.error : error)
        }
    }
    else{
        console.log("coś poszło nie tak")
    }
  }
  
    return(
        <Dialog.Root>
            <Dialog.Trigger asChild>
              <button className="trade-item-button">Prześlij przedmiot</button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="DialogOverlay" />
              <Dialog.Content className="DialogContent">
                <Dialog.Title className="DialogTitle">Prześlij przedmiot</Dialog.Title>
                <Dialog.Description className="DialogDescription">
                  Wyślij przedmiot do innego uzytkownika. Pamiętaj, ze tej akcji nie mozna cofnąć.
                </Dialog.Description>
                <fieldset className="Fieldset">
                  <label className="Label" htmlFor="name">
                    Wybierz uzytkownika
                  </label>
                  <input ref={inputRef} onChange={handleUpdateFoundUsers} className="Input" id="name" />
                  {
                    foundUsers?.length > 0 && 

                    <div className="foundUsersList">

                      {
                        foundUsers?.map((user)=>(
                            <div className='foundUser' key={user.id}>
                                <CommentsAvatar avatar={user.avatar} nickname={user.nickname}/>
                                <Link to={`/Users/${user.nickname}`}>
                                  <p className='comment-author'>{user.nickname}</p>
                                </Link>
                                {/* <p>ID: {user.id}</p> */}
                                <button className='select-user-button button green' onClick={(()=>handleSetNewOwner(user))}>Wybierz</button>
                            </div>
                        ))
                      }
                    </div>

                
                    }
               
                </fieldset>

                <div style={{ display: 'flex', marginTop: 25, justifyContent: 'flex-end' }}>
                  <Dialog.Close asChild>
                    <button onClick={()=>handleTradeItem(props.item)} className="Button green">Prześlij</button>
                  </Dialog.Close>
                </div>
                <Dialog.Close asChild>
                  <button className="IconButton" aria-label="Close">
                    <Cross2Icon />
                  </button>
                </Dialog.Close>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
    )
}

