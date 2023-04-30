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



const EditProfile = ({ toggleClose }) => {

    const user = auth.currentUser;
    const [displayName, setDisplayName] = useState(user ? user.displayName : '');
    const [userHandle, setUserHandle] = useState(user ? user.userHandle : '');
    

    const handleChange = (event) => {
        const { name, value } = event.target;

        switch (name) {
            case 'displayName':
                setDisplayName(value);
                break;
            case 'userHandle':
                setUserHandle(value);
                break;
            default:
                break;
        }
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
            <div className='flex center'>
                <IconBtn onClick={toggleClose} ><FontAwesomeIcon icon={faTimesCircle} /></IconBtn>
                <p>Edit Profile</p>
            </div>
            <Button fontSize='.6em' >Save</Button>
        </Header>
        <form>
            <div className='float-label' >
                <input type="text" name='displayName' id='displayName' required  onChange={handleChange} onBlur={handleInputChange} onFocus={handleInputChange}/>
                <label htmlFor="dislpayName">Display Name</label>
            </div>
            <div className='float-label' >
                <input type="text" name='userHandle' id='userHandle' required onChange={handleChange} onBlur={handleInputChange} onFocus={handleInputChange} />
                <label htmlFor="userHandle">User Handle</label>
            </div>
        </form>
    </Module>
  )
}

export default EditProfile