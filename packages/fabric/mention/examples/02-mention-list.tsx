import * as React from 'react';

import { randomMentions, onSelection } from '../example-helpers';
import { MentionDescription } from '../src/types';
import MentionList from '../src/components/MentionList';

export interface State {
  mentions: MentionDescription[];
}

export default class DemoMentionList extends React.Component<any, State> {
  private mentionListRef: MentionList;

  constructor(props) {
    super(props);
    this.state = {
      mentions: randomMentions(),
    };
  }

  private updateData = () => {
    this.setState({
      mentions: randomMentions(),
    });
  };

  private moveUp = () => {
    if (this.mentionListRef) {
      // FIXME reactify should expose prototype methods from a wc
      this.mentionListRef.selectPrevious();
    }
  };

  private moveDown = () => {
    if (this.mentionListRef) {
      this.mentionListRef.selectNext();
    }
  };

  private handleMentionListRef = ref => {
    this.mentionListRef = ref;
  };

  render() {
    const mentionList = (
      <MentionList
        mentions={this.state.mentions}
        onSelection={onSelection}
        ref={this.handleMentionListRef}
      />
    );

    return (
      <div style={{ paddingLeft: '10px' }}>
        <div style={{ paddingBottom: '10px' }}>
          <button
            onClick={this.updateData}
            style={{ height: '30px', marginRight: '10px' }}
          >
            Random refresh
          </button>
          <button
            onClick={this.moveUp}
            style={{ height: '30px', marginRight: '10px' }}
          >
            Up
          </button>
          <button
            onClick={this.moveDown}
            style={{ height: '30px', marginRight: '10px' }}
          >
            Down
          </button>
        </div>
        {mentionList}
      </div>
    );
  }
}
