import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const TweetCard = styled.div`
 width: 100%;
 display: flex;
 padding: .5em;
 border-bottom: 1px solid ${props => props.theme.colors.secondary};
 

 ${props => props.isMini && `
  width: 90%;
  padding: .3em;
//   margin-left: auto;
  border-bottom: none;
 `}
`;

export const LeftThreadLine = styled.div`
 width: 1px;
 height: 5em;
 background: ${props => props.theme.colors.secondary};
 border: 2px solid ${props => props.theme.colors.secondary};
 margin-left: 2em;
 margin-right: 2em;
`;

export const TweetHeader = styled.div`
 width: 100%;
 display: flex;
`;

export const FlexDiv = styled.div`
 width: 100%;
 display: flex;
 justify-content: space-between;
`;

export const UserImage = styled.img`
 width: 3.7em;
 height: 3.7em;
 border-radius: 50%;
 border: 1px solid black;
 margin-right: .5em;
 cursor: pointer;

 ${props => props.isMini && `
  width: 50px;
  height: 50px;
 `}

 @media (max-width: 599px) {
  width: 3em;
  height: 3em;
 }
`;

export const Name = styled.h2`
 color: ${props => props.theme.colors.primary};
 margin-right: .3em;

 ${props => props.isMini && `
  font-size: 1.2em;
 `}

@media (max-width: 600px) {
  font-size: 1.2em;
 }
`;

export const Handle = styled.h3`
 color: ${props => props.theme.colors.secondary};
 cursor: pointer;

 &:hover {
  color: ${props => props.theme.colors.primary};
  text-decoration: underline;
 }

 ${props => props.isMini && `
  font-size: 1.2em;
 `}

@media (max-width: 600px) {
  font-size: 1.2em;
 }
`;

export const TweetDate = styled.div`
 display: flex;
 color: ${props => props.theme.colors.secondary};
 font-size: 1em;
 justify-content: flex-end;

 ${props => props.isMini && `
  font-size: .9em;
 `}
`;

export const TweetBody = styled.div`
 width: 100%;
 text-align: start;
 color: #fff;
 font-size: 1.3em;
 margin-top: .3em;

 ${props => props.isMini && `
  font-size: 1.2em;
 `}

 @media (max-width: 600px) {
  font-size: 1.2em;
  margin-top: .1em
 }
`;

export const TweetReactions = styled.div`
 display: flex;
 margin-top: .3em;
`;

export const TweetReactionsCount = styled.span`
 color: ${props => props.theme.colors.primary};
`;

export const StyledIcon = styled(FontAwesomeIcon)`
 color: ${props => props.theme.colors.secondary};
 cursor: pointer;

 &:hover {
  color: ${props => props.theme.colors.accent};
 }
`;

export const MenuContainer = styled.div`
 position: relative;
`;

export const MenuOptions = styled.div`
 position: absolute;
 top: 100%;
 right: 0;
 width: 6em;
 background-color: ${props => props.theme.colors.bgDark};
 border: 1px solid ${props => props.theme.colors.secondary};
 padding: .3em;
 box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;