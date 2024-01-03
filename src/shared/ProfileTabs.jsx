import React from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import './ProfileTabs.css';
import { Link, useLocation } from 'react-router-dom';
import { MyAvatar } from './Avatar';
import { CommentsAvatar } from './commentsAvatar';
import { ItemDialog } from './ItemDialog';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export const ProfileTabs = (props) => {
  
  const location = useLocation();

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




  
  
  return(
    <Tabs.Root className="TabsRoot" defaultValue="tab1">
      <Tabs.List className="TabsList" aria-label="Manage your account">
        <Tabs.Trigger className="TabsTrigger" value="tab1">
          Przedmioty ({props?.userItemsList?.length})
        </Tabs.Trigger>
        <Tabs.Trigger className="TabsTrigger" value="tab2">
          Legit check
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
          {/* <p className='item-counter'> przedmiotów</p> */}
          <div className="items-container">
              {
                props?.userItemsList?.map((item)=>(
                  <div className='item' key={item.id}>
                        {
                        location.pathname === '/main' &&

                        <div className="item-hover-button">
                          <ItemDialog notify={notify} tradeError={tradeError} item={item}/>
                          {/* Przekaz przedmiot */}
                      </div>
                      }
                
                    <div className="image">
                      <img src={item.image} alt="" />
                    </div>
                    <p className='item-name'>{item.name}</p> 
                    <p className='item-registered'>Registered <span className='register-date'>{item.legited_at.slice(0, 10)}</span></p>
                  </div>
                ))
              }
          </div>
      </Tabs.Content>
      <Tabs.Content className="TabsContent" value="tab2">

        {
          location.pathname !== '/main' &&      

          <form className="add-comment-tab" onSubmit={props.handleAddComment}>
            <textarea className='textarea-add-comment' placeholder='Dodaj komentarz' name='comment' type="text" />
            {/* <input placeholder='ocena 1-5' type="text" min={0} max={5} /> */}
            <button type='submit'>Wyślij</button>
          </form>
        }
        
        {
          props?.comments?.map((comment)=>(
              <div key={comment.id} className='comment-tab'>
                <CommentsAvatar avatar={comment.avatar} nickname={comment.comment_by_nickname}/>
                <div className="comment-data">
                  <Link to={`/Users/${comment.comment_by_nickname}`}>
                    <p className='comment-author'>{comment.comment_by_nickname}</p>
                  </Link>
                  <p className='comment-content'>{comment.content}</p>
  
                </div>
                {
                  comment?.comment_by===props?.viewer?.id && 

                  <div className="delete">
                    <button className='button-delete' onClick={(event)=>props.handleDeleteComment(event, comment.id)}>
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H5H10H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H11V12C11 12.5523 10.5523 13 10 13H5C4.44772 13 4 12.5523 4 12V4L3.5 4C3.22386 4 3 3.77614 3 3.5ZM5 4H10V12H5V4Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
                    </button>
                  </div>
                     
                }

              </div>
          ))
        }
      </Tabs.Content>
    </Tabs.Root>
  );
}



