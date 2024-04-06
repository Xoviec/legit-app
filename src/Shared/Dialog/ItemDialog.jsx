import React from 'react';
import { useState } from 'react';
import { CommentsAvatar } from '../Avatar/commentsAvatar';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import './ItemDialog.css'
import { useRef } from 'react';
import { useEffect } from 'react';
import { useSession, useUser } from '../.././Context/Context';
import { DividerHorizontalIcon, CheckIcon } from '@radix-ui/react-icons';
import * as Checkbox from '@radix-ui/react-checkbox';


export const ItemDialog = (props) =>{

  const API = import.meta.env.VITE_API

  const inputRef = useRef()
  const[foundUsers, setFoundUsers] = useState()
  const[newOwner, setNewOwner] = useState('')
  
  const[checked, setChecked ] = useState(props.item.is_private)


  const user = useUser()
  const sesssion = useSession()



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

    setNewOwner(user)
    setFoundUsers()
    inputRef.current.value = user.nickname;

  }


  const handleTradeItem = async (item) =>{
        
    const currentOwner = item.current_owner

    if(item.id && currentOwner && newOwner?.id && newOwner?.id!==currentOwner){
        try{
            await axios.post(`${API}/change-owner`, {
                registerID: item.id,
                currentOwner: currentOwner,
                newOwner: newOwner.id,
                verifyID: user.id
            })
            .then(
              props.notify(newOwner.nickname),
              setNewOwner()
            )
        }
        catch(error){
            props.tradeError()
            console.log(error.response ? error.response.data.error : error)
        }
    }
    else{
      props.tradeError()
        console.log("coś poszło nie tak")
        
    }
  }
  console.log(props.item)

  const handlePrivateChange = async (e) =>{

    setChecked((prev)=>!prev)


    try{
      await axios.post(`${API}/item-privacy`, {
          itemID: props.item.id,
          isPrivate: e,
      })

  }
  catch(error){
      console.log(error.response ? error.response.data.error : error)
  }

    console.log(e)
  }
  
    return(
        <Dialog.Root>
            <Dialog.Trigger asChild>
              <button className="trade-item-button">Prześlij przedmiot</button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="DialogOverlay" />
              <Dialog.Content className="DialogContent">
                <Dialog.Title className="DialogTitle">Zarządzaj</Dialog.Title>
                <div className="privacy-row">
                    <Dialog.Description className="DialogDescription">
                      Ukryj przedmiot na profilu
                    </Dialog.Description>
                    <div className="private-check">
                      {/* <label className="Label" htmlFor="c1">
                        Prywatny
                      </label> */}
                      <Checkbox.Root onCheckedChange={handlePrivateChange} className="CheckboxRoot" checked={checked} id="c1">
                        <Checkbox.Indicator className="CheckboxIndicator">
                          <CheckIcon />
                        </Checkbox.Indicator>
                      </Checkbox.Root>
                  </div>
                </div>
                <Dialog.Description className="DialogDescription">
                  Wyślij przedmiot do innego uzytkownika
                  {/* Pamiętaj, ze tej akcji nie mozna cofnąć. */}
                </Dialog.Description>
                <fieldset className="Fieldset">
                  {/* <label className="Label" htmlFor="name">
                    Wybierz uzytkownika
                  </label> */}
                  <input ref={inputRef} onChange={handleUpdateFoundUsers} className="Input" id="name" placeholder='Wybierz użytkownika'/>
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

                <div className='dialog-bottom'>

                  <Dialog.Close asChild>
                    <button onClick={()=>handleTradeItem(props.item)} className="Button green">
                      Prześlij
                    </button>
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

