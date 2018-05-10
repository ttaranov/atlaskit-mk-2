import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import mountWrapper from '@pgleeson/enzyme-mount-wrapper';

// https://github.com/airbnb/enzyme#installation
Enzyme.configure({ adapter: new Adapter(), mountWrapper });
