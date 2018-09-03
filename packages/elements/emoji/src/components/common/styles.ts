import { borderRadius, colors } from '@atlaskit/theme';
import { defaultEmojiHeight, emojiSprite } from '../../constants';
import { akEmojiSelectedBackgroundColor } from '../../shared-styles';
import { style } from 'typestyle';

export const selected = 'emoji-common-selected';
export const selectOnHover = 'emoji-common-select-on-hover';

export { emojiNode, emojiSprite, placeholder } from '../../constants';

export const deleteButton = style({
  // hide by default
  display: 'none',
  float: 'right',
  height: '0px',
  marginRight: '-14px',
  marginTop: '-14px',
});

export const emoji = style({
  borderRadius: '5px',
  backgroundColor: 'transparent',
  display: 'inline-block',
  verticalAlign: 'middle',
  // Ensure along with vertical align middle, we don't increase the line height for p and some
  // headings. Smaller headings get a slight increase in height, cannot add more negative margin
  // as a "selected" emoji (e.g. in the editor) will not look good.
  margin: '-1px 0',

  $nest: {
    [`&.${selected},&.${selectOnHover}:hover`]: {
      backgroundColor: akEmojiSelectedBackgroundColor,
    },
    [`&.${selected},&.${selectOnHover}:hover .${deleteButton}`]: {
      // show delete button on hover
      display: 'inline-block',
    },
    img: {
      display: 'block',
    },
  },
});

export const emojiContainer = style({
  display: 'inline-block',
  // Ensure along with vertical align middle, we don't increase the line height for h1..h6, and p
  margin: '-1px 0',

  $nest: {
    [`&.${selected},&.${selectOnHover}:hover`]: {
      backgroundColor: akEmojiSelectedBackgroundColor,
    },

    [`.${emojiSprite}`]: {
      background: 'transparent no-repeat',
      display: 'inline-block',
      verticalAlign: 'middle',
      height: `${defaultEmojiHeight}px`,
      width: `${defaultEmojiHeight}px`,
    },
  },
});

export const placeholderContainer = style({
  // Ensure no vertical reflow
  margin: '-1px 0',
  display: 'inline-block',
  background: '#f7f7f7',
  borderRadius: '20%',
  verticalAlign: 'middle',
  whiteSpace: 'nowrap',
});

export const placeholderEmoji = style({
  display: 'inline-block',
  verticalAlign: 'middle',
  whiteSpace: 'nowrap',
});

export const emojiButton = style({
  backgroundColor: 'transparent',
  border: '0',
  cursor: 'pointer',
  padding: 0,

  $nest: {
    /* Firefox */
    ['&::-moz-focus-inner']: {
      border: '0 none',
      padding: 0,
    },

    '&>span': {
      borderRadius: '5px',
      padding: '8px',

      $nest: {
        // Scale sprite to fit regardless of default emoji size
        [`&>.${emojiSprite}`]: {
          height: '24px',
          width: '24px',
        },
      },
    },
  },
});

// Emoji Preview

export const buttons = 'emoji-common-buttons';
export const preview = 'emoji-common-preview';
export const previewImg = 'emoji-common-preview-image';
export const previewText = 'emoji-common-preview-text';
export const name = 'emoji-common-name';
export const shortName = 'emoji-common-shortname';
export const previewSingleLine = 'emoji-common-preview-single-line';
export const toneSelectorContainer = 'emoji-common-tone-selector-container';
export const withToneSelector = 'emoji-common-with-tone-selector';
export const emojiPreviewSection = 'emoji-preview-section';

export const emojiPreview = style({
  display: 'flex',
  height: '50px',
  boxSizing: 'border-box',

  $nest: {
    [`.${preview}`]: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      padding: '10px',

      $nest: {
        [`.${emojiSprite}`]: {
          height: '32px',
          margin: '0',
          width: '32px',
        },

        [`.${previewImg}`]: {
          display: 'inline-block',
          flex: 'initial',
          width: '32px',

          $nest: {
            '&>span': {
              width: '32px',
              height: '32px',
              padding: 0,
              maxHeight: 'inherit',

              $nest: {
                '&>img': {
                  position: 'relative',
                  left: '50%',
                  top: '50%',
                  transform: 'translateX(-50%) translateY(-50%)',
                  maxHeight: '32px',
                  maxWidth: '32px',
                  padding: 0,
                  display: 'block',
                },
              },
            },
          },
        },

        [`.${previewText}`]: {
          display: 'flex',
          flexDirection: 'column',
          marginLeft: '10px',
          marginTop: '-2px',
          maxWidth: '285px',
          width: '285px' /* IE */,
          flexGrow: 1,
          flexShrink: 1,

          $nest: {
            [`.${name}`]: {
              display: 'block',
              color: colors.N900,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',

              $nest: {
                ['&:first-letter']: {
                  textTransform: 'uppercase',
                },
              },
            },

            [`.${shortName}`]: {
              display: 'block',
              color: colors.N200,
              fontSize: '12px',
              lineHeight: 1,
              marginBottom: '-2px',
              overflow: 'hidden',
              paddingBottom: '2px',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            },
          },
        },

        [`.${previewSingleLine}`]: {
          paddingTop: '10px',

          $nest: {
            [`.${name}`]: {
              display: 'none',
            },

            [`.${shortName}`]: {
              color: colors.N900,
              fontSize: '14px',
            },
          },
        },
      },
    },

    [`.${buttons}`]: {
      flex: 1,
      textAlign: 'right',
      margin: '6px',
    },

    [`.${toneSelectorContainer}`]: {
      flex: 1,
      textAlign: 'right',
      margin: '6px',
    },

    [`.${withToneSelector} .${previewText}`]: {
      maxWidth: '235px',
      width: '235px' /* IE */,
    },
  },
});

export const AddCustomEmoji = style({
  alignSelf: 'center',
  marginLeft: '10px',
});

// Scrollable

export const emojiScrollable = style({
  border: '1px solid #fff',
  borderRadius: `${borderRadius()}px`,
  display: 'block',
  margin: '0',
  overflowX: 'hidden',
  overflowY: 'auto',
  padding: '0',
});
