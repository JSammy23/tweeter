import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from 'services/appContext';
import UserProfile from './UserProfile';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import db from 'services/storage';
import auth from 'services/auth';
import NewsFeed from './NewsFeed';
import Compose from './Compose';
import Loading from './Loading/Loading';


import styled from 'styled-components';


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

    const { activeFilter, viewedUser, isUserLoaded, currentUser, setCurrentUser } = useContext(AppContext);
    

    useEffect(() => {
      console.log('Feed Mounted!')
    },[]);

    const getUserData = async (userUid) => {
      try {
        const userDocRef = doc(db, "users", userUid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          setCurrentUser(userDocSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.log(error);
      }
    };

    useEffect(() => {
      getUserData(auth.currentUser.uid);
    }, []);

  

  // useEffect(() => {
  //     if (user) {
  //       const userRef = doc(db, 'users', user.uid);
  //       const unsubscribe = onSnapshot(userRef, (doc) => {
  //         if (doc.exists()) {
  //           setUser(doc.data());
  //         }
  //         else {
  //           setUser(null);
  //         }
  //       });
  //       return unsubscribe;
  //     }
  // }, [user]);

  const renderByFilter = () => {
    switch (activeFilter) {
      default:
        return <Compose user={currentUser} />;
      case 'profile':
        return <UserProfile user={currentUser} isCurrentUser={true} />
      case 'viewUser':
        return isUserLoaded ? (
          <UserProfile user={viewedUser} isCurrentUser={auth.currentUser.uid === viewedUser.uid} />
        ) : (
          <Loading />
        )
    }
  }

  return (
    <FeedContainer>
        {renderByFilter()}
        <NewsFeed />
    </FeedContainer>
  )
}

export default Feed