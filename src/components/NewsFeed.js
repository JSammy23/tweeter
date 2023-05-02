import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from 'services/appContext';
import db from 'services/storage';
import Tweet from './Tweet';

import styled from 'styled-components';


const Container = styled.div`
 width: 100%;
 margin-left: auto;
 margin-right: auto;
 display: flex;
 flex-direction: column;
`;


const NewsFeed = ({ user }) => {

    const { activeFilter, setActiveFilter } = useContext(AppContext);
    const [tweets, setTweets] = useState([]);
    
    useEffect(() => {
        // Fetch user tweets
        const fetchUserTweets = async () => {
            const userTweetsRef = collection(db, 'tweets');
            const userTweetsQuery = query(userTweetsRef, where('authorID', '==', user.uid));
            const userTweetsSnapshot = await getDocs(userTweetsQuery);
            const userTweetsData = userTweetsSnapshot.docs.map((doc) => doc.data());
            setTweets(userTweetsData);
            console.log(userTweetsData);
        };

        if (activeFilter === 'profile') {
            fetchUserTweets();
        };

    }, [activeFilter]);

    // TODO: renderTweets() by active filter

  return (
    <Container>
        {tweets.map((tweet) => (
            <Tweet key={tweet.id} tweet={tweet} />
        ))}
    </Container>
  )
}

export default NewsFeed