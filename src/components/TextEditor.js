import React, { useState } from 'react';
import { Editor, EditorState, RichUtils, convertToRaw, CompositeDecorator } from 'draft-js';

import styled from 'styled-components';
import { Button } from 'styles/styledComponents';


const EditorWrapper = styled.div`
  position: relative;
  /* border: 1px solid lime; */
  max-width: 505px;
  max-height: 158px;
`;

const StyledEditor = styled.div`
  .DraftEditor-root {
    height: 6.25em;
    padding: .6em;
    border: 1px solid red;
  }

  .DraftEditor-editorContainer {
    height: 100%;
    border: 1px solid blue;
  }

  .public-DraftEditorPlaceholder-root {
    position: absolute;
    color: ${props => props.theme.colors.secondary};
    pointer-events: none;
    font-size: 1.4rem;

    @media (max-width: 683px) {
      font-size: 1.2em;
    }
  }

  .public-DraftEditor-content {
    color: #fff;
    font-size: 1.4rem;
    max-height: 158px;
    overflow: auto;
    border: 1px solid yellow;

    @media (max-width: 683px) {
      font-size: 1.2rem;
    }
  }
`;

const Controls = styled.div`
 width: 100%;
 display: flex;
 justify-content: end;
`;

const hashtagStrategy = (contentBlock, callback, contentState) => {
  const text = contentBlock.getText();
  text.replace(/\#[\w\u0590-\u05ff]+/g, (match, offset) => {
    callback(offset, offset + match.length);
  });
};

const HashtagSpan = (props) => {
  return (
    <span style={{color: 'lime', fontWeight: 'bold'}}>
      {props.children}
    </span>
  );
};

const compositeDecorator = new CompositeDecorator([
  {
    strategy: hashtagStrategy,
    component: HashtagSpan,
  },
]);

const TextEditor = ({ onTweet, action }) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty(compositeDecorator));
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

  const handleTweet = () => {
    const contentState = editorState.getCurrentContent();
    const tweetBody = convertEditorStateToPlainText(contentState);
    onTweet(tweetBody);
    setEditorState(EditorState.createEmpty());
  };

  const placeholder = action === 'tweet' ? "What's Happening?" : "Tweet your reply!";


  return (
    <EditorWrapper>
      <StyledEditor>
        <Editor
          editorState={editorState}
          onChange={handleEditorChange}
          placeholder={placeholder}
          maxLength={maxTweetLength}
          onBeforeInput={handleBeforeInput}
        />
        <Controls>
                <div>
                    <Button disabled={isComposeDisabled} onClick={handleTweet} >
                      {action === 'tweet' ? 'Tweet' : 'Reply'}
                    </Button>
                </div>
            </Controls>
      </StyledEditor>
    </EditorWrapper>
  )
}

export default TextEditor