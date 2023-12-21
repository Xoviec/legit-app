import React from 'react';
import * as Avatar from '@radix-ui/react-avatar';
import './Avatar.css';


export const CommentsAvatar = ({avatar, nickname}) => {
    

  console.log('japierdole')

    return(
    <div style={{ display: 'flex', gap: 20 }}>
    <Avatar.Root className="CommentAvatarRoot">
      <Avatar.Image
        className="AvatarImage"
        src={avatar}
        alt="Colm Tuite"
      />
      <Avatar.Fallback className="AvatarFallback" delayMs={0}>
        {nickname[0]}
      </Avatar.Fallback>
    </Avatar.Root>

  </div>
);

}
