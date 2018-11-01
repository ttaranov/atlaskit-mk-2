import * as React from 'react';
import { mount } from 'enzyme';
import { imageFileId } from '@atlaskit/media-test-helpers';
import Media from '../../../../react/nodes/media';
import MediaSingle from '../../../../react/nodes/mediaSingle';
import { WidthProvider } from '@atlaskit/editor-common';

describe('MediaSingle', () => {
  const editorWidth = 123;

  it('passes the renderer width down as cardDimensions', () => {
    const mediaDimensions = {
      width: 250,
      height: 250,
    };

    const mediaAspectRatio = mediaDimensions.height / mediaDimensions.width;

    // mock page width
    Object.defineProperties(document.body, {
      offsetWidth: {
        get: () => 123,
      },
    });

    const mediaSingle = mount(
      <WidthProvider>
        <MediaSingle layout={'center'} appearance={'full-page'}>
          <Media
            id={imageFileId.id}
            type={imageFileId.mediaItemType}
            collection={imageFileId.collectionName}
            {...mediaDimensions}
          />
        </MediaSingle>
      </WidthProvider>,
    );

    const { cardDimensions } = mediaSingle.find(Media).props();
    expect(cardDimensions).toBeDefined();

    const cardHeightCss = cardDimensions!.height as string;
    const cardHeight = Number(
      cardHeightCss.substring(0, cardHeightCss.length - 2),
    );

    expect(cardDimensions!.width).toEqual(`${editorWidth}px`);
    expect(cardHeight).toBeCloseTo(editorWidth * mediaAspectRatio);

    mediaSingle.unmount();
  });
});
