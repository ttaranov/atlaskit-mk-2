import { parseHTML } from '../../util/parseHTML';
import { wrapperStyles } from './styled';
import { getAssetUrl } from '../../util/getAssetUrl';

// TODO [MSW-385]: Remove template string and use React
// TODO [i18n][MS-1030]: Translate non React MediaPicker locales
export default parseHTML(
  `<div class="mediaPickerDropzone">
    <style>${wrapperStyles}</style>
    <div class="mp-content">
        <div class="mp-circle">
            <div class="mp-text">
                <span class="mp-title">Drop your files here</span>
                <span class="mp-description">We'll share them instantly</span>
            </div>
            <img class="mp-fileIcon mp-iconAtlassianDoc" src="${getAssetUrl(
              'pie-chart-icon.png',
            )}"/>
            <img class="mp-fileIcon mp-iconOtherDoc" src="${getAssetUrl(
              'line-graph-icon.png',
            )}" />
            <img class="mp-fileIcon mp-iconPageSpreadsheet" src="${getAssetUrl(
              'flow-chart-icon.png',
            )}" />
        </div>
    </div>
  </div>`,
);
