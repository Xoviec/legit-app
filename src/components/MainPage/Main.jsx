// import logo from './logo.svg';
import '../../Main.css';
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { ProfileTabs } from '../../shared/ProfileTabs/ProfileTabs';
import { MyAvatar } from '../../shared/Avatar/Avatar';
import { MainNotLogged } from '../MainPageNotLoggedd/MainNotLogged';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useQuery } from '@tanstack/react-query' 
import { useAdmin, useSession, useUser } from '../Context/Context';


export const Mainpage = () => {


const item = JSON.parse(localStorage.getItem('sb-bpkpqswpimtoshzxozch-auth-token'));
const nickNameFromLocalStorage = item?.user.user_metadata.full_name

const location = useLocation();

const path = location.pathname



  const API = process.env.REACT_APP_API

  const session = useSession()
  const user = useUser()
  const admin = useAdmin()



  const getItems = async () =>{
    return await fetch(`${API}/user-items/${nickNameFromLocalStorage}`)
      .then(res=>res.json())
  }

  const {
    status: itemsStatus,
    error: itemsError,
    data: itemsData,
  } = useQuery({
    queryKey: ['items',nickNameFromLocalStorage],
    queryFn: getItems,
    
  })

  const getComments = async () =>{

    if(user==='failed'){
      return false
    }
    else{
      return await fetch(`${API}/get-comments/${user.id}`)
        .then(res=>res.json())
    }
  }

  const {
    status: commentsStatus,
    error: commentsError,
    data: commentsData,
  } = useQuery({
    queryKey: ['comments',nickNameFromLocalStorage],
    queryFn: getComments,
    enabled: !!user, // Fetch data only if user has a value

  })


  const getProfileData = async () =>{

      if(user==='failed'){
        return false
      }
      else{
        return await fetch(`${API}/secret/${user.id}`, {
          method: 'GET',
          headers: {
            'jwt': (session.access_token),
          }
        })
        .then(res=>res.json())
        .then(res=>res[0])
      }
      
  }

  const {
    status: profileDataStatus,
    error: profileDataError,
    data: profileDataData,
  } = useQuery({
    queryKey: ['profileData',nickNameFromLocalStorage],
    queryFn: getProfileData,
    enabled: !!user, // Fetch data only if user has a value

  })
  
  return (

    <>
        {
            item ? 
            (
              
            <div className="profile-container">
            <div className="user-info">
                <MyAvatar user={profileDataData}/>
                <h1>{profileDataData?.nickname || <Skeleton width={200}/>}</h1>
                <Link state={profileDataData}to={`/settings`} className='settings-btn'>
                  <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.8536 1.14645C11.6583 0.951184 11.3417 0.951184 11.1465 1.14645L3.71455 8.57836C3.62459 8.66832 3.55263 8.77461 3.50251 8.89155L2.04044 12.303C1.9599 12.491 2.00189 12.709 2.14646 12.8536C2.29103 12.9981 2.50905 13.0401 2.69697 12.9596L6.10847 11.4975C6.2254 11.4474 6.3317 11.3754 6.42166 11.2855L13.8536 3.85355C14.0488 3.65829 14.0488 3.34171 13.8536 3.14645L11.8536 1.14645ZM4.42166 9.28547L11.5 2.20711L12.7929 3.5L5.71455 10.5784L4.21924 11.2192L3.78081 10.7808L4.42166 9.28547Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                  <span className='settings-text'>Edytuj profil</span>
                </Link>
            </div>
            {
              profileDataData?.description && <><p className='user-about'>O mnie:</p> <p>{profileDataData?.description}</p></>
            }
            <ProfileTabs userItemsList={itemsData} comments={commentsData}/>
          </div> 
            )

            :
            
            <MainNotLogged/>

        }

       

    </>
    

  );
}

