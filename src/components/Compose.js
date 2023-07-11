import React from 'react';
import db from 'services/storage';
import { collection, addDoc, Timestamp,doc, updateDoc } from 'firebase/firestore';
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


const Compose = ({ user, activeThread, action }) => {

    
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
            tweetID: '',
        });

        const tweetID = newTweetRef.id;
        await updateDoc(newTweetRef, {
            tweetID: tweetID,
        });

        return {
            tweetID: tweetID,
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
            const { tweetID, tweetDate } = await createTweet(text);
            await addToUserTweetBucket(tweetID, tweetDate);
            console.log('Tweeted!');
        } catch (error) {
            console.error('Error composing tweet:', error);
        }
    };

    const createComment = async (text) => {
        const date = new Date();
        const commentDate = Timestamp.fromDate(date);
        const commentsRef = collection(db, 'comments');
        const newCommentRef = await addDoc(commentsRef, {
            authorID: user.uid,
            body: text,
            date: commentDate,
            threadID: activeThread,
        });

        const commentID = newCommentRef.id;
        await updateDoc(newCommentRef, {
            commentID: commentID,
        });

        return {
            commentID: commentID,
            date: commentDate, 
            threadID: activeThread,
        };
    };

    const addCommentToTweetDoc = async (commentID, tweetID, commentDate) => {
        const tweetRef = doc(db, 'tweets', tweetID);
        const repliesRef = collection(tweetRef, 'replies');
        await addDoc(repliesRef, {
            commentID: commentID,
            date: commentDate,
        });
    };

    const composeComment = async (text) => {
        try {
            const { commentID, date, threadID } = await createComment(text);
            await addCommentToTweetDoc(commentID, threadID, date);
            console.log('Reply Tweeted!');
        } catch (error) {
            console.error('Error composing comment:', error);
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
             onReply={composeComment}
             action={action} />
            
        </ComposeBody>
    </TweetCard>
  )
}

export default Compose