import { doc, getDoc } from 'firebase/firestore';
import React, {useContext, useEffect, useState} from 'react';
import db from 'services/storage';
import { format } from 'date-fns';
import { AppContext } from 'services/appContext';
import { ThreadContext } from 'services/ThreadContext';


import styled from 'styled-components';


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