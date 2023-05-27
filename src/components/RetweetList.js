import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from 'services/appContext';
import { doc, getDoc } from 'firebase/firestore';
import db from 'services/storage';

import styled from 'styled-components';

const StyledText = styled.p`
 color: ${props => props.theme.colors.accent};
 margin-left: .3em;
 margin-top: .3em;
`;

const RetweetList = ({ tweet }) => {
    const { currentUser, followingList } = useContext(AppContext);
    const [isAuthorFollowed, setIsAuthorFollowed] = useState(null);
    const [subscribedRetweetedBy, setSubscribedRetweetedBy] = useState([]);

    useEffect(() => {
        checkIsFollowing();
    }, []);

    useEffect(() => {
        if (isAuthorFollowed) {
            return;
        };
        fetchRetweetUsers();
    }, [isAuthorFollowed]);
    

    const checkIsFollowing = () => {
        const isFollowing = followingList.some((user) => user.user === tweet.authorID);
        setIsAuthorFollowed(isFollowing);
    };

    const fetchDisplayName = async (uid) => {
        // Check if display name is already cached in local storage
        const cachedUser = localStorage.getItem(uid);
        if (cachedUser) {
          return JSON.parse(cachedUser).displayName;
        } else {
          try {
            // Fetch user document from Firestore
            const userRef = doc(db, 'users', uid);
            const userDoc = await getDoc(userRef);
            const userData = userDoc.data();
      
            // Cache display name in local storage
            localStorage.setItem(uid, JSON.stringify(userData));
      
            return userData.displayName;
          } catch (error) {
            console.error('Error fetching user display name', error);
            return null;
          }
        }
    };

    const fetchRetweetUsers = async () => {
        if (tweet.retweetedBy && Array.isArray(tweet.retweetedBy)) {
          try {
            const retweetedUsers = await Promise.all(
              tweet.retweetedBy.map(async (userUid) => {
                const displayName = await fetchDisplayName(userUid);
                return displayName;
              })
            );
            setSubscribedRetweetedBy(retweetedUsers);
          } catch (error) {
            console.error('Error fetching retweet users', error);
          }
        } else {
          // Handle the case when `retweetedBy` is missing or not an array
          console.log('RetweetedBy data is missing or invalid');
        }
    };

    const renderRetweetUsers = () => {
        if (subscribedRetweetedBy.length === 1) {
          return <StyledText>{subscribedRetweetedBy[0]} retweeted</StyledText>;
        } else if (subscribedRetweetedBy.length > 1) {
          const displayedUsers = subscribedRetweetedBy.slice(0, 2).join(", ");
          const remainingCount = subscribedRetweetedBy.length - 2;
          const othersText = remainingCount === 1 ? "other" : "others";
          const text = `${displayedUsers}, and ${remainingCount} ${othersText} retweeted`;
          return <StyledText>{text}</StyledText>;
        } else {
          return null;
        }
    };

 

  return (
    <div>
        {renderRetweetUsers()}
    </div>
  )
}

export default RetweetList;