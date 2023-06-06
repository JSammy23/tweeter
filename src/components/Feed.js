import React, { useContext, useState } from 'react';
import { AppContext } from 'services/appContext';
import UserProfile from './UserProfile';
import auth from 'services/auth';
import NewsFeed from './NewsFeed';
import Compose from './Compose';
import Loading from './Loading/Loading';


import styled from 'styled-components';
import useUserData from 'hooks/useUserData';


const FeedContainer = styled.div`
 width: 100%;
 height: 100%;
 grid-column: 2 / 3;
 overflow-y: scroll;
 border-right: 1px solid;
 border-left: 1px solid;
 border-color: ${props => props.theme.colors.secondary};

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



const Feed = () => {

  const { activeFilter, viewedUser, isUserLoaded, currentUser } = useContext(AppContext);
  const [showLikes, setShowLikes] = useState(false);
  const [showNewsFeed, setShowNewsFeed] = useState(true);

  const { loading } = useUserData(auth.currentUser.uid);

    
  const renderByFilter = () => {
    switch (activeFilter) {
      default:
        return <Compose user={currentUser} />
      case 'profile':
        return (
          <UserProfile 
          user={currentUser} 
          isCurrentUser={true} 
          showLikes={setShowLikes}
          showNewsFeed={setShowNewsFeed} 
          />
          );
      case 'viewUser':
        return isUserLoaded ? (
          <UserProfile 
          user={viewedUser} 
          isCurrentUser={auth.currentUser.uid === viewedUser.uid} 
          showLikes={setShowLikes} 
          showNewsFeed={setShowNewsFeed} 
          />
        ) : (
          <Loading />
        );
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