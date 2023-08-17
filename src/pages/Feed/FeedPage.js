import React, { useContext, useEffect } from 'react'
import Sidebar from 'components/Sidebar';
import useUserInfo from 'hooks/useUserInfo';
import auth from 'services/auth';

import styled from 'styled-components';
import { Background, Wrapper } from 'styles/styledComponents';
import { AppContext } from 'services/appContext';
import Loading from 'components/Loading/Loading';


const Flex = styled.div`
  display: flex;
  
  @media (max-width: 683px) {
    flex-direction: column;
  }
`;

const FeedContainer = styled.div`
 width: 100%;
 height: 100vh;
 max-width: 683px;
 /* grid-column: 2 / 3; */
 flex: 3;
 flex-shrink: 1;
 order: 1;
 overflow-y: scroll;
 border-right: 1px solid;
 border-left: 1px solid;
 border-color: ${props => props.theme.colors.secondary};

 @media (min-width: 838px) {
  min-width: 683px;
 }

 @media (max-width: 683px) {
  padding-bottom: 3.5em;
  width: 100vw;
 }

 /* Hide the scrollbar */
 &::-webkit-scrollbar {
    width: 0em;
    background-color: transparent;
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    background-color: transparent;
  }

  /* Track */
  &::-webkit-scrollbar-track {
    background-color: transparent;
  }

  /* Hide the scrollbar in Mozilla Firefox */
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;

  /* Track */
  scrollbar-track-color: transparent;

  /* Handle */
  scrollbar-thumb-color: transparent;
`;

const FeedPage = ({ children }) => {
  const { setCurrentUser } = useContext(AppContext);

  const { loading, userInfo } = useUserInfo(auth.currentUser.uid);

  useEffect(() => {
    const setCurrentUserAsync = async () => {
      if (userInfo && !loading) {
        setCurrentUser(userInfo);
      }
    }
    setCurrentUserAsync();
  }, [userInfo, loading, setCurrentUser]);

  if (loading) {
    return <Loading/>
  }
  
  return (
    <Background>
      <Wrapper>
        <Flex>
        <Sidebar/>
        <FeedContainer>{children}</FeedContainer>
        </Flex>
      </Wrapper>
    </Background>
  )
}

export default FeedPage