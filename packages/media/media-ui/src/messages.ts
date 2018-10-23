import { defineMessages } from 'react-intl';

export const messages = defineMessages({
  retry: {
    id: 'fabric.media.retry',
    defaultMessage: 'Retry',
    description: 'Allows user to perform an action again',
  },
  failed_to_load: {
    id: 'fabric.media.failed_to_load',
    defaultMessage: 'Failed to load',
    description: 'We show this message when we have an error loading a file',
  },
  recent_uploads: {
    id: 'fabric.media.recent_uploads',
    defaultMessage: 'Recent uploads',
    description:
      'Title of a section where we show the user recent uploaded files',
  },
  upload_file: {
    id: 'fabric.media.upload_file',
    defaultMessage: 'Upload a file',
    description: 'Call to action that initiates the upload of a file',
  },
  drag_and_drop_your_files: {
    id: 'fabric.media.drag_and_drop_your_files',
    defaultMessage: 'Drag and drop your files anywhere or',
    description:
      'Used to describe the area where the user can drag and drop files to upload',
  },
  drop_your_files: {
    id: 'fabric.media.drop_your_files',
    defaultMessage: 'Drop your files to upload',
    description:
      'Indicates that the files will be uploaded when the user drops them in the drag and drop area',
  },
  upload: {
    id: 'fabric.media.upload',
    defaultMessage: 'Upload',
    description: 'upload',
  },
  cancel: {
    id: 'fabric.media.cancel',
    defaultMessage: 'Cancel',
    description: 'cancel',
  },
  search_all_gifs: {
    id: 'fabric.media.search_all_gifs',
    defaultMessage: 'Search all the GIFs!',
    description:
      'Used as input placeholder to let the user know that he can search for GIF image files',
  },
  cant_retrieve_gifs: {
    id: 'fabric.media.cant_retrieve_gifs',
    defaultMessage: 'Ouch! We could not retrieve any GIFs',
    description:
      'Error message when we can not find any GIF images for that text',
  },
  check_your_network: {
    id: 'fabric.media.check_your_network',
    defaultMessage: 'Check your network connection',
    description: 'Error message when network does not work',
  },
  try_again: {
    id: 'fabric.media.try_again',
    defaultMessage: 'Try again',
    description: 'Allow the user to try an action again',
  },
  no_gifs_found: {
    id: 'fabric.media.no_gifs_found',
    defaultMessage: "Hello? Was it me you're looking for?",
    description:
      'Not expected error that happens when searching for GIF images',
  },
  no_gifs_found_suggestion: {
    id: 'fabric.media.no_gifs_found_suggestion',
    defaultMessage: 'We couldn\'t find anything for "{query}"',
    description: 'There are no results for GIFs matching that query',
  },
  load_more_gifs: {
    id: 'fabric.media.load_more_gifs',
    defaultMessage: 'Load more GIFs',
    description: 'Used to load next page of GIF images',
  },
  add_account: {
    id: 'fabric.media.add_account',
    defaultMessage: 'Add account',
    description: 'Allows to add a new account',
  },
  unlink_account: {
    id: 'fabric.media.unlink_account',
    defaultMessage: 'Unlink Account',
    description: 'Allows to remove a connected account from the user',
  },
  upload_file_from: {
    id: 'fabric.media.upload_file_from',
    defaultMessage: 'Upload a file from {name}',
    description: 'Allows to upload a file from different sources',
  },
  connect_to: {
    id: 'fabric.media.connect_to',
    defaultMessage: 'Connect to {name}',
    description:
      'Allows the user to connect with different types of external services',
  },
  connect_account_description: {
    id: 'fabric.media.connect_account_description',
    defaultMessage:
      "We'll open a new page to help you connect your {name} account",
    description:
      'Explains what will happen when the users connects to a new account',
  },
});
