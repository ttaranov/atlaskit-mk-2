import * as React from 'react';
import LazyRender from 'react-lazily-render';
import { Client } from '../Client';
import { WithObject } from '../WithObject';

import { CardContent, CardAppearance } from './CardContent';

export { CardAppearance };

export type FromUrlProps = {
  appearance: CardAppearance;
  url: string;
  client?: Client;
};

export type WithDataProps = {
  appearance: CardAppearance;
  data: any;
};

export type CardProps = FromUrlProps | WithDataProps;

const isFromUrl = (props: CardProps): props is FromUrlProps =>
  (props as FromUrlProps).url !== undefined;

export const renderFromURL = ({ appearance, url, client }: FromUrlProps) => (
  <LazyRender
    offset={100}
    component={appearance === 'inline' ? 'span' : 'div'}
    placeholder={
      <CardContent
        appearance={appearance}
        state={{
          status: 'resolving',
          services: [],
          data: {
            url,
          },
        }}
        reload={() => {
          /* do nothing */
        }}
      />
    }
    content={
      <WithObject client={client} url={url}>
        {({ state, reload }) => (
          <CardContent
            appearance={appearance}
            state={{
              ...state,
              data: {
                url,
                ...state.data,
              },
            }}
            reload={reload}
          />
        )}
      </WithObject>
    }
  />
);

export const renderTheData = ({ appearance, data }: WithDataProps) => (
  <CardContent
    appearance={appearance}
    state={{
      status: 'resolved',
      services: [],
      data,
    }}
    reload={() => {
      /* do nothing */
    }}
  />
);

export class Card extends React.PureComponent<CardProps> {
  render() {
    return isFromUrl(this.props)
      ? renderFromURL(this.props)
      : renderTheData(this.props);
  }
}
