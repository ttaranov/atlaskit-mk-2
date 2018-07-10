import * as React from 'react';
import { shallow } from 'enzyme';
import { MediaImage } from '../../../../../utils/mediaImage';
import CardDetails from '../../../../../links/cardGenericView/CardDetails';
import {
  Title,
  TitlePlaceholder,
  Thumbnail,
} from '../../../../../links/cardGenericView/CardDetails/styled';

describe('CardDetails', () => {
  const thumbnail = 'http://localhost:9001/some/thumbnail';

  it('should render placeholder content when isPlaceholder=true', () => {
    const element = shallow(<CardDetails isPlaceholder={true} />);
    expect(element.find(Title)).toHaveLength(0);
    expect(element.find(TitlePlaceholder)).toHaveLength(1);
  });

  it('should render real content by default', () => {
    const element = shallow(<CardDetails />);
    expect(element.find(Title)).toHaveLength(1);
    expect(element.find(TitlePlaceholder)).toHaveLength(0);
  });

  it('should not render a thumbnail if isThumbnailVisible=false and there is a thumbnail', () => {
    const element = shallow(
      <CardDetails isThumbnailVisible={false} thumbnail={thumbnail} />,
    );
    expect(element.find(Thumbnail)).toHaveLength(0);
  });

  it('should not render a thumbnail if isThumbnailVisible=false and isPlaceholder=true', () => {
    const element = shallow(
      <CardDetails isThumbnailVisible={false} isPlaceholder={true} />,
    );
    expect(element.find(Thumbnail)).toHaveLength(0);
  });

  it('should not render a thumbnail if isThumbnailVisible=true and there is no thumbnail provided', () => {
    const element = shallow(<CardDetails />);
    expect(element.find(Thumbnail)).toHaveLength(0);
  });

  it('should render a placeholder thumbnail if isThumbnailVisible=true and isPlaceholder=true', () => {
    const element = shallow(
      <CardDetails isThumbnailVisible={true} isPlaceholder={true} />,
    );
    const thumb = element.find(Thumbnail);
    expect(thumb).toHaveLength(1);
    expect(thumb.exists()).toBeTruthy();
  });

  it('should render a placeholder thumbnail if isThumbnailVisible=true and there is a thumbnail', () => {
    const element = shallow(
      <CardDetails isThumbnailVisible={true} thumbnail={thumbnail} />,
    );
    const thumb = element.find(Thumbnail);
    expect(thumb).toHaveLength(1);
    expect(thumb.find(MediaImage)).toHaveLength(1);
  });
});
