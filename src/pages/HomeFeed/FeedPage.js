import React from 'react'


import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter } from '@fortawesome/fontawesome-free-brands';



const Background = styled.div`
    background-color: ${props => props.theme.colors.bgDark};
    width: 100vw;
    height: 100vh;
`

const Logo = styled.h1`
  color: ${props => props.theme.colors.primary};
  font-size: 2em;
  padding: .3em;
`

const Wrapper = styled.div`
  width: 90%;
  background-color: transparent;
  margin-right: auto;
  margin-left: auto;
  /* border: 2px solid red; */
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 600px 1fr;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr 600px;
  }
`

const FeedPage = ({ user }) => {
  return (
    <Background>
      <Wrapper>
        <Grid>
        <Logo><FontAwesomeIcon icon={faTwitter} /> Tweeter</Logo>
        {/* Feed component */}
        </Grid>
      </Wrapper>
    </Background>
  )
}

export default FeedPage