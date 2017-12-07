import * as React from 'react';
import { shallow } from 'enzyme';
import CardFrame from '../../../src/shared/CardFrame';
import IconImage from '../../../src/shared/IconImage';
import CardDetails from '../../../src/app_2/shared/CardDetails';
import FilmstripApplicationCardView from '../../../src/app_2/FilmstripApplicationCardView';

describe('FilmstripApplicationCardView', () => {
  const preview = {
    url: '',
  };

  it('should render a link when link is provided', () => {
    const element = shallow(
      <FilmstripApplicationCardView
        link={{ url: 'https://www.google.com/' }}
      />,
    );
    expect(element.find(CardFrame).prop('href')).toEqual(
      'https://www.google.com/',
    );
  });

  it('should not render a link when link is not provided', () => {
    const element = shallow(<FilmstripApplicationCardView />);
    expect(element.find(CardFrame).prop('href')).toBeUndefined();
  });

  it('should render an icon in the frame when context is provided', () => {
    const element = shallow(
      <FilmstripApplicationCardView context={{ text: 'Jira' }} />,
    );
    expect(element.find(CardFrame).prop('text')).toEqual('Jira');
  });

  it('should not render an icon in the frame when context is not provided', () => {
    const element = shallow(<FilmstripApplicationCardView />);
    expect(element.find(CardFrame).prop('text')).toBeUndefined();
  });

  it('should render text in the frame when context is provided', () => {
    const element = shallow(
      <FilmstripApplicationCardView
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
    const element = shallow(<FilmstripApplicationCardView />);
    expect(element.find(CardFrame).prop('icon')).toBeUndefined();
  });

  it('it should render a thumbnail when there is a preview', () => {
    const element = shallow(<FilmstripApplicationCardView preview={preview} />);
    expect(element.find(CardDetails).prop('thumbnail')).toEqual(preview);
  });

  it('it should not render a thumbnail when there is no preview', () => {
    const element = shallow(<FilmstripApplicationCardView />);
    expect(element.find(CardDetails).prop('thumbnail')).toBeUndefined();
  });

  it('should have a minWidth of 240 when there is a preview', () => {
    const element = shallow(<FilmstripApplicationCardView preview={preview} />);
    expect(element.find(CardFrame).prop('minWidth')).toEqual(240);
  });

  it('should have a minWidth of 240 when there is no preview', () => {
    const element = shallow(<FilmstripApplicationCardView />);
    expect(element.find(CardFrame).prop('minWidth')).toEqual(240);
  });

  it('should have a maxWidth of 400 when there is a preview', () => {
    const element = shallow(<FilmstripApplicationCardView preview={preview} />);
    expect(element.find(CardFrame).prop('maxWidth')).toEqual(400);
  });

  it('should have a maxWidth of 400 when there is no preview', () => {
    const element = shallow(<FilmstripApplicationCardView />);
    expect(element.find(CardFrame).prop('maxWidth')).toEqual(400);
  });
});
