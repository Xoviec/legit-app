import React from 'react';
import * as Avatar from '@radix-ui/react-avatar';
import './Avatar.css';


export const MyAvatar = (props) => {
    

    return(
    <div style={{ display: 'flex', gap: 20 }}>
    <Avatar.Root className="AvatarRoot">
      <Avatar.Image
        className="AvatarImage"
        src={props?.user?.avatar}
        alt="Colm Tuite"
      />
      <Avatar.Fallback className="AvatarFallback" delayMs={0}>
        {props?.user?.nickname[0]}
      </Avatar.Fallback>
    </Avatar.Root>

  </div>
);

}

