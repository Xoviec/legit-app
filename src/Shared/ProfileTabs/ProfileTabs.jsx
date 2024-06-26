import React from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import './ProfileTabs.css';
import { Link, useLocation } from 'react-router-dom';
import { format, formatDistance, formatRelative, subDays } from 'date-fns'
import { pl } from 'date-fns/locale'
import { MyAvatar } from '../Avatar/Avatar';
import { CommentsAvatar } from '../Avatar/commentsAvatar';
import { ItemDialog } from '../Dialog/ItemDialog';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRef } from 'react';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { DisplayItemCard } from '../DisplayItemCard/DisplayItemCard';
import { DisplayItemCardSkeleton } from '../Skeleton/DisplayCardSkeleton/DisplayItemCardSkeleton';
import { memo } from 'react';
import { useUser } from '../../Context/Context';
import { SortMenu } from '../../Components/SortMenu/SortMenu';

export const ProfileTabs = memo((props) => {
  
  const location = useLocation();
  const textareaRef = useRef()
  const user = useUser()
  

  const notify = (nickname) => toast.success(`Przedmiot przesłany pomyślnie do uzytkownika ${nickname}`, {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    });

  const tradeError = () => toast.error('Błąd podczas przesyłania przedmiotu', {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    });

  const addComment = (e) =>{
    e.preventDefault()
    if((e.target.comment.value).length > 0){
      props.handleAddComment(e)
      textareaRef.current.value = ''
    }
  }

  return(
    <Tabs.Root className="TabsRoot" defaultValue="tab1">
      <Tabs.List className="TabsList" aria-label="Manage your account">
        <Tabs.Trigger className="TabsTrigger" value="tab1">
          Przedmioty ({props?.userItemsList?.length})
        </Tabs.Trigger>
        <Tabs.Trigger className="TabsTrigger" value="tab2">
          Komentarze ({props?.comments?.length})
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content className="TabsContent" value="tab1">
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />       
      <SortMenu changeSort={props.changeSort} sort={props.sort} order={props.order} handleOrderSwitch={props.handleOrderSwitch} changeSetSearchItem={props.changeSetSearchItem}/>

          <div className="items-container">
              {
                props?.userItemsList?.map((item)=>(
                  <DisplayItemCard key={item.id} item={item} notify={notify} tradeError={tradeError}/>
                ))
                ||
                Array.from(Array(9).keys()).map((num,i)=>(
                  <DisplayItemCardSkeleton key={i} num={num}/>
                ))

              }
          </div>
      </Tabs.Content>
      <Tabs.Content className="TabsContent" value="tab2">

        {
          location.pathname !== '/main' && user ?      

          <div className='add-comment-section'> 
          <CommentsAvatar avatar={props?.viewer?.avatar} nickname={props?.viewer?.nickname}/>
          <form className="add-comment-form" onSubmit={addComment}>
            <textarea ref={textareaRef} className='textarea-add-comment' placeholder='Dodaj komentarz' name='comment' type="text" />
            <button type='submit'>Dodaj komentarz</button>
          </form>
          </div>
          :
          !user && 
          <div className='add-comment-section-not-logged'>
            <p>Zaloguj się aby zamieścić komentarz</p>
          </div>
      
        }
        
        {
          props?.comments?.map((comment)=>(
              <div key={comment.id} className='comment-tab'>
                <div className="comment-data">
                  <CommentsAvatar avatar={comment.avatar} nickname={comment.comment_by_nickname}/>
                    <div className="comment-right-side">
                    <div className="comment-info">
                      <Link to={`/Users/${comment.comment_by_nickname}`}>
                          <p className='comment-author'>{comment.comment_by_nickname}</p>
                        </Link>
                          <div className="comment-date">
                            {
                              formatDistance(subDays(comment.created_at, 0), new Date(), { locale: pl })
                            }
                            <span> temu</span>
                          </div>
                          {
                            comment?.comment_by===props?.viewer?.id && 

                            <div className="delete">
                              <button className='button-delete' onClick={(event)=>props.handleDeleteComment(event, comment.id)}>
                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H5H10H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H11V12C11 12.5523 10.5523 13 10 13H5C4.44772 13 4 12.5523 4 12V4L3.5 4C3.22386 4 3 3.77614 3 3.5ZM5 4H10V12H5V4Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                              </button>
                            </div>
                            
                          }
                    </div>
                        <p className='comment-content'>{comment.content}</p>
                    </div>
                    
                </div>
             
         

              </div>
              ||

              <div>
                xD
              </div>
          ))
        }
      </Tabs.Content>
    </Tabs.Root>
  );
})



