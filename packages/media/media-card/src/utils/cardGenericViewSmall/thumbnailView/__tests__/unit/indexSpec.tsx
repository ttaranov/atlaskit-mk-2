import * as React from 'react';
import { shallow } from 'enzyme';
import FileIcon from '@atlaskit/icon/glyph/file';
import LinkIcon from '@atlaskit/icon/glyph/link';
import { ThumbnailView } from '../..';
import { MediaImage } from '../../../../mediaImage';
import { LoadingPlaceholder, EmptyPlaceholder } from '../../styled';

describe('CardGenericViewSmall', () => {
  describe('ThumbnailView', () => {
    it('should render the <LoadingPlaceholder/> when isLoading=true', () => {
      const element = shallow(<ThumbnailView type="link" isLoading={true} />);
      expect(element.find(LoadingPlaceholder).exists()).toBeTruthy();
    });

    it('should not render the <LoadingPlaceholder/> when isLoading=false', () => {
      const element = shallow(<ThumbnailView type="link" isLoading={false} />);
      expect(element.find(LoadingPlaceholder).exists()).toBeFalsy();
    });

    it('should render the <EmptyPlaceholder/> with a <LinkIcon/> when type=link and url is undefined', () => {
      const element = shallow(<ThumbnailView type="link" url={undefined} />);
      expect(element.find(LinkIcon).exists()).toBeTruthy();
    });

    it('should render the <EmptyPlaceholder/> with a <LinkIcon/> when type=file and url is undefined', () => {
      const element = shallow(<ThumbnailView type="file" url={undefined} />);
      expect(element.find(FileIcon).exists()).toBeTruthy();
    });

    it('should not render the <EmptyPlaceholder/> when url is defined', () => {
      const element = shallow(
        <ThumbnailView
          type="link"
          url="https://www.example.com/thumbnail.jpg"
        />,
      );
      expect(element.find(EmptyPlaceholder).exists()).toBeFalsy();
    });

    it('should render the <MediaImage/> when url is defined', () => {
      const element = shallow(
        <ThumbnailView
          type="link"
          url="https://www.example.com/thumbnail.jpg"
        />,
      );
      expect(element.find(MediaImage).exists()).toBeTruthy();
    });

    it('should not render the <MediaImage/> when url is undefined', () => {
      const element = shallow(<ThumbnailView type="link" url={undefined} />);
      expect(element.find(MediaImage).exists()).toBeFalsy();
    });
  });
});
