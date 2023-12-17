import React from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import './ProfileTabs.css';
import { Link, useLocation } from 'react-router-dom';

import { MyAvatar } from './Avatar';
import { CommentsAvatar } from './commentsAvatar';


export const ProfileTabs = (props) => {
  
  const location = useLocation();

  
  
  return(
    <Tabs.Root className="TabsRoot" defaultValue="tab1">
      <Tabs.List className="TabsList" aria-label="Manage your account">
        <Tabs.Trigger className="TabsTrigger" value="tab1">
          Przedmioty
        </Tabs.Trigger>
        <Tabs.Trigger className="TabsTrigger" value="tab2">
          Legit check
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content className="TabsContent" value="tab1">
        <p className='item-counter'>{props?.userItemsList?.length} przedmiotów</p>
          <div className="items-container">
              {
                props?.userItemsList?.map((item)=>(
                  <div className='item' key={item.id}>
                        {
                        location.pathname === '/main' &&

                        <div className="item-hover-button">
                        <button className='trade-item-button'>
                          Przekaz przedmiot
                        </button>
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
        {/* <p className="Text">Komentarze na profilu</p> */}
        {
          props?.comments?.map((comment)=>(
              <div className='comment-tab'>
                <CommentsAvatar avatar={comment.avatar} nickname={comment.comment_by_nickname}/>
                <div className="comment-data">
                  <Link to={`/Users/${comment.comment_by}`}>
                        <p className='comment-author'>{comment.comment_by_nickname}</p>
                    </Link>
                    <p className='comment-content'>{comment.content}</p>
                </div>

              </div>
          ))
        }
      </Tabs.Content>
    </Tabs.Root>
  );
}



