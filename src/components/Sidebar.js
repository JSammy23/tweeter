import React, { useContext } from 'react';
import { logout } from 'services/auth';
import styled from 'styled-components';
import { Logo } from 'styles/styledComponents';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter } from '@fortawesome/fontawesome-free-brands';
import { faHome, faHashtag, faUser } from '@fortawesome/fontawesome-free-solid';
import { AppContext } from 'services/appContext';
import LogoutButton from './LogoutButton';


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
`;

const Sidebar = () => {

    const { activeFilter, setActiveFilter } = useContext(AppContext);

    const navItems = [
        {id: 'home', icon: faHome, text: 'Home'},
        {id: 'explore', icon: faHashtag, text: 'Explore'},
        {id: 'profile', icon: faUser, text: 'Profile'},
    ];

    const handleNavClick = (filter) => {
        setActiveFilter(filter);
    };


  return (
    <Header>
        <div>
            <Logo><FontAwesomeIcon icon={faTwitter} /></Logo>
            <Nav>
                <ul>
                    {navItems.map((item) => (
                        <li
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        className={activeFilter === item.id ? 'active' : ''} >
                            <FontAwesomeIcon icon={item.icon} />
                            <span>{item.text}</span>
                        </li>
                    ))}
                </ul>
            </Nav>
        </div>
        <UserControls>
            <LogoutButton />
        </UserControls>
    </Header>
  )
}

export default Sidebar