import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from 'services/appContext';
import UserProfile from './UserProfile';
import auth from 'services/auth';
import NewsFeed from './NewsFeed';
import Compose from './Compose';
import Loading from './Loading/Loading';
import Thread from './Thread';
import useUserInfo from 'hooks/useUserInfo';

import styled from 'styled-components';


const FeedContainer = styled.div`
 width: 100%;
 height: 100vh;
 /* grid-column: 2 / 3; */
 flex: 3;
 order: 1;
 overflow-y: scroll;
 border-right: 1px solid;
 border-left: 1px solid;
 border-color: ${props => props.theme.colors.secondary};

 @media (max-width: 683px) {
  padding-bottom: 3.5em;
 }

 /* Hide the scrollbar */
 &::-webkit-scrollbar {
    width: 0em;
    background-color: transparent;
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    background-color: transparent;
  }

  /* Track */
  &::-webkit-scrollbar-track {
    background-color: transparent;
  }

  /* Hide the scrollbar in Mozilla Firefox */
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;

  /* Track */
  scrollbar-track-color: transparent;

  /* Handle */
  scrollbar-thumb-color: transparent;
`;



const Feed = ({ onBackClick }) => {

  const { activeFilter, viewedUser, isUserLoaded, currentUser, setCurrentUser } = useContext(AppContext);
  const [showLikes, setShowLikes] = useState(false);
  const [showNewsFeed, setShowNewsFeed] = useState(true);

  const { loading, userInfo } = useUserInfo(auth.currentUser.uid);

  useEffect(() => {
    const setCurrentUserAsync = async () => {
      if (userInfo && !loading) {
        setCurrentUser(userInfo);
      }
    }
    setCurrentUserAsync();
  }, [userInfo, loading, setCurrentUser]);

    
  const renderByFilter = () => {
    switch (activeFilter) {
      default:
        return <Compose 
         user={currentUser}
         action='tweet' />
      case 'profile':
        return (
          <UserProfile 
          userUid={currentUser?.uid}  
          showLikes={setShowLikes}
          showNewsFeed={setShowNewsFeed} 
          />
          );
      case 'viewUser':
        return isUserLoaded ? (
          <UserProfile 
          userUid={viewedUser?.uid}  
          showLikes={setShowLikes} 
          showNewsFeed={setShowNewsFeed} 
          />
        ) : (
          <Loading />
        );
      case 'thread':
        return <Thread 
         showNewsFeed={setShowNewsFeed}
         onBackClick={onBackClick} />
    }
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <FeedContainer>
        {renderByFilter()}
        {showNewsFeed && <NewsFeed showLikes={showLikes} />}
    </FeedContainer>
  )
}

export default Feed