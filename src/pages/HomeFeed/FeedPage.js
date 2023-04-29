import React from 'react'
import Sidebar from 'components/Sidebar';
import Feed from 'components/Feed';


import styled from 'styled-components';
import { Background, Wrapper } from 'styles/styledComponents';



const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 600px 1fr;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr 600px;
  }
`;

const FeedPage = ({ user }) => {
  return (
    <Background>
      <Wrapper>
        <Grid>
        <Sidebar user={user}/>
        <Feed user={user}/>
        </Grid>
      </Wrapper>
    </Background>
  )
}

export default FeedPage