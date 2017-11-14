import * as React from 'react';
import { EmojiAttributes } from '@atlaskit/editor-common';
import { PureComponent } from 'react';
import { ProviderFactory } from '@atlaskit/editor-common';
import { Emoji } from '@atlaskit/editor-common';

export interface EmojiProps extends EmojiAttributes {
  providers?: ProviderFactory;
}

export default class EmojiItem extends PureComponent<EmojiProps, {}> {
  render() {
    const { id, providers, shortName, text } = this.props;

    return (
      <Emoji
        allowTextFallback={true}
        id={id}
        shortName={shortName}
        fallback={text}
        providers={providers}
      />
    );
  }
}
