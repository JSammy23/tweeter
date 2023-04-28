import React, { useContext } from 'react';
import { logout } from 'services/auth';
import styled from 'styled-components';
import { Logo } from 'styles/styledComponents';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter } from '@fortawesome/fontawesome-free-brands';
import { faHome, faHashtag, faUser } from '@fortawesome/fontawesome-free-solid';
import { AppContext } from 'services/appContext';


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

    &.active {
        color: ${props => props.theme.colors.accent};
    }

    span {
        margin-left: .3em;
    }

    @media (max-width: 868px) {
        span {
            display: none;
        }
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

    const { activeFilter, setActiveFilter } = useContext(AppContext);

    const handleNavClick = (filter) => {
        setActiveFilter(filter);
    };

    const handleLogout = () => {
        logout();
    };

  return (
    <Header>
        <div>
            <Logo><FontAwesomeIcon icon={faTwitter} /></Logo>
            <Nav>
                <ul>
                    <li onClick={() => handleNavClick('home')} className={activeFilter === 'home' ? 'active' : ''} ><FontAwesomeIcon icon={faHome} /><span>Home</span></li>
                    <li onClick={() => handleNavClick('explore')} className={activeFilter === 'explore' ? 'active' : ''} ><FontAwesomeIcon icon={faHashtag} /> <span>Explore</span></li>
                    <li onClick={() => handleNavClick('profile')} className={activeFilter === 'profile' ? 'active' : ''} ><FontAwesomeIcon icon={faUser} /> <span>Profile</span></li>
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