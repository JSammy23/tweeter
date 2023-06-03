import React, { useContext, useEffect, useState } from 'react';
import EditProfile from './Edit Profile/EditProfile';
import { doc, getDocs, getDoc, setDoc, collection } from 'firebase/firestore';
import db from 'services/storage';
import FollowButton from './FollowButton';
import UserProfileControls from './UserProfileControls';


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

 span {
    color: ${props => props.theme.colors.primary};
    margin: 0 .3em;
 }
`;


// TODO:
// Add followers & following state array
// Add followers & following count to user profile
// Pass follower & FOllowing array down to follow button


const UserProfile = ({user, isCurrentUser, showLikes }) => {

    const [editProfile, setEditProfile] = useState(false);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [userProfileImg, setUserProfileImg] = useState(user?.profileImg);

    const userRef = doc(db, 'users', user?.uid);

    useEffect(() => {
        fetchFollowers();
        fetchFollowing();
        setUserProfileImg(user.profileImg)
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

    // const fetchUser = async (uid) => {
    //     try {
    //         const userDoc = await getDoc(userRef);
    //         const userData = userDoc.data();
    //         localStorage.setItem(uid, JSON.stringify(userData));
    //     } catch (error) {
    //         console.error('Error fetching user', error)
    //     };
    // };    

    
    const toggleEditProfile = () => {
        setEditProfile(!editProfile);
    };
    
    const handleUpdateUser = async (updatedUser) => {
        setEditProfile(false);
        await setDoc(userRef, updatedUser);
    };


  return (
    <ProfileCard>
        <div className="flex spacer">
            <div>
                <UserImage src={userProfileImg} />
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
            <UserProfileControls showLikes={showLikes} />
        </div>
        {editProfile && (
        <EditProfile onUpdateUser={handleUpdateUser} 
        toggleClose={toggleEditProfile}
        user={user}
        updateUserProfileImg={setUserProfileImg} />)}
    </ProfileCard>
  )
}

export default UserProfile