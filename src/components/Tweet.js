import { doc, getDoc } from 'firebase/firestore';
import React, {useContext, useEffect, useState} from 'react';
import StandardTweet from './StandardTweet';
import ReplyTweet from './ReplyTweet';


import styled from 'styled-components';


// TODO:
// 1. Assess tweet type ie. isReply, isQoute?
// 2. Return the appropiate tweet component and pass the tweet object prop

const Tweet = ({ tweet }) => {
    
  if (!tweet.isReply && !tweet.isQoute) {
    return <StandardTweet tweet={tweet} />
  } else if (tweet.isReply) {
    return <ReplyTweet tweet={tweet} />
  }

  return null;

};

export default Tweet