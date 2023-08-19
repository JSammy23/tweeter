import React from 'react';
import img from '../../assets/Screenshot from 2023-08-19 12-21-06.png'

import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Button } from 'styles/styledComponents';


const Screenshot = styled.img`
  transition: transform 0.5s;
  transform-style: preserve-3d;
  transform: perspective(1000px) rotateX(30deg) rotateY(30deg) rotateZ(-25deg);
  padding: 1em;
  width: 40em;

  /* &:hover {
    transform: perspective(1000px) rotateX(0deg);
  } */
`;

const FlexDiv = styled.div`
 display: flex;
 justify-content: space-around;
 align-items: center;
 /* flex-wrap: wrap; */
`;

// Styles

const Page = styled.div`
  font-family: 'Arial', sans-serif;
  background-color: #121212;  // Dark background
  color: #FFFFFF;  // White text for contrast
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 5%;
`;

const Logo = styled.h1`
  font-size: 2rem;
  color: #4CAF50;  // You can choose a contrast color for the logo
`;

const ButtonLink = styled(Link)`
  padding: 0.5rem 1rem;
  margin-left: 0.5rem;
  border: none;
  border-radius: 4px;
  background-color: #4CAF50;  // Green for Call to Action buttons
  color: #FFFFFF;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #45a049;  // Slightly darker green on hover
  }
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
`;

const Title = styled.h2`
  font-size: 3rem;
  text-align: center;
`;

const Description = styled.p`
  font-size: 1.5rem;
  text-align: center;
  max-width: 800px;
`;

const Footer = styled.footer`
  background-color: #2a2a2a;  // A shade lighter than the main background for distinction
  padding: 1rem 5%;
  text-align: center;
  font-size: 0.9rem;
  color: #bbbbbb;  // Slightly dim color for the text to maintain the dark theme
`;

// Component

function LandingPage() {
  return (
    <Page>
      <Header>
        <Logo>Tweeter</Logo>
        <div>
          <ButtonLink to='/login' >Login</ButtonLink>
          <ButtonLink to='/signup' >Sign Up</ButtonLink>
        </div>
      </Header>

      <MainContent>
        <Title>Welcome to Tweeter</Title>
        <Description>
          The next generation of microblogging. Share your story, explore moments, and connect with others, all in one place.
        </Description>
      </MainContent>
      <Footer>
      This project is for learning and resume purposes only. Not intended for any copyright infringement.
      </Footer>
    </Page>
  );
}

export default LandingPage;