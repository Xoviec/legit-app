
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';




export const UserPage = (key) =>{

    const API = process.env.REACT_APP_API


    const[displayUser, setDisplayUser] = useState() // user który jest wyswietlany na stronie
    const[user, setUser] = useState('none') // user przeglądający strone 
    const[userItemsList, setUserItemsList] = useState()
    const[foundUsers, setFoundUsers] = useState()
    const[newOwner, setNewOwner] = useState()
    const[commentsList, setCommentsList] = useState()
    const[commentVal, setCommentVal] = useState('')
 
    const location = useLocation();
    const pathSegments = location.pathname.split('/');
    const usernameFromPath = pathSegments[2];


    const getUserDataFromDB = async()=>{

        const { data: { user } } = await supabase.auth.getUser()
        try{
            const userResponse = await fetch(`${API}/secret/${user?.id}`)
            const usersDataResponse = await userResponse.json()
            console.log(usersDataResponse[0].nickname)
            setUser(usersDataResponse[0])
        }
        catch(err){
            console.log(err)
        }
    }

    const getComments = async () =>{

        try{
            const response = await fetch(`${API}/get-comments/${usernameFromPath}`);
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
                const response = await fetch(`${API}/nicknames/${usernameFromPath}`);
                const userItemsListResponse = await fetch(`${API}/user-items/${usernameFromPath}`);
                const userItemsList = await userItemsListResponse.json()
                console.log(userItemsList)
                const data = await response.json();
                setUserItemsList(userItemsList)
                setDisplayUser(data[0])
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
            const response = await fetch(`${API}/search-users?letters=${e.target.value}`);
            const data = await response.json();

            console.log(data)
            setFoundUsers(data)

        try{

        }catch(err){
            console.log(err)
        }
    }

    // Przykładowe użycie
    const handleTradeItem = async (item) =>{
        
        const currentOwner = item.current_owner
        if(item.registerID && currentOwner.ownerID && newOwner && newOwner!==currentOwner){
            try{
                await axios.post(`${API}/change-owner`, {
                    registerID: item.registerID,
                    currentOwner: currentOwner.ownerID,
                    newOwner: newOwner,
                    verifyID: user.id
                });
            setNewOwner()
            }catch(error){
                // console.log(error.response.data.error)
                console.log(error.response ? error.response.data.error : error)
            }
        }
    }
    
    const handleAddComment = async (e) =>{

        console.log(e.target.comment.value)

        e.preventDefault()

        try{
            const userResponse = await fetch(`${API}/secret/${user.id}`)
            const usersDataResponse = await userResponse.json()
            console.log(usersDataResponse[0].nickname)
            setCommentVal('')

            console.log('exdi')
            await axios.post(`${API}/add-comment`, {
                commentBy: usersDataResponse[0].nickname,
                commentOn: displayUser.nickname,
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

        const userResponse = await fetch(`${API}/secret/${user.id}`)
        const usersDataResponse = await userResponse.json()
        console.log(usersDataResponse[0].nickname)
        await axios.post(`${API}/delete-comment`, {
            id: id,
            userNick: usersDataResponse[0].nickname
            // commentOn: user.nickname,
            // content: e.target.comment.value,
        });
    }catch(err){
        console.log(err)
    }
    }

    console.log(user)
    return(
        <div>
            {usernameFromPath}-{displayUser?.id}


            <p>Przedmioty uzytkownika {usernameFromPath}</p>
            <div>
                {
                    userItemsList?.map((item)=>(

                        // console.log(item.owners_history[item.owners_history.length-1].registerDate)
                        <div key={item.registerID}>
                            <p>{item.id}</p>
                            <p>{item.name} registered {item.legited_at}</p>
                            <p>It belongs to {item.owner_nickname} since {item.owners_history[item.owners_history.length-1].registerDate}</p>
                            <img src={item.image} alt="" />
                            <button onClick={()=>handleTradeItem(item)}>prześlij item</button>
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
                                {comment.comment_by}: 
                                {comment.content}

                                
                                {
                                    comment.comment_by===user.nickname && 

                                    <button onClick={(event)=>handleDeleteComment(event, comment.id)}>usuń komentarz</button>

                                }
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