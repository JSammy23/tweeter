import React, { useState, useEffect } from 'react';
import StandardTweet from './StandardTweet';
import MissingTweet from './MissingTweet';
import { doc, getDoc } from 'firebase/firestore';
import db from 'services/storage';

const ReplyTweet = ({ tweet }) => {
    const [replyToTweets, setReplyToTweets] = useState([]);

    const fetchReplyToTweet = async (tweetId, replyToTweets) => {
        const tweetDocRef = doc(db, 'tweets', tweetId);
        const tweetDoc = await getDoc(tweetDocRef);

        if (!tweetDoc.exists()) {
            console.log('No such document!');
            replyToTweets.push({ missing: true, isReply: false, replyTo: null });
            return replyToTweets;
        }

        const tweetData = tweetDoc.data();
        // Add the tweet to the replyToTweets array
        replyToTweets.push(tweetData);

        // If the tweet is not a reply to another tweet, return the array
        if (!tweetData.isReply) {
            return replyToTweets;
        }

        // If the tweet is a reply, recursively get reply tweet until top level tweet is fetched
        return fetchReplyToTweet(tweetData.replyTo, replyToTweets);
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            const replyToTweets = [];
            const finalReplyToTweets = await fetchReplyToTweet(tweet.replyTo, replyToTweets);
            setReplyToTweets(finalReplyToTweets);
        };
        fetchInitialData();
    }, [tweet]);

  return (
    <div>
        {replyToTweets.slice().reverse().map((tweet, index) => (
            tweet.missing ? 
            <MissingTweet key={index} isMini /> :
            <StandardTweet key={index} tweet={tweet} isMini />
        ))}
        <StandardTweet key={replyToTweets.length} tweet={tweet} />
    </div>
  )
}

export default ReplyTweet