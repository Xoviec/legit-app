import React from 'react';
import * as Avatar from '@radix-ui/react-avatar';
import './Avatar.css';


export const CommentsAvatar = ({avatar, nickname}) => {
    

    return(
    <div style={{ display: 'flex', gap: 20 }}>
    <Avatar.Root className="CommentAvatarRoot">
      <Avatar.Image
        className="AvatarImage"
        src={avatar}
        alt="Colm Tuite"
      />
      <Avatar.Fallback className="AvatarFallback" delayMs={0}>
        {nickname ? nickname[0] : 'U'}
      </Avatar.Fallback>
    </Avatar.Root>

  </div>
);

}

