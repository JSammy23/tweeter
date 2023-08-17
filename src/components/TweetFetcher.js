import React, { useEffect, useState } from 'react';
import Tweet from './Tweet';

const TweetFetcher = ({ userUid, showLikes, fetchDataFunction, showType }) => {

    const [tweetData, setTweetData] = useState({
        userTweets: [],
        userLikes: [],
        subscribedTweets: [],
        recentTweets: []
    });

    useEffect(() => {
        const fetchTweets = async () => {
            try {
                const data = await fetchDataFunction();
                setTweetData(data);
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

  return (
    <div>{renderTweets()}</div>
  )
}

export default TweetFetcher