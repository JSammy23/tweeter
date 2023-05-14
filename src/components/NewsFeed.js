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

// TODO: 
    // Optimize tweet fetching so the same tweets aren't being grabbed repeatedly
    // A load more tweets function to grab older tweets
    // A refresh tweets for the latest tweets since last fetch
    // Grab user tweets from tweetBucket

const NewsFeed = ({ user }) => {

    const { activeFilter, setActiveFilter } = useContext(AppContext);
    const [tweets, setTweets] = useState([]);
    const [userTweets, setUserTweets] = useState([]);
    const [followingTweets, setFollowingTweets] = useState([]);
    const [lastTweetTimestamp, setLastTweetTimestamp] = useState(null);
    
    const tweetsRef = collection(db, 'tweets');
    const userTweetBucketRef = collection(db, 'users', user.uid, 'tweetBucket');

    // useEffect(() => {
    //     console.log('NewsFeed Mounted!', user)
    //   }, []);

    
    useEffect(() => {
        if (!user) {
            return;
        }

        // Fetch user tweets
        const fetchUserTweets = async () => {
            const userTweetBucketQuery = query(userTweetBucketRef, orderBy('date', 'desc'), limit(50));
            const userTweetBucketSnapshot = await getDocs(userTweetBucketQuery);

            // Extract the tweet IDs from the document snapshots
            const tweetIds = userTweetBucketSnapshot.docs.map((doc) => doc.data().tweetId);

            // Use the tweet IDs to query the tweets collection to retrieve the actual tweet documents
            const tweetsQuery = query(tweetsRef, where(db.firestore.FieldPath.documentId(), 'in', tweetIds));
            const tweetsSnapshot = await getDocs(tweetsQuery);
            const tweetsData = tweetsSnapshot.docs.map((doc) => doc.data());
            setUserTweets(tweetsData);
            console.log(tweetsData);



            // let userTweetsQuery = query(tweetsRef, where('authorID', '==', user.uid), orderBy('date', 'desc'), limit(50));
            // if (userTweets.length > 0) {
            //     const lastTweet = userTweets[userTweets.length - 1];
            //     userTweetsQuery = query(tweetsRef, orderBy('date', 'desc'), startAfter(lastTweet.date), limit(50));
            // }
            
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

        // Fetch tweets for acounts user follows

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