import React, { useContext, useState } from 'react';
import auth from 'services/auth';


import styled from 'styled-components';


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

const Button = styled.button`
 background-color: ${props => props.theme.colors.primary};
 font-size: 1em;
 font-weight: bold;
 padding: .5em;
 margin: .7em;
 border-radius: 10px;
 border: none;
 outline: none;
 cursor: pointer;

 &:hover {
     background-color: ${props => props.theme.colors.accent};
 }
`;

const Title = styled.h2`
 color: ${props => props.theme.colors.primary};
 font-weight: bold;
 margin-left: .7em;
`;

const UserHandle = styled.h3`
 color: ${props => props.theme.colors.secondary};
 margin-left: .7em;
`;



const UserProfile = () => {

    const [editProfile, setEditProfile] = useState(false);

    const user = auth.currentUser;

    const toggleEditProfile = () => {
        setEditProfile(true);
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
    </ProfileCard>
  )
}

export default UserProfile