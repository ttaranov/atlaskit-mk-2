import React from 'react';
import { Editor } from '@atlaskit/editor-core';
import { getEmojiResource } from '../src/support/story-data';

class CoreEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      markdown: 'markdown',
    };
    this.handleChange = this.handleChange.bind(this);
  }

  onSubmit(editor) {
    alert(`Saved with python-markdown value: ${editor.value}`);
  }

  handleCancel(editor) {}

  handleChange(editor) {
    this.setState({
      markdown: editor.value,
    });
  }

  render() {
    return (
      <div>
        <Editor
          appearance="message"
          allowTextFormatting={true}
          allowTasksAndDecisions={true}
          allowHyperlinks={true}
          allowCodeBlocks={true}
          allowLists={true}
          allowTextColor={true}
          allowJiraIssue={true}
          allowUnsupportedContent={true}
          allowInlineCommentMarker={true}
          allowPanel={true}
          emojiProvider={getEmojiResource({ uploadSupported: true })}
          saveOnEnter={true}
          shouldFocus={true}
        />
      </div>
    );
  }
}

export default CoreEditor;
