// @flow
import fullAvatarExample from '../examples-util/full-avatar-example';
import { avatarUrl } from '../examples-util/data';

export default () =>
  fullAvatarExample({
    appearance: 'circle',
    src: avatarUrl,
  });
