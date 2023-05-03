import React, { useState } from 'react';
import { Editor, EditorState, RichUtils } from 'draft-js';

import styled from 'styled-components';

const Container = styled.div`
  border: 1px solid #ccc;
  padding: 8px;
  font-size: 16px;
  line-height: 1.5;
`;

const EditorWrapper = styled.div`
  position: relative;
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
  }
`;

const TextEditor = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const handleEditorChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  const toggleInlineStyle = (inlineStyle) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  };

  return (
    <EditorWrapper>
      <StyledEditor>
        <Editor
          editorState={editorState}
          onChange={handleEditorChange}
          placeholder="What's Happening?"
        />
      </StyledEditor>
    </EditorWrapper>
  )
}

export default TextEditor