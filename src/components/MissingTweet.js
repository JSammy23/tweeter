import React from 'react';
import userImg from '../assets/user.png'

import styled, { keyframes } from 'styled-components';
import { TweetCard, TweetHeader, TweetBody, UserImage, FlexDiv, LeftThreadLine } from 'styles/tweetStyles';


const loadingAnimation = keyframes`
  0% { 
    background-position: -100% 0;
  }
  100% { 
    background-position: 200% 0;
  }
`;

const Placeholder = styled.div`
  height: ${({ height }) => height || "20px"};
  width: ${({ width }) => width || "100px"};
  background-color: ${({ bgColor }) => bgColor || "#f0f0f0"}; // new bgColor prop
  background: linear-gradient(90deg, #808080 25%, #696969 50%, #808080 75%);
  background-size: 200% 100%;
  animation: ${loadingAnimation} 2.5s infinite linear;
`;

const BlurContainer = styled.div`
  position: relative;
  backdrop-filter: blur(2px);

`;

const MissingTextContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 99;
`;

const MissingText = styled.p`
  color: #fff;
`;

const MissingTweet = ({ isMini }) => {
  const missingText = 'This tweet is currently unavalable or was removed by the author.'

  return (
    <BlurContainer>
      <TweetCard isMini={isMini}>
        {isMini && <LeftThreadLine />}
        <UserImage src={userImg} isMini={isMini} />
        <div className="flex column">
          <TweetHeader>
            <FlexDiv>
              <div className="flex align">
                <Placeholder height="1.5em" width="30%" color='red' /> 
              </div>
              <Placeholder height="1.5em" width="20%" /> 
            </FlexDiv>
          </TweetHeader>
          <TweetBody isMini={isMini}>
            <Placeholder height="3em" width='75%' /> 
          </TweetBody>
        </div>
      </TweetCard>
      <MissingTextContainer>
        <MissingText>{missingText}</MissingText>
      </MissingTextContainer>
    </BlurContainer>
  );
  
}

export default MissingTweet
