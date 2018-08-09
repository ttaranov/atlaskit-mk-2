import { style } from 'typestyle/lib';
import { borderRadius, colors } from '@atlaskit/theme';

import {
  akEmojiSelectedBackgroundColor,
  emojiFooterBoxShadow,
  emojiPickerBorderColor,
  emojiPickerBoxShadow,
} from '../common/shared-styles';

import { emojiSprite, placeholder, emojiNode } from '../common/styles';

import { emojiPickerHeight, emojiPickerWidth } from '../common/constants';

export const active = 'emoji-picker-active';
export const disable = 'emoji-picker-disable';

// Level 1 - picker

export const emojiPicker = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  background: 'white',
  border: `${emojiPickerBorderColor} 1px solid`,
  borderRadius: borderRadius(),
  boxShadow: emojiPickerBoxShadow,
  height: `${emojiPickerHeight}px`,
  width: `${emojiPickerWidth}px`,
  marginBottom: '8px',
  minWidth: `${emojiPickerWidth}px`,
});

// Level 2

/// Category Selector

export const addButton = 'emoji-picker-add-button';

export const categorySelector = style({
  flex: '0 0 auto',
  backgroundColor: colors.N30,

  $nest: {
    ul: {
      listStyle: 'none',
      margin: '0 4px',
      padding: '3px 0',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around',
    },

    li: {
      display: 'inline-block',
      margin: 0,
      padding: 0,

      $nest: {
        button: {
          verticalAlign: 'middle',
        },
      },
    },

    [`.${addButton}`]: {
      color: colors.N200,
      margin: '0 0 0 5px',
      verticalAlign: 'middle',
    },
  },
});

export const category = style({
  backgroundColor: 'transparent',
  border: 0,
  color: colors.N100A,
  cursor: 'pointer',
  margin: '2px 0',
  padding: 0,
  transition: 'color 0.2s ease',

  $nest: {
    /* Firefox */
    ['&::-moz-focus-inner']: {
      border: '0 none',
      padding: 0,
    },

    [`&.${active}`]: {
      color: colors.B300,

      $nest: {
        ['&:hover']: {
          color: colors.B300,
        },
      },
    },

    ['&:hover']: {
      color: colors.B100,
    },

    [`&.${disable}`]: {
      color: colors.N50,
      cursor: 'default',

      $nest: {
        ['&:hover']: {
          color: colors.N50,
        },
      },
    },

    ['&:focus']: {
      outline: '0',
    },
  },
});

/// EmojiPickerList

export const emojiPickerList = style({
  display: 'flex',
  flexDirection: 'column',
  flex: '1 1 auto',
  // To force Firefox/IE/Edge to shrink the list, if necessary (e.g. when upload panel in place)
  height: '0',
});

// react-virtualized enables focus style by default - turn it off
export const virtualList = style({
  $nest: {
    '&:focus': {
      outline: 'none',
    },
  },
});

//// Search

export const searchIcon = 'search-icon';
export const input = 'input';

export const pickerSearch = style({
  boxSizing: 'border-box',
  padding: '10px',
  flex: '0 0 auto',

  $nest: {
    [`.${searchIcon}`]: {
      opacity: 0.5,
    },

    [`.${input}`]: {
      background: 'transparent',
      border: 0,
      boxSizing: 'border-box',
      color: 'inherit',
      cursor: 'inherit',
      fontSize: '14px',
      outline: 'none',
      padding: '1px 0 2px 10px',
      width: '100%',

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

//// Loading/Spinner

export const emojiPickerSpinner = style({
  display: 'flex',
  width: '100%',
  height: '150px',
  justifyContent: 'center',
  alignItems: 'center',

  $nest: {
    '>div': {
      flex: '0 0 auto',
    },
  },
});

//// Category/Result

export const emojiPickerRow = style({
  marginLeft: '8px',
});

export const emojiCategoryTitle = style({
  boxSizing: 'border-box',
  color: colors.N900,
  fontSize: '14px',
  padding: '5px 8px',
  textTransform: 'lowercase',

  $nest: {
    '&:first-letter': {
      textTransform: 'uppercase',
    },
  },
});

export const emojiItem = style({
  display: 'inline-block',
  textAlign: 'center',
  width: '40px',

  $nest: {
    [`&>.${emojiNode}`]: {
      cursor: 'pointer',
      padding: '8px',
      borderRadius: '5px',
      width: '24px',
      height: '24px',

      $nest: {
        // Fit non-square emoji to square
        '&>img': {
          position: 'relative',
          left: '50%',
          top: '50%',
          transform: 'translateX(-50%) translateY(-50%)',
          maxHeight: '24px',
          maxWidth: '24px',
          display: 'block',
        },
        // Scale sprite to fit regardless of default emoji size
        [`&>.${emojiSprite}`]: {
          height: '24px',
          width: '24px',
        },
      },
    },
    [`&>.${placeholder}`]: {
      padding: '0',
      margin: '7px',
    },
  },
});

export const addEmoji = style({
  border: '2px dashed #ccc',
  borderRadius: borderRadius(),
  backgroundColor: 'transparent',
  width: '32px',
  height: '32px',
  padding: 0,
  margin: '4px',
  verticalAlign: 'middle',

  $nest: {
    '&:hover': {
      backgroundColor: akEmojiSelectedBackgroundColor,
    },

    '&:focus': {
      outline: '0',
    },

    span: {
      backgroundColor: 'inherit',
    },
  },
});

/// Footer
export const emojiPickerFooter = style({
  flex: '0 0 auto',
});

export const emojiPickerFooterWithTopShadow = style({
  borderTop: `2px solid ${colors.N30A}`,
  boxShadow: emojiFooterBoxShadow,
});

// EmojiUpload

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

export const AddCustomEmoji = style({
  alignSelf: 'center',
  marginLeft: '10px',
});

// Emoji Delete preview

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
