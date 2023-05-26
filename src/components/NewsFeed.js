import { collection, getDoc, getDocs, limit, orderBy, query, startAfter, where } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from 'services/appContext';
import db from 'services/storage';
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

    const { activeFilter, viewedUser, currentUser, followingList } = useContext(AppContext);
    const [tweets, setTweets] = useState([]);
    const [userTweets, setUserTweets] = useState([]);
    const [subscribedTweets, setSubscribedTweets] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const tweetsRef = collection(db, 'tweets');
    
    const subscribedPaginationParams = {
        startAfterDoc: null,
        limit: 50
    };
      
    const explorePaginationParams = {
        startAfterDoc: null,
        limit: 100
    };
    

    const fetchTweets = async (paginationParams, tweetsRef) => {
        const { startAfterDoc, limitValue } = paginationParams;
      
        let tweetsQuery = query(
          tweetsRef,
          orderBy('date', 'desc'),
          limit(limitValue)
        );
      
        if (startAfterDoc) {
          tweetsQuery = query(
            tweetsRef,
            orderBy('date', 'desc'),
            startAfter(startAfterDoc.date),
            limit(limitValue)
          );
        }
      
        const tweetsSnapshot = await getDocs(tweetsQuery);
        const tweetsData = tweetsSnapshot.docs.map((doc) => doc.data());
        
        return tweetsData;
    };

    const handleLoadMoreTweets = async () => {
        const lastTweet = tweets[tweets.length - 1];
        
        const nextPaginationParams = {
          startAfterDoc: lastTweet,
          limit: 50
        };
      
        const newTweetsData = await fetchTweets(nextPaginationParams);
        
        // Append the new tweets to the existing tweets list
        setTweets((prevTweets) => [...prevTweets, ...newTweetsData]);
    };
    

    // Fetch subscribed tweets
    const fetchSubscribedTweets = async () => {
        try {
          setLoading(true); // Set loading state to true before fetching
      
          const subscribedTweets = [];
      
          for (const user of followingList) {
            const userTweetBucketRef = collection(db, 'users', user.user, 'tweetBucket');
            const userTweetBucketQuery = query(userTweetBucketRef, orderBy('date', 'desc'));
            const userTweetBucketSnapshot = await getDocs(userTweetBucketQuery);
      
            // Extract the tweet IDs from the document snapshots
            const tweetIds = userTweetBucketSnapshot.docs.map((doc) => doc.data().tweetID);
      
            // Use the tweet IDs to query the tweets collection to retrieve the actual tweet documents
            const subscribedTweetsQuery = query(tweetsRef, where('__name__', 'in', tweetIds));
            const tweetsSnapshot = await getDocs(subscribedTweetsQuery);
            const tweetsData = tweetsSnapshot.docs.map((doc) => doc.data());
      
            // Update the subscribedTweets state for the current user
            subscribedTweets.push(...tweetsData);
          }
      
          subscribedTweets.sort((a, b) => b.date - a.date);
      
          // Set the subscribedTweets state with all the fetched tweet data
          setSubscribedTweets(subscribedTweets);
        } catch (error) {
          console.error('Error fetching subscribed tweets:', error);
          // Handle the error if needed
        } finally {
          setLoading(false); // Set loading state to false after fetching
        }
    };

    // Fetch user tweets
    const fetchUserTweets = async (uid) => {
        const userTweetBucketRef = collection(db, 'users', uid, 'tweetBucket');
        const userTweetBucketQuery = query(userTweetBucketRef);
        const userTweetBucketSnapshot = await getDocs(userTweetBucketQuery);

        // Extract the tweet IDs from the document snapshots
        const tweetIds = userTweetBucketSnapshot.docs.map((doc) => doc.data().tweetID);

        // Use the tweet IDs to query the tweets collection to retrieve the actual tweet documents
        const tweetsQuery = query(tweetsRef, where('__name__', 'in', tweetIds));
        const tweetsSnapshot = await getDocs(tweetsQuery);
        const tweetsData = tweetsSnapshot.docs.map((doc) => doc.data());
        // Sort by date in descending order
        tweetsData.sort((a, b) => b.date - a.date);
        setUserTweets(tweetsData);
    };

    useEffect(() => {
        if (!currentUser) {
            return
        }
        if (activeFilter === 'home') {
            fetchSubscribedTweets()
        };
    }, [activeFilter, currentUser]);
    
    useEffect(() => {
        if (!currentUser) {
            return;
        }
        if (activeFilter !== 'viewUser') {
            fetchUserTweets(currentUser.uid);
        }
    }, [currentUser, activeFilter]);

    // useEffect(() => {
    //     // Fetch all tweets for explore page
    //     const fetchTweets = async () => {
    //         let tweetsQuery = query(tweetsRef, orderBy('date', 'desc'), limit(100));
    //         if (tweets.length > 0) {
    //             const lastTweet = tweets[tweets.length - 1];
    //             tweetsQuery = query(tweetsRef, orderBy('date', 'desc'), startAfter(lastTweet.date), limit(50));
    //         }
    //         const tweetsSnapshot = await getDocs(tweetsQuery);
    //         const tweetsData = tweetsSnapshot.docs.map((doc) => doc.data());
    //         console.log(tweetsData);
    //         setTweets(tweetsData);
    //     };
    //     fetchTweets();
    // }, []);

    useEffect(() => {
        const intitialPaginationParams = {
            startAfterDoc: null,
            limit: 100,
        };

        const fetchInitialTweets = async () => {
            const tweetsData = await fetchTweets(intitialPaginationParams, tweetsRef);
            setTweets(tweetsData);
        };

        fetchInitialTweets();
    }, []);

    useEffect(() => {
        if (activeFilter !== 'viewUser') {
            return;
        }
        fetchUserTweets(viewedUser?.uid);
    }, [activeFilter, viewedUser]);

    if (!currentUser) {
        return <Loading />;
    };

    const mapTweetsToComponents = (tweets) => {
        return tweets.map((tweet) => <Tweet key={tweet.date} tweet={tweet} />);
    };



    // TODO: render home filter tweets, only tweets and retweets of following. 
    const renderTweets = () => {
        let tweetArray;
        switch (activeFilter) {
            case 'profile':
            case 'viewUser':
                tweetArray = userTweets;
                break;
            case 'explore':
                tweetArray = tweets;
                break;
            case 'home':
                tweetArray = subscribedTweets;
                break;
            default:
                tweetArray = [];
                break;
        };

        return mapTweetsToComponents(tweetArray);
    };

  return (
    <Container>
        {loading && (<Loading />)}
        {renderTweets()}
    </Container>
  )
}

export default NewsFeed