import * as React from 'react';
import LazyRender from 'react-lazily-render';
import { WithObject } from '../WithObject';
import { CardProps, CardWithData, CardWithUrl } from './types';
import { CardContentLoader } from './CardContentLoader';

export const isCardWithData = (props: CardProps): props is CardWithData =>
  !!(props as CardWithData).data;

export const renderCardWithURL = ({
  url,
  client,
  appearance,
  isSelected,
  onClick,
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
        <CardContentLoader
          appearance={appearance}
          state={{
            status: 'resolving',
            services: [],
            data: { url },
          }}
          onClick={onClick}
          reload={() => {
            /* do nothing */
          }}
        />
      }
      content={
        <WithObject client={client} url={url}>
          {({ state, reload }) => (
            <CardContentLoader
              isSelected={isSelected}
              appearance={appearance}
              state={{
                ...state,
                data: { url, ...state.data },
              }}
              onClick={onClick}
              reload={reload}
            />
          )}
        </WithObject>
      }
    />
  );
};

export const renderCardWithData = ({
  appearance,
  data,
  isSelected,
  onClick,
}: CardWithData) => (
  <CardContentLoader
    isSelected={isSelected}
    appearance={appearance}
    state={{
      status: 'resolved',
      services: [],
      data,
    }}
    onClick={onClick}
    reload={() => {
      /* do nothing */
    }}
  />
);
