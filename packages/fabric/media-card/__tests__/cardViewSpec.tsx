import * as React from 'react';

import { shallow, mount } from 'enzyme';
import { FileDetails, LinkDetails } from '@atlaskit/media-core';

import { ErrorWrapper } from '../src/links/cardGenericView/styled';
import { Retry } from '../src/utils/cardGenericViewSmall/styled';
import { CardView } from '../src/root/cardView';
import { LinkCard } from '../src/links';
import { FileCard } from '../src/files';

describe('CardView', () => {
  const file: FileDetails = {
    id: 'abcd',
    name: 'my-file',
  };
  const link: LinkDetails = {
    id: 'abcd',
    type: 'wha',
    url: 'https://example.com',
    title: 'foobar',
  };

  it('should render FileCard when no metadata is passed', () => {
    const element = shallow(<CardView status="loading" appearance="small" />);
    const linkCard = element.find(FileCard);
    expect(linkCard).toHaveLength(1);
  });

  it('should render LinkCard with details', () => {
    const element = shallow(
      <CardView status="loading" metadata={link} appearance="small" />,
    );

    const linkCard = element.find(LinkCard);
    expect(linkCard).toHaveLength(1);
    expect(linkCard.props().details).toBe(link);
  });

  it('should render LinkCard with other props', () => {
    const element = shallow(
      <CardView status="loading" metadata={link} appearance="small" />,
    );

    const linkCard = element.find(LinkCard);
    expect(linkCard).toHaveLength(1);
    expect(linkCard.prop('appearance')).toBe('small');
  });

  it('should render FileCard with details', () => {
    const element = shallow(
      <CardView status="loading" metadata={file} appearance="small" />,
    );

    const card = element.find(FileCard);
    expect(card).toHaveLength(1);
    expect(card.props().details).toBe(file);
  });

  it('should render FileCard with other props', () => {
    const element = shallow(
      <CardView status="loading" metadata={file} appearance="small" />,
    );

    const fileCard = element.find(FileCard);
    expect(fileCard).toHaveLength(1);
    expect(fileCard.prop('appearance')).toBe('small');
  });

  it('should render LinkCard and NOT use details to determine which card to render when mediaItemType is "link"', () => {
    const element = shallow(
      <CardView mediaItemType="link" status="loading" metadata={file} />,
    );

    const linkCard = element.find(LinkCard);
    expect(linkCard).toHaveLength(1);
  });

  it('should render FileCard and NOT use details to determine which card to render when mediaItemType is "file"', () => {
    const element = shallow(
      <CardView mediaItemType="file" status="loading" metadata={link} />,
    );

    const linkCard = element.find(FileCard);
    expect(linkCard).toHaveLength(1);
  });

  it('should fire onClick and onMouseEnter events when file details are passed in', () => {
    const clickHandler = jest.fn();
    const hoverHandler = jest.fn();
    const card = mount(
      <CardView
        status="loading"
        metadata={file}
        onClick={clickHandler}
        onMouseEnter={hoverHandler}
      />,
    );

    card.simulate('click');
    card.simulate('mouseEnter');

    expect(clickHandler).toHaveBeenCalledTimes(1);
    const clickHandlerArg = clickHandler.mock.calls[0][0];
    expect(clickHandlerArg.mediaItemDetails).toEqual(file);

    expect(hoverHandler).toHaveBeenCalledTimes(1);
    const hoverHandlerArg = hoverHandler.mock.calls[0][0];
    expect(hoverHandlerArg.mediaItemDetails).toEqual(file);
  });

  it('should fire onClick and onMouseEnter events when link details are passed in', () => {
    const clickHandler = jest.fn();
    const hoverHandler = jest.fn();
    const card = shallow(
      <CardView
        status="loading"
        metadata={link}
        onClick={clickHandler}
        onMouseEnter={hoverHandler}
      />,
    );

    card.simulate('click');
    card.simulate('mouseEnter');

    expect(clickHandler).toHaveBeenCalledTimes(1);
    const clickHandlerArg = clickHandler.mock.calls[0][0];
    expect(clickHandlerArg.mediaItemDetails).toEqual(link);

    expect(hoverHandler).toHaveBeenCalledTimes(1);
    const hoverHandlerArg = hoverHandler.mock.calls[0][0];
    expect(hoverHandlerArg.mediaItemDetails).toEqual(link);
  });

  it('should fire onRetry when there is an error and callback is passed', () => {
    const onRetryHandler = jest.fn();
    const card = mount(
      <CardView status="error" metadata={link} onRetry={onRetryHandler} />,
    );

    card
      .find(ErrorWrapper)
      .find('button')
      .simulate('click');
    expect(onRetryHandler).toHaveBeenCalledTimes(1);
  });

  it('should render retry element for small cards when an error occurs', () => {
    const onRetryHandler = jest.fn();
    const linkCard = mount(
      <CardView
        status="error"
        appearance="small"
        metadata={link}
        onRetry={onRetryHandler}
      />,
    );
    const fileCard = mount(
      <CardView
        status="error"
        appearance="small"
        metadata={file}
        onRetry={onRetryHandler}
      />,
    );

    expect(linkCard.find(Retry)).toHaveLength(1);
    expect(fileCard.find(Retry)).toHaveLength(1);
  });

  it('should NOT fire onSelectChange when card is NOT selectable', () => {
    const handler = jest.fn();
    const card = shallow(
      <CardView status="loading" metadata={file} onSelectChange={handler} />,
    );
    card.setProps({ selected: true });

    expect(handler).not.toHaveBeenCalled();
  });

  it('should fire onSelectChange when selected state is changed by the consumer and selectable is true', () => {
    const handler = jest.fn();
    const card = shallow(
      <CardView
        status="loading"
        metadata={file}
        onSelectChange={handler}
        selectable={true}
      />,
    );
    card.setProps({ selected: true });

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0][0]).toEqual({
      selected: true,
      mediaItemDetails: file,
    });
  });

  it('should render a cropped image by default', () => {
    const card = mount(
      <CardView status="complete" dataURI="a" metadata={file} />,
    );

    expect(card.find('MediaImage').prop('crop')).toBe(true);
  });

  it('should render not render a cropped image if we specify a different resizeMode', () => {
    const card = mount(
      <CardView
        status="complete"
        dataURI="a"
        metadata={file}
        resizeMode="full-fit"
      />,
    );

    expect(card.find('MediaImage').prop('crop')).toBe(false);
  });
});
