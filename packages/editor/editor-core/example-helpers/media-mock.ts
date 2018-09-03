import { MediaMock } from '@atlaskit/media-test-helpers';
import { fakeImage } from '../../../media/media-test-helpers/src/mocks/database/mockData';

export default new MediaMock({
  'one.svg': fakeImage,
  'two.svg': fakeImage,
  'three.svg': fakeImage,
  'four.svg': fakeImage,
  'five.svg': fakeImage,
});
