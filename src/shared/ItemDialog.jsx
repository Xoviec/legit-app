import React from 'react';
import { useState } from 'react';

import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import './ItemDialog.css'


export const ItemDialog = () =>{

  const API = process.env.REACT_APP_API

  const[foundUsers, setFoundUsers] = useState()
  const[newOwner, setNewOwner] = useState('')


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
  
    return(
        <Dialog.Root>
            <Dialog.Trigger asChild>
              <button className="Button violet">Edit profile</button>
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
                  <input onChange={handleUpdateFoundUsers} className="Input" id="name" />
                  <div className="foundUsersList">
                  {
                        foundUsers?.length > 0 && 
                        foundUsers?.map((user)=>(
                            <div key={user.id}>
                                <p>Nickname: {user.nickname}</p>
                                <p>ID: {user.id}</p>
                                <button onClick={(()=>setNewOwner(user.id))}>Wybierz uzytkownika</button>
                            </div>
                        ))
                
                    }
                  </div>
               
                </fieldset>
                <fieldset className="Fieldset">
                  <label className="Label" htmlFor="username">
                    Username
                  </label>
                  <input className="Input" id="username" defaultValue="@peduarte" />
                </fieldset>
                <div style={{ display: 'flex', marginTop: 25, justifyContent: 'flex-end' }}>
                  <Dialog.Close asChild>
                    <button className="Button green">Save changes</button>
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

