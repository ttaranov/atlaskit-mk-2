import * as React from 'react';
import CollapsedEditor from './../src/labs/CollapsedEditor';
import { IntlProvider } from 'react-intl';

export interface State {
  isExpanded: boolean;
}
export default class Example extends React.Component<{}, State> {
  state = { isExpanded: false };

  toggleExpanded = () => {
    this.setState(prevState => ({ isExpanded: !prevState.isExpanded }));
  };

  render() {
    return (
      <CollapsedEditor
        placeholder="What would you like to say?"
        isExpanded={this.state.isExpanded}
        onClickToExpand={this.toggleExpanded}
        renderEditor={Editor => (
          <IntlProvider locale="en">
            <Editor
              appearance="comment"
              quickInsert={true}
              onSave={() => alert('Saved!')}
              onCancel={this.toggleExpanded}
            />
          </IntlProvider>
        )}
      />
    );
  }
}
