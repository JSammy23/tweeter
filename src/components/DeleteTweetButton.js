import React, { useContext } from 'react';
import db from 'services/storage';
import { doc, deleteDoc } from 'firebase/firestore';
import { ThreadContext } from 'services/ThreadContext';
import { reduceReplyCount } from 'utilities/tweetUtilites';

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/fontawesome-free-solid';


const MenuButton = styled.button`
 color: ${props => props.theme.colors.secondary};
 width: 100%;
 height: auto;
 border: none;
 outline: none;
 font-size: 1em;
 background-color: transparent;
 cursor: pointer;
 
 &:hover {
    color: ${props => props.theme.colors.primary};
 }
`;

const StyledIcon = styled(FontAwesomeIcon)`
 margin-right: .3em;
`;

const DeleteTweetButton = ({ tweet }) => {
  const { setReplies } = useContext(ThreadContext);

  const handleDeleteTweet = async () => {
    try {
      // Delete reply from firestore
      const tweetRef = doc(db, 'tweets', tweet.id);
      await deleteDoc(tweetRef);
      console.log('Tweet deleted.');

      setReplies(prevReplies => prevReplies.filter(reply => reply.ID !== tweet.id));
      if (tweet.isReply) {
        await reduceReplyCount(tweet.replyTo);
      };
    } catch (error) {
      console.error('Error deleting tweet:', error);
    };
  };

  return (
    <MenuButton onClick={handleDeleteTweet} >
        <StyledIcon icon={faTrash} />
        Delete
    </MenuButton>
  );
};

export default DeleteTweetButton