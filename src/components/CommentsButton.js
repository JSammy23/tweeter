import React, { useState } from 'react'

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/fontawesome-free-regular';
import { TweetReactionsCount } from 'styles/styledComponents';

const StyledIcon = styled(FontAwesomeIcon)`
 color: ${props => props.theme.colors.secondary};
 cursor: pointer;

 &:hover {
    color:  ${props => props.theme.colors.primary};
 }
`;

const CommentsButton = ({ tweet, onClick, count }) => {
  const [replyCount, setReplyCount] = useState(tweet.replies || 0);
  const updatedCount = count > replyCount ? count : replyCount;

  return (
    <div onClick={onClick}>
        <StyledIcon icon={faComment} />
        {replyCount > 0 && <TweetReactionsCount>{updatedCount}</TweetReactionsCount>}
    </div>
  )
}

export default CommentsButton