import React, { useContext, useEffect, useState } from 'react';
import EditProfile from './Edit Profile/EditProfile';
import { doc, setDoc } from 'firebase/firestore';
import db from 'services/storage';
import FollowButton from './FollowButton';
import UserProfileControls from './UserProfileControls';
import FollowList from './FollowList';
import useUserInfo from 'hooks/useUserInfo';
import { AppContext } from 'services/appContext';

import styled from 'styled-components';
import { Title, UserHandle, Button } from 'styles/styledComponents';


const ProfileCard = styled.div`
 width: 100%;
 height: 17.5em;
 border-top: 1px solid;
 border-bottom: 1px solid;
 border-color: ${props => props.theme.colors.secondary};
`;

const UserImage = styled.img`
 width: 133px;
 height: 133px;
 border: 2px solid black;
 border-radius: 50%;
 margin: .7em;
`;

const CountsDiv = styled.div`
 color: ${props => props.theme.colors.secondary};
 margin-left: .7em;
 margin-top: .3em;

 span {
    color: ${props => props.theme.colors.primary};
    margin: 0 .3em;

    &:hover {
        text-decoration: underline;
        cursor: pointer;
    }
 }

 button {
    color: ${props => props.theme.colors.secondary};
    background-color: transparent;
    border: none;
    outline: none;
    cursor: pointer;
    font-size: 1em;

    &:hover {
        color: ${props => props.theme.colors.primary};
        text-decoration: underline;
    }
 }

`;


// TODO:
// Pass follower & Following array down to follow button?


const UserProfile = ({userUid, showLikes, showNewsFeed }) => {

    const [isCurrentUser, setIsCurrentUser] = useState(false);
    const [editProfile, setEditProfile] = useState(false);
    const [localHandle, setLocalHandle] = useState('');
    const [localDisplayName, setLocalDisplayName] = useState('');
    const [userProfileImg, setUserProfileImg] = useState('');
    const [showFollowList, setShowFollowList] = useState(false);
    const [listType, setListType] = useState(null);
    const { currentUser } = useContext(AppContext);

    const { userInfo, loading } = useUserInfo(userUid);

    useEffect(() => {
        if (currentUser.uid === userUid) {
            setIsCurrentUser(true);
        };
        if (userInfo && !loading) {
            if (localDisplayName !== userInfo.displayName) {
                setLocalDisplayName(userInfo.displayName);
            }
            if (localHandle !== userInfo.userHandle) {
                setLocalHandle(userInfo.userHandle);
            }
            if (userProfileImg !== userInfo.profileImg) {
                setUserProfileImg(userInfo.profileImg);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userUid, userInfo, loading]);

    const toggleEditProfile = () => {
        setEditProfile(!editProfile);
    };
    
    const handleUpdateUser = async (updatedUser) => {
        const userRef = doc(db, 'users', userUid);
        setEditProfile(false);
        await setDoc(userRef, updatedUser);
    };

    const handleFollowCountClick = (event) => {
        const LinkId = event.target.id;
        setListType(LinkId);
        setShowFollowList(true);
        showNewsFeed(false);
    };

    const handleBackClick = () => {
        setShowFollowList(false);
        showNewsFeed(true);
    };

    useEffect(() => {
        console.log('UserProfile rendered')
      });

  return (
    <>
        {showFollowList ? (
            <FollowList
              followers={userInfo?.followers}
              following={userInfo?.following}
              listType={listType}
              user={userInfo}
              onBackClick={handleBackClick}
            />
        ) : (
            <ProfileCard>
                <div className="flex spacer">
                    <div>
                        <UserImage src={userProfileImg} />
                    </div>
                    <div>
                    {isCurrentUser ? (
                        <Button onClick={toggleEditProfile} >Edit profile</Button>
                     ) : (
                          <FollowButton user={userInfo?.uid} />
                     )}
                    </div>
                </div>
                <div className="flex column">
                    <Title>{localDisplayName}</Title>
                    <UserHandle>{localHandle}</UserHandle>
                    <CountsDiv>
                        <button id='following' onClick={handleFollowCountClick} >
                            <span>{userInfo?.following.length}</span>Following
                        </button>
                        <button id='followers' onClick={handleFollowCountClick} >
                            <span>{userInfo?.followers.length}</span>Followers
                        </button>
                    </CountsDiv>
                    <UserProfileControls showLikes={showLikes} />
                </div>
                {editProfile && (
                <EditProfile onUpdateUser={handleUpdateUser} 
                toggleClose={toggleEditProfile}
                user={userInfo}
                setLocalHandle={setLocalHandle}
                localHandle={localHandle}
                setLocalDisplayName={setLocalDisplayName}
                localDisplayName={localDisplayName}
                updateUserProfileImg={setUserProfileImg} />)}
            </ProfileCard>
        )}
    </>
  )
}

export default UserProfile