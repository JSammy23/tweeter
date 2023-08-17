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
import { useParams, Outlet, Link, useRoutes, useLocation } from 'react-router-dom';
import TweetFetcher from './TweetFetcher';
import { fetchFromUserSubCollection, fetchUserTweetsAndLikes } from 'utilities/tweetUtilites';


const ProfileCard = styled.div`
 width: 100%;
 height: auto;
 border-top: 1px solid;
 border-bottom: 1px solid;
 border-color: ${props => props.theme.colors.secondary};
`;

const UserImage = styled.img`
 width: 8em;
 height: 8em;
 border: 2px solid black;
 border-radius: 50%;
 margin: .7em;

 @media (max-width: 599px) {
    width: 7em;
    height: 7em;
 }
`;

const CountsDiv = styled.div`
 color: ${props => props.theme.colors.secondary};
 margin-left: .7em;
 margin-top: .3em;

 span {
    color: ${props => props.theme.colors.primary};
    margin: 0 .3em;
    cursor: pointer;
 }
`;

const StyledLink = styled(Link)`
 color: ${props => props.theme.colors.secondary};
 background-color: transparent;
 border: none;
 outline: none;
 cursor: pointer;
 font-size: 1em; 
 text-decoration: none;

 &:hover {
     color: ${props => props.theme.colors.primary};
     text-decoration: underline;
 }
`;


// TODO:
// Pass follower & Following array down to follow button?


const UserProfile = () => {

    const [isCurrentUser, setIsCurrentUser] = useState(false);
    const [editProfile, setEditProfile] = useState(false);
    const [localHandle, setLocalHandle] = useState('');
    const [localDisplayName, setLocalDisplayName] = useState('');
    const [userProfileImg, setUserProfileImg] = useState('');
    const { currentUser } = useContext(AppContext);

    const { userId } = useParams();
    const location = useLocation();
    const showLikes = location.pathname.endsWith('/likes');
    const { userInfo, loading } = useUserInfo(userId);

    useEffect(() => {
        if (currentUser.uid === userId) {
            setIsCurrentUser(true);
        } else {
            setIsCurrentUser(false);
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
    }, [userId, userInfo, loading, currentUser]);

    const match = useRoutes([
        {
            path: 'following',
            element: <FollowList listType='following' following={userInfo?.following} user={userInfo} />
        },
        {
            path: 'followers',
            element: <FollowList listType='followers' followers={userInfo?.followers} user={userInfo} />
        },
    ]);

    const toggleEditProfile = () => {
        setEditProfile(!editProfile);
    };
    
    const handleUpdateUser = async (updatedUser) => {
        const userRef = doc(db, 'users', userId);
        setEditProfile(false);
        await setDoc(userRef, updatedUser);
    };

  return (
    <>
        {match || (
            <>
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
                            <StyledLink to={`/profile/${userId}/following`} >
                                <span>{userInfo?.following.length}</span>Following
                            </StyledLink>
                            <StyledLink to={`/profile/${userId}/followers`} >
                                <span>{userInfo?.followers.length}</span>Followers
                            </StyledLink>
                        </CountsDiv>
                        <UserProfileControls userId={userId} />
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
                <TweetFetcher fetchDataFunction={() => fetchUserTweetsAndLikes(userId)} showLikes={showLikes} showType='userTweets' />
            </>
        )}
        <Outlet/>
    </>
  );
};

export default UserProfile