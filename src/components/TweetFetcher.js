import React, { useEffect, useState } from 'react';
import Tweet from './Tweet';

const TweetFetcher = ({ userUid, showLikes, fetchDataFunction, showType }) => {

    const [tweetData, setTweetData] = useState({
        userTweets: [],
        userLikes: [],
        subscribedTweets: [],
        recentTweets: []
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchTweets = async () => {
            try {
                setIsLoading(true);
                const data = await fetchDataFunction();
                setTweetData(data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching tweets:", error);
            }
        }
        fetchTweets();  // Invoke the fetchTweets function
    }, [fetchDataFunction]); 

    const mapTweetsToComponents = (tweets) => {
        if (tweets.length === 0) {
            return;
        } else {
            return tweets.map((tweet) => <Tweet key={tweet.id} tweet={tweet} />);
        }
    };

    const tweetTypes = {
        userTweets: tweetData.userTweets,
        userLikes: tweetData.userLikes,
        subscribedTweets: tweetData.subscribedTweets,
        recentTweets: tweetData.recentTweets,
    };

    const renderTweets = () => {
        let tweets;
    
        if (showLikes) {
            tweets = tweetData.userLikes;
        } else if (showType && tweetTypes[showType]) {
            tweets = tweetTypes[showType];
        } else {
            // Default scenario or you can throw an error, depending on your use case.
            tweets = [];
        }
    
        return mapTweetsToComponents(tweets);
    };

    if (isLoading) {
        return <div style={{color: 'lime'}} >Loading...</div>
    }

  return (
    <div>{renderTweets()}</div>
  )
}

export default TweetFetcher