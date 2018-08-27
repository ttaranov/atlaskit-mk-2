import * as React from 'react';
import { shallow } from 'enzyme';
import { Wrapper } from '../../styled';
import { CardDimensions } from '../../..';

describe('Root Wrapper', () => {
  const dimensions: CardDimensions = {
    width: 400,
    height: 300,
  };

  describe('File', () => {
    it('should render properly with default properties', () => {
      const file = shallow(<Wrapper mediaItemType="file" />);
      expect(file).toMatchSnapshot();
    });

    it('should render properly with passed dimensions', () => {
      const defaultWithDimensions = shallow(
        <Wrapper mediaItemType="file" dimensions={dimensions} />,
      );
      const small = shallow(
        <Wrapper
          mediaItemType="file"
          appearance="small"
          dimensions={dimensions}
        />,
      );
      const auto = shallow(
        <Wrapper
          mediaItemType="file"
          appearance="auto"
          dimensions={dimensions}
        />,
      );

      expect(defaultWithDimensions).toMatchSnapshot();
      expect(small).toMatchSnapshot();
      expect(auto).toMatchSnapshot();
    });

    it('should render properly with different appeareances', () => {
      const auto = shallow(<Wrapper mediaItemType="file" appearance="auto" />);
      const small = shallow(
        <Wrapper mediaItemType="file" appearance="small" />,
      );
      const image = shallow(
        <Wrapper mediaItemType="file" appearance="image" />,
      );
      const square = shallow(
        <Wrapper mediaItemType="file" appearance="square" />,
      );
      const horizontal = shallow(
        <Wrapper mediaItemType="file" appearance="horizontal" />,
      );

      expect(auto).toMatchSnapshot();
      expect(small).toMatchSnapshot();
      expect(image).toMatchSnapshot();
      expect(square).toMatchSnapshot();
      expect(horizontal).toMatchSnapshot();
    });

    it('should apply breakpoint rules bassed on breakpointSize', () => {
      const small = shallow(
        <Wrapper mediaItemType="file" breakpointSize="small" />,
      );
      const medium = shallow(
        <Wrapper mediaItemType="file" breakpointSize="medium" />,
      );
      const large = shallow(
        <Wrapper mediaItemType="file" breakpointSize="large" />,
      );
      const xlarge = shallow(
        <Wrapper mediaItemType="file" breakpointSize="xlarge" />,
      );

      expect(small).toMatchSnapshot();
      expect(medium).toMatchSnapshot();
      expect(large).toMatchSnapshot();
      expect(xlarge).toMatchSnapshot();
    });
  });

  describe('Link', () => {
    it('should render properly with default properties', () => {
      const file = shallow(<Wrapper mediaItemType="link" />);

      expect(file).toMatchSnapshot();
    });

    it('should render properly with passed dimensions', () => {
      const defaultWithDimensions = shallow(
        <Wrapper mediaItemType="link" dimensions={dimensions} />,
      );
      const small = shallow(
        <Wrapper
          mediaItemType="link"
          appearance="small"
          dimensions={dimensions}
        />,
      );
      const auto = shallow(
        <Wrapper
          mediaItemType="link"
          appearance="auto"
          dimensions={dimensions}
        />,
      );

      expect(defaultWithDimensions).toMatchSnapshot();
      expect(small).toMatchSnapshot();
      expect(auto).toMatchSnapshot();
    });

    it('should render properly with different appeareances', () => {
      const auto = shallow(<Wrapper mediaItemType="link" appearance="auto" />);
      const small = shallow(
        <Wrapper mediaItemType="link" appearance="small" />,
      );
      const image = shallow(
        <Wrapper mediaItemType="link" appearance="image" />,
      );
      const square = shallow(
        <Wrapper mediaItemType="link" appearance="square" />,
      );
      const horizontal = shallow(
        <Wrapper mediaItemType="link" appearance="horizontal" />,
      );

      expect(auto).toMatchSnapshot();
      expect(small).toMatchSnapshot();
      expect(image).toMatchSnapshot();
      expect(square).toMatchSnapshot();
      expect(horizontal).toMatchSnapshot();
    });
  });
});
