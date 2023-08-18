import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from 'services/appContext'
import Tweet from './Tweet';
import StandardTweet from './StandardTweet';
import Compose from './Compose';
import { fetchReplies } from 'utilities/tweetUtilites';
import { ThreadContext } from 'services/ThreadContext';
import { useNavigate } from 'react-router-dom';

import styled from 'styled-components';
import { Header } from 'styles/styledComponents';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/fontawesome-free-solid';


const StyledIcon = styled(FontAwesomeIcon)`
 cursor: pointer;
 color: inherit;
 font-size: 1.4em;
 margin: .3em 0;

 &:hover {
  color: ${props => props.theme.colors.primary};
 }
`;

// TODO:
// Back click is not working, prevFilter in Feedpage not working.
// When thread changes, tweet interactions are not updating.

const Thread = () => {
  const { currentUser } = useContext(AppContext);
  const { activeThread, setReplies, replies, setLocalReplyCount } = useContext(ThreadContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    const getReplies = async () => {
        const threadId = activeThread?.id;
        if (activeThread?.replies > 0) {
            const repliesData = await fetchReplies(threadId);
            setReplies(repliesData);
        } else {
            setReplies([]);
        }
    };
    getReplies();
  }, [activeThread]);

  const mapRepliesToTweetComponents = (replies) => {
    return replies.map((reply) => (
      // This will be the only place we bypass the tweet comp for a standard tweet for replies
      <StandardTweet 
        key={reply.id} 
        tweet={reply} />
    ));
  };

  const handleAddReply = (newReply) => {
    setReplies((prevReplies) => [newReply, ...prevReplies]);
    setLocalReplyCount((prevLocalReplyCount) => prevLocalReplyCount + 1);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <>
        <Header>
            <h2>Tweet</h2>
            <StyledIcon icon={faArrowLeft} onClick={handleBackClick} />
        </Header>    
        <Tweet 
         key={activeThread.ID} 
         tweet={activeThread} />
        <Compose 
         user={currentUser}
         action='reply'
         isReply
         activeThread={activeThread}
         addReply={handleAddReply} />
        {mapRepliesToTweetComponents(replies)}
    </>
  )
}

export default Thread