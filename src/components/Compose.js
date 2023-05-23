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


const Compose = ({ user }) => {
    
    const composeTweet = async (text) => {
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
        const userRef = doc(db, 'users', user.uid);
        const tweetBucketRef = collection(userRef, 'tweetBucket');
        await addDoc(tweetBucketRef, {
            tweetID: tweetID,
            date: tweetDate,
        });
        console.log('Tweeted!');

        await updateDoc(newTweetRef, {
            tweetID: tweetID,
        });
    };

  return (
    <TweetCard>
        <ImgDiv>
            <UserImage src={user?.profileImg} />
        </ImgDiv>
        <ComposeBody>
            <TextEditor  onTweet={composeTweet} />
            
        </ComposeBody>
    </TweetCard>
  )
}

export default Compose