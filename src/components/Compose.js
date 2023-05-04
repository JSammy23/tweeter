import React from 'react';
import db from 'services/storage';
import { collection, addDoc, Timestamp,doc } from 'firebase/firestore';
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

const InputWrapper = styled.div`
 position: relative;
`;

const Input = styled.div`
 width: 100%;
 min-height: 3em;
 height: auto;
 resize: none;
 background: transparent;
 border: none;
 word-wrap: normal;
 font-size: 1.2em;
 color: #fff;

 &:focus {
    outline: none;
 }
`;

const Placeholder = styled.span`
 font-size: 1.2em;
 color: ${props => props.theme.colors.secondary};
 pointer-events: none;
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
        const tweetsRef = collection(db, 'tweets');
        const newTweetRef = await addDoc(tweetsRef, {
            authorID: user.uid,
            body: text,
            date: Timestamp.fromDate(date),
        });

        const tweetID = newTweetRef.id;
        const userRef = doc(db, 'users', user.uid);
        const tweetBucketRef = collection(userRef, 'tweetBucket');
        await addDoc(tweetBucketRef, {
            tweetID: tweetID,
        });
        console.log('Tweeted!');
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