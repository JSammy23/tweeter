import React from 'react';
import { useNavigate } from 'react-router-dom';


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
    const navigate = useNavigate();

    const navigateToSearch = () => {
        // Navigate to the search component with the hashtag as a parameter
        navigate(`/search?tag=${encodeURIComponent(hashtag)}`);
    }
  
    return (
      <StyledHashtag onClick={navigateToSearch}>
        {children}
      </StyledHashtag>
    );
  }
  
  export default Hashtag;