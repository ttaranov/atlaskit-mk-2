import * as React from 'react';
import { shallow } from 'enzyme';
import { UrlPreview } from '@atlaskit/media-core';
import {
  genericLinkDetails,
  emptyLinkDetails,
  spotifyLinkDetails,
  youtubeLinkDetails,
} from '@atlaskit/media-test-helpers';

import { LinkCard, LinkCardGenericView } from '../..';
import { A } from '../../card/styled';
import { CardGenericViewSmall } from '../../../utils/cardGenericViewSmall';
import { URLEmbedCard } from '../../embed/urlEmbedCard';
import { HTMLEmbedCard } from '../../embed/htmlEmbedCard';

describe('LinkCard', () => {
  describe('.render()', () => {
    it('should render LinkCardViewSmall when appearance="small"', () => {
      const card = shallow(
        <LinkCard
          status="complete"
          appearance="small"
          details={genericLinkDetails}
        />,
      );
      expect(card.find(CardGenericViewSmall).exists()).toBeTruthy();
    });

    it('should render LinkCardGenericView when appearance="image"', () => {
      const card = shallow(
        <LinkCard
          status="complete"
          appearance="image"
          details={genericLinkDetails}
        />,
      );
      expect(card.find(LinkCardGenericView).exists()).toBeTruthy();
    });

    it('should render LinkCardGenericView when appearance="horizontal" and details do not contain a smartCard', () => {
      const element = shallow(
        <LinkCard
          status="complete"
          appearance="horizontal"
          details={genericLinkDetails}
        />,
      );
      expect(element.find(LinkCardGenericView).exists()).toBeTruthy();
    });

    it('should render LinkCardGenericView when appearance="square"', () => {
      const element = shallow(
        <LinkCard
          status="complete"
          appearance="square"
          details={genericLinkDetails}
        />,
      );
      expect(element.find(LinkCardGenericView).exists()).toBeTruthy();
    });

    it('should render URLEmbedCard when appearance is undefined and details contains a URL embed with a height', () => {
      const app: UrlPreview = {
        type: 'link',
        url: 'http://fake-example.com/',
        title: 'fake example',
        resources: {
          app: {
            url: 'http://fake-example.com/embed',
            type: 'text/html',
            height: 456,
          },
        },
      };
      const card = shallow(<LinkCard status="complete" details={app} />);
      expect(card.find(URLEmbedCard).exists()).toBeTruthy();
    });

    it('should render URLEmbedCard when appearance is undefined and details contains a URL embed with an aspect ratio', () => {
      const app: UrlPreview = {
        type: 'link',
        url: 'http://fake-example.com/',
        title: 'fake example',
        resources: {
          app: {
            url: 'http://fake-example.com/embed',
            type: 'text/html',
            aspect_ratio: 1234,
          },
        },
      };
      const card = shallow(<LinkCard status="complete" details={app} />);
      expect(card.find(URLEmbedCard).exists()).toBeTruthy();
    });

    it('should render URLEmbedCard when appearance is undefined and details contains a player with a URL and a height', () => {
      const card = shallow(
        <LinkCard status="complete" details={spotifyLinkDetails} />,
      );
      expect(card.find(URLEmbedCard).exists()).toBeTruthy();
    });

    it('should render URLEmbedCard when appearance is undefined and details contains a player with a URL and an aspect ratio', () => {
      const card = shallow(
        <LinkCard status="complete" details={youtubeLinkDetails} />,
      );
      expect(card.find(URLEmbedCard).exists()).toBeTruthy();
    });

    it('should render HTMLEmbedCard when appearance is undefined and details contains a HTML embed', () => {
      const app: UrlPreview = {
        type: 'link',
        url: 'http://fake-example.com/',
        title: 'fake example',
        resources: {
          app: {
            html: '<h1>Hello World</h1>',
            type: 'text/html',
          },
        },
      };
      const card = shallow(<LinkCard status="complete" details={app} />);
      expect(card.find(HTMLEmbedCard).exists()).toBeTruthy();
    });

    it('should render LinkCardGenericView when appearance is undefined and details do not contain anything special', () => {
      const element = shallow(
        <LinkCard status="complete" details={genericLinkDetails} />,
      );
      expect(element.find(LinkCardGenericView).exists()).toBeTruthy();
    });

    it('should not render an A tag when status is "loading"', () => {
      const element = shallow(
        <LinkCard status="loading" details={genericLinkDetails} />,
      );
      expect(element.find(A)).toHaveLength(0);
    });

    it('should not render an A tag when status is "processing"', () => {
      const element = shallow(
        <LinkCard status="processing" details={genericLinkDetails} />,
      );
      expect(element.find(A)).toHaveLength(0);
    });

    it('should not render an A tag when status is "error"', () => {
      const element = shallow(
        <LinkCard status="error" details={genericLinkDetails} />,
      );
      expect(element.find(A)).toHaveLength(0);
    });

    it('should not render an A tag when URL is not present', () => {
      const element = shallow(
        <LinkCard status="complete" details={emptyLinkDetails} />,
      );
      expect(element.find(A)).toHaveLength(0);
    });
  });
});
