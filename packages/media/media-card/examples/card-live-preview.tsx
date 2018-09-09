/* tslint:disable:no-console */

import * as React from 'react';
import { Component } from 'react';
import Button from '@atlaskit/button';
import FieldText from '@atlaskit/field-text';
import {
  StoryList,
  createStorybookContext,
  defaultCollectionName as collectionName,
} from '@atlaskit/media-test-helpers';

import { Card, UrlPreviewIdentifier } from '../src';

const context = createStorybookContext();

const eventHandler = (eventName: string) => {
  return () => {
    console.log(eventName);
  };
};

const menuActions = [
  {
    label: 'Open',
    handler: () => {
      console.log('open');
    },
  },
  {
    label: 'Close',
    handler: () => {
      console.log('close');
    },
  },
];

interface LiveUrlConverterState {
  link: string;
  loading: boolean;
}

class LiveUrlConverter extends Component<{}, LiveUrlConverterState> {
  constructor(props: any) {
    super(props);
    this.state = { link: 'https://www.atlassian.com', loading: false };
  }

  render() {
    const identifier: UrlPreviewIdentifier = {
      mediaItemType: 'link',
      url: this.state.link,
    };

    const cards = [
      {
        title: 'small',
        content: (
          <Card
            identifier={identifier}
            context={context}
            appearance="small"
            onClick={eventHandler('click')}
            onMouseEnter={eventHandler('mouseEnter')}
            actions={menuActions}
          />
        ),
      },
      {
        title: 'image',
        content: (
          <Card
            identifier={identifier}
            context={context}
            appearance="image"
            onClick={eventHandler('click')}
            onMouseEnter={eventHandler('mouseEnter')}
            actions={menuActions}
          />
        ),
      },
      {
        title: 'horizontal',
        content: (
          <Card
            identifier={identifier}
            context={context}
            appearance="horizontal"
            onClick={eventHandler('click')}
            onMouseEnter={eventHandler('mouseEnter')}
            actions={menuActions}
          />
        ),
      },
      {
        title: 'square',
        content: (
          <Card
            identifier={identifier}
            context={context}
            appearance="square"
            onClick={eventHandler('click')}
            onMouseEnter={eventHandler('mouseEnter')}
            actions={menuActions}
          />
        ),
      },
      {
        title: 'generic (no appearance)',
        content: (
          <Card
            identifier={identifier}
            context={context}
            onClick={eventHandler('click')}
            onMouseEnter={eventHandler('mouseEnter')}
            actions={menuActions}
          />
        ),
      },
    ];

    return (
      <div style={{ margin: '20px' }}>
        <h1>Url live preview</h1>
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ width: '500px', marginRight: '20px' }}>
            <FieldText
              label="url"
              type="text"
              shouldFitContainer={true}
              placeholder="Paste some url..."
              value={this.state.link}
              onChange={this.onInputChange}
            />
          </div>
          <Button appearance="primary" onClick={this.onAddLink}>
            Add link
          </Button>
        </div>
        <StoryList>{cards}</StoryList>
      </div>
    );
  }

  onLoadingChange = (state: any) => {
    if (state) {
      this.setState({ loading: state.loading });
    }
  };

  // TODO debounce
  onInputChange = (e: any) => {
    const link = e.target.value;
    this.setState({ link });
  };

  onAddLink = () => {
    const { link } = this.state;
    context
      .getUrlPreviewProvider(link)
      .observable()
      .subscribe(metadata =>
        context.addLinkItem(link, collectionName, metadata),
      );
  };
}

export default () => <LiveUrlConverter />;
