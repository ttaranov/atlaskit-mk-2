import * as React from 'react';
import Button from '@atlaskit/button';
import { CardList } from '@atlaskit/media-card';
import { SmartMediaEditor } from '../src';
import {
  imageFileId,
  createUploadContext,
  defaultCollectionName,
} from '@atlaskit/media-test-helpers';
import { CardListWrapper } from '../example-helpers/styled';

interface State {
  showEditor: boolean;
}

const context = createUploadContext();

class SmartMediaEditorExample extends React.Component<{}, State> {
  state: State = {
    showEditor: false,
  };

  openSmartEditor = () => {
    this.setState({ showEditor: true });
  };

  onFinish = identifier => {
    console.log('onFinish', identifier);
    this.setState({
      showEditor: false
    })
  };

  renderCardList = () => {
    return (
      <CardListWrapper>
        <h1>Public collection: {defaultCollectionName}</h1>
        <CardList
          context={context}
          collectionName={defaultCollectionName}
          // cardAppearance="small"
        />
      </CardListWrapper>
    );
  };

  render() {
    const { showEditor } = this.state;

    const editor = (
      <SmartMediaEditor
        identifier={imageFileId}
        context={context}
        onFinish={this.onFinish}
      />
    );

    return (
      <div>
        <Button onClick={this.openSmartEditor}>Open Smart Editor</Button>
        {this.renderCardList()}
        {showEditor ? editor : null}
      </div>
    );
  }
}

export default () => <SmartMediaEditorExample />;
