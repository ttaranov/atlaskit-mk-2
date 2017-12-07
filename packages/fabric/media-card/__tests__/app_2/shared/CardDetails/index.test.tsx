import * as React from 'react';
import { shallow } from 'enzyme';
import Avatar from '@atlaskit/avatar';
import IconImage from '../../../../src/shared/IconImage';
import PreviewImage from '../../../../src/shared/PreviewImage';
import CardDetails from '../../../../src/app_2/shared/CardDetails';
import Actions from '../../../../src/app_2/shared/CardDetails/Actions';
import {
  Title,
  Description,
  BottomWrapper,
} from '../../../../src/app_2/shared/CardDetails/styled';

describe('CardDetails', () => {
  const icon = {
    url: '',
  };

  const user = {
    icon: {
      url: '',
    },
  };

  const thumbnail = {
    url: '',
  };

  it('should render the title', () => {
    const element = shallow(
      <CardDetails
        title={{
          title: {
            text: 'Hello World!',
          },
          text: {
            text: 'Your world is small.',
          },
        }}
      />,
    );
    expect(
      element
        .find(Title)
        .render()
        .text(),
    ).toEqual('Hello World!');
  });

  it('should render the description', () => {
    const element = shallow(
      <CardDetails
        title={{
          title: {
            text: 'Hello World!',
          },
          text: {
            text: 'Your world is small.',
          },
        }}
      />,
    );
    expect(
      element
        .find(Description)
        .render()
        .text(),
    ).toEqual('Your world is small.');
  });

  it('should render the icon when there is an icon, a user and a thumbnail', () => {
    const element = shallow(
      <CardDetails icon={icon} user={user} thumbnail={thumbnail} />,
    );
    expect(element.find(IconImage)).toHaveLength(1);
    expect(element.find(Avatar)).toHaveLength(0);
    expect(element.find(PreviewImage)).toHaveLength(0);
  });

  it('should render the user when there is a user and a thumbnail', () => {
    const element = shallow(<CardDetails user={user} thumbnail={thumbnail} />);
    expect(element.find(IconImage)).toHaveLength(0);
    expect(element.find(Avatar)).toHaveLength(1);
    expect(element.find(PreviewImage)).toHaveLength(0);
  });

  it('should render the user when there is a user', () => {
    const element = shallow(<CardDetails user={user} />);
    expect(element.find(IconImage)).toHaveLength(0);
    expect(element.find(Avatar)).toHaveLength(1);
    expect(element.find(PreviewImage)).toHaveLength(0);
  });

  it('should render the thumbnail when there is a thumbnail', () => {
    const element = shallow(<CardDetails thumbnail={thumbnail} />);
    expect(element.find(IconImage)).toHaveLength(0);
    expect(element.find(Avatar)).toHaveLength(0);
    expect(element.find(PreviewImage)).toHaveLength(1);
  });

  it('should render the icon when there is an icon and a user', () => {
    const element = shallow(<CardDetails icon={icon} user={user} />);
    expect(element.find(IconImage)).toHaveLength(1);
    expect(element.find(Avatar)).toHaveLength(0);
    expect(element.find(PreviewImage)).toHaveLength(0);
  });

  it('should render the icon when there is an icon and a thumbnail', () => {
    const element = shallow(<CardDetails icon={icon} thumbnail={thumbnail} />);
    expect(element.find(IconImage)).toHaveLength(1);
    expect(element.find(Avatar)).toHaveLength(0);
    expect(element.find(PreviewImage)).toHaveLength(0);
  });

  it('should render the icon when there is an icon', () => {
    const element = shallow(<CardDetails icon={icon} thumbnail={thumbnail} />);
    expect(element.find(IconImage)).toHaveLength(1);
    expect(element.find(Avatar)).toHaveLength(0);
    expect(element.find(PreviewImage)).toHaveLength(0);
  });

  it('should padLeft when there is an icon', () => {
    const element = shallow(<CardDetails icon={icon} />);
    expect(element.find(BottomWrapper).prop('padLeft')).toBeTruthy();
  });

  it('should padLeft when there is a user', () => {
    const element = shallow(<CardDetails user={user} />);
    expect(element.find(BottomWrapper).prop('padLeft')).toBeTruthy();
  });

  it('should padLeft when there is a thumbnail', () => {
    const element = shallow(<CardDetails thumbnail={thumbnail} />);
    expect(element.find(BottomWrapper).prop('padLeft')).toBeTruthy();
  });

  it('should not padLeft when there is no icon, user or preview', () => {
    const element = shallow(<CardDetails />);
    expect(element.find(BottomWrapper).prop('padLeft')).toBeFalsy();
  });

  it('should use compact actions when width is <384', () => {
    const element = shallow(<CardDetails />);
    element.setState({ width: 383 });
    expect(element.find(Actions).prop('compact')).toBeTruthy();
  });

  it('should not use compact actions when width is undefined', () => {
    const element = shallow(<CardDetails />);
    element.setState({ width: undefined });
    expect(element.find(Actions).prop('compact')).toBeFalsy();
  });

  it('should not use compact actions when width is >=384', () => {
    const element = shallow(<CardDetails />);
    element.setState({ width: 384 });
    expect(element.find(Actions).prop('compact')).toBeFalsy();
  });
});
