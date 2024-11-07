
import { useLocation, useParams, useSearchParams } from 'react-router-dom';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { ProfileTabs } from '../../Shared/ProfileTabs/ProfileTabs';
import { MyAvatar } from '../../Shared/Avatar/Avatar';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query' 
import { useItemsSearch, useSession, useUser, useUserData } from '../../Context/Context';
import { v4 as uuidv4 } from 'uuid';
import { HelmetSpecified } from '../Helmet/HelmetSpecified';
import { useRef } from 'react';


export const UserPage = (key) =>{



    const queryClient = useQueryClient();



    const API = import.meta.env.VITE_API
    const { nickname } = useParams();
    const itemsSearch = useItemsSearch()

    const userData = useUserData()

    const location = useLocation();
    const pathSegments = location.pathname.split('/');
    const usernameFromPath = pathSegments[2];

    const itemsCountRef = useRef()

    const[commentsList, setCommentsList] = useState()
    const[userNotFound, setUserNotFound] = useState(false)
    const[sort, setSort] = useState('brand') // brand, name, legited_at, sku
    const[order, setOrder] = useState('asc')
    const [searchParams, setSearchParams]= useSearchParams({order:"asc", sortBy: "brand"})

    

    const session = useSession()
    const user = useUser()

    const changeSort = (i) =>{
        searchParams.set("sortBy", i)
        setSearchParams(searchParams, {replace: true})
    }

    const handleOrderSwitch = () =>{
        const newOrder = searchParams.get("order") === 'desc' ? 'asc' : 'desc'
        searchParams.set("order", newOrder)
        setSearchParams(searchParams, {replace: true})
    }

      const handleDeleteComment = async ({event, id}) =>{
        return axios.delete(`http://localhost:3030/deleteComment/${id}`)
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
        },
        onError: (err) =>{
            console.log(err)
        }
    })





    const addComment = ({comment_by, comment_on, content, id}) =>{
        return axios.post(`http://localhost:3030/createComment`, {
            commentBy: comment_by,
            commentOn: comment_on,
            content,
        });
    }


    const addCommentMutation = useMutation({
        mutationFn: addComment,
        onSuccess: (data, variables, context) =>{
            queryClient.invalidateQueries({ queryKey: ['comments', usernameFromPath] });
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
            comment_by: userData.userId,
            comment_on: profileData.id,
            content: commentContent,
            id: newCommentID
        })
        
    }





    const getProfile = async() =>{
        return await fetch(`http://localhost:3030/getUserData/${usernameFromPath}`)
            .then(res=>res.json())
            .then(res=>res.userData)
            // .then(res =>  res[0] ? res[0] : null);
s        }

    const getComments = async () =>{

        // const response = await fetch(`${API}/nicknames/${usernameFromPath}`);
        // const data = await response.json();

        return await fetch(`http://localhost:3030/comments/${usernameFromPath}`)
            .then(res=>res.json())

            // .then(res=>res.comments)

    }

    const getItems = async (nickname) => {
        return await fetch(`http://localhost:3030/userItems/${usernameFromPath}?order=${searchParams.get("order")}&sortBy=${searchParams.get("sortBy")}`, {
            method: 'GET',
            headers: {
                viewer: user.id,
            }
        })
        
        .then(res=>res.json())
    };

    const {
        status: itemsStatus,
        error: itemsError,
        data: itemsData,
      } = useQuery({
        queryKey: ['items', usernameFromPath, searchParams.get("order"), searchParams.get("sortBy")],
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
                    <HelmetSpecified nickname={profileData?.nickname} desc={`${profileData?.nickname}, ${profileData?.description}`}/>
                    {
                        !(profileData === null) ?
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
                        !(profileData === null) ?
                        <ProfileTabs 
                            handleDeleteComment={handleMutateCommentDelete}
                            handleAddComment={handleMutateComment}
                            viewer={user} 
                            userItemsList={itemsData}
                            comments={commentsData}
                            changeSort={changeSort}
                            sort={sort} order={order}
                            handleOrderSwitch={handleOrderSwitch}
                            itetmsCount={itemsCountRef}
                        />
                        :
                        null
                    }
                </div>
        </>
    )
}

