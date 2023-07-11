import React from 'react'

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/fontawesome-free-regular';

const StyledIcon = styled(FontAwesomeIcon)`
 color: ${props => props.theme.colors.secondary};
 cursor: pointer;

 &:hover {
    color:  ${props => props.theme.colors.primary};
 }
`;

const CommentsButton = ({ tweet, onClick }) => {
  return (
    <div onClick={onClick}>
        <StyledIcon icon={faComment} />
    </div>
  )
}

export default CommentsButton