import * as React from 'react';
import { StoryList } from '@atlaskit/media-test-helpers';
import { CardList } from '../../src';

import { wrongCollection, wrongContext } from '..';

export const renderErrorStates = () => {
  const style = { color: 'red', fontSize: '30px' };
  const customErrorComponent = <div style={style}>Something went wrong :\</div>;

  return (
    <StoryList>
      {[
        {
          title: 'Default error state',
          content: (
            <CardList context={wrongContext} collectionName={wrongCollection} />
          ),
        },
        {
          title: 'Custom error state',
          content: (
            <CardList
              context={wrongContext}
              errorComponent={customErrorComponent}
              collectionName={wrongCollection}
            />
          ),
        },
      ]}
    </StoryList>
  );
};
