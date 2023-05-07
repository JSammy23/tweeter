import React, { useState } from 'react';
import { Editor, EditorState, RichUtils, convertToRaw } from 'draft-js';

import styled from 'styled-components';
import { Button } from 'styles/styledComponents';

const Container = styled.div`
  border: 1px solid #ccc;
  padding: 8px;
  font-size: 16px;
  line-height: 1.5;
`;

const EditorWrapper = styled.div`
  position: relative;
  /* border: 1px solid lime; */
  max-width: 505px;
  max-height: 158px;
`;

const StyledEditor = styled.div`
  .DraftEditor-root {
    height: 100px;
    padding: 10px;
  }

  .DraftEditor-editorContainer {
    height: 100%;
  }

  .public-DraftEditorPlaceholder-root {
    position: absolute;
    color: ${props => props.theme.colors.secondary};
    pointer-events: none;
    font-size: 1.4em;
  }

  .public-DraftEditor-content {
    color: #fff;
    font-size: 1.4em;
    max-height: 158px;
    overflow: auto;
  }
`;

const Controls = styled.div`
 width: 100%;
 display: flex;
 justify-content: end;
`;

const TextEditor = ({ onTweet }) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [isComposeDisabled, setIsComposeDisabled] = useState(true);
  const maxTweetLength = 180;

  const handleEditorChange = (newEditorState) => {
    setEditorState(newEditorState);
    // Enable Tweet button
    const contentState = newEditorState.getCurrentContent();
    const nonWhitespaceText = contentState.getPlainText().trim();
    const tweetLength = nonWhitespaceText.length;
    setIsComposeDisabled(nonWhitespaceText.length === 0 || tweetLength > maxTweetLength);
  };

  const handleBeforeInput = (e) => {
    const currentContentLength = editorState.getCurrentContent().getPlainText().length;
    if (currentContentLength >= maxTweetLength) {
      e.preventDefault();
    }
  };

  const toggleInlineStyle = (inlineStyle) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  };

  const convertEditorStateToPlainText = (editorState) => {
    const rawContentState = convertToRaw(editorState);
    return JSON.stringify(rawContentState);
  };

  const tweet = () => {
    const contentState = editorState.getCurrentContent();
    const tweetBody = convertEditorStateToPlainText(contentState);
    onTweet(tweetBody);
    setEditorState(EditorState.createEmpty());
  }


  return (
    <EditorWrapper>
      <StyledEditor>
        <Editor
          editorState={editorState}
          onChange={handleEditorChange}
          placeholder="What's Happening?"
          maxLength={maxTweetLength}
          onBeforeInput={handleBeforeInput}
        />
        <Controls>
                <div>
                    <Button disabled={isComposeDisabled} onClick={tweet} >Tweet</Button>
                </div>
            </Controls>
      </StyledEditor>
    </EditorWrapper>
  )
}

export default TextEditor