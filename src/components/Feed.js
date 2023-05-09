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



const FeedContainer = styled.div`
 width: 100%;
 height: 100%;
 border-right: 1px solid;
 border-left: 1px solid;
 border-color: ${props => props.theme.colors.secondary};
`;



const Feed = () => {

    const { activeFilter, setActiveFilter } = useContext(AppContext);
    const [user, setUser] = useState(null);

    useEffect(() => {
      console.log('Feed Mounted!')
    },[]);

    useEffect(() => {
      const getUserData = async () => {
        try {
          const userDocRef = doc(db, "users", auth.currentUser.uid);
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
      
      getUserData();
      
    }, []);

  //   useEffect(() => {
  //     const unsubscribe = onAuthStateChanged(auth, async (user) => {
  //         if (user) {
  //             const userRef = doc(db, 'users', user.uid);
  //             const userDoc = await getDoc(userRef);

  //             if (userDoc.exists()) {
  //                 setUser(userDoc.data());
  //             }
  //             else {
  //                 setUser(null);
  //             }
  //         }
  //     });
  //     return unsubscribe
  // }, []);

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
        return <UserProfile user={user} />
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