import React, { useContext, useEffect, useState } from 'react';
import auth from 'services/auth';
import EditProfile from './Edit Profile/EditProfile';


import styled from 'styled-components';
import { Title, UserHandle, Button } from 'styles/styledComponents';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import db from 'services/storage';
import { onAuthStateChanged } from 'firebase/auth';


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



const UserProfile = () => {

    const [editProfile, setEditProfile] = useState(false);
    const [user, setUser] = useState(null);

    
    const toggleEditProfile = () => {
        setEditProfile(!editProfile);
    };
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userRef = doc(db, 'users', user.uid);
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    setUser(userDoc.data());
                }
                else {
                    setUser(null);
                }
            }
        });
        return unsubscribe
    }, []);

    useEffect(() => {
        if (user) {
          const userRef = doc(db, 'users', user.uid);
          const unsubscribe = onSnapshot(userRef, (doc) => {
            if (doc.exists()) {
              setUser(doc.data());
            }
            else {
              setUser(null);
            }
          });
          return unsubscribe;
        }
    }, [user]);
      

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
                <Button onClick={toggleEditProfile} >Edit profile</Button>
            </div>
        </div>
        <div className="flex column">
            <Title>{user?.displayName}</Title>
            <UserHandle>@{user?.userHandle}</UserHandle>
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