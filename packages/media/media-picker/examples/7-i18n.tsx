import {
  I18NWrapper,
  defaultCollectionName,
  defaultMediaPickerAuthProvider,
  userAuthProvider,
} from '@atlaskit/media-test-helpers';
import * as React from 'react';
import { Component } from 'react';
import { ContextFactory } from '@atlaskit/media-core';
import { MediaPicker, Popup } from '../src';
import { intlShape } from 'react-intl';

const mediaContext = ContextFactory.create({
  authProvider: defaultMediaPickerAuthProvider,
  userAuthProvider: userAuthProvider,
});

interface ExampleChildrenProps {}

// This class simulates a real integration where the React legacy context it's passed manually.
// That's pretty much what Editor does.
class ExampleChildren extends Component<ExampleChildrenProps, {}> {
  popup?: Popup;

  static contextTypes = {
    intl: intlShape,
  };

  componentDidMount() {
    this.createMediaPicker(this.context);
    this.showMediaPicker();
  }

  componentWillReceiveProps(_: ExampleChildrenProps, nextContext: any) {
    if (this.context.intl !== nextContext.intl) {
      this.createMediaPicker(nextContext);
    }
  }

  createMediaPicker(reactContext: any) {
    this.popup = MediaPicker('popup', mediaContext, {
      container: document.body,
      uploadParams: {
        collection: defaultCollectionName,
      },
      proxyReactContext: reactContext,
    });
  }

  showMediaPicker = () => {
    if (this.popup) {
      this.popup.show();
    }
  };

  render() {
    return <button onClick={this.showMediaPicker}>Show Popup</button>;
  }
}

export default class Example extends Component<{}, {}> {
  render() {
    return (
      <div>
        <I18NWrapper>
          <ExampleChildren />
        </I18NWrapper>
      </div>
    );
  }
}
