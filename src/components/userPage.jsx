
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';




export const UserPage = (key) =>{

    const[user, setUser] = useState()
    const[userItemsList, setUserItemsList] = useState()
    const[foundUsers, setFoundUsers] = useState()
    const[newOwner, setNewOwner] = useState()
    const[userID, setUserID] = useState('none')
    const[commentsList, setCommentsList] = useState()
    const[commentVal, setCommentVal] = useState()
 
    const location = useLocation();
    const pathSegments = location.pathname.split('/');
    const usernameFromPath = pathSegments[2];


    const getUserDataFromDB = async()=>{

        const { data: { user } } = await supabase.auth.getUser()
        setUserID(user?.id)
    }

    const getComments = async () =>{

        try{
            const response = await fetch(`http://localhost:8000/get-comments/${usernameFromPath}`);
            const data = await response.json();
            console.log(data)
            setCommentsList(data)

        }catch(err){
            console.log(err)
        }
    }

    useEffect(()=>{
        const getNicknameData = async (nickname) => {
            try {
                const response = await fetch(`http://localhost:8000/nicknames/${usernameFromPath}`);
                const userItemsListResponse = await fetch(`http://localhost:8000/user-items/${usernameFromPath}`);
                const userItemsList = await userItemsListResponse.json()
                const data = await response.json();
                setUserItemsList(userItemsList)
                setUser(data[0])
            } catch (error) {
                console.error('Błąd podczas pobierania danych:', error);
            }
        };

        getComments()
        getUserDataFromDB()
        getNicknameData()
    }, [])


    const handleUpdateFoundUsers = async (e) =>{
        console.log(e.target.value)
            const response = await fetch(`http://localhost:8000/search-users?letters=${e.target.value}`);
            const data = await response.json();

            console.log(data)
            setFoundUsers(data)

        try{

        }catch(err){
            console.log(err)
        }
    }

    // Przykładowe użycie
    const handleDeleteItem = async (item) =>{
        
        const currentOwner = item.ownersHistory[item.ownersHistory.length-1]
        if(item.registerID && currentOwner.ownerID && newOwner && newOwner!==currentOwner){
            try{
                await axios.post('http://localhost:8000/change-owner', {
                    registerID: item.registerID,
                    currentOwner: currentOwner.ownerID,
                    newOwner: newOwner,
                    verifyID: userID
                });
            setNewOwner()
            }catch(error){
                console.log(error.response.data.error)
            }
        }
    }
    
    const handleAddComment = async (e) =>{

        console.log(e.target.comment.value)

        e.preventDefault()

        try{
            const userResponse = await fetch(`http://localhost:8000/secret/${userID}`)
            const usersDataResponse = await userResponse.json()
            console.log(usersDataResponse[0].nickname)
            setCommentVal('')

            console.log('exdi')
            await axios.post('http://localhost:8000/add-comment', {
                commentBy: usersDataResponse[0].nickname,
                commentOn: user.nickname,
                content: e.target.comment.value,
            });
        }catch(error){
            console.log(error)
        }
    }

    const handleDeleteComment = async (event, id) =>{

        console.log(event)
        console.log(id)
        event.preventDefault()

     try{
        await axios.post('http://localhost:8000/delete-comment', {
            id: id,
            // commentOn: user.nickname,
            // content: e.target.comment.value,
        });
    }catch(err){
        console.log(err)
    }
    }


    return(
        <div>
            {usernameFromPath}-{user?.id}


            <p>Przedmioty uzytkownika {usernameFromPath}</p>
            <div>
                {
                    userItemsList?.map((item)=>(
                        <div key={item.id}>
                            <p>{item.name} registered {item.ownersHistory[0].registerDate}</p>
                            <p>It belongs to {user.nickname} since {item.ownersHistory[item.ownersHistory.length-1].registerDate}</p>
                            <img src={item.image} alt="" />
                            <button onClick={()=>handleDeleteItem(item)}>prześlij item</button>
                        </div>
                    ))
                }
            </div>
            <div>

                <input onChange={handleUpdateFoundUsers} type="text" name="search" id="" />

                <div>
                    <p>Wybierz uzytkownika:</p>
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
                <div>
                    <p>Komentarze:</p>
                    {
                        commentsList?.map((comment)=>(
                            <div key={comment.id}>
                                {comment.content}
                                <button onClick={(event)=>handleDeleteComment(event, comment.id)}>Wypierdol</button>
                            </div>
                        ))
                    }
                    <p>Dodaj komentarz</p>
                    <form onSubmit={handleAddComment}>
                        <input name='comment' type="text" onChange={((e)=>setCommentVal(e.target.value))} value={commentVal}/>
                        <button type='submit'>Dodaj komentarz</button>
                    </form>
                </div>
            </div>

        </div>
    )
}


// try{
//     await axios.post('http://localhost:8000/delete-comment', {
//         id: id,
//         commentOn: user.nickname,
//         content: e.target.comment.value,
//     });
// }catch(err){
//     console.log(err)
// }