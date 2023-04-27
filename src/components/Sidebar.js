import React from 'react';
import { logout } from 'services/auth';
import styled from 'styled-components';
import { Logo } from 'styles/styledComponents';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter } from '@fortawesome/fontawesome-free-brands';
import { faHome, faHashtag, faUser } from '@fortawesome/fontawesome-free-solid';


const Header = styled.header`
 background-color: ${props => props.theme.colors.bgDark};
 display: flex;
 flex-direction: column;
 height: 100vh;
 justify-content: space-between;
`

const Nav = styled.nav`
  ul {
    list-style: none;
 }
 li {
    color: ${props => props.theme.colors.primary};
    font-size: 2em;
    margin-bottom: .5em;
    cursor: pointer;

    &:hover {
        color: ${props => props.theme.colors.accent};
    }

    span {
        margin-left: .3em;
    }
 }
`;

const UserControls = styled.div`
 margin: 1em 0;

 button {
    background-color: ${props => props.theme.colors.primary};
    font-size: 1em;
    padding: .5em;
    border-radius: 10px;
    border: none;
    outline: none;
    cursor: pointer;

    &:hover {
        background-color: ${props => props.theme.colors.accent};
    }
 }
`;

const Sidebar = ({ user }) => {

    const handleLogout = () => {
        logout();
    };

  return (
    <Header>
        <div>
            <Logo><FontAwesomeIcon icon={faTwitter} /></Logo>
            <Nav>
                <ul>
                    <li><FontAwesomeIcon icon={faHome} /><span>Home</span></li>
                    <li><FontAwesomeIcon icon={faHashtag} /><span>Explore</span></li>
                    <li><FontAwesomeIcon icon={faUser} /><span>Profile</span></li>
                </ul>
            </Nav>
        </div>
        <UserControls>
            <button onClick={handleLogout} >Log Out</button>
        </UserControls>
    </Header>
  )
}

export default Sidebar