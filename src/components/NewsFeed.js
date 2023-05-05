import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
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
    
    const tweetsRef = collection(db, 'tweets');

    // Fetch user tweets
    const fetchUserTweets = async () => {
        const userTweetsQuery = query(tweetsRef, where('authorID', '==', user.uid), orderBy('date', 'desc'), limit(50));
        const userTweetsSnapshot = await getDocs(userTweetsQuery);
        const userTweetsData = userTweetsSnapshot.docs.map((doc) => doc.data());
        setTweets(userTweetsData);
        console.log(userTweetsData);
    };

    // Fetch all tweets for explore page
    const fetchTweets = async () => {
        const tweetsQuery = query(tweetsRef, orderBy('date', 'desc'), limit(100));
        const tweetsSnapshot = await getDocs(tweetsQuery);
        const tweetsData = tweetsSnapshot.docs.map((doc) => doc.data());
        setTweets(tweetsData);
    }


    useEffect(() => {

        if (activeFilter === 'profile') {
            fetchUserTweets();
        }
        else if (activeFilter === 'explore') {
            fetchTweets();
        }

    }, [activeFilter]);

    // TODO: renderTweets() by active filter

  return (
    <Container>
        {tweets.map((tweet) => (
            <Tweet key={tweet.date} tweet={tweet} />
        ))}
    </Container>
  )
}

export default NewsFeed