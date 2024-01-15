
import { useLocation, useParams } from 'react-router-dom';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { supabase } from '../components/supabaseClient';
import { ProfileTabs } from '../shared/ProfileTabs';
import { MyAvatar } from '../shared/Avatar';
import { UserRanking } from '../components/UserRanking';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'


export const UserPage = (key) =>{

    const { v4: uuidv4 } = require('uuid');


    const API = process.env.REACT_APP_API
    const { nickname } = useParams();

    const location = useLocation();
    const pathSegments = location.pathname.split('/');
    const usernameFromPath = pathSegments[2];

    const[displayUser, setDisplayUser] = useState() // user który jest wyswietlany na stronie
    const[user, setUser] = useState('none') // user przeglądający strone 
    const[userItemsList, setUserItemsList] = useState()
    const[foundUsers, setFoundUsers] = useState()
    const[newOwner, setNewOwner] = useState()
    const[commentsList, setCommentsList] = useState()
    const[commentVal, setCommentVal] = useState('')
    const[mostItems, setMostItems] = useState()
    const[userNotFound, setUserNotFound] = useState(false)
    const[stateUsernameFromPath, setStateUserNameFromPath] = useState(usernameFromPath)




    const getUserDataFromDB = async()=>{

        

        const { data: { user } } = await supabase.auth.getUser()
        try{
            const userResponse = await fetch(`${API}/secret/${user?.id}`)
            const usersDataResponse = await userResponse.json()
            setUser(usersDataResponse[0])

        }
        catch(err){
            console.log(err)
        }
    }



    const getMostItems = async () =>{
        const mostItemsRes = await fetch(`${API}/most-items`); // szuka wszystkich uzytkownikow
        const mostItemsData = await mostItemsRes.json();
        setMostItems(mostItemsData)
    
      } 
    

    const getComments = async () =>{

        try{
            const response = await fetch(`${API}/get-comments/${usernameFromPath}`);
            const data = await response.json();
            setCommentsList(data)

        }catch(err){
            console.log(err)
        }
    }

    const clearData = ()=>{

        setUserItemsList(undefined)
        setDisplayUser(undefined)
        setCommentsList(undefined)

    }

    useEffect(()=>{


        clearData()

        setStateUserNameFromPath(usernameFromPath)
        setUserNotFound(false)

        const getProfileData = async (nickname) => {
            try {
                const response = await fetch(`${API}/nicknames/${usernameFromPath}`);
                const userItemsListResponse = await fetch(`${API}/user-items/${usernameFromPath}`);
                const userItemsList = await userItemsListResponse.json()
                const data = await response.json();

                try{
                    const commentsResponse = await fetch(`${API}/get-comments/${data[0].id}`);
                    const commentsData = await commentsResponse.json();
                    setCommentsList(commentsData)
        
                }catch(err){
                    console.log(err)
                }
                setUserItemsList(userItemsList)
                setDisplayUser(data[0])
            } catch (error) {
                setUserNotFound(true)
                console.error('Błąd podczas pobierania danych:', error);
            }
        };


        getMostItems()
        getUserDataFromDB()
        getProfileData()
    }, [nickname])
    


    console.log('state', stateUsernameFromPath)
    console.log(usernameFromPath)

    const handleUpdateFoundUsers = async (e) =>{
            const response = await fetch(`${API}/search-users?letters=${e.target.value}`);
            const data = await response.json();
            setFoundUsers(data)

        try{

        }catch(err){
            console.log(err)
        }
    }

    // Przykładowe użycie
    const handleTradeItem = async (item) =>{
        
        const currentOwner = item.current_owner

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
    
    const handleAddComment = async (e) =>{

        const newCommentID = uuidv4()

        const commentContent = e.target.comment.value
        e.preventDefault()

        const newCommentData = {
            avatar: user.avatar,
            comment_by_nickname: user.nickname,
            comment_by: user.id,
            comment_on: displayUser.id,
            content: commentContent,
            id: newCommentID,
            created_at: 'teraz'
        }

        const newCommentList = [...commentsList, newCommentData]

        setCommentsList(newCommentList)

        try{
            const userResponse = await fetch(`${API}/secret/${user.id}`)
            const usersDataResponse = await userResponse.json()
            setCommentVal('')

            await axios.post(`${API}/add-comment`, {
                comment_by: usersDataResponse[0].id,
                comment_on: displayUser.id,
                content: commentContent,
                id: newCommentID
            });
        }catch(error){
            console.log(error)
        }
    }

    const handleDeleteComment = async (event, id) =>{

        event.preventDefault()
        const newCommentList = commentsList.filter(((comment)=>comment.id !== id))
        setCommentsList(newCommentList)
     try{
        // const userResponse = await fetch(`${API}/secret/${user.id}`)
        // const usersDataResponse = await userResponse.json()
        await axios.post(`${API}/delete-comment`, {
            id: id,
            comment_by_id: user.id
        });

    
    }catch(err){
        console.log(err)
    }

    }

    return(
        <>
            {/* <UserRanking list={mostItems}/> */}
                <div className="profile-container">
                    {
                        !userNotFound ?
                            <div className="user-info">
                                <MyAvatar user={displayUser}/>
                                {
                                    <h1>{displayUser?.nickname}</h1> 
                                    ||
                                    <Skeleton />
                                }
                                {/* <h1>{displayUser?.nickname || <Skeleton />}</h1> */}
                            </div>
                            :
                            <div>
                                <h1>Nie znaleziono uzytkownika</h1>
                            </div>
                        
                        
                    }
                    
                    {
                        displayUser?.description && <><p className='user-about'>O mnie:</p> <p>{displayUser?.description}</p></>
                    }
                    {
                        !userNotFound &&

                        <ProfileTabs  handleDeleteComment={handleDeleteComment} handleAddComment={handleAddComment} viewer={user} userItemsList={userItemsList} comments={commentsList}/>

                    }
                </div>
        </>
    )
}

