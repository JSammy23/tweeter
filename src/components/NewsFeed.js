import { collection, getDocs, limit, orderBy, query, startAfter, where } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from 'services/appContext';
import db from 'services/storage';
import auth from 'services/auth';
import Tweet from './Tweet';
import Loading from './Loading/Loading';

import styled from 'styled-components';


const Container = styled.div`
 width: 100%;
 margin-left: auto;
 margin-right: auto;
 display: flex;
 flex-direction: column;
`;


const NewsFeed = ({ user }) => {
    // TODO: 
    // 1. Optimize tweet fetching so the same tweets aren't being grabbed repeatedly

    const { activeFilter, setActiveFilter } = useContext(AppContext);
    const [tweets, setTweets] = useState([]);
    const [userTweets, setUserTweets] = useState([]);
    const [lastTweetTimestamp, setLastTweetTimestamp] = useState(null);
    
    const tweetsRef = collection(db, 'tweets');
    // const userTweetBucketRef = collection(db, 'users', user.uid, 'tweetBucket');

    // useEffect(() => {
    //     console.log('NewsFeed Mounted!', user)
    //   }, []);

    
    useEffect(() => {
        if (!user) {
            return;
        }

        // Fetch user tweets
        const fetchUserTweets = async () => {
            let userTweetsQuery = query(tweetsRef, where('authorID', '==', user.uid), orderBy('date', 'desc'), limit(50));
            if (userTweets.length > 0) {
                const lastTweet = userTweets[userTweets.length - 1];
                userTweetsQuery = query(tweetsRef, orderBy('date', 'desc'), startAfter(lastTweet.date), limit(50));
            }
            const userTweetsSnapshot = await getDocs(userTweetsQuery);
            const userTweetsData = userTweetsSnapshot.docs.map((doc) => doc.data());
            setUserTweets(userTweetsData);
            console.log(userTweetsData);
        };
    
        // Fetch all tweets for explore page
        const fetchTweets = async () => {
            let tweetsQuery = query(tweetsRef, orderBy('date', 'desc'), limit(100));
            if (tweets.length > 0) {
                const lastTweet = tweets[tweets.length - 1];
                tweetsQuery = query(tweetsRef, orderBy('date', 'desc'), startAfter(lastTweet.date), limit(50));
            }
            const tweetsSnapshot = await getDocs(tweetsQuery);
            const tweetsData = tweetsSnapshot.docs.map((doc) => doc.data());
            console.log(tweetsData);
            setTweets(tweetsData);
        };

        fetchTweets();
        fetchUserTweets();

    }, [user]);

    if (!user) {
        return <Loading />;
    };

    // TODO: render home filter tweets, only tweets and retweets of following. 
    const renderTweets = () => {
        switch (activeFilter) {
            case 'profile':
                return userTweets.map((tweet) => (
                    <Tweet key={tweet.date} tweet={tweet} />
                ));
            case 'explore':
                return tweets.map((tweet) => (
                    <Tweet key={tweet.date} tweet={tweet} />
                ));
            default:
                return null;
        };
    };

  return (
    <Container>
        {renderTweets()}
    </Container>
  )
}

export default NewsFeed