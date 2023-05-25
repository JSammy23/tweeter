import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from 'services/appContext';

import styled from 'styled-components';

// TODO:
// Fetch user name instead of listing user uid

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

    const fetchRetweetUsers = () => {
        if (tweet.retweetedBy && Array.isArray(tweet.retweetedBy)) {
          const retweetUsers = tweet.retweetedBy.filter((user) =>
            followingList.some((followingUser) => followingUser.user === user)
          );
          setSubscribedRetweetedBy(retweetUsers);
        } else {
          // Handle the case when `retweetedBy` is missing or not an array
          console.log('RetweetedBy data is missing or invalid');
        }
    };

    const renderRetweetUsers = () => {
        if (subscribedRetweetedBy.length === 1) {
          return <p>{subscribedRetweetedBy[0]} retweeted</p>;
        } else if (subscribedRetweetedBy.length > 1) {
          const displayedUsers = subscribedRetweetedBy.slice(0, 2).join(", ");
          const remainingCount = subscribedRetweetedBy.length - 2;
          const othersText = remainingCount === 1 ? "other" : "others";
          const text = `${displayedUsers}, and ${remainingCount} ${othersText} retweeted`;
          return <p>{text}</p>;
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