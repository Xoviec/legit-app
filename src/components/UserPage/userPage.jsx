
import { useLocation, useParams } from 'react-router-dom';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { ProfileTabs } from '../../shared/ProfileTabs/ProfileTabs';
import { MyAvatar } from '../../shared/Avatar/Avatar';
import { UserRanking } from '../Layout/Sidebar/UserRanking';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useQuery, useMutation } from '@tanstack/react-query' 


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
        const { data: {session}, error } = await supabase.auth.getSession()

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
    }



    const getMostItems = async () =>{
        const mostItemsRes = await fetch(`${API}/most-items`); // szuka wszystkich uzytkownikow
        const mostItemsData = await mostItemsRes.json();
        setMostItems(mostItemsData)
    
      } 
      

      const addComment = ({comment_by, comment_on, content, id}) =>{
        return axios.post(`${API}/add-comment`, {
            comment_by,
            comment_on,
            content,
            id
        });
    }
    const addCommentMutation = useMutation({
        mutationFn: addComment,
        onSuccess: (data, variables, context) =>{
            console.log('działa')
        }
    })



    const handleMutateComment = (e) =>{
        e.preventDefault()

        const commentContent = e.target.comment.value
        const newCommentID = uuidv4()


        addCommentMutation.mutate({
            comment_by: user.id,
            comment_on: profileData.id,
            content: commentContent,
            id: newCommentID
        })
        
    }


    

    // const getComments = async () =>{

    //     try{
    //         const response = await fetch(`${API}/nicknames/${usernameFromPath}`);
    //         const data = await response.json();
    //         const commentsResponse = await fetch(`${API}/get-comments/${data[0].id}`);
    //         const commentsData = await commentsResponse.json();
    //         setCommentsList(commentsData)

    //     }catch(err){
    //         console.log(err)
    //     }
    // }

    const clearData = ()=>{ //nie pamietam po co tutaj to dałem, było na początku useEffecta,wywaliłem bo przy nawigacji odświeały się itemy

        setUserItemsList(undefined)
        setDisplayUser(undefined)
        setCommentsList(undefined)

    }

    const getItems = async (nickname) => {


        return await fetch(`${API}/user-items/${usernameFromPath}`)
            .then(res=>res.json())
    };

    const getProfile = async() =>{

        return await fetch(`${API}/nicknames/${usernameFromPath}`)
            .then(res=>res.json())
            .then(res=>res[0])

    }

    const getComments = async () =>{

        const response = await fetch(`${API}/nicknames/${usernameFromPath}`);
        const data = await response.json();


        return await fetch(`${API}/get-comments/${data[0].id}`)
            .then(res=>res.json())

    }

        // return axios
        //     .get(`${API}/user-items/${usernameFromPath}`)
        //     .then(res=>res.data)
            
            // const response = await fetch(`${API}/nicknames/${usernameFromPath}`);
            // const userItemsListResponse = await fetch(`${API}/user-items/${usernameFromPath}`);
            // const userItemsList = await userItemsListResponse.json()
            // const data = await response.json();
            // console.log('xd')
            // return data
        // try {
        //     const response = await fetch(`${API}/nicknames/${usernameFromPath}`);
        //     const userItemsListResponse = await fetch(`${API}/user-items/${usernameFromPath}`);
        //     const userItemsList = await userItemsListResponse.json()
        //     const data = await response.json();

        //     try{
        //         const commentsResponse = await fetch(`${API}/get-comments/${data[0].id}`);
        //         const commentsData = await commentsResponse.json();
        //         setCommentsList(commentsData)
    
        //     }catch(err){
        //         console.log(err)
        //     }
        //     setUserItemsList(userItemsList)
        //     setDisplayUser(data[0])
        // } catch (error) {
        //     setUserNotFound(true)
        //     console.error('Błąd podczas pobierania danych:', error);
        // }

    const {
        status: itemsStatus,
        error: itemsError,
        data: itemsData,
      } = useQuery({
        queryKey: ['items', usernameFromPath],
        queryFn: getItems,
      })

    const {
        status: profileStatus,
        error: profileError,
        data: profileData,
      } = useQuery({
        queryKey: ['profile', usernameFromPath],
        queryFn: getProfile,
      })

      const {
        status: commentsStatus,
        error: commentsError,
        data: commentsData,
      } = useQuery({
        queryKey: ['comments', usernameFromPath],
        queryFn: getComments,
      })


      useEffect(()=>{
        setCommentsList(commentsData)
    }, [commentsData])

    //   console.log(commentsData)


    console.log(commentsList)

    useEffect(()=>{


        console.log(displayUser?.nickname)


        setStateUserNameFromPath(usernameFromPath)
        setUserNotFound(false)



        getComments()
        getUserDataFromDB()
        // getProfileData()
    }, [nickname])
    



    const handleUpdateFoundUsers = async (e) =>{
            const response = await fetch(`${API}/search-users?letters=${e.target.value}`);
            const data = await response.json();
            setFoundUsers(data)

        try{

        }catch(err){
            console.log(err)
        }
    }

    
    const handleAddComment = async (e) =>{ //Nie ma display user

        const newCommentID = uuidv4()

        const commentContent = e.target.comment.value
        e.preventDefault()

        const newCommentData = {
            avatar: user.avatar,
            comment_by_nickname: user.nickname,
            comment_by: user.id,
            comment_on: profileData.id,
            content: commentContent,
            id: newCommentID,
            created_at: new Date()
        }

        const newCommentList = [...commentsList, newCommentData]

        setCommentsList(newCommentList)

        try{
            // const userResponse = await fetch(`${API}/secret/${user.id}`)
            // const usersDataResponse = await userResponse.json()
            setCommentVal('')

            await axios.post(`${API}/add-comment`, {
                comment_by: user.id,
                comment_on: profileData.id,
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
        const reqData = {
            id: id,
            comment_by_id: user.id
        }
     try{
        await axios.delete(`${API}/delete-comment`, {
            headers: {
                Authorization: 'jwt-key'
            },
            data: reqData
        });
        }catch(err){
            console.log(err)
        }
    }

    return(
        <>
                <div className="profile-container">
                    {
                        !userNotFound ?
                            <div className="user-info">
                                <MyAvatar user={profileData}/>
                                <h1>{profileData?.nickname || <Skeleton width={200} className='skeleton' containerClassName="skeleton" /> } </h1>
                                <Skeleton />
                            </div>
                            :
                            <div>
                                <h1>Nie znaleziono uzytkownika</h1>
                            </div>
                    }
                    
                    {
                        profileData?.description && <><p className='user-about'>O mnie:</p> <p>{profileData?.description}</p></>
                    }
                    {
                        !userNotFound &&

                        <ProfileTabs  handleDeleteComment={handleDeleteComment} handleAddComment={handleMutateComment} viewer={user} userItemsList={itemsData} comments={commentsList}/>

                    }
                </div>
        </>
    )
}

