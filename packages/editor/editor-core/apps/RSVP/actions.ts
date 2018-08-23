import uuidv4 from 'uuid/v4';
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';

export const MAP_BOX_TOKEN =
  'pk.eyJ1IjoiamFrZWMiLCJhIjoiY2psNjkxNXdmMTB5dDNycWxsMnpqN3U3ZSJ9.e3q80K2ERa_sQ9M-gKQiDQ';

const geocodingClient = mbxGeocoding({ accessToken: MAP_BOX_TOKEN });

export async function getLocationFromAddress(
  address: string,
  isMock: boolean = false,
) {
  if (!isMock) {
    const response = await geocodingClient
      .forwardGeocode({
        query: address,
        limit: 1,
      })
      .send();

    if (response && response.body) {
      return response.body.features[0].center;
    }
  }
  return [151.195, -33.8683];
}

const KEY = 'editor:apps:rsvp:uid';
export function getUserId() {
  const uid = localStorage && localStorage.getItem(KEY);
  if (uid) {
    return uid;
  }
  const tmpId = uuidv4();
  localStorage && localStorage.setItem(KEY, tmpId);
  return tmpId;
}
