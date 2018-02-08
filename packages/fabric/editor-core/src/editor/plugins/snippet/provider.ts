import { Snippet } from './ui/data';

export interface SnippetProvider {
  search(query: string): Promise<Snippet[]>;
  get(name: string): Promise<Snippet>;
  create(name: string, value: string): Promise<Snippet | null>;
}

export class SnippetProvider implements SnippetProvider {
  CACHED = [] as Snippet[];
  BASE_URL = 'https://pf-snippets-service.ap-southeast-2.dev.public.atl-paas.net';
  search(query: string) {
    if (query.length <= 2 && this.CACHED.length) {
      debugger;
      const results = this.CACHED.filter(snip =>
        snip.name.toLowerCase().indexOf(query.toLowerCase()),
      );
      if (results.length) {
        return Promise.resolve(results);
      }
    }
    return fetch(`${this.BASE_URL}/search/${encodeURIComponent(query)}`)
      .then(response => response.json())
      .then((snippetWannabes: any[]) =>
        snippetWannabes.map(
          snippetWannabe =>
            ({
              name: snippetWannabe.key,
              value: snippetWannabe.value,
              id: snippetWannabe.key,
            } as Snippet),
        ),
      )
      .then(results => {
        debugger;
        this.CACHED = this.CACHED.filter(
          snip => !results.some(result => result.id === snip.id),
        ).concat(...results);
        return results;
      });
  }

  get(name: string): Promise<Snippet | null> {
    return fetch(`${this.BASE_URL}/${encodeURIComponent(name)}`).then(
      response => {
        if (!response.ok) {
          return null;
        }
        return response.json();
      },
    );
  }

  create(name: string, value: string) {
    return fetch(`${this.BASE_URL}/`, {
      method: 'POST',
      body: { key: name, value },
    }).then(response => {
      if (!response.ok) {
        console.warn('Failed to create: ' + name + ' with value: ' + value);
      }
      return { name, value, id: name } as Snippet;
    });
  }
}
