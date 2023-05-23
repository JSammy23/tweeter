import { collection, doc, getDoc, updateDoc, query, getDocs, addDoc, deleteDoc, where } from 'firebase/firestore';
import React, {useContext, useEffect, useState} from 'react';
import db from 'services/storage';
import { format } from 'date-fns';
import { AppContext } from 'services/appContext';
import { convertFromRaw, Editor, EditorState } from 'draft-js';

import styled from 'styled-components';
import { faRetweet } from '@fortawesome/fontawesome-free-solid';
import { faHeart } from '@fortawesome/fontawesome-free-regular';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';



export const TweetCard = styled.div`
 width: 100%;
 display: flex;
 padding: .5em;
 border-bottom: 1px solid ${props => props.theme.colors.secondary};
`;

const TweetHeader = styled.div`
 width: 100%;
 display: flex;
`;

const Div = styled.div`
 width: 100%;
 display: flex;
 justify-content: space-between;
`;

export const UserImage = styled.img`
 width: 60px;
 height: 60px;
 border-radius: 50%;
 border: 1px solid black;
 margin-right: .5em;
 cursor: pointer;
`;

const Name = styled.h2`
 color: ${props => props.theme.colors.primary};
 margin-right: .3em;
`;

const Handle = styled.h3`
 color: ${props => props.theme.colors.secondary};
`;

const TweetDate = styled.div`
 display: flex;
 color: ${props => props.theme.colors.secondary};
 font-size: 1em;
 justify-content: flex-end;
`;

const TweetBody = styled.div`
 width: 100%;
 text-align: start;
 color: #fff;
 font-size: 1.3em;
 margin-top: .3em;
`;

const TweetReactions = styled.div`
 display: flex;
 margin-top: .3em;
 gap: .3em;
`;

const StyledIcon = styled(FontAwesomeIcon)`
 color: ${props => (props.active ? props.theme.colors.primary : 'inherit')};
 cursor: pointer;
`;

const RetweetCount = styled.span`
 color: ${props => props.theme.colors.primary};
 margin-right: .3em;
`;

// TODO:
// User handle needs to link to that user profile

const Tweet = ({ tweet }) => {

    const [author, setAuthor] = useState(null);
    const {setActiveFilter, setViewedUser, setIsUserLoaded, currentUser} = useContext(AppContext);
    const [retweets, setRetweets] = useState(tweet.retweets || 0);
    const [likes, setLikes] = useState(tweet.likes || 0);
    const [retweeted, setRetweeted] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

    const contentState = convertFromRaw(JSON.parse(tweet.body));
    const editorState = EditorState.createWithContent(contentState);

    useEffect(() => {
      const fetchAuthor = async () => {
        // Check if author is already cached in memory
        const cachedAuthor = localStorage.getItem(tweet.authorID);
        if (cachedAuthor) {
          setAuthor(JSON.parse(cachedAuthor));
        } else {
          // Fetch author from Firestore and cache in memory
          const authorRef = doc(db, "users", tweet.authorID);
          const authorDoc = await getDoc(authorRef);
          const authorData = authorDoc.data();
          localStorage.setItem(tweet.authorID, JSON.stringify(authorData));
          setAuthor(authorData);
        }
      };

      fetchAuthor();
    },[tweet.authorID]);

    useEffect(() => {
      checkIfRetweeted();
      checkIfLiked();
    }, [tweet.tweetID]);

    const getUserData = async (userUid) => {
      try {
        const userDocRef = doc(db, "users", userUid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          setViewedUser(userDocSnap.data());
          setIsUserLoaded(true);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.log(error);
      }
    };

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
    }

    const handleUserProfileClick = () => {
      getUserData(tweet.authorID);
      setActiveFilter('viewUser');
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
    
    const handleRetweet = async () => {
      if (retweeted) {
        const newRetweetCount = retweets - 1;
        setRetweets(newRetweetCount);
        setRetweeted(false);
    
        try {
          const tweetRef = doc(db, 'tweets', tweet.tweetID);
          await updateDoc(tweetRef, {
            retweets: newRetweetCount,
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


    // Format dueDate
    let formattedDate;
    let date;
    if (tweet.date) {
      if (typeof tweet.date === 'string') {
        date = new Date(tweet.date)
      } else {
        date = tweet.date.toDate(); // convert Firestore Timestamp to Date object
      } 
        formattedDate = format(date, "h:mm bbb MM/dd/yyy");
    };

  return (
    <TweetCard>
        <UserImage src={author?.profileImg}  onClick={handleUserProfileClick}/>
        <div className="flex column">
            <TweetHeader>
                <Div>
                    <div className="flex align">
                        <Name>{author?.displayName}</Name>
                        <Handle>{author?.userHandle}</Handle>
                    </div>
                    <TweetDate>{formattedDate}</TweetDate>
                </Div>
            </TweetHeader>
            <TweetBody>
                <Editor editorState={editorState} readOnly />
            </TweetBody>
            <TweetReactions>
              <StyledIcon icon={faRetweet} active={retweeted}  onClick={handleRetweet} />
              {retweets > 0 && <RetweetCount>{retweets}</RetweetCount>}
              <StyledIcon icon={faHeart} active={isLiked} onClick={handleLike} />
              {likes > 0 && <RetweetCount>{likes}</RetweetCount>}
            </TweetReactions>
        </div>
    </TweetCard>
  )
}

export default Tweet