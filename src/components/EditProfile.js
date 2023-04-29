import React, { useState } from 'react';
import auth from 'services/auth';

import styled from 'styled-components';
import { Button, Module } from 'styles/styledComponents';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/fontawesome-free-regular'




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

const Legend = styled.div`
 position: relative;
 border: 1px solid;
 border-color: ${props => props.theme.colors.secondary};
 width: 100%;
 padding: .2em;
 margin-top: .5em;

 input {
    
    border: none;
    outline: none;
    background: transparent;
    font-size: 1.1em;
    color: ${props => props.theme.colors.primary};
    padding: .3em;
    margin: 1em 0;
 }

 label {
    position: absolute;
    top:.8em;
    left: 0;
    padding: .5em;
    font-size: 1.2em;
    color: #fff;
    pointer-events: none;
    transition: .5s;
 }

 input:focus ~ label,
 input:valid > label {
    top: -7px;
    left: 0px;
    font-size: 1em;
    color: ${props => props.theme.colors.accent};
 }
`;


const EditProfile = ({ toggleClose }) => {

    const user = auth.currentUser;
    const [displayName, setDisplayName] = useState(user ? user.displayName : '')
    const [userHandle, setUserHandle] = useState(user ? user.userHandle : '')

    

    
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
            <Legend>
                <input type="" />
                <label htmlFor="">Display Name</label>
            </Legend>
            <Legend>
                <input type="" />
                <label htmlFor="">User Handle</label>
            </Legend>
        </form>
    </Module>
  )
}

export default EditProfile