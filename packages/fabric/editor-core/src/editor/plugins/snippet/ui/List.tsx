import * as React from 'react';
import { Snippet } from './data';
import { PickerRow } from './styles';
import SnippetIcon from './SnippetIcon';
import LockCircleIcon from '@atlaskit/icon/glyph/lock-circle';

export interface Props {
  snippet: Snippet;
  onSelection?: (snippet: Snippet, event: React.MouseEvent<any>) => void;
}

export function leftClick(event: React.MouseEvent<any>): boolean {
  return (
    event.button === 0 &&
    !event.altKey &&
    !event.ctrlKey &&
    !event.metaKey &&
    !event.shiftKey
  );
}

export default class SnippetItem extends React.PureComponent<Props, {}> {
  // internal, used for callbacks
  private onSnippetSelection = (event: React.MouseEvent<HTMLDivElement>) => {
    if (leftClick(event) && this.props.onSelection) {
      event.preventDefault();
      this.props.onSelection(this.props.snippet, event);
    }
  };

  render() {
    const { snippet } = this.props;

    return (
      <PickerRow key={snippet.id} onMouseDown={this.onSnippetSelection}>
        <div className="icon">
          <SnippetIcon />
        </div>
        <div className="content">
          <div className="name">{snippet.name}</div>
          <div className="value">
            {typeof snippet.value === 'number'
              ? snippet.value.toLocaleString()
              : snippet.value}
          </div>
        </div>
        <div className="lock">
          {snippet.private ? <LockCircleIcon label="" /> : null}
        </div>
      </PickerRow>
    );
  }
}
