import React, { useContext, useState, useEffect } from 'react';
import db from 'services/storage';
import { doc, getDoc } from 'firebase/firestore';
import { ThreadContext } from 'services/ThreadContext';
import { AppContext } from 'services/appContext';
import { convertFromRaw, Editor, EditorState, CompositeDecorator, SelectionState, Modifier } from 'draft-js';
import Retweet from './Retweet';
import LikeButton from './LikeButton';
import RetweetList from './RetweetList';
import DeleteTweetButton from './DeleteTweetButton';
import { useUserProfileClick } from 'hooks/useUserProfileClick';
import CommentsButton from './CommentsButton';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

import styled from 'styled-components';
import { TweetCard, TweetHeader, FlexDiv, UserImage, Name, Handle, TweetDate, TweetBody, TweetReactions, StyledIcon, MenuContainer, MenuOptions, LeftThreadLine } from '../styles/tweetStyles';
import { faEllipsisH } from '@fortawesome/fontawesome-free-solid';
import Hashtag from './Hashtag';


const StandardTweet = ({ tweet, isMini }) => {
    const [author, setAuthor] = useState(null);
    const [isTweetMenuOpen, setIsTweetMenuOpen] = useState(false);
    const { currentUser, activeFilter, setActiveFilter } = useContext(AppContext);
    const { setActiveThread } = useContext(ThreadContext);
    const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
    );

    const navigate = useNavigate();

    useEffect(() => {
      const hashtagStrategy = (contentBlock, callback, contentState) => {
        contentBlock.findEntityRanges(
          character => character.getEntity() && contentState.getEntity(character.getEntity()).getType() === 'HASHTAG',
          callback
        );
      };
    
      const compositeDecorator = new CompositeDecorator([
        {
          strategy: hashtagStrategy,
          component: Hashtag,
        },
      ]);
    
      let contentState = convertFromRaw(JSON.parse(tweet.body));
    
      // Search and create hashtag entities
      contentState.getBlockMap().forEach(block => {
        block.getText().split(' ').forEach((word, index) => {
          if (word.startsWith('#')) {
            contentState = contentState.createEntity('HASHTAG', 'IMMUTABLE', { hashtag: word });
            const entityKey = contentState.getLastCreatedEntityKey();
            const selection = SelectionState.createEmpty(block.getKey()).merge({
              anchorOffset: block.getText().indexOf(word),
              focusOffset: block.getText().indexOf(word) + word.length,
            });
            contentState = Modifier.applyEntity(contentState, selection, entityKey);
          }
        });
      });
    
      const newEditorState = EditorState.createWithContent(contentState, compositeDecorator);
      setEditorState(newEditorState);
    }, [tweet.body]);
  

    const handleUserProfileClick = useUserProfileClick();

    useEffect(() => {
        const fetchAuthor = async () => {
          // Check if author is already cached in memory
          const cachedAuthor = localStorage.getItem(tweet.author);
          if (cachedAuthor) {
            setAuthor(JSON.parse(cachedAuthor));
          } else {
            // Fetch author from Firestore and cache in memory
            const authorRef = doc(db, "users", tweet.author);
            const authorDoc = await getDoc(authorRef);
            const authorData = authorDoc.data();
            localStorage.setItem(tweet.author, JSON.stringify(authorData));
            setAuthor(authorData);
          }
        };
  
        fetchAuthor();
    },[tweet.author]);

    const toggleTweetMenu = () => {
        setIsTweetMenuOpen(!isTweetMenuOpen)
    };
  
    const handleTweetThreadClick = () => {
        setActiveThread(tweet);
        setActiveFilter('thread');
        navigate(`/thread/${tweet.id}`);
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
          {tweet.retweets > 0 && activeFilter === 'home' && <RetweetList tweet={tweet} />}
          <TweetCard isMini={isMini} >
          {isMini && <LeftThreadLine />}
            <UserImage 
                src={author?.profileImg}  
                onClick={() => handleUserProfileClick(tweet.author)}
                isMini={isMini} />
            <div className="flex column">
                <TweetHeader>
                    <FlexDiv>
                        <div className="flex align">
                            <Name isMini={isMini} >{author?.displayName}</Name>
                            <Handle isMini={isMini} onClick={() => handleUserProfileClick(tweet.author)}>{author?.userHandle}</Handle>
                        </div>
                        <TweetDate isMini={isMini} >{formattedDate}</TweetDate>
                        {tweet.author === currentUser.uid && (activeFilter === 'profile' || activeFilter === 'thread') && (
                          <MenuContainer>
                            <StyledIcon icon={faEllipsisH} onClick={toggleTweetMenu} />
    
                            {isTweetMenuOpen && (
                              <MenuOptions>
                                <DeleteTweetButton tweet={tweet} />
                              </MenuOptions>
                            )}
                          </MenuContainer>
                        )}
                    </FlexDiv>
                </TweetHeader>
                <TweetBody isMini={isMini} >
                    <Editor editorState={editorState} readOnly />
                </TweetBody>
                <TweetReactions>
                  <CommentsButton 
                    tweet={tweet} 
                    onClick={handleTweetThreadClick}  />
                  <Retweet tweet={tweet} />
                  <LikeButton tweet={tweet} />
                </TweetReactions>
            </div>
          </TweetCard>
        </>
      )
}

export default StandardTweet