import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from 'services/appContext';
import { getRetweets, removeRetweet, addRetweet } from 'utilities/tweetUtilites';

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRetweet } from '@fortawesome/fontawesome-free-solid';
import { TweetReactionsCount } from 'styles/styledComponents';


export const StyledIcon = styled(FontAwesomeIcon)`
 color: ${props => (props.active ? props.theme.colors.primary : props.theme.colors.secondary)};
 cursor: pointer;
`;

const Retweet = ({ tweet }) => {
  const [retweets, setRetweets] = useState(tweet.retweets || 0);
  const [retweeted, setRetweeted] = useState(false);
  const { currentUser } = useContext(AppContext);

  useEffect(() => {
      checkIfRetweeted();
  }, [tweet.id]);

  const checkIfRetweeted = async () => {
    if (!currentUser) {
      return;
    }
    const isRetweeted = await getRetweets(tweet.id, currentUser.uid); 
    setRetweeted(isRetweeted);
  };

  const handleRetweet = async () => {
    if (retweeted) {
      const newRetweetCount = retweets - 1;
      setRetweets(newRetweetCount);
      setRetweeted(false);
  
      try {
        await removeRetweet(tweet.id, currentUser.uid, newRetweetCount); 
      } catch (error) {
        console.error('Error removing retweet or tweet from user tweet bucket', error);
      }
    } else {
      const newRetweetCount = retweets + 1;
      setRetweets(newRetweetCount);
      setRetweeted(true);

      try {
        await addRetweet(tweet.id, currentUser.uid, newRetweetCount); 
      } catch (error) {
        console.error('Error updating retweets', error);
      };
    }
  };

  return (
      <div>
          <StyledIcon icon={faRetweet} active={retweeted}  onClick={handleRetweet} />
          {retweets > 0 && <TweetReactionsCount>{retweets}</TweetReactionsCount>}
      </div>
  )
}

export default Retweet;