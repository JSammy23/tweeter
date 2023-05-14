import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from 'services/appContext';
import UserProfile from './UserProfile';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import db from 'services/storage';
import { onAuthStateChanged } from 'firebase/auth';
import auth from 'services/auth';


import styled from 'styled-components';
import NewsFeed from './NewsFeed';
import Compose from './Compose';
import Loading from './Loading/Loading';



const FeedContainer = styled.div`
 width: 100%;
 height: 100%;
 border-right: 1px solid;
 border-left: 1px solid;
 border-color: ${props => props.theme.colors.secondary};
`;



const Feed = () => {

    const { activeFilter, viewedUser, isUserLoaded, user, setUser } = useContext(AppContext);
    

    useEffect(() => {
      console.log('Feed Mounted!')
    },[]);

    const getUserData = async (userUid) => {
      try {
        const userDocRef = doc(db, "users", userUid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          setUser(userDocSnap.data());
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
        return <Compose user={user} />;
      case 'profile':
        return <UserProfile user={user} isCurrentUser={true} />
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
        <NewsFeed user={user} />
    </FeedContainer>
  )
}

export default Feed