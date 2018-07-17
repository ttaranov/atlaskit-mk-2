import { md } from '@atlaskit/docs';

export default md`
  # MediaUI

  > Includes common components and utilities used by other media packages.

  This package exports two componets:

  * BlockCard
  * InlineCard

  Each of them expose the list of sub-views:

  * Resolving
  * Forbidden
  * Unauthorised
  * Errored
  * Resolved

  ## Props

  ### InlineCard

  * Link:

    * \`text: string\` - text to display
    * \`onClick?: () => void\` - the optional click handler

  * Resolving:

    * \`url: string\` - the url to display
    * \`onClick?: () => void\` - the optional click handler

  * Forbidden

    * \`url: string\` - the url to display
    * \`onClick?: () => void\` - the optional click handler
    * \`onAuthorise?: () => void\` - what to do when a user hit "Try another account" button

  * Unauthorized

    * \`url: string\` - the url to display
    * \`icon?: string\` - the icon of the service (e.g. Dropbox/Asana/Google/etc) to display
    * \`onClick?: () => void\` - the optional click handler
    * \`onAuthorise?: () => void\` - handler for "Connect" button

  * Errored

    * \`url: string\` - the url to display
    * \`message: string\` - the error message to display
    * \`onClick?: () => void\` - the optional click handler
    * \`onRetry?: () => void\` - what to do when a user clicks "Try again" button

  * Resolved

    * \`icon?: string\` - the icon of the service (e.g. Dropbox/Asana/Google/etc) to display
    * \`title: string\` - the name of the resource
    * \`lozenge?: LozengeViewModel\` - the optional lozenge that might represent the statu of the resource, for example
    * \`isSelected?: boolean\` - a flag that determines whether the card is selected in edit mode
    * \`onClick?: () => void\` - the optional click handler

  ### BlockCard

  * Resolving:

    * \`onClick?\` - the optional click handler

  * Forbidden

    * \`url: string\` - the url of the resorce to display
    * \`onClick?: () => void\` - the click hander that determines what to do when used clicked on the card
    * \`onAuthorise?: () => void\` - what to do when a user hit "Try another account" button

  * Unauthorized

    * \`icon?: string;\` - the icon of the service (e.g. Dropbox/Asana/Google/etc) to display
    * \`url: string\` - the url of the resorce to display
    * \`onClick?: () => void\` - the click hander that determines what to do when used clicked on the card
    * \`onAuthorise?: () => void\` - handler for "Connect" button

  * Errored

    * \`url: string\` - the url of the resorce to display
    * \`message: string\` - the error message
    * \`onClick?: () => void\` - the optional click hander
    * \`onRetry?: () => void\` - what to do when a user clicks "Try again" button

  * Resolved

    * \`context?: ContextViewModel\`
    * \`link?: string\`
    * \`icon?: IconWithTooltip\`
    * \`user?: UserViewModel\`
    * \`thumbnail?: string\`
    * \`preview?: string\`
    * \`title?: TextWithTooltip\`
    * \`byline?: TextWithTooltip\`
    * \`description?: TextWithTooltip\`
    * \`details?: DetailViewModel[]\`
    * \`users?: UserViewModel[]\`
    * \`actions?: Action[]\`
    * \`onClick?: () => void\`
`;
