import { parseHTML } from '../../util/parseHTML';
import { wrapperStyles } from './styled';
// TODO: Use webpack image loader to include the images
// TODO [MSW-385]: Remove template string and use React

export default parseHTML(
  `<div class="mediaPickerDropzone">
    <style>${wrapperStyles}</style>
    <div class="mp-content">
        <div class="mp-circle">
            <div class="mp-text">
                <span class="mp-title">Drop your files here</span>
                <span class="mp-description">We'll share them instantly</span>
            </div>
            <img class="mp-fileIcon mp-iconAtlassianDoc" src="https://dt-static.us-west-2.prod.public.atl-paas.net/media-picker/images/pie-chart-icon.png"/>
            <img class="mp-fileIcon mp-iconOtherDoc" src="https://dt-static.us-west-2.prod.public.atl-paas.net/media-picker/images/line-graph-icon.png" />
            <img class="mp-fileIcon mp-iconPageSpreadsheet" src="https://dt-static.us-west-2.prod.public.atl-paas.net/media-picker/images/flow-chart-icon.png" />
        </div>
    </div>
  </div>`,
);
