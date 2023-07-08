import React, { useEffect } from 'react'
import Sidebar from 'components/Sidebar';
import Feed from 'components/Feed';


import styled from 'styled-components';
import { Background, Wrapper } from 'styles/styledComponents';



const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 600px 1fr;
  grid-template-rows: 100vh;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr 600px;
  }

  @media (max-width: 683px) {
    grid-template-columns: 1fr 100%;
  }
`;

const FeedPage = () => {

  useEffect(() => {
    console.log('FeedPage mounted!');
  }, []);

  return (
    <Background>
      <Wrapper>
        <Grid>
        <Sidebar />
        <Feed />
        </Grid>
      </Wrapper>
    </Background>
  )
}

export default FeedPage