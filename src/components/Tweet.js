import { doc, getDoc } from 'firebase/firestore';
import React, {useContext, useEffect, useState} from 'react';
import db from 'services/storage';
import { format } from 'date-fns';
import { AppContext } from 'services/appContext';
// import { convertFromRaw, Editor, EditorState } from 'draft-js';
import Retweet from './Retweet';
import LikeButton from './LikeButton';
import RetweetList from './RetweetList';
import DeleteTweetButton from './DeleteTweetButton';
// import { useUserProfileClick } from 'hooks/useUserProfileClick';
import CommentsButton from './CommentsButton';

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH } from '@fortawesome/fontawesome-free-solid';
import { ThreadContext } from 'services/ThreadContext';




export const TweetCard = styled.div`
 width: 100%;
 display: flex;
 padding: .5em;
 border-bottom: 1px solid ${props => props.theme.colors.secondary};
`;

export const TweetHeader = styled.div`
 width: 100%;
 display: flex;
`;

export const FlexDiv = styled.div`
 width: 100%;
 display: flex;
 justify-content: space-between;
`;

export const UserImage = styled.img`
 width: 60px;
 height: 60px;
 border-radius: 50%;
 border: 1px solid black;
 margin-right: .5em;
 cursor: pointer;
`;

export const Name = styled.h2`
 color: ${props => props.theme.colors.primary};
 margin-right: .3em;
`;

export const Handle = styled.h3`
 color: ${props => props.theme.colors.secondary};
 cursor: pointer;

 &:hover {
  color: ${props => props.theme.colors.primary};
  text-decoration: underline;
 }
`;

export const TweetDate = styled.div`
 display: flex;
 color: ${props => props.theme.colors.secondary};
 font-size: 1em;
 justify-content: flex-end;
`;

export const TweetBody = styled.div`
 width: 100%;
 text-align: start;
 color: #fff;
 font-size: 1.3em;
 margin-top: .3em;
`;

export const TweetReactions = styled.div`
 display: flex;
 margin-top: .3em;
 gap: 1em;
`;

export const StyledIcon = styled(FontAwesomeIcon)`
 color: ${props => props.theme.colors.secondary};
 cursor: pointer;

 &:hover {
  color: ${props => props.theme.colors.accent};
 }
`;

export const MenuContainer = styled.div`
 position: relative;
`;

export const MenuOptions = styled.div`
 position: absolute;
 top: 100%;
 right: 0;
 width: 6em;
 background-color: ${props => props.theme.colors.bgDark};
 border: 1px solid ${props => props.theme.colors.secondary};
 padding: .3em;
 box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;


// TODO:
// 1. Assess tweet type ie. isReply, isQoute?
// 2. Return the appropiate tweet component and pass the tweet object prop

const Tweet = ({ tweet, localReplyCount, setReplies }) => {

    // const [author, setAuthor] = useState(null);
    const { currentUser, activeFilter, setActiveFilter} = useContext(AppContext);
    const { setActiveThread } = useContext(ThreadContext);
    // const [isTweetMenuOpen, setIsTweetMenuOpen] = useState(false);

    // const contentState = convertFromRaw(JSON.parse(tweet.body));
    // const editorState = EditorState.createWithContent(contentState);

    // useEffect(() => {
    //   const fetchAuthor = async () => {
    //     // Check if author is already cached in memory
    //     const cachedAuthor = localStorage.getItem(tweet.author);
    //     if (cachedAuthor) {
    //       setAuthor(JSON.parse(cachedAuthor));
    //     } else {
    //       // Fetch author from Firestore and cache in memory
    //       const authorRef = doc(db, "users", tweet.author);
    //       const authorDoc = await getDoc(authorRef);
    //       const authorData = authorDoc.data();
    //       localStorage.setItem(tweet.author, JSON.stringify(authorData));
    //       setAuthor(authorData);
    //     }
    //   };

    //   fetchAuthor();
    // },[tweet.author]);

    // const handleUserProfileClick = useUserProfileClick();

    // const toggleTweetMenu = () => {
    //   setIsTweetMenuOpen(!isTweetMenuOpen)
    // };

    // const handleTweetThreadClick = () => {
    //   setActiveThread(tweet);
    //   setActiveFilter('thread');
    // };

    // Format dueDate
    let formattedDate;
    let date;
    if (tweet.date) {
      if (typeof tweet.date === 'string') {
        date = new Date(tweet.date)
      } else {
        date = tweet.date.toDate(); // convert Firestore Timestamp to Date object
      } 
        formattedDate = format(date, "h:mm bbb MM/dd/yyy");
    };

  return (
    <>
      
    </>
  )
}

export default Tweet