import React from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import './ProfileTabs.css';

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
        <div className="items-container">
            {
              props?.userItemsList?.map((item)=>(
                <div className='item' key={item.id}>
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
                <p className='comment-author'>{comment.comment_by}</p>
                <p>{comment.content}</p>
            </div>
        ))
      }
    </Tabs.Content>
  </Tabs.Root>
);
