import * as React from 'react';

import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import ChevronUpIcon from '@atlaskit/icon/glyph/chevron-up';
import Button from '@atlaskit/button';
import Editor, { EditorProps } from '../../../editor';
import { toJSON } from '../../../utils';
import { JSONDocNode } from '../../../transformers/json/';

export interface Props {
  editorProps: EditorProps;
  apperanceProps?: { message?: EditorProps, comment?: EditorProps }
}

export interface State {
  appearance: 'comment' | 'message'
}

export default class ChameleonEditor extends React.Component<Props, State> {

  value?: JSONDocNode | string | Object;

  constructor(props: Props) {
    super(props);
    this.state = { appearance: 'message' };
    this.value = props.editorProps.defaultValue;
  }

  onEditorChange = (editorView) => {
    this.value = toJSON(editorView.state.doc);

    if (this.state.appearance === 'message') {
      if (
        JSON.stringify(this.value).indexOf('List') !== -1 ||
        JSON.stringify(this.value).indexOf('codeBlock') !== -1 ||
        JSON.stringify(this.value).indexOf('heading') !== -1
      ) {
        this.toggleEditor();
      }
    }

    if (this.props.editorProps.onChange) {
      this.props.editorProps.onChange(editorView);
    }
  }

  toggleEditor = () => this.setState(prevState => ({ appearance: prevState.appearance === 'comment' ? 'message': 'comment' }));

  renderToggleButton = () => (
    <Button
      onClick={this.toggleEditor}
      iconAfter={
        this.state.appearance === 'comment'
          ? <ChevronDownIcon label="collapse"/>
          : <ChevronUpIcon label="expand" />
      }
    />
  )

  renderEditor = () => {
    if (this.state.appearance === 'comment') {
      return (
        <Editor
          {...this.props.editorProps}
          {...this.props.apperanceProps![this.state.appearance]}

          onChange={this.onEditorChange}
          defaultValue={this.value}
          appearance={this.state.appearance}
        />
      )
    } else {
      return (
        <div style={{ flexGrow: 1}}>
          <Editor
            {...this.props.editorProps}
            {...this.props.apperanceProps![this.state.appearance]}

            onChange={this.onEditorChange}
            defaultValue={this.value}
            appearance={this.state.appearance}
          />
        </div>
      );
    }
  }

  render() {
    return (
      <div style={{ display: 'flex', position: 'absolute', bottom: '0px', width: '-webkit-fill-available', padding: '0px 40px' }}>
        {this.renderToggleButton()}
        <span style={{ marginRight: '8px' }} />
        {this.renderEditor()}
      </div>
    );
  }
}