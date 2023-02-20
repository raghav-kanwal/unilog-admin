// const baseURL = 'https://unilog.unicommerce.com';
const baseURL = 'http://localhost:4003';

export async function fetchShipmentList(
  searchText: string,
  from: string,
  to: string,
  sortBy: string,
  filterBy: string[]
) {
  const days90InMiliSeconds = 90 * 24 * 60 * 60 * 1000;

  if (new Date(from).getTime() + days90InMiliSeconds < new Date(to).getTime())
    throw new Error('Maximum time range is 90 days');

  if (new Date(from).getTime() > new Date(to).getTime())
    throw new Error('Invalid date range');

  const res = await fetch(`${baseURL}/shipper/api/tracking-list`, {
    method: 'POST',
    headers: {
      'APP-KEY': '#$%^SK&SNLSH*^%SF',
    },
    body: JSON.stringify({
      search_text: searchText,
      from,
      to,
      sort_by: sortBy,
      filters: filterBy,
    }),
  });

  if (!res.ok) throw new Error(res.statusText);
  const text = await res.text();
  return text ? JSON.parse(text) : {};
}
