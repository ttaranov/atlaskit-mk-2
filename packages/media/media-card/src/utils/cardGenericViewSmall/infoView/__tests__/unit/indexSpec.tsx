import * as React from 'react';
import { shallow } from 'enzyme';
import { InfoView } from '../..';
import { Title, Body, Icon } from '../../styled';

describe('CardGenericViewSmall', () => {
  describe('InfoView', () => {
    it('should align to the bottom when title is undefined and isLoading=false', () => {
      const element = shallow(
        <InfoView title={undefined} subtitle="fobar" isLoading={false} />,
      );
      expect(element.prop('valign')).toEqual('bottom');
    });

    it('should align to the top when icon and subtitle is undefined and isLoading=false', () => {
      const element = shallow(
        <InfoView
          title="foobar"
          icon={undefined}
          subtitle={undefined}
          isLoading={false}
        />,
      );
      expect(element.prop('valign')).toEqual('top');
    });

    it('should not align when both Title and Body are displayed', () => {
      const element = shallow(<InfoView title="foo" subtitle="bar" />);
      expect(element.prop('valign')).toBeUndefined();
    });

    it('should render the title when the title is defined', () => {
      const element = shallow(<InfoView title="Test title" />);
      expect(element.find(Title).exists()).toBeTruthy();
    });

    it('should render the title when isLoading=true', () => {
      const element = shallow(<InfoView isLoading={true} />);
      expect(element.find(Title).exists()).toBeTruthy();
    });

    it('should not render the title when the title is undefined and isLoading=false', () => {
      const element = shallow(<InfoView title={undefined} isLoading={false} />);
      expect(element.find(Title).exists()).toBeFalsy();
    });

    it('should render the body when the icon is defined', () => {
      const element = shallow(<InfoView icon={<img />} />);
      expect(element.find(Body).exists()).toBeTruthy();
    });

    it('should render the body when the subtitle is defined', () => {
      const element = shallow(<InfoView subtitle="foobar" />);
      expect(element.find(Body).exists()).toBeTruthy();
    });

    it('should render the body when isLoading=true', () => {
      const element = shallow(<InfoView isLoading={true} />);
      expect(element.find(Body).exists()).toBeTruthy();
    });

    it('should not render the body when icon and subtitle are undefined and isLoading=false', () => {
      const element = shallow(
        <InfoView icon={undefined} subtitle={undefined} isLoading={false} />,
      );
      expect(element.find(Body).exists()).toBeFalsy();
    });

    it('should not render the icon when icon is undefined and isLoading=false', () => {
      const element = shallow(<InfoView icon={undefined} isLoading={false} />);
      expect(element.find(Icon).exists()).toBeFalsy();
    });

    it('should not render the icon when icon is undefined and isLoading=true', () => {
      const element = shallow(<InfoView icon={undefined} isLoading={true} />);
      expect(element.find(Icon).exists()).toBeFalsy();
    });

    it('should not render the icon when icon is defined and isLoading=true', () => {
      const element = shallow(<InfoView icon={<img />} isLoading={true} />);
      expect(element.find(Icon).exists()).toBeFalsy();
    });

    it('should render the icon when icon is defined and isLoading=false', () => {
      const element = shallow(<InfoView icon={<img />} isLoading={false} />);
      expect(element.find(Icon).exists()).toBeTruthy();
    });
  });
});
