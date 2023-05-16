import React, { useContext, useEffect, useState } from 'react';
import auth from 'services/auth';
import EditProfile from './Edit Profile/EditProfile';


import styled from 'styled-components';
import { Title, UserHandle, Button } from 'styles/styledComponents';
import { doc, getDocs, setDoc, onSnapshot, collection, addDoc, query } from 'firebase/firestore';
import db from 'services/storage';
import FollowButton from './FollowButton';



const ProfileCard = styled.div`
 width: 100%;
 height: 15em;
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

 span {
    color: ${props => props.theme.colors.primary};
    margin: 0 .3em;
 }
`;


// TODO:
// Add followers & following state array
// Add followers & following count to user profile
// Pass follower & FOllowing array down to follow button


const UserProfile = ({user, isCurrentUser }) => {

    const [editProfile, setEditProfile] = useState(false);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);

    const userRef = doc(db, 'users', user?.uid);

    useEffect(() => {
        fetchFollowers();
        fetchFollowing();
    }, [user]);

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

    
    const toggleEditProfile = () => {
        setEditProfile(!editProfile);
    };
    
    const handleUpdateUser = async (updatedUser) => {
        setEditProfile(false);
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, updatedUser);
    };


  return (
    <ProfileCard>
        <div className="flex spacer">
            <div>
                <UserImage src={user?.profileImg} />
            </div>
            <div>
                {isCurrentUser ? (
                    <Button onClick={toggleEditProfile} >Edit profile</Button>
                ) : (
                    <FollowButton />
                )}
            </div>
        </div>
        <div className="flex column">
            <Title>{user?.displayName}</Title>
            <UserHandle>{user?.userHandle}</UserHandle>
            <CountsDiv>
                <span>{following.length}</span> Following <span>{followers.length}</span> Followers
            </CountsDiv>
        </div>
        {/* TODO: Add follower & following count */}
        {editProfile && (
        <EditProfile onUpdateUser={handleUpdateUser} 
        toggleClose={toggleEditProfile}
        user={user} />)}
    </ProfileCard>
  )
}

export default UserProfile