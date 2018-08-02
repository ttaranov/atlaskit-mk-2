import { md } from '@atlaskit/docs';

export default md`
  # Documentation

  ## Table of contents

  * [Working with the Library](#markdown-header-working-with-the-library)
  * [Configuration](#markdown-header-configuration)
  * [Component Creation](#markdown-header-component-creation)
  * [Typescript](#typescript)
  * [Events](#markdown-header-events)
  * [Components](#markdown-header-components)
    _ [Dropzone](#markdown-header-dropzone)
    _ [Clipboard](#markdown-header-clipboard)
    _ [Browser](#markdown-header-browser)
    _ [Binary](#markdown-header-binary) \* [Popup](#markdown-header-popup)

  **Installation**

  ~~~bash
  yarn add @atlaskit/media-picker
  ~~~

  ## Working with the Library

  MediaPicker library is the composition of different components. All of the components have the same interface.

  Let's take the **Browser** component as an example and see how to write a simple file uploading app around it.
  The easiest integration may look like this:

  ~~~javascript
  import { MediaPicker } from '@atlaskit/media-picker';

  const config = {
    apiUrl: 'https://media-api.atlassian.io',
    authProvider: (context) => Promise.resolve({
      clientId: 'your-app-client-id',
      token: 'your-generated-token'
    })
  };
  const browser = MediaPicker('browser', config);
  browser.on('upload-end', payload => {console.log(payload.public)});

  ...

  browser.browse();
  ~~~

  This little app will let the user browse a file on his hard drive and upload it by clicking the button. The upload-end event provides the file selected/uploaded, with a new public id. You can read more detailed documentation of the MediaPickerBrowser component below.

  ---

  ## Configuration

  All media picker components take the following object as configuration as the second argument in the MediaPicker function.

  ~~~javascript
  const config = {
    apiUrl: 'https://media-api.atlassian.io',
    authProvider: context =>
      Promise.resolve({
        clientId: 'your-app-client-id',
        token: 'your-generated-token',
      }),
    uploadParams: {
      collection: 'collection-id',
    },
  };
  ~~~

  There are 3 parameters that you may specify in your config listed below.

  ### apiUrl <_string_>

  This parameter points towards Media API. Currently, the production URL is 'https://media-api.atlassian.io'.

  ### authProvider <_[AuthProvider](./authProvider.md)_>

  MediaPicker uses this parameter to get a client id and JWT token used for authorization against the Media API.

  ### uploadParams? <_{collection: string})_>

  **collection** <_string_> —
  The name of the collection where files should be uploaded to

  ---

  ## Component creation

  All MediaPicker components are created the same way. The first parameter is always the name of the component, the second is the general MediaPicker config and the third is the component-specific config

  ~~~javascript
  const dropzone = MediaPicker('dropzone', config, {
    container: document.body,
  });
  ~~~

  Please note that you don't need to specify the **new** keyword before creating a component. MediaPicker will do it internally.

  #### Typescript

  MediaPicker is fully written in Typescript, and it exports all its public types and interfaces. We refer to some of those objects in the docs,
  if you want to know more about those please have a look into:

  * media-picker/src/domain
  * media-picker/popup/src/domain

  ## Events

  All MediaPicker components are emitting the same set of generic events. It doesn't matter whether file was uploaded from the local drive or picked from Dropbox — all the following events will be emitted in the same way.

  ### Events

  #### uploads-start _{file: MediaFile[]}_

  Emitted when uploads have started

  #### upload-preview-update _{file: MediaFile, preview: Preview}_

  Emitted when MediaPicker has a preview. Will not be raised if a preview could not be generated, therefore preview will always have a value.

  #### upload-status-update _{file: MediaFile, progress: MediaProgress}_

  Emitted when upload is in action

  #### upload-processing _{file: MediaFile}_

  Emitted when server got all the chunks and started to process the file

  #### upload-end _{file: MediaFile, public: &lt;the object returned by fileStore get method&gt;}_

  Emitted when server finished processing file and made it available to download

  #### upload-error _{error: MediaError}_

  Emitted if library got an error it can not recover from

  ~~~javascript
  browser.on('upload-end', payload => {
    console.log(payload.public);
  });
  ~~~

  ## Components

  ### Dropzone

  Allows user to drag & drop files into the page. Has a design first seen in [https://enso.me/](Enso).

  ![alt text](./dropzone.png 'Dropzone')

  #### Usage

  ~~~javascript
  const config = {
    apiUrl: 'https://media-api.atlassian.io',
    authProvicer: context =>
      Promise.resolve({
        clientId: 'your-app-client-id',
        token: 'your-generated-token',
      }),
  };

  const dropzone = MediaPicker('dropzone', config, {
    container: document.getElementById('container'),
  });
  dropzone.on('upload-end', payload => {
    console.log(payload.public);
  });
  dropzone.activate();
  ~~~

  #### Additional parameters

  **container?** <_HTML Element | JQuery Selector_> —
  Element where the popup should be placed. The default value is the document Body.

  **headless?** <_boolean_> — If true, no UI will be shown. The integrator should listen to drag-enter and drag-leave events to show custom UI.

  #### Methods

  **activate()** — Activates the dropzone

  **deactivate()** — Make container ignore the dragged & dropped files

  #### Dropzone Events

  **drag-enter** <_{ length: number }_> — Emitted when user dragged file over the container and contains the number of dragged files

  > Special cases

  * This event doesn't support dragged directories, it will return 1 as length.
  * IE11 and Safari don't return the number of dragged items. This will return 0 as length.

  **drag-leave** <_{ }_> — Emitted when user moved file away from the container

  **_drop_** <_{ }_> — Emitted when user dropped a file

  > Special cases

  * IE11: doesn't upload files when a folder is dropped.
  * Firefox: doesn't upload files recursively within a folder.

  ---

  ### Clipboard

  Allows a user to paste files from the clipboard. You can try this feature in project.

  #### Usage

  ~~~javascript
  const config = {
    apiUrl: 'https://media-api.atlassian.io',
    authProvider: context =>
      Promise.resolve({
        clientId: 'your-app-client-id',
        token: 'your-generated-token',
      }),
  };

  const clipboard = MediaPicker('clipboard', config);
  clipboard.on('upload-end', payload => {
    console.log(payload.public);
  });
  clipboard.activate();
  ~~~

  #### Methods

  **activate()** — Start listen to clipboard events

  **deactivate()** — Stop listen to clipboard events

  ---

  ### Browser

  Opens native Operating System file browser window.

  ![alt text](./browser.png 'Browser')

  #### Usage

  ~~~javascript
  const mpConfig = {
    apiUrl: 'https://media-api.atlassian.io',
    authProvider: context =>
      Promise.resolve({
        clientId: 'your-app-client-id',
        token: 'your-generated-token',
      }),
  };

  const browserConfig = {
    multiple: true,
    fileExtensions: ['.jpg'],
  };

  const browser = MediaPicker('browser', mpConfig, browserConfig);
  browser.on('upload-end', payload => {
    console.log(payload.public);
  });

  browser.browse();
  ~~~

  #### Additional parameters

  **multiple?** <_boolean_> —
  Defines whether client app accepts multiple files. The default value is true.

  **fileExtensions?** <_array<*string*>_> —
  An array of allowed file extensions. All extensions are allowed by default.

  #### Methods

  **browse()** — Open a dialog with the files on the local drive. Allows multiple file uploads.

  ---

  ### Binary

  Allows client app to upload a file without user interaction.

  #### Usage

  ~~~javascript
  const config = {
    apiUrl: 'https://media-api.atlassian.io',
    authProvider: context =>
      Promise.resolve({
        clientId: 'your-app-client-id',
        token: 'your-generated-token',
      }),
  };

  const binary = MediaPicker('binary', config);
  binary.on('upload-end', payload => {
    console.log(payload.public);
  });
  binary.upload(
    'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=',
    'screen-capture.gif',
  );
  ~~~

  #### Methods

  **upload(base64 <string>, fileName <string>)** —
  Starts upload of the file encoded in base64 with the specified fileName

  #### Special events

  No special events for this module

  ---

  ### Popup

  Lets user pick files from their local computer or cloud storage.

  The popup component requires userAuthProvider (in addition to the authProvider because it displays files from and uploads files to the user's recent file collection). You will be need to cache this token returned by userAuthProvider because the popup will call this provider on every request to the media api concerning the users collection and cloud accounts. You cannot use the popup component if you can't obtain a token for the user's collection - use the Browser component instead. It can be optionally passed Legacy Context from any "parent" element to make analytics-next events bubble up to listeners.

  ![alt text](./popup.png 'Popup')

  #### Usage

  ~~~javascript
  const mpConfig = {
    apiUrl: 'https://media-api.atlassian.io',
    authProvider: context =>
      Promise.resolve({
        clientId: 'your-app-client-id',
        token: 'your-generated-token',
      }),
  };

  const popupConfig = {
    container: document.getElementById('container'),
    userAuthProvider: context =>
      Promise.resolve({
        clientId: 'your-user-client-id',
        token: 'your-user-generated-token',
      }),
    proxyReactContext?: {
      getAtlaskitAnalyticsEventHandlers: () => {}
    }
  };

  const popup = MediaPicker('popup', mpConfig, popupConfig);
  popup.on('upload-end', payload => {
    console.log(payload.public);
  });
  popup.show();
  ~~~

  #### Additional parameters

  **container?** <_HTML Element | JQuery Selector_> —
  The element where the popup should be placed. The default value is the document Body.

  #### Methods

  **show()** – Shows the popup

  **hide()** – Hides the popup

  #### Special events

  **closed** - emitted when the popup its disappears, this can happen when its either closed or submitted.
`;
