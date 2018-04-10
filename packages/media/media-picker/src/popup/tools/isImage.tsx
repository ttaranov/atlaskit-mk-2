export const isImage = function(type: string) {
  return ['image/jpeg', 'image/png'].indexOf(type) > -1;
};
