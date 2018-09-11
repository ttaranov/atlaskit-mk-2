import * as React from 'react';
import LazyRender from 'react-lazily-render';
import { Client } from '../Client';
import { WithObject } from '../WithObject';

import { CardContent, CardAppearance } from './CardContent';

export { CardAppearance };

export type CardWithData = {
  appearance: CardAppearance;
  data?: any;
  isSelected?: boolean;
};

export type CardWithUrl = {
  appearance: CardAppearance;
  url?: string;
  client?: Client;
  isSelected?: boolean;
};

export type CardProps = CardWithData | CardWithUrl;

export const Card = (props: CardProps) =>
  isCardWithData(props) ? renderCardWithData(props) : renderCardWithURL(props);

const isCardWithData = (props: CardProps): props is CardWithData =>
  !!(props as CardWithData).data;

const renderCardWithURL = ({
  url,
  client,
  appearance,
  isSelected,
}: CardWithUrl) => {
  if (!url) {
    throw new Error(
      '@atlaskit/smart-card: Please, provide either data or url props',
    );
  }
  return (
    <LazyRender
      offset={100}
      component={appearance === 'inline' ? 'span' : 'div'}
      placeholder={
        <CardContent
          appearance={appearance}
          state={{
            status: 'resolving',
            services: [],
            data: { url },
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
              isSelected={isSelected}
              state={{
                ...state,
                data: { url, ...state.data },
              }}
              reload={reload}
            />
          )}
        </WithObject>
      }
    />
  );
};

const renderCardWithData = ({ appearance, data, isSelected }: CardWithData) => (
  <CardContent
    appearance={appearance}
    isSelected={isSelected}
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
