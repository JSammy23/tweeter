import { useLocation, Link } from 'react-router-dom';

import styled from 'styled-components';

const StyledTab = styled(Link)`
 background-color: transparent;
 color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.secondary};
 border: none;
 border-bottom: ${props => props.active ? `3px solid ${props.theme.colors.accent}` : 'none'};
 padding: .3em;
 font-size: 1em;
 margin-top: 1em;
 cursor: pointer;
 text-decoration: none;
`;


const UserProfileControls = ({ userUid }) => {
    const location = useLocation();
    const activeTab = location.pathname.endsWith('/likes') ? 'userLikes' : 'userTweets';

    const navItems = [
      {id: 'userTweets', text: 'Tweets', link: `/profile/${userUid}`},
      {id: 'userLikes', text: 'Likes', link: `/profile/${userUid}/likes`},
  ];

  return (
    <div className='flex around'>
        {navItems.map((item) => (
            <StyledTab
            key={item.id}
            as={Link}
            to={item.link}
            active={item.id === activeTab}
            >
                {item.text}
            </StyledTab>
        ))}
    </div>
  );
};

export default UserProfileControls