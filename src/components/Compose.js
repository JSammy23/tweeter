import React from 'react';
import db from 'services/storage';
import { collection, addDoc, Timestamp,doc, updateDoc, increment } from 'firebase/firestore';
import TextEditor from './TextEditor';

import styled from 'styled-components';
import { TweetCard, UserImage } from './Tweet';



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


const Compose = ({ user, activeThread, action, addReply }) => {

    
    const createTweet = async (text) => {
        const date =  new Date();
        const tweetDate = Timestamp.fromDate(date)
        const tweetsRef = collection(db, 'tweets');
        const newTweetRef = await addDoc(tweetsRef, {
            authorID: user.uid,
            body: text,
            date: tweetDate,
            userHandle: user.userHandle,
            profileImg: user.profileImg,
            displayName: user.displayName,
            ID: '',
        });

        const tweetID = newTweetRef.id;
        await updateDoc(newTweetRef, {
            ID: tweetID,
        });

        return {
            ID: tweetID,
            tweetDate: tweetDate,
        };
    };

    const addToUserTweetBucket = async (tweetID, tweetDate) => {
        const userRef = doc(db, 'users', user.uid);
        const tweetBucketRef = collection(userRef, 'tweetBucket');
        await addDoc(tweetBucketRef, {
            tweetID: tweetID,
            date: tweetDate,
        });
        console.log('Tweeted!');
    };

    const composeTweet =  async (text) => {
        try {
            const { ID, tweetDate } = await createTweet(text);
            await addToUserTweetBucket(ID, tweetDate);
            console.log('Tweeted!');
        } catch (error) {
            console.error('Error composing tweet:', error);
        }
    };

    const createReply = async (text) => {
        const date = new Date();
        const replyDate = Timestamp.fromDate(date);
        const repliesRef = collection(db, 'replies');
        const newReplyRef = await addDoc(repliesRef, {
            authorID: user.uid,
            body: text,
            date: replyDate,
            threadID: activeThread.tweetID,
        });

        const replyID = newReplyRef.id;
        await updateDoc(newReplyRef, {
            ID: replyID,
        });

        return {
            authorID: user.uid,
            ID: replyID,
            date: replyDate, 
            threadID: activeThread.tweetID,
            body: text,
        };
    };

    const addReplyToTweetDoc = async (replyID, tweetID, replyDate) => {
        const tweetRef = doc(db, 'tweets', tweetID);
        const repliesRef = collection(tweetRef, 'replies');
        await addDoc(repliesRef, {
            replyID: replyID,
            date: replyDate,
        });

        await updateDoc(tweetRef, {
            replies: increment(1),
        });
    };

    const composeReply = async (text) => {
        try {
            const newReply = await createReply(text);
            await addReplyToTweetDoc(newReply.ID, newReply.threadID, newReply.date);
            addReply(newReply);
            console.log('Reply Tweeted!');
        } catch (error) {
            console.error('Error composing reply:', error);
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
             onReply={composeReply}
             action={action} />
            
        </ComposeBody>
    </TweetCard>
  )
}

export default Compose