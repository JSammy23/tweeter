import React from 'react';
import Compose from './Compose';
import TweetFetcher from './TweetFetcher';
import { fetchExploreTweets } from 'utilities/tweetUtilites';

const ExploreContent = () => {
  return (
    <>
        <Compose action='tweet' />
        <TweetFetcher fetchDataFunction={fetchExploreTweets} showType='recentTweets' />
    </>
  )
}

export default ExploreContent