import React, { useContext, useEffect, useState } from 'react'
import Sidebar from 'components/Sidebar';
import Feed from 'components/Feed';


import styled from 'styled-components';
import { Background, Wrapper } from 'styles/styledComponents';
import { AppContext } from 'services/appContext';



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
  const { activeFilter, setActiveFilter } = useContext(AppContext);
  const [prevFilter, setPrevFilter] = useState('');

  useEffect(() => {
    console.log('FeedPage mounted!');
    setPrevFilter(activeFilter);
  }, []);

  const handleBackClick = () => {
    setActiveFilter(prevFilter);
  };

  return (
    <Background>
      <Wrapper>
        <Grid>
        <Sidebar />
        <Feed onBackClick={handleBackClick} />
        </Grid>
      </Wrapper>
    </Background>
  )
}

export default FeedPage