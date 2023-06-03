import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from 'services/appContext';
import { collection, doc, updateDoc, query, getDocs, addDoc, deleteDoc, where, arrayRemove, arrayUnion } from 'firebase/firestore';
import db from 'services/storage';

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRetweet } from '@fortawesome/fontawesome-free-solid';


export const StyledIcon = styled(FontAwesomeIcon)`
 color: ${props => (props.active ? props.theme.colors.primary : props.theme.colors.secondary)};
 cursor: pointer;
`;

export const RetweetCount = styled.span`
 color: ${props => props.theme.colors.primary};
 margin-right: .3em;
 margin-left: .3em;
`;

const Retweet = ({ tweet }) => {
    const [retweets, setRetweets] = useState(tweet.retweets || 0);
    const [retweeted, setRetweeted] = useState(false);
    const { currentUser } = useContext(AppContext);

    useEffect(() => {
        checkIfRetweeted();
    }, [tweet.tweetID]);

    const checkIfRetweeted = async () => {
      if (!currentUser) {
        return;
      }

      const userRetweetsRef = collection(db, 'users', currentUser.uid, 'retweets');
      const userRetweetsQuery = query(userRetweetsRef);
      const userRetweetsSnapshot = await getDocs(userRetweetsQuery);

      // Extract the tweet IDs from the document snapshots
      const tweetIds = userRetweetsSnapshot.docs.map((doc) => doc.data().tweetID);

      // Check if the tweet ID exists in the tweet bucket
      const isRetweeted = tweetIds.includes(tweet.tweetID);
      setRetweeted(isRetweeted);
    };

    const handleRetweet = async () => {
      if (retweeted) {
        const newRetweetCount = retweets - 1;
        setRetweets(newRetweetCount);
        setRetweeted(false);
    
        try {
          const tweetRef = doc(db, 'tweets', tweet.tweetID);
          await updateDoc(tweetRef, {
            retweets: newRetweetCount,
            retweetedBy: arrayRemove(currentUser.uid),
          });
    
          // Remove tweet from user tweetBucket
          const userTweetBucketRef = collection(db, 'users', currentUser.uid, 'tweetBucket');
          const userTweetQuery = query(userTweetBucketRef, where('tweetID', '==', tweet.tweetID));
          const userTweetSnapshot = await getDocs(userTweetQuery);
          const userTweetDoc = userTweetSnapshot.docs[0];
          if (userTweetDoc) {
            const userTweetDocRef = doc(db, 'users', currentUser.uid, 'tweetBucket', userTweetDoc.id);
            await deleteDoc(userTweetDocRef);
          }

          // Remove tweet from user retweets
          const userRetweetsRef = collection(db, 'users', currentUser.uid, 'retweets');
          const userRetweetsQuery = query(userRetweetsRef, where('tweetID', '==', tweet.tweetID));
          const userRetweetsSnapshot = await getDocs(userRetweetsQuery);
          const userRetweetsDoc = userRetweetsSnapshot.docs[0];
          if (userRetweetsDoc) {
            const userRetweetsDocRef = doc(db, 'users', currentUser.uid, 'retweets', userRetweetsDoc.id);
            await deleteDoc(userRetweetsDocRef);
          }
        } catch (error) {
          console.error('Error removing retweet or tweet from user tweet bucket', error);
        }
      } else {
        // If not retweeted, add the retweet
        const newRetweetCount = retweets + 1;
        setRetweets(newRetweetCount);
        setRetweeted(true);
        try {
          const tweetRef = doc(db, 'tweets', tweet.tweetID);
          await updateDoc(tweetRef, {
            retweets: newRetweetCount,
            retweetedBy: arrayUnion(currentUser.uid),
          });

          const userTweetBucketRef = collection(db, 'users', currentUser.uid, 'tweetBucket');
          await addDoc(userTweetBucketRef, {
            tweetID: tweet.tweetID,
            date: new Date(),
          });

          const userRetweetsRef = collection(db, 'users', currentUser.uid, 'retweets');
          await addDoc(userRetweetsRef, {
            tweetID: tweet.tweetID,
            date: new Date(),
          });

        } catch (error) {
          console.error('Error updating retweets', error);
        };
      }
    };


  return (
    <div>
        <StyledIcon icon={faRetweet} active={retweeted}  onClick={handleRetweet} />
        {retweets > 0 && <RetweetCount>{retweets}</RetweetCount>}
    </div>
  )
}

export default Retweet;