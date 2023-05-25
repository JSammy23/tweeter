import { doc, getDoc } from 'firebase/firestore';
import React, {useContext, useEffect, useState} from 'react';
import db from 'services/storage';
import { format } from 'date-fns';
import { AppContext } from 'services/appContext';
import { convertFromRaw, Editor, EditorState } from 'draft-js';
import Retweet from './Retweet';
import LikeButton from './LikeButton';
import RetweetList from './RetweetList';

import styled from 'styled-components';



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


// TODO:
// User handle needs to link to that user profile

const Tweet = ({ tweet }) => {

    const [author, setAuthor] = useState(null);
    const {setActiveFilter, setViewedUser, setIsUserLoaded, currentUser} = useContext(AppContext);

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


    const handleUserProfileClick = () => {
      getUserData(tweet.authorID);
      setActiveFilter('viewUser');
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
    <>
      {tweet.retweets > 0 && <RetweetList tweet={tweet} />}
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
              <Retweet tweet={tweet} />
              <LikeButton tweet={tweet} />
            </TweetReactions>
        </div>
      </TweetCard>
    </>
  )
}

export default Tweet