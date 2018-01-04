export default async function makeRequest(
  url: string,
  path: string,
  opts?: Partial<RequestInit>,
): Promise<any> {
  const fetchOptions: RequestInit = {
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    ...opts,
  };

  const response = await fetch(`${url}${path}`, fetchOptions);

  if (!response.ok) {
    throw new Error(`${response.status} - ${response.statusText}`);
  }

  return await response.json();
}
