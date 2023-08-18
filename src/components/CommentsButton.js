import React, { useContext, useState, useEffect } from 'react'

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/fontawesome-free-regular';
import { TweetReactionsCount } from 'styles/tweetStyles';
import { ThreadContext } from 'services/ThreadContext';
import { AppContext } from 'services/appContext';

const StyledIcon = styled(FontAwesomeIcon)`
 color: ${props => props.theme.colors.secondary};
 cursor: pointer;
 margin: 0 .5em;

 &:hover {
    color:  ${props => props.theme.colors.primary};
 }
`;

const CommentsButton = ({ tweet, onClick }) => {
  const { localReplyCount, activeThread } = useContext(ThreadContext);
  const { activeFilter } = useContext(AppContext);
  const [repliesCount, setRepliesCount] = useState(tweet.replies || 0);

  useEffect(() => {
    if (activeFilter === 'thread' && activeThread?.id === tweet.id && localReplyCount !== repliesCount) {
      setRepliesCount(localReplyCount);
    }
  }, [activeFilter, activeThread, tweet.id, localReplyCount, repliesCount]);

  return (
    <div onClick={onClick}>
        <StyledIcon icon={faComment} />
        {repliesCount > 0 && <TweetReactionsCount>{repliesCount}</TweetReactionsCount>}
    </div>
  )
};

export default CommentsButton