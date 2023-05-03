import React, { useState } from 'react';
import db from 'services/storage';
import { collection, addDoc, Timestamp,doc } from 'firebase/firestore';

import styled from 'styled-components';
import { TweetCard, UserImage } from './Tweet';
import { Button } from 'styles/styledComponents';
import TextEditor from './TextEditor';

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

const Controls = styled.div`
 width: 100%;
 display: flex;
 justify-content: end;
`;

const Compose = ({ user }) => {
    const [text, setText] = useState('');
    const [isInputFocused, setIsInputFocused] = useState(false);

    const handleTextChange = (e) => {
        setText(e.target.innerText);
    };

    const isComposeDisabled = text.trim(). length === 0;

    const handleFocus = () => {
        setIsInputFocused(true);
    };

    const handleBlur = () => {
        setIsInputFocused(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);
            const br = document.createElement("br");
            range.insertNode(br);
            range.setStartAfter(br);
            range.setEndAfter(br);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    };

    const composeTweet = async () => {
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
        setText('');
    };

  return (
    <TweetCard>
        <ImgDiv>
            <UserImage src={user?.profileImg} />
        </ImgDiv>
        <ComposeBody>
            <TextEditor />
            <Controls>
                <div>
                    <Button disabled={isComposeDisabled} onClick={composeTweet} >Tweet</Button>
                </div>
            </Controls>
        </ComposeBody>
    </TweetCard>
  )
}

export default Compose