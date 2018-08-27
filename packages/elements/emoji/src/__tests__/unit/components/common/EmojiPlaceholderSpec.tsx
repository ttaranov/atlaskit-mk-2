import { shallow } from 'enzyme';
import * as React from 'react';
import { expect } from 'chai';
import EmojiPlaceholder from '../../../../components/common/EmojiPlaceholder';

describe('<EmojiPlaceholder />', () => {
  describe('render', () => {
    it('should render with fitToHeight', () => {
      const shortName = ':rage:';
      const wrapper = shallow(
        <EmojiPlaceholder
          shortName={shortName}
          showTooltip={false}
          size={48}
        />,
      );

      const spanStyle = wrapper.find('span').prop('style');
      expect(spanStyle!.width).to.equal('48px');
      expect(spanStyle!.height).to.equal('48px');
    });

    it('should render with default height', () => {
      const shortName = ':rage:';
      const wrapper = shallow(
        <EmojiPlaceholder shortName={shortName} showTooltip={false} />,
      );

      const spanStyle = wrapper.find('span').prop('style');
      expect(spanStyle!.width).to.equal('20px');
      expect(spanStyle!.height).to.equal('20px');
    });

    it('should render with provided size', () => {
      const shortName = ':rage:';
      const wrapper = shallow(
        <EmojiPlaceholder
          shortName={shortName}
          showTooltip={false}
          size={64}
        />,
      );

      const spanStyle = wrapper.find('span').prop('style');
      expect(spanStyle!.width).to.equal('64px');
      expect(spanStyle!.height).to.equal('64px');
    });

    it('should render image representation with custom size', () => {
      const shortName = ':rage:';
      const rep = {
        imagePath: '/path/bla.png',
        width: 256,
        height: 128,
      };
      const wrapper = shallow(
        <EmojiPlaceholder
          shortName={shortName}
          showTooltip={false}
          representation={rep}
          size={48}
        />,
      );

      const spanStyle = wrapper.find('span').prop('style');
      expect(spanStyle!.width).to.equal('96px');
      expect(spanStyle!.height).to.equal('48px');
    });

    it('should render media representation with custom size', () => {
      const shortName = ':rage:';
      const rep = {
        mediaPath: '/path/bla.png',
        width: 256,
        height: 128,
      };
      const wrapper = shallow(
        <EmojiPlaceholder
          shortName={shortName}
          showTooltip={false}
          representation={rep}
          size={48}
        />,
      );

      const spanStyle = wrapper.find('span').prop('style');
      expect(spanStyle!.width).to.equal('96px');
      expect(spanStyle!.height).to.equal('48px');
    });
  });
});
