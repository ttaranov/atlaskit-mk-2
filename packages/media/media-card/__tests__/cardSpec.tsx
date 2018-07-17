import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { fakeContext } from '@atlaskit/media-test-helpers';

import {
  Card,
  UrlPreviewIdentifier,
  FileIdentifier,
  LinkIdentifier,
  CardEvent,
  CardView,
} from '../src';
import { MediaCard } from '../src/root/mediaCard';
import { LazyContent } from '../src/utils/lazyContent';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { UIAnalyticsEventInterface } from '@atlaskit/analytics-next-types';

describe('Card', () => {
  const linkIdentifier: LinkIdentifier = {
    id: 'some-random-id',
    mediaItemType: 'link',
    collectionName: 'some-collection-name',
  };
  const fileIdentifier: FileIdentifier = {
    id: 'some-random-id',
    mediaItemType: 'file',
    collectionName: 'some-collection-name',
  };

  // TODO: Add test to check that we are rendering LinkCard
  it.skip('should render media card with UrlPreviewProvider when passed a UrlPreviewIdentifier', () => {
    const dummyUrl = 'http://some.url.com';
    const mediaItemType = 'link';
    const identifier: UrlPreviewIdentifier = {
      url: dummyUrl,
      mediaItemType,
    };
    const dummyProvider = { observable: 'dummy provider ftw!' };
    const context = fakeContext({
      getUrlPreviewProvider: dummyProvider,
    }) as any;

    const card = shallow(<Card context={context} identifier={identifier} />);

    expect(context.getUrlPreviewProvider).toHaveBeenCalledTimes(1);
    expect(context.getUrlPreviewProvider).toBeCalledWith(dummyUrl);
    expect(card.find(CardView)).toHaveLength(1);
  });

  // TODO: Adapt to the new api
  it.skip('should use the new context to create the subscription when context prop changes', () => {
    const dummyProvider = 'second provider';

    const firstContext = fakeContext({
      getMediaItemProvider: 'first provider',
    });

    const secondContext = fakeContext({
      getMediaItemProvider: dummyProvider,
    }) as any;

    const card = shallow(
      <Card context={firstContext} identifier={fileIdentifier} />,
    );
    card.setProps({ context: secondContext, fileIdentifier });
    const mediaCard = card.find(MediaCard);

    const { id, mediaItemType, collectionName } = fileIdentifier;
    expect(secondContext.getMediaItemProvider).toHaveBeenCalledTimes(1);
    expect(secondContext.getMediaItemProvider).toBeCalledWith(
      id,
      mediaItemType,
      collectionName,
    );

    expect(mediaCard).toHaveLength(1);
    expect(mediaCard.props().provider).toBe(dummyProvider);
  });

  // TODO: Adapt to new api
  it.skip('should create a new subscription when the identifier changes', () => {
    const firstIdentifier: FileIdentifier = fileIdentifier;
    const secondIdentifier: LinkIdentifier = linkIdentifier;

    const dummyProvider = { observable: 'dummy provider ftw!' };

    const context = fakeContext({
      getMediaItemProvider: dummyProvider,
    }) as any;

    const card = shallow(
      <Card context={context} identifier={firstIdentifier} />,
    );
    card.setProps({ context, identifier: secondIdentifier });
    const mediaCard = card.find(MediaCard);

    const { id, mediaItemType, collectionName } = secondIdentifier;
    expect(context.getMediaItemProvider).toHaveBeenCalledTimes(2);
    expect(context.getMediaItemProvider).toBeCalledWith(
      id,
      mediaItemType,
      collectionName,
    );

    expect(mediaCard).toHaveLength(1);
    expect(mediaCard.props().provider).toBe(dummyProvider);
  });

  it('should fire onClick when passed in as a prop and CardView fires onClick', () => {
    const context = fakeContext() as any;
    const clickHandler = jest.fn();
    const card = shallow(
      <Card
        context={context}
        identifier={fileIdentifier}
        onClick={clickHandler}
      />,
    );
    const mediaCardOnClick = card.find(CardView).props().onClick;

    if (!mediaCardOnClick) {
      throw new Error('MediaCard onClick was undefined');
    }

    expect(clickHandler).not.toHaveBeenCalled();
    mediaCardOnClick({} as any, {} as any);
    expect(clickHandler).toHaveBeenCalledTimes(1);
  });

  it('should pass onMouseEnter to CardView', () => {
    const context = fakeContext() as any;
    const hoverHandler = (result: CardEvent) => {};
    const card = shallow(
      <Card
        context={context}
        identifier={fileIdentifier}
        onMouseEnter={hoverHandler}
      />,
    );

    expect(card.find(CardView).props().onMouseEnter).toEqual(hoverHandler);
  });

  it('should use lazy load by default', () => {
    const context = fakeContext() as any;
    const hoverHandler = (result: CardEvent) => {};
    const card = shallow(
      <Card
        context={context}
        identifier={fileIdentifier}
        onMouseEnter={hoverHandler}
      />,
    );
    expect(card.find(LazyContent)).toHaveLength(1);
  });

  it('should not use lazy load when "isLazy" is false', () => {
    const context = fakeContext() as any;
    const hoverHandler = (result: CardEvent) => {};
    const card = shallow(
      <Card
        isLazy={false}
        context={context}
        identifier={fileIdentifier}
        onMouseEnter={hoverHandler}
      />,
    );

    expect(card.find(LazyContent)).toHaveLength(0);
  });

  it('should pass properties down to CardView', () => {
    const context = fakeContext() as any;
    const card = shallow(
      <Card
        context={context}
        identifier={fileIdentifier}
        appearance="small"
        dimensions={{ width: 100, height: 50 }}
      />,
    );

    expect(card.find(CardView).props().appearance).toBe('small');
    expect(card.find(CardView).props().dimensions).toEqual({
      width: 100,
      height: 50,
    });
  });

  it('should create a card placeholder with the right props', () => {
    const context = fakeContext() as any;
    const fileCard = shallow(
      <Card
        context={context}
        identifier={fileIdentifier}
        appearance="small"
        dimensions={{ width: 100, height: 50 }}
      />,
    );
    const linkCard = shallow(
      <Card context={context} identifier={linkIdentifier} />,
    );
    const filePlaceholder = (fileCard.instance() as Card).placeholder;
    const linkPlaceholder = (linkCard.instance() as Card).placeholder;
    const {
      status,
      appearance,
      mediaItemType,
      dimensions,
    } = filePlaceholder.props;

    expect(status).toBe('loading');
    expect(appearance).toBe('small');
    expect(mediaItemType).toBe('file');
    expect(dimensions).toEqual({ width: 100, height: 50 });
    expect(linkPlaceholder.props.mediaItemType).toBe('link');
  });

  it('should use "crop" as default resizeMode', () => {
    const context = fakeContext();
    const card = mount(
      <Card context={context} identifier={fileIdentifier} isLazy={false} />,
    );

    expect(card.find(CardView).prop('resizeMode')).toBe('crop');
  });

  it('should pass right resizeMode down', () => {
    const context = fakeContext();
    const card = mount(
      <Card
        context={context}
        identifier={fileIdentifier}
        isLazy={false}
        resizeMode="full-fit"
      />,
    );

    expect(card.find(CardView).prop('resizeMode')).toBe('full-fit');
  });

  it('should contain analytics context with identifier info', () => {
    const analyticsEventHandler = jest.fn();
    const fetchImageDataUriSpy = jest.fn(() => Promise.resolve());
    const context = fakeContext({
      getDataUriService: {
        fetchImageDataUri: fetchImageDataUriSpy,
      },
    });
    const card = mount(
      <AnalyticsListener channel="media" onEvent={analyticsEventHandler}>
        <Card
          context={context}
          identifier={fileIdentifier}
          isLazy={false}
          resizeMode="full-fit"
        />
      </AnalyticsListener>,
    );

    card.simulate('click');

    expect(analyticsEventHandler).toHaveBeenCalledTimes(1);
    const actualFiredEvent: UIAnalyticsEventInterface =
      analyticsEventHandler.mock.calls[0][0];
    expect(actualFiredEvent.context[0]).toEqual(
      expect.objectContaining({
        actionSubject: 'MediaCard',
        actionSubjectId: 'some-random-id',
        componentName: 'Card',
        packageName: '@atlaskit/media-card',
      }),
    );
  });

  it('should pass "disableOverlay" to CardView', () => {
    const context = fakeContext();
    const card = shallow(
      <Card
        context={context}
        identifier={fileIdentifier}
        isLazy={false}
        resizeMode="full-fit"
        disableOverlay={true}
      />,
      { disableLifecycleMethods: true },
    );

    expect(card.find(CardView).prop('disableOverlay')).toBe(true);
  });
});
