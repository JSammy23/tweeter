import React from 'react';
import FollowButton from './FollowButton';
import { useUserProfileClick } from 'hooks/useUserProfileClick';

import styled from 'styled-components';
import { UserImage, Name, Handle } from '../styles/tweetStyles';
import useUserInfo from 'hooks/useUserInfo';
import { useNavigate } from 'react-router-dom';

const UserCard = styled.div`
 width: 100%;
 height: auto;
 padding: .3em;
 display: flex;
 border-bottom: 1px solid ${props => props.theme.colors.secondary};
`;

const Container = styled.div`
 margin-left: auto;
 width: 40%;
`;

const UserInfoCard = ({ uid, onBackClick }) => {
  const { userInfo, loading } = useUserInfo(uid);
  const navigate = useNavigate();
  // const handleUserProfileClick = useUserProfileClick();

  const handleUserProfileClickWithBackClick = () => {
    // onBackClick();
    navigate(`/profile/${uid}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <UserCard>
      <UserImage src={userInfo?.profileImg} onClick={handleUserProfileClickWithBackClick} />
      <div className='flex column' >
        <Name>{userInfo?.displayName}</Name>
        <Handle onClick={handleUserProfileClickWithBackClick}>{userInfo?.userHandle}</Handle>
      </div>
      <Container>
        <FollowButton user={uid} />
      </Container>
    </UserCard>
  )
}

export default UserInfoCard