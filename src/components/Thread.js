import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from 'services/appContext'
import Tweet from './Tweet';
import Compose from './Compose';

import styled from 'styled-components';
import { Header } from 'styles/styledComponents';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/fontawesome-free-solid';
import { collection, query, getDocs, where } from 'firebase/firestore';
import db from 'services/storage';


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
// Load comments below compose component.

const Thread = ({ onBackClick }) => {
  const { activeThread, setActiveThread, setActiveFilter, currentUser } = useContext(AppContext);
  const [replies, setReplies] = useState([]);
  const [localReplyCount, setLocalReplyCount] = useState(activeThread?.replies || 0);

  useEffect(() => {
    const fecthReplies = async () => {
      const threadID = activeThread?.tweetID;
      const tweetRepliesRef = collection(db, 'tweets', threadID, 'replies');
      const tweetRepliesQuery = query(tweetRepliesRef);
      const tweetRepliesSnapshot = await getDocs(tweetRepliesQuery);

      if (!tweetRepliesSnapshot.empty) {
        const repliesIDs = tweetRepliesSnapshot.docs.map((doc) => doc.data().replyID);
        const repliesData = await retrieveAndSortReplies(repliesIDs);
        setReplies(repliesData);
      } else {
        return;
      }
    };
    fecthReplies();
  }, []);

  const retrieveAndSortReplies = async (repliesIDs) => {
    const repliesRef = collection(db, 'replies');
    const repliesQuery = query(repliesRef, where('__name__', 'in', repliesIDs));
    const repliesSnapshot = await getDocs(repliesQuery);
    const repliesData = repliesSnapshot.docs.map((doc) => doc.data());
    repliesData.sort((a, b) => b.date - a.date);

    return repliesData;
  };

  const mapRepliesToTweetComponents = (replies) => {
    return replies.map((reply) => (
      <Tweet key={reply.replyID} tweet={reply} isReply />
    ));
  };

  const handleAddReply = (newReply) => {
    setReplies((prevReplies) => [newReply, ...prevReplies]);
    setLocalReplyCount((prevLocalReplyCount) => prevLocalReplyCount + 1);
  };

  return (
    <>
        <Header>
            <h2>Tweet</h2>
            <StyledIcon icon={faArrowLeft} onClick={onBackClick} />
        </Header>    
        <Tweet 
         key={activeThread} 
         tweet={activeThread}
         localReplyCount={localReplyCount} />
        <Compose 
         user={currentUser}
         action='reply'
         activeThread={activeThread}
         addReply={handleAddReply} />
        {mapRepliesToTweetComponents(replies)}
    </>
  )
}

export default Thread