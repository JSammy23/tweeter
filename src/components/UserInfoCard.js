import React from 'react';

import styled from 'styled-components';
import { UserImage, Name, Handle } from './Tweet';
import useUserInfo from 'hooks/useUserInfo';

const UserCard = styled.div`
 width: 100%;
 height: auto;
 padding: .3em;
 display: flex;
 border-bottom: 1px solid ${props => props.theme.colors.secondary};
`;

const UserInfoCard = ({uid}) => {
  const { userInfo, loading } = useUserInfo(uid);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <UserCard>
      <UserImage src={userInfo?.profileImg} />
      <div className='flex column' >
        <Name>{userInfo?.displayName}</Name>
        <Handle>{userInfo?.userHandle}</Handle>
      </div>
    </UserCard>
  )
}

export default UserInfoCard