import React, { useState, useEffect, useContext } from 'react';
import db from 'services/storage';
import { AppContext } from 'services/appContext';
import { collection, doc, updateDoc, query, getDocs, addDoc, deleteDoc, where } from 'firebase/firestore';

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/fontawesome-free-regular';
import { StyledIcon } from './Retweet';
import { TweetReactionsCount } from 'styles/styledComponents';

const LikeButton = ({ tweet, isReply }) => {
    const [likes, setLikes] = useState(tweet.likes || 0);
    const [isLiked, setIsLiked] = useState(false);
    const { currentUser } = useContext(AppContext);
    const subCollectionName = isReply ? 'likedReplies' : 'likes';

    useEffect(() => {
        checkIfLiked();
    }, [tweet.ID]);

    const checkIfLiked = async () => {
        if (!currentUser) {
          return;
        }

        try {
          const userLikesRef = collection(db, 'users', currentUser.uid, subCollectionName);
          const userLikesQuery =  query(userLikesRef, where('tweetID', '==', tweet.ID));
          const userLikesSnapshot = await getDocs(userLikesQuery);
          const isLiked = !userLikesSnapshot.empty;
          setIsLiked(isLiked);
        } catch (error) {
          console.error('Error checking if tweet/reply was liked by user', error);
        };
        
    };

    const handleLike = async () => {
      const newLikesCount = isLiked ? likes - 1 : likes + 1;
      setLikes(newLikesCount);
      setIsLiked(!isLiked);
  
      try {
        const documentRef = doc(db, isReply ? 'replies' : 'tweets', tweet.ID);
        await updateDoc(documentRef, {
          likes: newLikesCount,
        });
  
        const userLikesRef = collection(db, 'users', currentUser.uid, subCollectionName);
        if (isLiked) {
          const userLikesQuery = query(userLikesRef, where('tweetID', '==', tweet.ID));
          const userLikesSnapshot = await getDocs(userLikesQuery);
          const userLikesDoc = userLikesSnapshot.docs[0];
          if (userLikesDoc) {
            const userLikesDocRef = doc(userLikesRef, userLikesDoc.id);
            await deleteDoc(userLikesDocRef);
          }
        } else {
          await addDoc(userLikesRef, {
            tweetID: tweet.ID,
            date: new Date(),
          });
        }
      } catch (error) {
        console.error('Error liking tweet/reply or updating user likes', error);
      }
    };


  return (
    <div>
        <StyledIcon icon={faHeart} active={isLiked} onClick={handleLike} />
        {likes > 0 && <TweetReactionsCount>{likes}</TweetReactionsCount>}
    </div>
  )
}

export default LikeButton