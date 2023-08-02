import React, { useContext } from 'react';
import db from 'services/storage';
import { doc, deleteDoc, collection, where, query, getDocs, updateDoc, increment } from 'firebase/firestore';

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/fontawesome-free-solid';
import { ThreadContext } from 'services/ThreadContext';

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

const DeleteTweetButton = ({ tweet, isReply }) => {
  const { setReplies } = useContext(ThreadContext);

  const handleDeleteTweet = async () => {
    if (isReply) {
      try {
        // Delete reply from firestore
        const replyRef = doc(db, 'replies', tweet.ID);
        await deleteDoc(replyRef);
        console.log('Reply deleted.');
        
        // Remove reply refernece from thread
        const threadRef = doc(db, tweet.threadType === 'reply' ? 'replies' : 'tweets', tweet.threadID);
        const repliesSubCollectionRef = collection(threadRef, 'replies');
        const replyQuery = query(repliesSubCollectionRef, where('replyID', '==', tweet.ID));
        const replyQuerySnapshot = await getDocs(replyQuery);
        if (!replyQuerySnapshot.empty) {
          const replyDoc = replyQuerySnapshot.docs[0];
          await deleteDoc(replyDoc.ref);
          await updateDoc(threadRef, {
            replies: increment(-1),
          });
          setReplies(prevReplies => prevReplies.filter(reply => reply.ID !== tweet.ID));
          console.log('Reply ref removed from thread.');
        };
      } catch (error) {
        console.error('Error deleting reply:', error);
      };
    } else {
      try {
        // Delete tweet from firestore tweets collection
        const tweetRef = doc(db, 'tweets', tweet.ID);
        await deleteDoc(tweetRef);
        console.log('Tweet deleted');

        // Delete tweet from any retweet & liked lists
        // ...

        
      } catch (error) {
        console.error('Error deleting tweet:', error);
      };
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