import React, { useEffect, useState } from 'react';
import Tweet from './Tweet';
import { fetchFromFirestore } from 'utilities/firebaseUtils';
import { fetchFromUserSubCollection } from 'utilities/tweetUtilites';

const TweetFetcher = ({ userUid, showLikes }) => {

    const [userTweetBucket, setUserTweetBucket] = useState([]);
    const [userLikes, setUserLikes] = useState([]);

    useEffect(() => {
        const fetchTweets = async () => {
            try {
                const userTweets = await fetchFromUserSubCollection(userUid, 'tweetBucket');
                setUserTweetBucket(userTweets); // To set the fetched tweets to the data state
                const userLikes = await fetchFromUserSubCollection(userUid, 'likes');
                setUserLikes(userLikes);
            } catch (error) {
                console.error("Error fetching tweets:", error);
            }
        }

        fetchTweets();  // Invoke the fetchTweets function
    }, [userUid]); 

    const mapTweetsToComponents = (tweets) => {
        if (tweets.length === 0) {
            return;
        } else {
            return tweets.map((tweet) => <Tweet key={tweet.id} tweet={tweet} />);
        }
    };

    const renderTweets = () => {
        let tweets;
        if (showLikes) {
            tweets = userLikes;
        } else {
            tweets = userTweetBucket
        }
        return mapTweetsToComponents(tweets);
    };

  return (
    <div>{renderTweets()}</div>
  )
}

export default TweetFetcher