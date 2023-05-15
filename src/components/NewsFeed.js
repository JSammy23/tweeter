import { collection, getDocs, limit, orderBy, query, startAfter, where, FieldPath, doc, documentId } from 'firebase/firestore';
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

// TODO: 
    // Optimize tweet fetching so the same tweets aren't being grabbed repeatedly
    // A load more tweets function to grab older tweets
    // A refresh tweets for the latest tweets since last fetch

const NewsFeed = () => {

    const { activeFilter, setActiveFilter, viewedUser, user } = useContext(AppContext);
    const [tweets, setTweets] = useState([]);
    const [userTweets, setUserTweets] = useState([]);
    const [followingTweets, setFollowingTweets] = useState([]);
    const [lastTweetTimestamp, setLastTweetTimestamp] = useState(null);
    
    const tweetsRef = collection(db, 'tweets');
    

    // useEffect(() => {
    //     console.log('NewsFeed Mounted!', user)
    //   }, []);

    // Fetch user tweets
    const fetchUserTweets = async (uid) => {
        const userTweetBucketRef = collection(db, 'users', uid, 'tweetBucket');
        const userTweetBucketQuery = query(userTweetBucketRef, orderBy('date', 'desc'), limit(50));
        const userTweetBucketSnapshot = await getDocs(userTweetBucketQuery);

        // Extract the tweet IDs from the document snapshots
        const tweetIds = userTweetBucketSnapshot.docs.map((doc) => doc.data().tweetID);

        // Use the tweet IDs to query the tweets collection to retrieve the actual tweet documents
        const tweetsQuery = query(tweetsRef, where('__name__', 'in', tweetIds));
        const tweetsSnapshot = await getDocs(tweetsQuery);
        const tweetsData = tweetsSnapshot.docs.map((doc) => doc.data());
        setUserTweets(tweetsData);
        console.log(tweetsData);
    };
    
    useEffect(() => {
        if (!user) {
            return;
        }
        if (activeFilter !== 'viewUser') {
            fetchUserTweets(user.uid);
        }
    }, [user, activeFilter]);

    useEffect(() => {
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
    }, []);

    useEffect(() => {
        if (activeFilter !== 'viewUser') {
            return;
        }
        fetchUserTweets(viewedUser?.uid);
    }, [activeFilter, viewedUser]);

    if (!user) {
        return <Loading />;
    };

    // TODO: render home filter tweets, only tweets and retweets of following. 
    const renderTweets = () => {
        switch (activeFilter) {
            case 'profile':
            case 'viewUser':
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