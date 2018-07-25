import * as React from 'react';
import { shallow } from 'enzyme';
import { Filmstrip, FilmstripView, FilmstripProps } from '../src';
import { fakeContext } from '@atlaskit/media-test-helpers';
import { Card, Identifier } from '@atlaskit/media-card';

describe('<Filmstrip />', () => {
  const setup = (props?: Partial<FilmstripProps>) => {
    const context = fakeContext();
    const identifiers: Identifier[] = [
      {
        id: 'id-1',
        mediaItemType: 'file',
      },
      {
        id: 'id-2',
        mediaItemType: 'file',
      },
      {
        url: 'some-url',
        mediaItemType: 'link',
      },
    ];
    const component = shallow(
      <Filmstrip context={context} identifiers={identifiers} {...props} />,
    );

    return {
      component,
      context,
    };
  };

  it('should render a FilmstripView with the right amount of Cards', () => {
    const { component } = setup();

    expect(component.find(FilmstripView)).toHaveLength(1);
    expect(component.find(FilmstripView).find(Card)).toHaveLength(3);
  });

  it('should use right React key for Cards', () => {
    const { component } = setup();

    expect(
      component
        .find(FilmstripView)
        .find(Card)
        .at(0)
        .key(),
    ).toEqual('id-1');
    expect(
      component
        .find(FilmstripView)
        .find(Card)
        .at(1)
        .key(),
    ).toEqual('id-2');
    expect(
      component
        .find(FilmstripView)
        .find(Card)
        .at(2)
        .key(),
    ).toEqual('some-url');
  });

  it('should pass properties down to Cards', () => {
    const { component, context } = setup({
      cardProps: {
        selectable: true,
        selected: true,
      },
    });

    expect(
      component
        .find(FilmstripView)
        .find(Card)
        .first()
        .props(),
    ).toEqual(
      expect.objectContaining({
        context,
        selectable: true,
        selected: true,
        identifier: {
          id: 'id-1',
          mediaItemType: 'file',
        },
      }),
    );
  });
});
