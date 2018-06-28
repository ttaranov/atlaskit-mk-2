declare module 'enzyme-react-intl' {
  import { mount, shallow } from 'enzyme';

  type Mount = typeof mount;
  type Shallow = typeof shallow;

  export const mountWithIntl: Mount;
  export const shallowWithIntl: Shallow;
}
