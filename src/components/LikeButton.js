import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from 'services/appContext';
import { checkIfLiked, likeTweet, unlikeTweet } from 'utilities/tweetUtilites';

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/fontawesome-free-regular';
import { StyledIcon } from './Retweet';
import { TweetReactionsCount } from 'styles/styledComponents';

const LikeButton = ({ tweet }) => {
    const [likes, setLikes] = useState(tweet.likes || 0);
    const [isLiked, setIsLiked] = useState(false);
    const { currentUser } = useContext(AppContext);

    useEffect(() => {
      const fetchCheckIfLiked = async () => {
          const result = await checkIfLiked(tweet.id, currentUser.uid);
          setIsLiked(result);
      }
      fetchCheckIfLiked();
    }, [tweet.id, currentUser.uid]);

    const handleLike = async () => {
      const newLikesCount = isLiked ? likes - 1 : likes + 1;
      setLikes(newLikesCount);
      setIsLiked(!isLiked);
      if (isLiked) {
        try {
          await unlikeTweet(tweet.id, currentUser.uid);
        } catch (error) {
          console.error('Error unliking tweet:', error)
        };
      } else {
        try {
          await likeTweet(tweet.id, currentUser.uid);
        } catch (error) {
          console.error('Error liking tweet:', error)
        };
      };
    };

  return (
    <div>
        <StyledIcon icon={faHeart} active={isLiked} onClick={handleLike} />
        {likes > 0 && <TweetReactionsCount>{likes}</TweetReactionsCount>}
    </div>
  )
}

export default LikeButton