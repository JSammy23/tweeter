import { doc, getDoc } from 'firebase/firestore';
import React, {useContext, useEffect, useState} from 'react';
import db from 'services/storage';
import { format } from 'date-fns';
import { AppContext } from 'services/appContext';
import { ThreadContext } from 'services/ThreadContext';
import StandardTweet from './StandardTweet';


import styled from 'styled-components';


// TODO:
// 1. Assess tweet type ie. isReply, isQoute?
// 2. Return the appropiate tweet component and pass the tweet object prop

const Tweet = ({ tweet, localReplyCount, setReplies }) => {

  const { currentUser, activeFilter, setActiveFilter} = useContext(AppContext);
  const { setActiveThread } = useContext(ThreadContext);
    

  
  if (!tweet.isReply && !tweet.isQoute) {
    return (
      <StandardTweet 
        tweet={tweet} 
        setReplies={setReplies} 
        localReplyCount={localReplyCount} />
    )
  };

  return null;

}

export default Tweet