import React from 'react';
import db from 'services/storage';
import { collection, addDoc, Timestamp,doc, updateDoc, runTransaction } from 'firebase/firestore';
import TextEditor from './TextEditor';

import styled from 'styled-components';
import { TweetCard, UserImage } from '../styles/tweetStyles';



const ImgDiv = styled.div`
 width: auto;
 height: 100%;
 margin-right: .5em;
 display: flex;
 align-items: flex-start;
`;

const ComposeBody = styled.div`
 display: flex;
 flex-direction: column;
 width: 100%;
 height: fit-content;
`;


const Compose = ({ user, activeThread, isReply = false, addReply, action }) => {

    const createTweet = async (text) => {
        const date =  new Date();
        const tweetDate = Timestamp.fromDate(date)
        const tweetsRef = collection(db, 'tweets');
        let threadId = null;
        let replyTo = null;

        // Extract hashtags from tweet
        const rawContent = JSON.parse(text);
        const tweetText = rawContent.blocks.map(block => block.text).join('\n');
        const hashtags = tweetText.match(/\#[\w\u0590-\u05ff]+/g) || [];

        if (isReply && activeThread) {
            replyTo = activeThread.id;
            threadId = activeThread.isReply ? activeThread.threadId : activeThread.id;
        };

        // Need to include isQoute field
        const newTweetData = {
            author: user.uid,
            body: text,
            date: tweetDate,
            id: '',
            isReply: isReply,
            replyTo: replyTo,
            threadId: threadId,
            likes: 0,
            retweets: 0,
            hashtags: hashtags,
        };

        const newTweetRef = await addDoc(tweetsRef, newTweetData);

        const tweetId = newTweetRef.id;
        newTweetData.id = tweetId;
        await updateDoc(newTweetRef, { id: tweetId });

        return newTweetData;
    };

    const addToUserTweetBucket = async (tweetId, tweetDate) => {
        try {
            const userRef = doc(db, 'users', user.uid);
        const tweetBucketRef = collection(userRef, 'tweetBucket');
        await addDoc(tweetBucketRef, {
            tweetID: tweetId,
            date: tweetDate,
        });
        } catch (error) {
            console.error('Error adding tweet ref to user tweetBucket:', error);
        };
    };

    const composeTweet =  async (text) => {
        try {
            const newTweet = await createTweet(text);
            await addToUserTweetBucket(newTweet.id, newTweet.date);
            
            if (isReply) {
                // Start a new transaction
                await runTransaction(db, async (transaction) => {
                    const tweetRef = doc(db, 'tweets', activeThread.id);
                    const tweetSnapshot = await transaction.get(tweetRef);
    
                    // Ensure the tweet exists before trying to update it
                    if (!tweetSnapshot.exists()) {
                        throw new Error("Tweet does not exist!");
                    };
    
                    const newReplyCount = (tweetSnapshot.data().replies || 0) + 1;
                    transaction.update(tweetRef, { replies: newReplyCount });
                });
                addReply(newTweet);
            };
            console.log('Tweeted!');
        } catch (error) {
            console.error('Error composing tweet:', error);
        }
    };


  return (
    <TweetCard>
        <ImgDiv>
            <UserImage src={user?.profileImg} />
        </ImgDiv>
        <ComposeBody>
            <TextEditor  
             onTweet={composeTweet} 
             action={action} />
            
        </ComposeBody>
    </TweetCard>
  )
}

export default Compose