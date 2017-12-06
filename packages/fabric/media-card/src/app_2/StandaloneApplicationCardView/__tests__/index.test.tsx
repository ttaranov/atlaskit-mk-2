import * as React from 'react';
import { shallow } from 'enzyme';
import CardFrame from '../../../shared/CardFrame';
import CardPreview from '../../../shared/CardPreview';
import CardDetails from '../../shared/CardDetails';
import IconImage from '../../../shared/IconImage';
import StandaloneApplicationCardView from '..';

describe('StandaloneApplicationCardView', () => {
  const preview = {
    url: '',
  };

  it('should render a link when link is provided', () => {
    const element = shallow(
      <StandaloneApplicationCardView
        link={{ url: 'https://www.google.com/' }}
      />,
    );
    expect(element.find(CardFrame).prop('href')).toEqual(
      'https://www.google.com/',
    );
  });

  it('should not render a link when link is not provided', () => {
    const element = shallow(<StandaloneApplicationCardView />);
    expect(element.find(CardFrame).prop('href')).toBeUndefined();
  });

  it('should render an icon in the frame when context is provided', () => {
    const element = shallow(
      <StandaloneApplicationCardView context={{ text: 'Jira' }} />,
    );
    expect(element.find(CardFrame).prop('text')).toEqual('Jira');
  });

  it('should not render an icon in the frame when context is not provided', () => {
    const element = shallow(<StandaloneApplicationCardView />);
    expect(element.find(CardFrame).prop('text')).toBeUndefined();
  });

  it('should render text in the frame when context is provided', () => {
    const element = shallow(
      <StandaloneApplicationCardView
        context={{
          text: 'Jira',
          icon: {
            url: 'https://www.google.com/',
          },
        }}
      />,
    );
    expect(element.find(CardFrame).prop('icon')).toEqual(
      <IconImage src="https://www.google.com/" alt="" />,
    );
  });

  it('should not render text in the frame when context is not provided', () => {
    const element = shallow(<StandaloneApplicationCardView />);
    expect(element.find(CardFrame).prop('icon')).toBeUndefined();
  });

  it('it should render a preview when there is a preview', () => {
    const element = shallow(
      <StandaloneApplicationCardView preview={preview} />,
    );
    expect(element.find(CardPreview)).toHaveLength(1);
  });

  it('it should not render a preview when there is no preview', () => {
    const element = shallow(<StandaloneApplicationCardView />);
    expect(element.find(CardPreview)).toHaveLength(0);
  });

  it('it should not render a thumbnail when there is a preview', () => {
    const element = shallow(
      <StandaloneApplicationCardView preview={preview} />,
    );
    expect(element.find(CardDetails).prop('thumbnail')).toBeUndefined();
  });

  it('it should not render a thumbnail when there is no preview', () => {
    const element = shallow(<StandaloneApplicationCardView />);
    expect(element.find(CardDetails).prop('thumbnail')).toBeUndefined();
  });

  it('should have a minWidth of 240 when there is a preview', () => {
    const element = shallow(
      <StandaloneApplicationCardView preview={preview} />,
    );
    expect(element.find(CardFrame).prop('minWidth')).toEqual(240);
  });

  it('should have a minWidth of 240 when there is no preview', () => {
    const element = shallow(<StandaloneApplicationCardView />);
    expect(element.find(CardFrame).prop('minWidth')).toEqual(240);
  });

  it('should have a maxWidth of 664 when there is a preview', () => {
    const element = shallow(
      <StandaloneApplicationCardView preview={preview} />,
    );
    expect(element.find(CardFrame).prop('maxWidth')).toEqual(664);
  });

  it('should have a maxWidth of 400 when there is no preview', () => {
    const element = shallow(<StandaloneApplicationCardView />);
    expect(element.find(CardFrame).prop('maxWidth')).toEqual(400);
  });
});
