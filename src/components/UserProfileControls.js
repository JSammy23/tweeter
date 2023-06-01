import React, { useState } from 'react';

import styled from 'styled-components';

const StyledTab = styled.button`
 background-color: transparent;
 color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.secondary};
 border: none;
 border-bottom: ${props => props.active ? `3px solid ${props.theme.colors.accent}` : 'none'};
 padding: .3em;
 font-size: 1em;
 margin-top: 1em;
 cursor: pointer;
`;

// TODO: Render liked tweets when activeTab is 'likes'.

const UserProfileControls = () => {
    const [activeTab, setActiveTab] = useState('userTweets');

    const navItems = [
        {id: 'userTweets', text: 'Tweets'},
        {id: 'userLikes', text: 'Likes'},
    ];

  return (
    <div className='flex around'>
        {navItems.map((item) => (
            <StyledTab
            key={item.id}
            active={item.id === activeTab}
            onClick={() => setActiveTab(item.id)}
            >
                {item.text}
            </StyledTab>
        ))}
    </div>
  );
};

export default UserProfileControls