import React from 'react';
import db from 'services/storage';
import { doc, deleteDoc } from 'firebase/firestore';

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

const DeleteTweetButton = ({ tweetID }) => {

    const handleDeleteTweet = async () => {
        try {
          // Delete tweet from firestore tweets collection
          const tweetRef = doc(db, 'tweets', tweetID);
          await deleteDoc(tweetRef);
          console.log('Tweet deleted');
  
          // Delete tweet from any retweet & liked lists
          // ...
  
          
        } catch (error) {
          console.error('Error deleting tweet:', error);
        }
    };

  return (
    <MenuButton onClick={handleDeleteTweet} >
        <StyledIcon icon={faTrash} />
        Delete
    </MenuButton>
  );
};

export default DeleteTweetButton