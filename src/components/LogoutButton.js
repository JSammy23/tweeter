import React, { useContext } from 'react';
import { AppContext } from 'services/appContext';
import { logout } from 'services/auth';
import db from 'services/storage';
import { query, getDoc, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

import styled from 'styled-components';

const StyledButton = styled.button`
 background-color: ${props => props.theme.colors.primary};
 font-size: 1em;
 padding: .5em;
 border-radius: 10px;
 border: none;
 outline: none;
 cursor: pointer;

 &:hover {
     background-color: ${props => props.theme.colors.accent};
 }
`;

const LogoutButton = () => {
    const { currentUser } = useContext(AppContext);

    const userLikedTweetsRef = currentUser ? collection(db, 'users', currentUser.uid, 'likes') : null;
    const userRetweetTweetsRef = currentUser ? collection(db, 'users', currentUser.uid, 'retweets') : null;
    

    const cleanupDeletedTweets = async (userTweetsRef) => {
        const tweetsRef = collection(db, 'tweets');
        const tweetsQuery = query(userTweetsRef);
        const tweetsSnapshot = await getDocs(tweetsQuery);
        const tweetsDocs = tweetsSnapshot.docs;
      
        const cleanupTasks = tweetsDocs.map(async (tweetDoc) => {
          const tweetID = tweetDoc.data().tweetID;
          const tweetDocRef = doc(tweetsRef, tweetID);
          const tweetDocSnapshot = await getDoc(tweetDocRef);
          if (!tweetDocSnapshot.exists()) {
            // Delete the reference to the deleted tweet from the user's liked tweets list
            await deleteDoc(tweetDoc.ref);
          }
        });
      
        await Promise.all(cleanupTasks);
    };

    const handleLogout = async () => {
        localStorage.clear();
        cleanupDeletedTweets(userLikedTweetsRef);
        cleanupDeletedTweets(userRetweetTweetsRef);
        logout();
    };

  return (
    <StyledButton onClick={handleLogout}>
        Log Out
    </StyledButton>
  )
}

export default LogoutButton