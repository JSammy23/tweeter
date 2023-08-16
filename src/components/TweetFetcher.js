import React, { useEffect, useState } from 'react';
import Tweet from './Tweet';
import { fetchFromFirestore } from 'utilities/firebaseUtils';
import { fetchTweetBucket } from 'utilities/tweetUtilites';

const TweetFetcher = ({ userUid }) => {

    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchTweets = async () => {
            try {
                const tweets = await fetchTweetBucket(userUid);
                console.log(tweets); // To console the fetched tweets
                setData(tweets); // To set the fetched tweets to the data state
            } catch (error) {
                console.error("Error fetching tweets:", error);
            }
        }

        fetchTweets();  // Invoke the fetchTweets function
    }, [userUid]); 

    const mapTweetsToComponents = (tweets) => {
        return tweets.map((tweet) => <Tweet key={tweet.id} tweet={tweet} />);
    };

    const renderTweets = () => {
        return mapTweetsToComponents(data);
    };

  return (
    <div>{renderTweets()}</div>
  )
}

export default TweetFetcher