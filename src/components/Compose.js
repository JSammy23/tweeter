import React, { useState } from 'react';

import styled from 'styled-components';
import { TweetCard, UserImage } from './Tweet';
import { Button } from 'styles/styledComponents';
import ContentEditable from 'react-contenteditable';

const ImgDiv = styled.div`
 width: auto;
 height: 100%;
 margin-right: .5em;
 display: flex;
 align-items: flex-start;
`;

const InputWrapper = styled.div`
 position: relative;
`;

const Input = styled.div`
 width: 100%;
 min-height: 3em;
 height: auto;
 resize: none;
 background: transparent;
 border: none;
 word-wrap: normal;
 font-size: 1.2em;
 color: #fff;

 &:focus {
    outline: none;
 }
`;

const Placeholder = styled.span`
 font-size: 1.2em;
 color: ${props => props.theme.colors.secondary};
 pointer-events: none;
`;

const ComposeBody = styled.div`
 display: flex;
 flex-direction: column;
 width: 100%;
 height: fit-content;
`;

const Controls = styled.div`
 width: 100%;
 display: flex;
 justify-content: end;
`;

const Compose = ({ user }) => {
    const [text, setText] = useState('');
    const [isInputFocused, setIsInputFocused] = useState(false);

    const handleTextChange = (e) => {
        setText(e.target.innerText);
    };

    const handleFocus = () => {
        setIsInputFocused(true);
    };

    const handleBlur = () => {
        setIsInputFocused(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);
            const br = document.createElement("br");
            range.insertNode(br);
            range.setStartAfter(br);
            range.setEndAfter(br);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    };

  return (
    <TweetCard>
        <ImgDiv>
            <UserImage src={user?.profileImg} />
        </ImgDiv>
        <ComposeBody>
            <Input contentEditable onInput={handleTextChange} onFocus={handleFocus} onBlur={handleBlur} onKeyDown={handleKeyDown} >
                {text === '' && !isInputFocused && <Placeholder>What's Happening?</Placeholder>}
            </Input>
            <Controls>
                <div>
                    <Button>Tweet</Button>
                </div>
            </Controls>
        </ComposeBody>
    </TweetCard>
  )
}

export default Compose