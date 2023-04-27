import styled from "styled-components"


export const Background = styled.div`
background-color: ${props => props.theme.colors.bgDark};
width: 100vw;
height: 100vh;
`;

export const Logo = styled.h1`
color: ${props => props.theme.colors.primary};
font-size: 2em;
padding: .5em 0;
`;

export const Wrapper = styled.div`
width: 90%;
background-color: transparent;
margin-right: auto;
margin-left: auto;
/* border: 2px solid red; */
`;