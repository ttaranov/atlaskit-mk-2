import * as React from 'react';
import { DiffRenderer, Renderer } from '../src/ui';
import { CheckboxStateless } from '@atlaskit/checkbox';
import AkFieldRadioGroup from '@atlaskit/field-radio-group';
import { diffDocs } from './helper/diff-data';

export interface State {
  diffOnly?: boolean;
  showDiff?: boolean;
  doc: string;
}

const items = [
  {
    name: 'doc',
    value: 'simple',
    label: 'Simple',
    defaultSelected: true,
  },
  {
    name: 'doc',
    value: 'table',
    label: 'Table',
  },
  {
    name: 'doc',
    value: 'lists',
    label: 'Lists',
  },
];

export class DiffDemo extends React.Component<{}, State> {
  constructor(props) {
    super(props);
    this.state = {
      diffOnly: false,
      showDiff: false,
      doc: 'simple',
    };
  }

  onDiffOnlyChange = () => {
    this.setState({
      diffOnly: !this.state.diffOnly,
    });
  };

  onShowDiffChange = () => {
    this.setState({
      showDiff: !this.state.showDiff,
    });
  };

  setDocument = (evt: any) => {
    this.setState({
      doc: evt.target.value,
    });
  };

  renderDiff() {
    const { diffOnly, showDiff, doc } = this.state;
    const { oldDocument, newDocument } = diffDocs[doc];
    if (!showDiff) {
      return null;
    }

    return (
      <div
        style={{
          flex: '1 1 0',
          boxSizing: 'border-box',
          padding: '0 10px 0 0',
          margin: '0 10px 0 0',
          borderRight: '1px solid #EBECF0',
        }}
      >
        <strong>Diff</strong>
        <DiffRenderer
          oldDocument={oldDocument}
          newDocument={newDocument}
          diffOnly={diffOnly}
        />
      </div>
    );
  }

  render() {
    const { diffOnly, showDiff, doc } = this.state;
    const { oldDocument, newDocument } = diffDocs[doc];
    return (
      <div style={{ display: 'flex' }}>
        <div
          style={{
            flex: '1 1 0',
            boxSizing: 'border-box',
            padding: '0 10px 0 0',
            margin: '0 10px 0 0',
            borderRight: '1px solid #EBECF0',
          }}
        >
          <strong>Old Document</strong>
          <Renderer document={oldDocument} />
        </div>
        {this.renderDiff()}
        <div style={{ flex: '1 1 0' }}>
          <strong>New Document</strong>
          <Renderer document={newDocument} />
        </div>
        <div
          style={{
            boxSizing: 'border-box',
            padding: '10px',
            marginLeft: '10px',
            width: '150px',
            borderLeft: '1px solid #EBECF0',
          }}
        >
          <CheckboxStateless
            label="Show diff"
            isChecked={showDiff}
            onChange={this.onShowDiffChange}
          />
          <CheckboxStateless
            label="Changes only"
            isChecked={diffOnly}
            onChange={this.onDiffOnlyChange}
          />
          <AkFieldRadioGroup
            items={items}
            label="Pick a document:"
            onRadioChange={this.setDocument}
          />
        </div>
      </div>
    );
  }
}

export default function Example() {
  return <DiffDemo />;
}
