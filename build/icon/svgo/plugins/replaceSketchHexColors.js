// @flow
exports.type = 'perItem';

exports.active = true;

exports.description =
  'Replaces the primary and secondary hex colours used in Sketch with currentColor and inherit';

// These are the colours that will be used in the Sketch file. We replace the non-hard-coded
// hex values when cleaning up the SVG files.
const primaryHex = '#42526E';
const secondaryHex = '#79F2C0';

exports.fn = function callbackOnDefinedFill(item /*: any*/) {
  var fill; // eslint-disable-line no-var
  var stopColor; // eslint-disable-line no-var
  // look for an fill or stop color attributes within the SVG file
  if (item.hasAttr('fill')) {
    fill = item.attr('fill').value;
    // If it's the primary hex colour, set that to "currentColor". This inherits from the
    // color property set in CSS which is how the primaryColor prop on the Icon component
    // is applied.
    if (fill && fill === primaryHex) {
      item.addAttr({
        name: 'fill',
        local: 'fill',
        prefix: '',
        value: 'currentColor',
      });
    }
    // If it's the secondary hex colour, set that to "inherit". This inherits from the
    // fill property set in CSS which is how the secondaryColor prop on the Icon component
    // is applied.
    if (fill && fill === secondaryHex) {
      item.addAttr({
        name: 'fill',
        local: 'fill',
        prefix: '',
        value: 'inherit',
      });
    }
    // Sometimes Sketch sets fill="none" on paths or groups, but this messes up
    // the cascade of primaryColor/secondaryColor styles, and needs to be removed.
    if (fill && fill === 'none') {
      item.removeAttr('fill');
    }
  } else if (item.hasAttr('stop-color')) {
    stopColor = item.attr('stop-color').value;
    /* The stopColor must be set to inherit for color change to be repainted properly in chrome in
     * combination with the prop being overridden with currentColor in the Icon base component.
     */
    if (stopColor && stopColor === primaryHex) {
      item.addAttr({
        name: 'stop-color',
        local: 'stop-color',
        prefix: '',
        value: 'inherit',
      });
    }
  }
};
