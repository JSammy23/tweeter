import React, { useState } from 'react';
import db, { storage } from 'services/storage';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { checkUserHandleAvailability } from 'utilities/firebaseUtils';


import styled from 'styled-components';
import { Button, Module } from 'styles/styledComponents';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/fontawesome-free-regular';
import './EditProfile.styles.css';



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



const EditProfile = ({ toggleClose, user, onUpdateUser, updateUserProfileImg }) => {

    const [displayName, setDisplayName] = useState(user.displayName);
    const [userHandle, setUserHandle] = useState(user.userHandle);
    const [profileImg, setProfileImg] = useState(user.profileImg);
    const [error, setError] = useState('');
    

    const handleSubmit = async (event) => {
        event.preventDefault();

        
        if (user.userHandle !== userHandle) {
            const handleAvailable = await checkUserHandleAvailability(userHandle);
            if (!handleAvailable) {
                setError('User handle is already taken!');
                return;
            }
        };
    
        const updatedUser = {
          ...user,
          displayName,
          userHandle,
          profileImg,
        };
    
        onUpdateUser(updatedUser);
        updateUserProfileImg(profileImg);
    };

    const handleInputChange = (e) => {
        if (e.target.value !== '') {
            e.target.parentElement.classList.add('has-value');
        } else {
            e.target.parentElement.classList.remove('has-value');
        }
    };

    const handleProfileImgChange = async (e) => {
        const file = e.target.files[0];
      
        const storageRef = ref(storage, `users/${user.uid}/profile-img/${file.name}`);
      
        try {
          const snapshot = await uploadBytes(storageRef, file);
          const downloadURL = await getDownloadURL(snapshot.ref);
          console.log('Profile image uploaded successfully:', downloadURL);
          setProfileImg(downloadURL);
        } catch (error) {
          console.error('Error uploading profile image:', error);
        };
    };

    const openFileInput = () => {
        const fileInput = document.getElementById('profileImgInput');
        fileInput.click();
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
            <div className="profile-img-cont">
                <img onClick={openFileInput} className='profile-pic' src={profileImg} alt='profile pic' />
                <div onClick={openFileInput} className="edit-label">Edit</div>
                <input 
                type="file"
                id='profileImgInput'
                accept='image/*'
                onChange={handleProfileImgChange}
                style={{ display: 'none' }}
                 />
            </div>
            <div className='float-label has-value' >
                <input type="text" name='displayName' id='displayName' required  onChange={(e) => setDisplayName(e.target.value)} onBlur={handleInputChange} onFocus={handleInputChange} value={displayName}/>
                <label htmlFor="dislpayName">Display Name</label>
            </div>
            <div className='float-label has-value' >
                <input type="text" name='userHandle' id='userHandle' required onChange={(e) => setUserHandle(e.target.value)} onBlur={handleInputChange} onFocus={handleInputChange} value={userHandle} />
                <label htmlFor="userHandle">User Handle</label>
            </div>
            {error && <div className='error'>{error}</div>}
        </form>
    </Module>
  )
}

export default EditProfile