import React, { useContext } from 'react';
import { AppContext } from 'services/appContext';
import UserProfile from './UserProfile';


import styled from 'styled-components';



const FeedContainer = styled.div`
 width: 100%;
 height: 100%;
 border-right: 1px solid;
 border-left: 1px solid;
 border-color: ${props => props.theme.colors.secondary};
`;



const Feed = ({ user }) => {

    const { activeFilter, setActiveFilter } = useContext(AppContext);



  return (
    <FeedContainer>
        {activeFilter === 'profile' ? (
            <UserProfile user={user} />
        ) : null }
    </FeedContainer>
  )
}

export default Feed