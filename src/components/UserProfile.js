import React, { useContext, useState } from 'react';
import auth from 'services/auth';
import EditProfile from './Edit Profile/EditProfile';


import styled from 'styled-components';
import { Title, UserHandle, Button } from 'styles/styledComponents';


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

    const user = auth.currentUser;

    const toggleEditProfile = () => {
        setEditProfile(!editProfile);
    };
    

  return (
    <ProfileCard>
        <div className="flex spacer">
            <div>
                <UserImage src={user.photoURL} />
            </div>
            <div>
                <Button onClick={toggleEditProfile} >Edit profile</Button>
            </div>
        </div>
        <div className="flex column">
            <Title>{user.displayName || 'New User'}</Title>
            <UserHandle>{user.handle || '@userhandle'}</UserHandle>
        </div>
        {/* TODO: Add follower & following count */}
        {editProfile && (<EditProfile toggleClose={toggleEditProfile} />)}
    </ProfileCard>
  )
}

export default UserProfile