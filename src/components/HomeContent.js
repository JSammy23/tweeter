import React, { useContext } from 'react';
import Compose from './Compose';
import TweetFetcher from './TweetFetcher';
import { AppContext } from 'services/appContext';
import { fetchSubscribedTweets } from 'utilities/tweetUtilites';

const HomeContent = () => {
    const { currentUser } = useContext(AppContext);
  return (
    <>
        <Compose action='tweet' />
        {currentUser && <TweetFetcher fetchDataFunction={() => fetchSubscribedTweets(currentUser?.following)} showType='subscribedTweets' />}
    </>
  )
}

export default HomeContent