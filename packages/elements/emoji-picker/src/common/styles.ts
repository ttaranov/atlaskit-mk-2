import { borderRadius, colors } from '@atlaskit/theme';
import { style } from 'typestyle';

// EmojiUploadPicker
export const emojiUpload = style({
  height: '78px',
  padding: '10px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-around',
});

export const uploadChooseFileMessage = style({
  color: colors.N300,
  fontSize: '12px',
  paddingBottom: '7px',
});

export const emojiUploadBottom = style({
  fontSize: '11px',
});

export const uploadChooseFileRow = style({
  display: 'flex',
  justifyContent: 'space-between',
});

export const uploadChooseFileEmojiName = style({
  flex: '1 1 auto',
  marginRight: '5px',

  $nest: {
    input: {
      background: 'transparent',
      border: 0,
      fontSize: '12px',
      outline: 'none',
      width: '100%',
      height: '22px', // fixed height is required to work in IE11 and other browsers in Windows

      $nest: {
        ['&:invalid']: {
          boxShadow: 'none',
        },
        ['&::-ms-clear']: {
          display: 'none',
        },
      },
    },
  },
});

export const uploadChooseFileBrowse = style({
  flex: '0 0 auto',
});

// EmojiUploadPreview
export const uploadPreviewFooter = style({
  display: 'flex',
  flexDirection: 'column',
  height: '100px',
  padding: '10px',
});

export const uploadPreview = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: colors.N20,
  borderRadius: `${borderRadius()}px`,
  padding: '10px',
});

export const uploadPreviewText = style({
  $nest: {
    h5: {
      color: colors.N300,
      paddingBottom: '4px',
      fontSize: '12px',
    },
    img: {
      maxHeight: '20px',
      maxWidth: '50px',
    },
  },
});

export const bigEmojiPreview = style({
  paddingLeft: '4px',
  $nest: {
    img: {
      maxHeight: '40px',
      maxWidth: '100px',
    },
  },
});

export const uploadAddRow = style({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  paddingTop: '10px',
});

// EmojiDeletePreview
export const submitDelete = 'emoji-submit-delete';
export const previewButtonGroup = 'emoji-preview-button-group';

export const deletePreview = style({
  height: '100px',
  padding: '10px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  fontSize: '12px',
});

export const deleteText = style({
  height: '64px',

  $nest: {
    ':first-child': {
      color: colors.N300,
      lineHeight: '16px',
    },
  },
});

export const deleteFooter = style({
  display: 'flex',
  height: '40px',
  alignItems: 'center',
  justifyContent: 'space-between',

  $nest: {
    img: {
      maxHeight: '32px',
      maxWidth: '72px',
    },

    [`.${previewButtonGroup}`]: {
      display: 'flex',
    },

    [`.${submitDelete}`]: {
      width: '84px',
      fontWeight: 'bold',
      marginRight: '4px',
    },
    button: {
      display: 'flex',
      justifyContent: 'center',
      fontSize: '14px',

      $nest: {
        div: {
          display: 'flex',
        },
      },
    },
  },
});

// EmojiErrorMessage
export const emojiDeleteErrorMessage = style({
  display: 'flex',
  color: colors.R400,
  alignItems: 'center',
  justifyContent: 'flex-end',
  paddingRight: '4px',
});

export const emojiChooseFileErrorMessage = style({
  display: 'flex',
  color: colors.R300,
  paddingRight: '10px',
  justifyContent: 'flex-start',
});

export const emojiPreviewErrorMessage = style({
  display: 'inline-flex',
  color: colors.R400,
  paddingRight: '10px',
  justifyContent: 'flex-end',
  alignItems: 'center',
});

// RetryableButton
export const uploadRetryButton = style({
  width: '93px',
  justifyContent: 'center',
  fontWeight: 'bold',
  marginRight: '4px',
  $nest: {
    div: {
      display: 'flex',
    },
  },
});

export const uploadEmojiButton = style({
  width: '93px',
  justifyContent: 'center',
  marginRight: '4px',
  $nest: {
    div: {
      display: 'flex',
    },
  },
});
