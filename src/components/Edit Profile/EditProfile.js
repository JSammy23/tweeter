import React, { useState } from 'react';
import auth from 'services/auth';

import styled from 'styled-components';
import { Button, Module } from 'styles/styledComponents';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/fontawesome-free-regular';
import '/home/jordan/repos/tweeter/src/components/Edit Profile/EditProfile.styles.css';




const Header = styled.div`
 display: flex;
 justify-content: space-between;
 width: 100%;
 color: ${props => props.theme.colors.primary};
 font-size: 1.7em;
`;

const IconBtn = styled.button`
 background-color: transparent;
 border: none;
 outline: none;
 color: ${props => props.theme.colors.primary};
 font-size: 1em;
 margin-right: .3em;
 cursor: pointer;

 &:hover {
    color: ${props => props.theme.colors.accent};
 }
`;



const EditProfile = ({ toggleClose, user, onUpdateUser }) => {

    const [displayName, setDisplayName] = useState(user.displayName);
    const [userHandle, setUserHandle] = useState(user.userHandle);
    
    

    const handleSubmit = (event) => {
        event.preventDefault();
    
        const updatedUser = {
          ...user,
          displayName,
          userHandle,
        };
    
        onUpdateUser(updatedUser);
    };

    const handleInputChange = (e) => {
        if (e.target.value !== '') {
            e.target.parentElement.classList.add('has-value');
        } else {
            e.target.parentElement.classList.remove('has-value');
        }
    };

    

    
  return (
    <Module>
        <Header>
            <div className='flex align'>
                <IconBtn onClick={toggleClose} ><FontAwesomeIcon icon={faTimesCircle} /></IconBtn>
                <p>Edit Profile</p>
            </div>
            <Button form='editProfile' type='submit' fontSize='.6em' >Save</Button>
        </Header>
        <form id='editProfile' onSubmit={handleSubmit} >
            <div className='float-label has-value' >
                <input type="text" name='displayName' id='displayName' required  onChange={(e) => setDisplayName(e.target.value)} onBlur={handleInputChange} onFocus={handleInputChange} value={displayName}/>
                <label htmlFor="dislpayName">Display Name</label>
            </div>
            <div className='float-label has-value' >
                <input type="text" name='userHandle' id='userHandle' required onChange={(e) => setUserHandle(e.target.value)} onBlur={handleInputChange} onFocus={handleInputChange} value={userHandle} />
                <label htmlFor="userHandle">User Handle</label>
            </div>
        </form>
    </Module>
  )
}

export default EditProfile