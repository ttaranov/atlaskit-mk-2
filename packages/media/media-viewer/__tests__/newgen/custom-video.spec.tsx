import * as React from 'react';
import { shallow } from 'enzyme';
import {
  CustomVideo,
  CustomVideoProps,
} from '../../src/newgen/viewers/video/customVideo';

describe('<CustomVideo />', () => {
  const setup = (props?: Partial<CustomVideoProps>) => {
    const onChange = jest.fn();
    const component = shallow(<CustomVideo src="video-src" {...props} />);

    return {
      component,
      onChange,
    };
  };

  it('', () => {});
});
