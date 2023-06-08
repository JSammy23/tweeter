import React from 'react';
import UserInfoCard from './UserInfoCard';

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/fontawesome-free-solid';

const Header = styled.div`
 background-color: rgba(0, 0, 0, .6);
 color: ${props => props.theme.colors.accent};
 width: 100%;
 height: 5.6em;
 padding: .3em;
`;

const StyledIcon = styled(FontAwesomeIcon)`
 cursor: pointer;
 color: inherit;
 font-size: 1.4em;
 margin: .3em 0;

 &:hover {
  color: ${props => props.theme.colors.primary};
 }
`;

const FollowList = ({ user, followers, following, onBackClick, listType }) => {
  let userList = [];

  if (listType === 'followers') {
    userList = followers;
  } else if (listType === 'following') {
    userList = following;
  };

  return (
    <div>
        <Header>
          <h2>{user.displayName}</h2>
          <h2>{user.userHandle}</h2>
          <StyledIcon icon={faArrowLeft} onClick={onBackClick} />
        </Header>
        {userList.map(uid => (
        <UserInfoCard key={uid} uid={uid} />
      ))}
    </div>
  )
}

export default FollowList