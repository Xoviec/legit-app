import React from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import './ProfileTabs.css';
import { Link } from 'react-router-dom';
import { MyAvatar } from './Avatar';


export const ProfileTabs = (props) => (
  <Tabs.Root className="TabsRoot" defaultValue="tab1">
    <Tabs.List className="TabsList" aria-label="Manage your account">
      <Tabs.Trigger className="TabsTrigger" value="tab1">
        Przedmioty
      </Tabs.Trigger>
      <Tabs.Trigger className="TabsTrigger" value="tab2">
        Komentarze
      </Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content className="TabsContent" value="tab1">
      <p className='item-counter'>{props?.userItemsList?.length} przedmiotów</p>
        <div className="items-container">
            {
              props?.userItemsList?.map((item)=>(
                <div className='item' key={item.id}>
                  <div className="item-hover-button">xd</div>
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
      <p className="Text">Komentarze na profilu</p>
      {
        props?.comments?.map((comment)=>(
            <div className='comment-tab'>
              {/* <MyAvatar user={comment}/> */}
              <div className="comment-data">
                <Link to={`/Users/${comment.comment_by}`}>
                      <p className='comment-author'>{comment.comment_by}</p>
                  </Link>
                  <p>{comment.content}</p>
              </div>

            </div>
        ))
      }
    </Tabs.Content>
  </Tabs.Root>
);
