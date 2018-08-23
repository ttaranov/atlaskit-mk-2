import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';

export const MAP_BOX_TOKEN =
  'pk.eyJ1IjoiamFrZWMiLCJhIjoiY2psNjkxNXdmMTB5dDNycWxsMnpqN3U3ZSJ9.e3q80K2ERa_sQ9M-gKQiDQ';

const geocodingClient = mbxGeocoding({ accessToken: MAP_BOX_TOKEN });

const attendees = [
  {
    id: '1',
    name: 'Eduard Shvedai',
    comment: 'lol',
    joined: new Date(),
  },
  {
    id: '2',
    name: 'Vijay Sutrave',
    comment: 'lol2',
    joined: new Date(),
  },
  {
    id: '3',
    name: 'Nathan Flew',
    comment: 'lol3',
    joined: new Date(),
  },
  {
    id: '4',
    name: 'Jake Coppinger',
    comment: 'lol4',
    joined: new Date(),
  },
];

export async function loadAttendees() {
  return new Promise<Array<any>>(resolve =>
    setTimeout(resolve, 1000, attendees),
  );
}

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

export async function join(name, comment) {
  return new Promise<Array<any>>(resolve =>
    setTimeout(() => {
      attendees.push({
        id: '5',
        name,
        comment,
        joined: new Date(),
      });
      resolve(attendees);
    }, 5000),
  );
}
