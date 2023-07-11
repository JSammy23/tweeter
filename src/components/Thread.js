import React, { useContext } from 'react'
import { AppContext } from 'services/appContext'
import Tweet from './Tweet';
import Compose from './Compose';

import styled from 'styled-components';
import { Header } from 'styles/styledComponents';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/fontawesome-free-solid';


const StyledIcon = styled(FontAwesomeIcon)`
 cursor: pointer;
 color: inherit;
 font-size: 1.4em;
 margin: .3em 0;

 &:hover {
  color: ${props => props.theme.colors.primary};
 }
`;

// TODO:
// Back click is not working, prevFilter in Feedpage not working.

const Thread = ({ onBackClick }) => {
    const { activeThread, setActiveThread, setActiveFilter, currentUser } = useContext(AppContext);
    

  return (
    <>
        <Header>
            <h2>Tweet</h2>
            <StyledIcon icon={faArrowLeft} onClick={onBackClick} />
        </Header>    
        <Tweet key={activeThread} tweet={activeThread} />
        <Compose 
         user={currentUser}
         action='reply'
         activeThread={activeThread} />
    </>
  )
}

export default Thread