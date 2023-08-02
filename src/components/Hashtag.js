import React from 'react';

import styled from 'styled-components';

const StyledHashtag = styled.span`
  color: lime;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const Hashtag = (props) => {
    const { entityKey, contentState, children } = props;
    const { hashtag } = contentState.getEntity(entityKey).getData();
  
    return (
      <StyledHashtag onClick={() => console.log("Hashtag Clicked: " + hashtag)}>
        {children}
      </StyledHashtag>
    );
  }
  
  export default Hashtag;