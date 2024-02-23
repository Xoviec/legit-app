
import { useLocation, useParams } from 'react-router-dom';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { ProfileTabs } from '../../Shared/ProfileTabs/ProfileTabs';
import { MyAvatar } from '../../Shared/Avatar/Avatar';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query' 
import { useSession, useUser } from '../../Context/Context';
import { v4 as uuidv4 } from 'uuid';


export const UserPage = (key) =>{

    const queryClient = useQueryClient();



    const API = import.meta.env.VITE_API
    const { nickname } = useParams();

    const location = useLocation();
    const pathSegments = location.pathname.split('/');
    const usernameFromPath = pathSegments[2];

    const[commentsList, setCommentsList] = useState()
    const[userNotFound, setUserNotFound] = useState(false)


    const session = useSession()
    const user = useUser()



      const handleDeleteComment = async ({event, id}) =>{
        const reqData = {
            id: id,
            comment_by_id: user.id
        }

        return axios.delete(`${API}/delete-comment`, {
            headers: {
                Authorization: 'jwt-key'
            },
            data: reqData
        })
    }

    const handleMutateCommentDelete = (e, id)=>{
        e.preventDefault()
        deleteCommentMutation.mutate({
            event: e,
            id
        })
    }


    const deleteCommentMutation = useMutation({
        mutationFn: handleDeleteComment,
        onSuccess: (data, variables, context) =>{
            queryClient.invalidateQueries({ queryKey: ['comments', usernameFromPath] });
            console.log('działa')
        },
        onError: (err) =>{
            console.log(err)
        }
    })





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
            queryClient.invalidateQueries({ queryKey: ['comments', usernameFromPath] });
            console.log('działa')
        },
        onError: (err) =>{
            console.log(err)
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
                        <ProfileTabs  handleDeleteComment={handleMutateCommentDelete} handleAddComment={handleMutateComment} viewer={user} userItemsList={itemsData} comments={commentsData}/>
                    }
                </div>
        </>
    )
}
