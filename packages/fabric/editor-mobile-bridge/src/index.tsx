import * as ReactDOM from 'react-dom';
import mobileEditor from './mobile-editor-element';

setTimeout(args => {
  ReactDOM.render(mobileEditor(), document.getElementById('editor'));
}, 1000);
