import * as React from 'react';
import { md, Example, Props } from '@atlaskit/docs';

export default md`
  # @atlaskit/media-avatar-picker

  Provides a set of components to resize, drag, select and export user avatars. It also includes a default list of 
  predefined avatars.

  ## Installation

  \`\`\`sh
  yarn add @atlaskit/media-avatar-picker
  \`\`\`

  ## Using the component

  The \`AvatarPickerDialog\` contains the \`ImageNavigator\`, which contains the \`ImageCropper\`.

  The overall purpose is to allow the user to select an image, then pan and zoom to a desired clipped view.

  The default zoom level should fit image within the crop area. Images smaller than the crop area are scaled up, and are not zoomable.

  The component constrains the panning and scaling of the image to ensure that only valid regions are selectable by the user.

  ### Exported data

  The \`onImagePicked\` property of the AvatarPickerDialog exposes an \`x\` \`y\` coordinate set, and a \`size\` value. This is used to produce a clipped rect from the source image.

  The \`x\` and \`y\` values are relative to the coordinate system of the source image.

  The \`size\` value is relative to the coordinate system of the source image. Since the avatar crop/display size is square, this is a single value representing both the width and height of the clipped rect, with the origin at the \`x\` and \`y\` values. The size value is essentially the transformed crop area onto the source image, starting at the x,y origin.

  ### AvatarPickerDialog

  \`\`\`
  import {AvatarPickerDialog, Avatar} from '@atlaskit/media-avatar-picker';

  const avatars: Array<Avatar> = [];

  <AvatarPickerDialog avatars={avatars} />
  \`\`\`

  ### ImageCropper

  \`\`\`
  import {ImageCropper} from '@atlaskit/media-avatar-picker';

  <ImageCropper imageSource={'http://remote-url.jpg'} imageWidth={300} scale={0.08} top={-80} left={-80} onDragStarted={action('DragStarted')} />
  \`\`\`

  ### ImageNavigator

  \`\`\`
  import {ImageNavigator} from '@atlaskit/media-avatar-picker';

  const onLoad = (params) => {
    console.log(params.export());
  };

  <ImageNavigator imageSource={tallImage} onLoad={onLoad} />
  \`\`\`

  ### PredefinedAvatarList

  \`\`\`
  import {Avatar, PredefinedAvatarList} from '@atlaskit/media-avatar-picker';

  const avatars: Array<Avatar> = [];

  <PredefinedAvatarList avatars={avatars} selectedAvatar={avatars[0]} />
  \`\`\`

  ### Slider

  \`\`\`
  import {Slider} from '@atlaskit/media-avatar-picker';

  <Slider value={20} min={0} max={100} onChange={action('onChange')} />
  \`\`\`

`;
