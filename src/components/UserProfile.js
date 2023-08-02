import React, { useEffect, useState } from 'react';
import EditProfile from './Edit Profile/EditProfile';
import { doc, getDocs, setDoc, collection } from 'firebase/firestore';
import db from 'services/storage';
import FollowButton from './FollowButton';
import UserProfileControls from './UserProfileControls';
import FollowList from './FollowList';


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


const UserProfile = ({user, isCurrentUser, showLikes, showNewsFeed }) => {

    const [editProfile, setEditProfile] = useState(false);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [localHandle, setLocalHandle] = useState(user?.userHandle);
    const [localDisplayName, setLocalDisplayName] = useState(user?.displayName);
    const [userProfileImg, setUserProfileImg] = useState(user?.profileImg);
    const [showFollowList, setShowFollowList] = useState(false);
    const [listType, setListType] = useState(null);

    const userRef = doc(db, 'users', user?.uid);

    useEffect(() => {
        const fetchFollowers = async () => {
            const followersRef = collection(userRef, 'followers');
            const querySnapshot = await getDocs(followersRef);
            const followers = querySnapshot.docs.map(doc => doc.data().user);
            setFollowers(followers);
        };

        const fetchFollowing = async () => {
            const followingRef = collection(userRef, 'following');
            const querySnapshot = await getDocs(followingRef);
            const following = querySnapshot.docs.map(doc => doc.data().user);
            setFollowing(following);
        };

        fetchFollowers();
        fetchFollowing();
        setUserProfileImg(user.profileImg)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const toggleEditProfile = () => {
        setEditProfile(!editProfile);
    };
    
    const handleUpdateUser = async (updatedUser) => {
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


  return (
    <>
        {showFollowList ? (
            <FollowList
              followers={followers}
              following={following}
              listType={listType}
              user={user}
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
                          <FollowButton user={user.uid} />
                     )}
                    </div>
                </div>
                <div className="flex column">
                    <Title>{localDisplayName}</Title>
                    <UserHandle>{localHandle}</UserHandle>
                    <CountsDiv>
                        <button id='following' onClick={handleFollowCountClick} >
                            <span>{following.length}</span>Following
                        </button>
                        <button id='followers' onClick={handleFollowCountClick} >
                            <span>{followers.length}</span>Followers
                        </button>
                    </CountsDiv>
                    <UserProfileControls showLikes={showLikes} />
                </div>
                {editProfile && (
                <EditProfile onUpdateUser={handleUpdateUser} 
                toggleClose={toggleEditProfile}
                user={user}
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