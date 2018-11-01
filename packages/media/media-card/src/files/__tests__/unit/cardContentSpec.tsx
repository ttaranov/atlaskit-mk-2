import * as React from 'react';
import { shallow } from 'enzyme';

import { CardContent } from '../../cardImageView/cardContent';
import { MediaImage } from '../../../utils/mediaImage';
import { PlayIconWrapper } from '../../../files/cardImageView/styled';

describe('<CardContent />', () => {
  it('should render the image preview when mediaType is "video"', function() {
    const card = shallow(
      <CardContent mediaType="video" dataURI="some-data-uri" />,
    );
    expect(card.find(MediaImage)).toHaveLength(1);
  });

  it('should render the image preview when mediaType is "audio"', function() {
    const card = shallow(
      <CardContent mediaType="audio" dataURI="some-data-uri" />,
    );
    expect(card.find(MediaImage)).toHaveLength(1);
  });

  it('should render the image preview when mediaType is "image"', function() {
    const card = shallow(
      <CardContent mediaType="image" dataURI="some-data-uri" />,
    );
    expect(card.find(MediaImage)).toHaveLength(1);
  });

  it('should NOT render the image preview when mediaType is "doc"', function() {
    const card = shallow(
      <CardContent mediaType="doc" dataURI="some-data-uri" />,
    );
    expect(card.find(MediaImage)).toHaveLength(0);
  });

  it('should NOT render the image preview when data URI is undefined', function() {
    const card = shallow(<CardContent mediaType="video" />);
    expect(card.find(MediaImage)).toHaveLength(0);
  });

  it('should render play icon for video files', () => {
    const card = shallow(
      <CardContent mediaType="video" dataURI={'some-preview'} />,
    );

    expect(card.find(PlayIconWrapper)).toHaveLength(1);
  });
});
