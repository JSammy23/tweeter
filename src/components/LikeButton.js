import React, { useState, useEffect, useContext } from 'react';
import db from 'services/storage';
import { AppContext } from 'services/appContext';
import { collection, doc, updateDoc, query, getDocs, addDoc, deleteDoc, where } from 'firebase/firestore';

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/fontawesome-free-regular';
import { RetweetCount, StyledIcon } from './Retweet';

const LikeButton = ({ tweet }) => {
    const [likes, setLikes] = useState(tweet.likes || 0);
    const [isLiked, setIsLiked] = useState(false);
    const { currentUser } = useContext(AppContext);

    useEffect(() => {
        checkIfLiked();
    }, [tweet.tweetID]);

    const checkIfLiked = async () => {
        if (!currentUser) {
          return;
        }
        const userLikesRef = collection(db, 'users', currentUser.uid, 'likes');
        const userLikesQuery =  query(userLikesRef);
        const userLikesSnapshot = await getDocs(userLikesQuery);
  
        const tweetIds = userLikesSnapshot.docs.map((doc) => doc.data().tweetID);
  
        const isLiked = tweetIds.includes(tweet.tweetID);
        setIsLiked(isLiked);
    };

    const handleLike = async () => {
        if (isLiked) {
          const newLikesCount = likes - 1;
          setLikes(newLikesCount);
          setIsLiked(false);
  
          try {
            const tweetRef = doc(db, 'tweets', tweet.tweetID);
            await updateDoc(tweetRef, {
              likes: newLikesCount,
            });
  
            // Remove tweet from user likes
            const userLikesRef = collection(db, 'users', currentUser.uid, 'likes');
            const userLikesQuery = query(userLikesRef, where('tweetID', '==', tweet.tweetID));
            const userLikesSnapshot = await getDocs(userLikesQuery);
            const userLikesDoc = userLikesSnapshot.docs[0];
            if (userLikesDoc) {
              const userLikesDocRef = doc(db, 'users', currentUser.uid, 'likes', userLikesDoc.id);
              await deleteDoc(userLikesDocRef);
            }
          } catch (error) {
            console.error('Error removing like or tweet from user likes', error);
          }
        } else {
          const newLikesCount = likes + 1;
          setLikes(newLikesCount);
          setIsLiked(true);
  
          try {
            const tweetRef = doc(db, 'tweets', tweet.tweetID);
            await updateDoc(tweetRef, {
              likes: newLikesCount,
            });
  
            const userLikesRef = collection(db, 'users', currentUser.uid, 'likes');
            await addDoc(userLikesRef, {
              tweetID: tweet.tweetID,
              date: new Date(),
            })
          } catch (error) {
            console.error('Error liking tweet or adding to user likes', error);
          }
        };
      };


  return (
    <div>
        <StyledIcon icon={faHeart} active={isLiked} onClick={handleLike} />
        {likes > 0 && <RetweetCount>{likes}</RetweetCount>}
    </div>
  )
}

export default LikeButton