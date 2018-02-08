export interface Snippet {
  id: string;
  private?: boolean;
  name: string;
  value: string | number;
}
const SNIPPETS = [
  { id: '1', private: true, name: 'Atlassian MAU', value: 100000000 },
  { id: '2', name: 'Jira MAU', value: 2700000 },
];

const contains = (base: string, candidate: string) =>
  base.toLowerCase().indexOf(candidate.toLowerCase()) >= 0;

export const getListOfSnippets = (query?: string) => {
  return query
    ? SNIPPETS.filter(
        snippet =>
          contains(snippet.name, query) || contains(`${snippet.value}`, query),
      )
    : SNIPPETS;
};

export const getSnippetById = (id: string) => SNIPPETS.find(s => s.id === id);
